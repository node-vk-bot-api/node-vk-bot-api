const toArray = require('../utils/toArray');

module.exports = function (userId, ...args) {
  const [message, attachment, keyboard, sticker] = args;

  if (Array.isArray(userId) && userId.length > 100) {
    throw new Error('Message can\'t be sent to more than 100 recipients.');
  }

  this.execute(
    'messages.send',
    Object.assign(
      Array.isArray(userId)
        ? { user_ids: userId.join(',') }
        : { peer_id: userId },
      typeof args[0] === 'object'
        ? args[0]
        : {
          message,
          attachment: toArray(attachment).join(','),
          sticker_id: sticker,
          keyboard: keyboard ? keyboard.toJSON() : null,
        },
    ),
  );
};
