const { VERSION } = require('../constants');

module.exports = function (method, settings, callback = () => {}) {
  this.methods.push({
    code: `API.${method}(${JSON.stringify({
      v: VERSION,
      ...settings,
    })})`,
    callback,
  });

  return this;
};
