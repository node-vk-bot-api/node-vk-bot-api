const { TRIGGER_TYPES } = require('../constants');
const toArray = require('../utils/toArray');

module.exports = function (triggers, type, ...middlewares) {
  const isButton = type === TRIGGER_TYPES.PAYLOAD;

  const normalizedTriggers = toArray(triggers)
    .map((item) => {
      if (isButton && typeof item === 'object') {
        return JSON.stringify(item);
      }

      if (typeof item === 'string') {
        return item.toLowerCase();
      }

      return item;
    });

  middlewares.forEach((fn) => {
    const idx = this.middlewares.length;

    this.middlewares.push({
      fn: ctx => fn(ctx, () => this.next(ctx, idx)),
      triggers: normalizedTriggers,
      type,
    });
  });

  return this;
};
