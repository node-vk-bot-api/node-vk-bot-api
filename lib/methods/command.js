const toArray = require('../utils/toArray');

module.exports = function (_triggers, ...middlewares) {
  const triggers = toArray(_triggers)
    .map(item => (item instanceof RegExp ? item : item.toLowerCase()));

  middlewares.forEach((fn) => {
    const idx = this.middlewares.length;

    this.middlewares.push({
      fn: ctx => fn(ctx, () => this.next(ctx, idx)),
      triggers,
    });
  });

  return this;
};
