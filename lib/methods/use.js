module.exports = function (callback) {
  this.actions.middlewares.push(callback)

  return this
}