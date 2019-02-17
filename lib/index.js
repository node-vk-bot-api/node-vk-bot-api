const api = require('./api');
const { TRIGGER_TYPES } = require('./constants');
const { callExecute } = require('./utils');
const {
  command,
  sendMessage,
  startPolling,
  getLongPollParams,
  use,
  next,
  execute,
  webhookCallback,
} = require('./methods');

const PUBLIC_METHODS = {
  api,
  sendMessage,
  startPolling,
  getLongPollParams,
  use,
  next,
  execute,
  webhookCallback,
};

class VkBot {
  constructor(settings) {
    if (!settings) {
      throw new Error('You must pass token into settings');
    } else if (typeof settings === 'object' && !settings.token) {
      throw new Error('You must set token param in settings');
    }

    this.middlewares = [];
    this.methods = [];
    this.settings = Object.assign({}, {
      polling_timeout: 25,
      execute_timeout: 50,
    }, typeof settings === 'object' ? settings : { token: settings });

    Object.entries(PUBLIC_METHODS).forEach(([key, method]) => {
      this[key] = method.bind(this);
    });

    setInterval(() => {
      callExecute(this.methods);
      this.methods = [];
    }, settings.execute_timeout);
  }

  command(triggers, ...middlewares) {
    command.call(this, triggers, TRIGGER_TYPES.TEXT, ...middlewares);
  }

  event(triggers, ...middlewares) {
    command.call(this, triggers, TRIGGER_TYPES.EVENT, ...middlewares);
  }

  button(payloads, ...middlewares) {
    command.call(this, payloads, TRIGGER_TYPES.PAYLOAD, ...middlewares);
  }

  on(...middlewares) {
    command.call(this, [], TRIGGER_TYPES.TEXT, ...middlewares);
  }
}

module.exports = VkBot;
