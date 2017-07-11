module.exports = (self) => {
  return (method, settings, key, callback) => {
    const code = `API.${method}(${JSON.stringify(settings)})`

    if (!self.requests[key]) {
      self.requests[key] = {}
    }

    self.requests[key][code] = callback
  }
}
