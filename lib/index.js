const methods = require('./methods');
const api = require('./api');
const { callExecute } = require('./utils');

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

    Object.entries({ ...methods, api, callExecute }).forEach(([key, method]) => {
      this[key] = method.bind(this);
    });

    setInterval(() => {
      this.callExecute(this.methods);
      this.methods = [];
    }, settings.execute_timeout);
  }

  event(triggers, ...middlewares) {
    this.command(triggers, ...middlewares);
  }

  on(...middlewares) {
    this.command([], ...middlewares);
  }
}

module.exports = VkBot;
