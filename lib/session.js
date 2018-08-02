class Session {
  constructor(settings) {
    Object.assign(this, {
      store: new Map(),
      key: 'session',
      getSessionKey: ctx => `${ctx.message.from_id}:${ctx.message.from_id}`,
    }, settings)
  }

  middleware() {
    return async (ctx, next) => {
      const key = this.getSessionKey(ctx)
      const session = this.store.get(key) || {}

      Object.defineProperty(ctx, this.key, {
        get: () => session,
        set: value => (session = value),
      })

      this.store.set(key, session)

      next()
    }
  }
}

module.exports = Session
