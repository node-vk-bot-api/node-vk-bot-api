module.exports = function (ctx, idx) {
  if (this.middlewares.length > idx + 1) {
    const isTriggered = this.middlewares[idx + 1].triggers
      .some(trigger => ctx.message.text.startsWith(trigger))

    if (isTriggered) {
      return this.middlewares[idx + 1].fn(ctx)
    }
  }
}
