const axios = require('axios');
const Context = require('../context');

module.exports = async function (callback, ts) {
  try {
    if (this.isStopped) {
      return;
    }

    if (!this.longPollParams) {
      this.longPollParams = await this.getLongPollParams();
    }

    if (callback && !callback.called) {
      callback.called = true;
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
      return this.startPolling(callback, body.ts);
    }

    if (body.failed) {
      this.longPollParams = null;
      this.startPolling(callback);

      return;
    }

    this.ts = body.ts;
    this.startPolling(callback, body.ts);

    body.updates.forEach(update => this.next(new Context(update, this)));
  } catch (err) {
    if (callback) {
      callback(err);
    }

    this.longPollParams = null;
    this.startPolling(callback);
  }
};
