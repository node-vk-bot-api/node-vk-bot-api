module.exports = function (ctx, idx = -1) {
  if (this.middlewares.length > idx + 1) {
    const { fn, triggers } = this.middlewares[idx + 1];
    const isTriggered = (triggers || []).some(
      (trigger) => {
        if (ctx.message.type === 'message_new' && trigger !== 'message_new') {
          const message = (ctx.message.text || ctx.message.body || '').toLowerCase();

          if (trigger instanceof RegExp) {
            const match = message.match(trigger);

            if (match) {
              ctx.match = match;
            }

            return !!match;
          }

          return message.startsWith(trigger);
        }

        return ctx.message.type === trigger;
      },
    );

    if (!triggers || (!triggers.length && ctx.message.type === 'message_new') || isTriggered) {
      return fn(ctx);
    }

    return this.next(ctx, idx + 1);
  }
};
