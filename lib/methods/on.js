module.exports = (self) => {
  return (callback) => {
    self.actions.on.default = callback
  }
}
