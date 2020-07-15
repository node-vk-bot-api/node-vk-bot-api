module.exports = async function () {
  if (!this.settings.group_id) {
    const { response } = await this.api('groups.getById', {
      access_token: this.settings.token,
    });

    this.settings.group_id = response[0].id;
  }

  const { response } = await this.api('groups.getLongPollServer', {
    group_id: this.settings.group_id,
    access_token: this.settings.token,
  });

  return response;
};
