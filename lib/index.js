const methods = require('./methods')
const api = require('./api')
const { callExecute } = require('./utils')

class VkBot {
  constructor(settings) {
    if (!settings.token) {
      throw new Error('You must set token param in settings')
    } else if (!settings.group_id) {
      throw new Error('You must set group_id param in settings')
    }

    this.longPollParams = null
    this.middlewares = []
    this.methods = []
    this.settings = settings

    Object.entries({ ...methods, api, callExecute }).forEach(([key, method]) => {
      this[key] = method.bind(this)
    })

    setInterval(() => {
      this.callExecute(this.methods)
      this.methods = []
    }, settings.executeTimeout || 50)
  }

  use(middleware) {
    this.use(middleware)
  }

  command(triggers, ...middlewares) {
    this.command(triggers, ...middlewares)
  }

  event(triggers, ...middlewares) {
    this.command(triggers, ...middlewares)
  }

  on(...middlewares) {
    this.command([], ...middlewares)
  }

  next(ctx, idx) {
    return this.next(ctx, idx)
  }

  sendMessage(userId, ...args) {
    this.sendMessage(userId, ...args)
  }

  startPolling(timeout) {
    return this.startPolling(timeout)
  }
}

module.exports = VkBot
