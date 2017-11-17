module.exports = function (peer, message, attachment) {
  this.execute('messages.send', {
    peer_id: peer,
    message: message,
    attachment: attachment
  }, this.settings.token, null)

  return this
}
