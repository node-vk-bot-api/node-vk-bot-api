const app = require('node-vk-bot-api');
const api = require('node-vk-bot-api/method');

// Set token
app.setToken('88935996c67c290f47b79a0c8b0093227e916ce14c62e490aa96c8f8ed3090c9cbcdda92c8fadf1f5c74c');

// Send 'Hello' to user on command '/start'
app.addCommand('/start', (data) => {
  const uid = data.user_id;

  app.sendMessage({ user_id: uid, message: 'Hello, this is /start command!' }); // => '{ response: [ 1 ] }'
});

// Send name and surname to user on command '/me'
app.addCommand('/me', (data) => {
  const uid = data.user_id;

  api('users.get', { user_id: uid }).then(body => {
    const user = body.response[0];

    app.sendMessage({
      user_id: uid,
      message: `You are ${user.first_name} ${user.last_name}.`
    });

    // => '{ response: [ 2 ] }'
  });
});

// Reply same message if user sent not command.
app.notCommand(data => {
  const uid = data.user_id;
  const date = data.date;
  const msg = data.msg;

  app.sendMessage({ user_id: uid, message: msg }); // => '{ response: [ 3 ] }'
});

// Start long poll
app.startLongPoll();
