const app = require('node-vk-bot-api');
const api = require('node-vk-bot-api/method');

app.auth(process.env.BOT_TOKEN);

app.command('/start', (data) => {
  const uid = data.user_id;

  app.sendMessage({ user_id: uid, message: 'Hello, this is /start command!' });
});

app.command('/me', (data) => {
  const uid = data.user_id;

  api('users.get', { user_id: uid }).then(body => {
    const user = body.response[0];

    app.sendMessage({
      user_id: uid,
      message: `You are ${user.first_name} ${user.last_name}.`
    });
  });
});

app.hears('hello', (data) => {
  const uid = data.user_id;

  app.sendMessage({ user_id: uid, message: 'Hi!' });
});

app.reserve(data => {
  const uid = data.user_id;
  const msg = data.msg;

  app.sendMessage({ user_id: uid, message: msg }); // => '{ response: [ 3 ] }'
});

app.startLongPoll();
