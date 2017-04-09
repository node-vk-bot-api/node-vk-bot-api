const app = require('node-vk-bot-api');
const api = require('node-vk-bot-api/method');

app.auth(process.env.BOT_TOKEN);

app.command('/start', (data) => {
  const uid = data.user_id;

  app.sendMessage(uid, 'Hello, this is /start command!');
});

app.command('/me', (data) => {
  const uid = data.user_id;

  api('users.get', { user_id: uid }).then(body => {
    const user = body.response[0];

    app.sendMessage(uid, `You are ${user.first_name} ${user.last_name}.`, 'wall145003487_1900');
  });
});

app.hears('hello', (data) => {
  const uid = data.user_id;

  app.sendMessage(uid, 'Hi!');
});

app.reserve(data => {
  const uid = data.user_id;
  const msg = data.msg;

  app.sendMessage(uid, msg); // => '{ response: [ 3 ] }'
});

app.startLongPoll();
