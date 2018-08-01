module.exports = async function () {
  const { response } = await this.api('groups.getLongPollServer', {
    group_id: this.settings.group_id,
    access_token: this.settings.token,
  })

  return response
}
