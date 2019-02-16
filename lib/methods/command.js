const toArray = require('../utils/toArray');

module.exports = function (_triggers, ...middlewares) {
  const triggers = toArray(_triggers);

  let triggerType = 'text';

  if (typeof middlewares[0] === 'string') {
    triggerType = middlewares[0];
    middlewares.splice(0, 1);
  }

  middlewares.forEach((fn) => {
    const idx = this.middlewares.length;

    this.middlewares.push({
      fn: ctx => fn(ctx, () => this.next(ctx, idx)),
      triggers,
      triggerType,
    });
  });

  return this;
};
