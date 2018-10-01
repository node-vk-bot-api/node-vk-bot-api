class Stage {
  constructor(...scenes) {
    this.scenes = {}

    scenes.forEach(({ name, middlewares }) => {
      this.scenes[name] = middlewares
    })
  }

  enter(ctx) {
    const { current, step } = ctx.session.__scene
    const middleware = this.scenes[current][step]

    if (!middleware) {
      return console.error(`Middleware not found for ${current} scene at ${step} step`)
    }

    middleware(ctx)
  }

  middleware() {
    return (ctx, next) => {
      ctx.scene = {
        enter: (name) => {
          ctx.session.__scene = {
            current: name,
            step: 0,
          }

          this.enter(ctx)
        },
        leave: () => {
          ctx.session.__scene = null
        },
        next: () => {
          ++ctx.session.__scene.step
        },
        selectStep: (index) => {
          ctx.session.__scene.step = index
        },
      }

      if (ctx.session.__scene && ctx.message.type === 'message_new') {
        return this.enter(ctx)
      }

      next()
    }
  }
}

module.exports = Stage
