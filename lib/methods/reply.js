module.exports = function (peer, message, attachment, callback) {
  this.execute('messages.send', {
    peer_id: peer,
    message: message,
    random_id: Number(`${Math.floor(Math.random() * 1e4)}${Date.now()}`),
    attachment: attachment
  }, callback)

  return this
}
