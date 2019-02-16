module.exports = function (method, settings, callback = () => {}) {
  this.methods.push({
    code: `API.${method}(${JSON.stringify({
      v: '5.80',
      ...settings,
    })})`,
    callback,
  });

  return this;
};
