class Session {
  constructor(settings) {
    Object.assign(this, {
      store: new Map(),
      key: 'session',
      getSessionKey: (ctx) => {
        const userId = ctx.message.from_id || ctx.message.user_id;

        return `${userId}:${userId}`;
      },
    }, settings);
  }

  middleware() {
    return (ctx, next) => {
      const key = this.getSessionKey(ctx);
      let session = this.store.get(key) || {};

      Object.defineProperty(ctx, this.key, {
        get: () => session,
        set: (value) => {
          session = value;
        },
      });

      this.store.set(key, session);

      next();
    };
  }
}

module.exports = Session;
