const sendMessage = require('./sendMessage')
const startPolling = require('./startPolling')
const getLongPollParams = require('./getLongPollParams')
const command = require('./command')
const next = require('./next')
const execute = require('./execute')

module.exports = {
  sendMessage,
  startPolling,
  getLongPollParams,
  command,
  next,
  execute,
}
