const getLastMessage = (update) => {
  if (update.fwd_messages && update.fwd_messages.length) {
    return getLastMessage(update.fwd_messages[0])
  }

  return update
}

module.exports = getLastMessage
