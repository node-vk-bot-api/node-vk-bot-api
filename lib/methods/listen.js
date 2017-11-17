const rp = require('request-promise')

module.exports = function () {
  const { commands, hears, on: reservedCallback } = this.actions

  if (!this.longPollParams) {
    return this.api('messages.getLongPollServer', {
      need_pts: 1,
      lp_version: 2,
      access_token: this.token,
      v: 5.65
    })
      .then((body) => {
        if (!body.response || !body.response.server) {
          throw new Error(JSON.stringify(body))
        }

        this.longPollParams = body.response
        this.listen()
      })
      .catch((err) => {
        this.longPollParams = null
        return this.listen()
      })
  }

  return rp({
    url: `https://${this.longPollParams.server}`,
    qs: {
      ...this.longPollParams,
      act: 'a_check',
      wait: 25,
      mode: 2,
      version: 2
    },
    json: true
  })
    .then((body) => {
      if (body.failed) {
        if (body.failed && body.ts) {
          this.longPollParams.ts = body.ts
        } else {
          this.longPollParams = null
        }

        return this.listen()
      }

      if (body.ts) {
        this.longPollParams.ts = body.ts
      }

      this.listen()

      if (body.updates && body.updates.length) {
        body.updates.forEach((update) => {
          if (update[0] === 4 && (update[2] & 2) === 0) {
            const ctx = {
              user_id: update[3],
              body: update[5],
              attachments: update[6],
              date: update[4],
              message_id: update[1],
            }

            if (update[6].from) {
              ctx.from = +update[6].from
            }

            const getForward = (ctx) => {
              return new Promise((resolve) => {
                if (!ctx.attachments || !ctx.attachments.fwd) {
                  resolve(null)
                }

                this.execute('messages.getById', {
                  message_ids: ctx.message_id,
                  v: 5.67
                }, this.token, (data) => {
                  resolve(this.getLastMessage(data.items[0]))
                })
              })
            }

            getForward(ctx)
              .then((forward) => {
                if (forward) {
                  ctx.forward = forward
                  ctx.body = forward.body
                }

                const attachmentsKeys = Object.keys(ctx.attachments).filter(key => key.search('attach') > -1 && key.search('type') === -1 && key.search('kind') === -1)
                const attachments = []

                attachmentsKeys.forEach((key) => {
                  const file = {}

                  file['type'] = ctx.attachments[`${key}_type`]
                  file[file.type] = ctx.attachments[key]

                  attachments.push(file)
                })

                ctx.attachments = attachments
                ctx.body = ctx.body.replace(/<br>/g, '\n')

                ctx.reply = (message, attachment) => this.reply(ctx.user_id, message, attachment)
                ctx.sendMessage = (userId, message, attachment) => this.reply(ctx.user_id, message, attachment)

                const message = ctx.body.toLowerCase()
                const commandKey = Object.keys(commands).filter(item => item.search(message) > -1)[0]
                const commandCallback = commands[commandKey]
                const hearsKey = Object.keys(hears).filter((item) => {
                  const index = item.split(';')
                    .filter((item) => {
                      if (/\/[\S]{1,}\/[a-z]{1,2}/.test(item)) {
                        const string = item.substr(1).replace(/\/[a-z]{1,2}/i, '')
                        const type = item.substr(1).match(/\/[a-z]{1,2}/i)[0].substr(1)

                        return new RegExp(string, type).test(message)
                      } else {
                        return new RegExp(item, 'i').test(message)
                      }
                    })
                  return index.length
                })[0]
                const hearsCallback = hears[hearsKey]

                if (commandCallback !== undefined) {
                  return commandCallback(ctx)
                } else if (hearsCallback !== undefined) {
                  return hearsCallback(ctx)
                } else if (reservedCallback !== undefined) {
                  return reservedCallback(ctx)
                }
              })
              .catch((err) => {
                this.longPollParams = null
                return this.listen()
              })
          }
        })
      }
    })
    .catch((err) => {
      this.longPollParams = null
      return this.listen()
    })
}
