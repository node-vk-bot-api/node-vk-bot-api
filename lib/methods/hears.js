module.exports = function (command, callback) {
  const commands = typeof command === 'object' && !(command instanceof RegExp)
    ? command : [ command ]

  commands
    .map((command) => {
      return command instanceof RegExp
        ? (command.toString().split('/')[2] ? command : new RegExp(command.toString().split('/')[1], 'i'))
        : new RegExp(command, 'i')
    })
    .forEach((command) => {
      this.actions.hears.push({
        command,
        callback
      })
    })

  return this
}
