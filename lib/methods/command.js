module.exports = (self) => {
  return (command, callback) => {
    if (typeof command === 'object') {
      command.forEach((command) => {
        self.actions.commands[command.toLowerCase()] = callback
      })

      return
    }

    self.actions.commands[command.toLowerCase()] = callback
  }
}
