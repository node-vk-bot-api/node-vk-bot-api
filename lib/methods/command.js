const toArray = value => (Array.isArray(value) ? value : [value])

module.exports = function (triggers, ...middlewares) {
  middlewares.forEach((fn) => {
    const idx = this.middlewares.length

    this.middlewares.push({
      fn: ctx => fn(ctx, () => this.next(ctx, idx)),
      triggers: toArray(triggers),
    })
  })

  return this
}
