module.exports = function (ctx, idx = -1) {
  if (this.middlewares.length > idx + 1) {
    const { fn, triggers } = this.middlewares[idx + 1]
    const message = ctx.message.text.toLowerCase()
    const isTriggered = (triggers || []).some(
      trigger => (ctx.message.type === 'message_new' && trigger !== 'message_new' ? message.startsWith(trigger) : ctx.message.type === trigger),
    )

    if (!triggers || (!triggers.length && ctx.message.type === 'message_new') || isTriggered) {
      return fn(ctx)
    }

    return this.next(ctx, idx + 1)
  }
}
