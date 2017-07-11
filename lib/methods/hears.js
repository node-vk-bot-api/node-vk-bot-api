module.exports = (self) => {
  return (command, callback) => {
    if (typeof command === 'object') {
      command.forEach((command) => {
        self.actions.hears[command] = callback
      })

      return
    }

    self.actions.hears[command] = callback
  }
}
