class Scene {
  constructor(name, ...middlewares) {
    this.name = name
    this.middlewares = []

    middlewares.forEach((fn) => {
      const idx = this.middlewares.length
      const middleaware = ctx => fn(ctx, () => this.next(ctx, idx))

      this.middlewares.push(middleaware)
    })
  }

  next(ctx, idx = -1) {
    if (this.middlewares.length > idx + 1) {
      return this.middlewares[idx + 1](ctx)
    }
  }
}

module.exports = Scene
