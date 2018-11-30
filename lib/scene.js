const toArray = require('./utils/toArray');

class Scene {
  constructor(name, ...middlewares) {
    this.name = name;
    this.middlewares = middlewares.map(fn => ({ fn }));
  }

  command(_triggers, ...middlewares) {
    const triggers = toArray(_triggers)
      .map(item => (item instanceof RegExp ? item : item.toLowerCase()));

    this.middlewares.push(
      ...middlewares.map(fn => ({
        fn,
        triggers,
      })),
    );
  }
}

module.exports = Scene;
