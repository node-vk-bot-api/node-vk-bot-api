module.exports = function (method, settings, token, callback = () => {}) {
  const code = `API.${method}(${JSON.stringify(settings)})`;

  if (!this.methods[token]) {
    this.methods[token] = [];
  }

  this.methods[token].push({
    code,
    callback
  });

  return this;
};
