module.exports = function (peer, message, attachment) {
  this.execute('messages.send', {
    peer_id: peer,
    message: message,
    random_id: Number(`${Math.floor(Math.random() * 1e4)}${Date.now()}`),
    attachment: attachment
  }, null)

  return this
}
