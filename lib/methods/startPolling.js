const axios = require('axios')
const Context = require('../context')

module.exports = async function (timeout = 25, ts) {
  try {
    if (!this.longPollParams) {
      this.longPollParams = await this.getLongPollParams()
    }

    const { data: body } = await axios.get(this.longPollParams.server, {
      params: {
        ...this.longPollParams,
        ts,
        act: 'a_check',
        wait: timeout,
      },
    })

    if (body.failed) {
      switch (body.failed) {
        case 1:
          return this.startPolling(timeout, body.ts)
        case 2:
        case 3:
          this.longPollParams = null
          return this.startPolling(timeout)
        default:
          console.error(`Listening Error: ${JSON.stringify(body)}`)

          this.longPollParams = null
          return this.startPolling(timeout)
      }
    }

    body.updates.forEach(({ type, object: update }) => {
      const ctx = new Context(update, this)

      if (type === 'message_new') {
        const handler = this.middlewares.find(
          ({ triggers }) => triggers.filter(trigger => ctx.message.text.startsWith(trigger)).length,
        )

        if (handler) {
          return handler.fn(ctx)
        }
      }
    })

    this.startPolling(timeout, body.ts)
  } catch (err) {
    throw new Error(err)
  }
}
