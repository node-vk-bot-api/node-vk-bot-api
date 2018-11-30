class Context {
  constructor({ type, object: update }, bot) {
    this.message = { ...update, type };
    this.bot = bot;
  }

  reply(...args) {
    this.bot.sendMessage(this.message.peer_id || this.message.user_id, ...args);
  }
}

module.exports = Context;
