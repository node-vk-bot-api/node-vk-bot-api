module.exports = function (command, callback) {
  const list = typeof command === 'object' ? command : [ command ];
  const string = list.map(item => item.toString().toLowerCase()).join(';');

  this.actions.commands[string] = callback;

  return this;
};
