const { TRIGGER_TYPES, EVENT_TYPES } = require('../constants');

module.exports = function (ctx, idx = -1) {
  if (this.middlewares.length > idx + 1) {
    const { fn, triggers, type } = this.middlewares[idx + 1];

    // common middleware
    if (!triggers) {
      return fn(ctx);
    }

    // text command without triggers
    if (!triggers.length && ctx.message.type === EVENT_TYPES.NEW_MESSAGE) {
      return fn(ctx);
    }

    // text or button command with triggers
    const isTriggered = triggers.some((trigger) => {
      if (ctx.message.type === EVENT_TYPES.NEW_MESSAGE && type === TRIGGER_TYPES.TEXT) {
        const message = (ctx.message.text || ctx.message.body || '').toLowerCase();

        return trigger instanceof RegExp
          ? trigger.test(message)
          : message.startsWith(trigger);
      }

      if (ctx.message.type === EVENT_TYPES.NEW_MESSAGE && type === TRIGGER_TYPES.PAYLOAD) {
        return ctx.message.payload === trigger;
      }

      if (type === TRIGGER_TYPES.EVENT) {
        return ctx.message.type === trigger;
      }

      return false;
    });

    return isTriggered ? fn(ctx) : this.next(ctx, idx + 1);
  }
};
