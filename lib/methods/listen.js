const axios = require('axios')

module.exports = async function () {
  if (!this.longPollParams) {
    await this.loadParams()

    return this.listen()
  }

  try {
    const { data: body } = await axios.get(`https://${this.longPollParams.server}`, {
      params: {
        ...this.longPollParams,
        act: 'a_check',
        wait: 25,
        mode: 2,
        version: 2
      }
    })

    if (body.failed) {
      if (body.ts) {
        this.longPollParams = { ...this.longPollParams, ts: body.ts }
      } else {
        this.longPollParams = null
      }

      return this.listen()
    }

    if (body.ts) {
      this.longPollParams = { ...this.longPollParams, ts: body.ts }
    }

    if (body.updates && body.updates.length) {
      await Promise.all(body.updates.map(update => this.handler(update)))
    }

    return this.listen()
  } catch (error) {
    this.longPollParams = null
    console.error(`${new Date()}: Listening error!`, error)

    return this.listen()
  }
}
