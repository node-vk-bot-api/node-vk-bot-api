class Context {
  constructor(update, bot) {
    this.message = update
    this.bot = bot
  }

  reply(...args) {
    this.bot.sendMessage(this.message.from_id, ...args)
  }
}

module.exports = Context
