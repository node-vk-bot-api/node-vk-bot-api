const toArray = require('../utils/toArray');

module.exports = function (userId, ...args) {
  const [message, attachment, keyboard, sticker] = args;

  this.execute(
    'messages.send',
    Object.assign(
      userId < 2000000000
        ? { user_ids: toArray(userId).join(',') }
        : { peer_id: userId },
      typeof args[0] === 'object'
        ? args[0]
        : {
          message,
          attachment: toArray(attachment).join(','),
          stickerId: sticker,
          keyboard: keyboard ? keyboard.toJSON() : null,
        },
    ),
  );
};
