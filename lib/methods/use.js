module.exports = function (middleware) {
  const idx = this.middlewares.length;

  this.middlewares.push({
    fn: ctx => middleware(ctx, () => this.next(ctx, idx)),
  });

  return this;
};
