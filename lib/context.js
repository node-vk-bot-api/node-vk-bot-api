class Context {
  constructor({ type, object: update, group_id, event_id }, bot) {
    if (update.message) {
      this.message = { ...update.message, type };
      this.client_info = update.client_info;
    } else {
      this.message = { ...update, type };
    }

    this.group_id = group_id;
    this.event_id = event_id;

    this.bot = bot;
  }

  reply(...args) {
    return this.bot.sendMessage(this.message.peer_id || this.message.user_id, ...args);
  }
}

module.exports = Context;
