const methods = require('./methods');
const api = require('./api');
const { execute } = require('./utils');

class VkBot {
  constructor(settings) {
    if (!settings) {
      throw new Error('You must set settings');
    } else if (typeof settings === 'object' && !settings.token) {
      throw new Error('You must set token param in settings');
    } else if (settings.proxy && typeof settings.proxy !== 'object') {
      throw new Error('Wrong proxy settings');
    }

    this.middlewares = [];
    this.methods = [];

    this.isStopped = false;

    this.settings = Object.assign(
      {
        polling_timeout: 25,
        execute_timeout: 50,
      },
      typeof settings === 'object'
        ? settings
        : { token: settings.token, proxy: setting.proxy },
    );

    Object.entries({ ...methods, api }).forEach(([key, method]) => {
      this[key] = method.bind(this);
    });

    setInterval(() => {
      execute(
        this.methods,
        this.settings.token,
        this.settings.proxy,
      );

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
