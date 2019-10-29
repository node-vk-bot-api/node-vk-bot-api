class Context {
  constructor({ type, object: update }, bot) {
    if (update.message) {
      this.message = { ...update.message, type };
      this.client_info = update.client_info;
    } else {
      this.message = { ...update, type };
    }

    this.bot = bot;
  }

  reply(...args) {
    this.bot.sendMessage(this.message.peer_id || this.message.user_id, ...args);
  }
}

module.exports = Context;
