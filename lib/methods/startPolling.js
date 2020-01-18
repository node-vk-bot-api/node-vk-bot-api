const axios = require('axios');
const Context = require('../context');
const PollingError = require('../errors/PollingError');

module.exports = async function (callback, ts) {
  try {
    if (this.settings.isStopped) {
      return;
    }

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
    });

    if (body.failed === 1) {
      return this.startPolling(null, body.ts);
    }

    if (body.failed) {
      this.longPollParams = null;
      this.startPolling();

      return;
    }

    this.startPolling(null, body.ts);

    body.updates.forEach(update => this.next(new Context(update, this)));
  } catch (err) {
    if (err instanceof PollingError) {
      this.longPollParams = null;
      this.startPolling();

      return;
    }

    throw err;
  }
};
