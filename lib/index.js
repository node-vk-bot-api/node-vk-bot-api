module.exports = class Bot {
  constructor (token) {
    if (!token) {
      throw 'Token is required'
    }

    this.v = 5.71
    this.token = token
    this.actions = { commands: [], hears: [], on: null, middlewares: [] }
    this.methods = []

    this.api = require('./api').bind(this)
    this.use = require('./methods/use').bind(this)
    this.command = require('./methods/command').bind(this)
    this.hears = require('./methods/hears').bind(this)
    this.on = require('./methods/on').bind(this)
    this.reply = require('./methods/reply').bind(this)
    this.handler = require('./methods/handler').bind(this)
    this.listen = require('./methods/listen').bind(this)
    this.loadParams = require('./methods/loadParams').bind(this)
    this.getForward = require('./methods/getForward').bind(this)
    this.execute = require('./methods/execute').bind(this)
    this.executeHandler = require('./utils/executeHandler')
    this.getLastMessage = require('./utils/getLastMessage')

    setInterval(() => {
      this.executeHandler(this.methods)
      this.methods = []
    }, (1000 / 20))
  }

  loadParams () {
    return this.loadParams()
  }

  handler (ctx) {
    return this.handler(ctx)
  }

  execute (method, settings, callback) {
    return this.execute(method, settings, callback)
  }

  reply (peerId, message, attachment, callback) {
    return this.reply(peerId, message, attachment, callback)
  }

  getLastMessage (update) {
    return this.getLastMessage(update)
  }

  command (command, callback) {
    return this.command(command, callback)
  }

  hears (command, callback) {
    return this.hears(command, callback)
  }

  on (callback) {
    return this.on(callback)
  }

  use (callback) {
    return this.use(callback)
  }

  listen () {
    return this.listen()
  }
}
