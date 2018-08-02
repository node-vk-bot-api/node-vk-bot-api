module.exports = function (method, settings, callback = () => {}) {
  this.methods.push({
    code: `API.${method}(${JSON.stringify(settings)})`,
    callback,
  })

  return this
}
