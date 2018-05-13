module.exports = function (peer, message, attachment, stickerId, callback) {
  this.execute('messages.send', {
    peer_id: peer,
    message: message,
    random_id: Number(`${Math.floor(Math.random() * 1e4)}${Date.now()}`),
    attachment: attachment,
    sticker_id: stickerId
  }, callback)

  return this
}
