module.exports = async function () {
  try {
    const { data : body } = await this.api('messages.getLongPollServer', {
      need_pts: 1,
      lp_version: 2
    })

    if (!body.response || !body.response.server) {
      throw new Error(JSON.stringify(body))
    }

    this.longPollParams = body.response
  } catch (error) {
    console.error('ERROR! messages.getLongPollServer', error)
    this.longPollParams = null
  }
}
