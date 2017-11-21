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
  let qs = Object.assign(this.longPollParams)
  qs.act='a_check'
  qs.wait=25
  qs.mode=2
  qs.version=2
  return rp({
    url: `https://${this.longPollParams.server}`,
    qs,
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
            this.message(ctx)

          }
        })
      }
    })
    .catch((err) => {
      this.longPollParams = null
      return this.listen()
    })
}
