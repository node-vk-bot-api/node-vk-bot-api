const sendRequestViaKoa = (ctx, middleware) => {
  middleware(ctx, () => {})

  return ctx
}

const sendRequestViaExpress = (ctx, middleware) => {
  middleware(ctx.req, ctx.res, () => {})

  return ctx
}

module.exports.sendRequest = (type, body, middleware) => {
  const ctx = {
    req: { body },
    res: {
      send: (body) => {
        ctx.res.body = body
      },
    },
  }

  return type === 'koa'
    ? sendRequestViaKoa(ctx, middleware)
    : sendRequestViaExpress(ctx, middleware)
}

module.exports.handleUpdate = (bot, update) => new Promise((resolve) => {
  bot.next(update)

  setTimeout(resolve, 100)
})
