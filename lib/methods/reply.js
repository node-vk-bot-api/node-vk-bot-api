module.exports = (self) => {
  return (peerId, message, attachment) => {
    return self.execute('messages.send', {
      peer_id: peerId,
      message: message,
      attachment: attachment
    }, self.settings.token, null)
  }
}
