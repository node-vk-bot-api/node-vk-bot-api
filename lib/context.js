class Context {
  constructor({ type, object: update }, bot) {
    this.message = { ...update, type }
    this.bot = bot
  }

  reply(...args) {
    this.bot.sendMessage(this.message.from_id, ...args)
  }
}

module.exports = Context
