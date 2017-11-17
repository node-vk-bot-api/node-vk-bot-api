module.exports = function (callback) {
  this.actions.on = callback

  return this
}
