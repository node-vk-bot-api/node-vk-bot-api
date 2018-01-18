module.exports = function () {
  return this.api('messages.getLongPollServer', {
    need_pts: 1,
    lp_version: 2,
    access_token: this.token,
    v: this.v
  })
    .then(({ data: body }) => {
      if (!body.response || !body.response.server) {
        throw new Error(JSON.stringify(body));
      }

      this.longPollParams = body.response;
    })
    .catch((error) => {
      this.longPollParams = null;
      console.error(`${new Date()} - ERROR! - ${error}`);
      return null;
    });
};
