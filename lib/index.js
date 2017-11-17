const executeHandler = require('./utils/executeHandler')

module.exports = class Bot {
  constructor (settings) {
    if (!settings) {
      throw 'Settings not found'
    } else if (!settings.token) {
      throw 'Token is required'
    }

    this.settings = settings
    this.methods = {}
    this.actions = { commands: {}, hears: {}, on: {} }

    Object.assign(this, {
      execute: require('./methods/execute').bind(this),
      reply: require('./methods/reply').bind(this),
      command: require('./methods/command').bind(this),
      hears: require('./methods/hears').bind(this),
      on: require('./methods/on').bind(this),
      listen: require('./methods/listen').bind(this),
      api: require('./api'),
      getLastMessage: require('./utils/getLastMessage')
    })

    setInterval(() => {
      executeHandler(this.methods)
      this.methods = {}
    }, (1000 / 20))
  }

  execute (method, settings, token, callback) {
    return this.execute(method, settings, token, callback)
  }

  reply (peerId, message, attachment) {
    return this.reply(peerId, message, attachment)
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

  listen () {
    return this.listen()
  }
}
