const toArray = value => (Array.isArray(value) ? value : [value])

module.exports = function (userId, ...args) {
  const [message, attachment, keyboard, sticker] = args

  this.execute(
    'messages.send',
    Object.assign(
      {
        user_ids: toArray(userId).join(','),
      },
      typeof args[0] === 'object'
        ? args[0]
        : {
          message,
          attachment: toArray(attachment).join(','),
          stickerId: sticker,
          keyboard: keyboard ? keyboard.toJSON() : null,
        },
    ),
  )
}
