const rp = require('request-promise')
const api = require('vk-wrapper')

module.exports = (self) => {
  return () => {
    if (!self.longPollParams) {
      return api('messages.getLongPollServer', {
        need_pts: 1,
        lp_version: 2,
        access_token: self.settings.token,
        v: 5.65
      })
        .then((body) => {
          if (!body.response || !body.response.server) {
            throw new Error(JSON.stringify(body))
          }

          self.longPollParams = body.response
          self.listen()
        })
        .catch(console.error)
    }

    return rp({
      url: `https://${self.longPollParams.server}?act=a_check&key=${self.longPollParams.key}&ts=${self.longPollParams.ts}&wait=25&mode=2&version=2`,
      json: true
    })
      .then((body) => {
        if (body.failed) {
          if (body.failed && body.ts) {
            self.longPollParams.ts = body.ts
          } else {
            self.longPollParams = null
          }

          return self.listen()
        }

        if (body.ts) {
          self.longPollParams.ts = body.ts
        }

        self.listen()

        if (body.updates && body.updates.length) {
          body.updates.forEach((update) => {
            if (update[0] === 4 && (update[2] & 2) === 0) {
              const ctx = {
                user_id: update[3],
                body: update[5],
                attachments: update[6],
                date: update[4],
                message_id: update[1]
              }

              const getForward = (ctx) => {
                return new Promise((resolve) => {
                  if (!ctx.attachments || !ctx.attachments.fwd) {
                    resolve(null)
                  }

                  self.execute('messages.getById', {
                    message_ids: ctx.message_id,
                    v: 5.67
                  }, self.settings.token, (data) => {
                    resolve(self.getLastMessage(data.items[0]))
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

                  ctx.reply = (message, attachment) => self.reply(ctx.user_id, message, attachment)
                  ctx.sendMessage = (userId, message, attachment) => self.reply(ctx.user_id, message, attachment)

                  const command = ctx.body.toLowerCase()

                  if (self.actions.commands[command]) {
                    return self.actions.commands[command](ctx)
                  }

                  const method = {}

                  Object.keys(self.actions.hears).forEach((command) => {
                    method[command] = self.actions.hears[command]
                  })

                  if (Object.keys(method).length === 0) {
                    if (typeof self.actions.on.default === 'function') {
                      return self.actions.on.default(ctx)
                    }

                    return console.error('Bot can\'t found reserved reply.')
                  }

                  const hears = Object.keys(method).filter((regexp) => {
                    return new RegExp(regexp, 'i').test(command)
                  })

                  if (hears.length !== 0) {
                    return method[hears[0]](ctx)
                  }

                  if (typeof self.actions.on.default === 'function') {
                    return self.actions.on.default(ctx)
                  }

                  return console.error('Bot can\'t found reserved reply.')
                })
                .catch(console.error)
            }
          })
        }
      })
  }
}
