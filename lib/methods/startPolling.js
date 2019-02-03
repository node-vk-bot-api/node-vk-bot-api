const axios = require('axios');
const Context = require('../context');

class PollingError extends Error {}

module.exports = async function (callback, ts) {
  try {
    if (!this.longPollParams) {
      this.longPollParams = await this.getLongPollParams();
    }

    if (typeof callback === 'function') {
      callback();
    }

    const { data: body } = await axios.get(this.longPollParams.server, {
      params: {
        ...this.longPollParams,
        ts,
        act: 'a_check',
        wait: this.settings.polling_timeout,
      },
    }).catch(() => {
      throw new PollingError();
    });

    if (body.failed) {
      switch (body.failed) {
        case 1:
          return this.startPolling(null, body.ts);
        case 2:
        case 3:
          this.longPollParams = null;

          return this.startPolling();
        default:
          console.error(`Listening Error: ${JSON.stringify(body)}`);

          this.longPollParams = null;

          return this.startPolling();
      }
    }

    this.startPolling(null, body.ts);

    body.updates.forEach(update => this.next(new Context(update, this)));
  } catch (err) {
    if (err instanceof PollingError) {
      this.longPollParams = null;
      this.startPolling();
    } else {
      throw err;
    }
  }
};
