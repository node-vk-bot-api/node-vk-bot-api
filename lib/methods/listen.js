const axios = require('axios');

module.exports = function () {
  if (!this.longPollParams) {
    return this.loadParams()
      .then(() => this.listen());
  }

  return axios.get(`https://${this.longPollParams.server}`, {
    params: {
      ...this.longPollParams,
      act: 'a_check',
      wait: 25,
      mode: 2,
      version: 2
    }
  })
    .then(({ data: body }) => {
      if (body.failed) {
        if (body.ts) {
          this.longPollParams = { ...this.longPollParams, ts: body.ts };
        } else {
          this.longPollParams = null;
        }

        return this.listen();
      }

      if (body.ts) {
        this.longPollParams = { ...this.longPollParams, ts: body.ts };
      }

      this.listen();

      if (body.updates && body.updates.length) {
        body.updates.forEach(update => {
          this.handler(update);
        });
      }
    })
    .catch((error) => {
      this.longPollParams = null;
      console.error(`${new Date()} - ERROR! - ${error}`);
      return this.listen();
    });
};
