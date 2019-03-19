const sendRequestViaKoa = (ctx, middleware) => {
  middleware(ctx, () => {});

  return ctx;
};

const sendRequestViaExpress = (ctx, middleware) => {
  middleware(ctx.req, ctx.res, () => {});

  return ctx;
};

module.exports.sendRequest = (type, body, middleware) => {
  const ctx = {
    req: { body },
    request: { body },
    res: {
      end: (body) => {
        ctx.res.body = body;
      },
    },
  };

  return type === 'koa'
    ? sendRequestViaKoa(ctx, middleware)
    : sendRequestViaExpress(ctx, middleware);
};
