module.exports = function (command, callback) {
  const list = typeof command === 'object' && !(command instanceof RegExp)
    ? command : [command];
  const string = list
    .map(item => item instanceof RegExp ? item.toString() : item.toString().toLowerCase())
    .join(';');

  this.actions.hears[string] = callback;

  return this;
};
