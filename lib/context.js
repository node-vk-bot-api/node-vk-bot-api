class Context {
  constructor(request, bot) {
    const {
      type,
      object: update,
      event_id: eventId,
      group_id: groupId,
    } = request;

    if (update.message) {
      this.message = { ...update.message, type };

      Object.defineProperty(this, 'client_info', {
        get: () => {
          // eslint-disable-next-line no-console
          console.warn("The 'ctx.client_info' option is deprecated. Use 'ctx.clientInfo' instead.");

          return update.client_info;
        },
      });

      this.clientInfo = update.client_info;
    } else {
      this.message = { ...update, type };
    }

    this.eventId = eventId;
    this.groupId = groupId;

    this.bot = bot;
  }

  reply(...args) {
    return this.bot.sendMessage(this.message.peer_id || this.message.user_id, ...args);
  }
}

module.exports = Context;
