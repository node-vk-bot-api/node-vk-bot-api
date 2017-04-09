[![node-vk-bot-api](https://img.shields.io/npm/v/node-vk-bot-api.svg)](https://www.npmjs.com/package/node-vk-bot-api/)

# VK Bot API

Clean API for VK bots based on long poll with multi-dispatch send messages **(~75 per second)**.

## Install

```
$ npm install node-vk-bot-api
```

## Example

Full example you can see [here](https://github.com/bifot/node-vk-bot-api/blob/master/examples/bot.js).

```javascript
const app = require('node-vk-bot-api');

app.auth(process.env.BOT_TOKEN);

app.command('/start', (data) => {
  const uid = data.user_id;

  app.sendMessage(uid, 'Hello, this is /start command!');
});

app.hears('hello', (data) => {
  const uid = data.user_id;

  app.sendMessage(uid, 'Hi!');
});

app.reserve(data => {
  const uid = data.user_id;
  const msg = data.msg;

  app.sendMessage(uid, msg, 'wall145003487_1900');
});

app.startLongPoll();
```

## Methods

* [.auth(token, opts)](#authtoken-opts)
* [.command(command, callback)](#commandcommand-callback)
* [.hears(command, callback)](#hearscommand-callback)
* [.reserve(callback)](#reservecallback)
* [.sendMessage(uid, msg, attach)](#sendmessageuid-msg-attach)
* [.replyMessage(updates)](#replymessageupdates)
* [.getLastMessage(update)](#getlastmessageupdate)
* [.getForwardMessage(update)](#getforwardmessageupdate)
* [.startLongPoll()](#startlongpoll)
* [.getLongPoll(longPollParams)](#getlongpolllongpollparams)

### .auth(token, opts)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| token      | string    | yes       |
| opts       | object    | no        |

Authting with token. Also you can set `subscribers mode` and bot will reply only to subscribers.

```javascript
// Bot will reply to all
app.auth(process.env.BOT_TOKEN);
```

```javascript
// Bot will reply only to subscribers.
// If user isn't subscriber, bot will send 'Bot available only for subscribers ...'
app.auth(process.env.BOT_TOKEN, {
  subscribers: 1, // mode on
  gid: 138165805, // group_id
  msg: 'Bot available only for subscribers. Subscribe and then try again. <3' // message
});
```

### .command(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

If bot get message which equal to command, then will run callback.

```javascript
app.command('/start', (data) => {
  app.sendMessage(data.user_id, 'This is start command!');
});
```

### .hears(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

If bot hears command in message from user, then will run callback (e.g. user sent 'Hello, world' and bot hears 'hello', then bot will run callback).

```javascript
app.hears('hello', (data) => {
  app.sendMessage(data.user_id, 'Hi!');
});
```

### .reserve(callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| callback   | function  | yes       |

If bot get message and this isn't command, then will run reserved callback.

```javascript
app.reserve(data => {
  app.sendMessage(data.user_id, 'Sorry, you sent not command to bot.');
});
```

### .sendMessage(uid, msg, attach)

| Parameter  | Type      | Requried                     |
| -----------|:---------:| ----------------------------:|
| uid        | number    | yes                          |
| msg        | string    | yes (no, if setten attach)   |
| attach     | string    | yes (no, if setten msg)      |

Send message (multi-dispatch). Also you can only one argument `opts`, it's must be equal to `object` All params for this object you can see on [messages.send](https://vk.com/dev/messages.send) page.

```javascript
app.sendMessage(data.user_id, 'Hello, world!');

app.sendMessage({
  user_id: data.user_id,
  message: 'Hello, function takes only one argument now. It\'s opts.',
  forward_messages: '123,431,544'
});
```

### .replyMessage(updates)

| Parameter  | Type      | Requried                     |
| -----------|:---------:| ----------------------------:|
| updates    | array     | yes                          |

Core function for reply message to user. In the start function calls [getForwardMessage](#getforwardmessageupdate) and then see is the message a command or action and calls [sendMessage](#sendmessageuid-msg-attach).

### .getLastMessage(update)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| update     | object    | yes       |

Get last message from forward message.

```javascript
app.getLastMessage({
  "response": {
    "count": 1,
    "items": [{
      "id": 480,
      "date": 1491653021,
      "out": 0,
      "user_id": 145003487,
      "read_state": 1,
      "title": " ... ",
      "body": "",
      "fwd_messages": [{
        "user_id": -138165805,
        "date": 1491652976,
        "body": "Hello, world!"
      }]
    }]
  }
});
```

### .getForwardMessage(update)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| update     | array     | yes       |

Get message info from forward message. If function detects `fwd_messages`, then will call [getLastMessage](#getlastmessageupdate).

```javascript
app.getForwardMessage([ 4, 487, 529, 145003487, 1491653078, ' ... ', '',  { fwd: '145003487_2214301' } ]);
```

### .startLongPoll()

Get long poll params.

```javascript
app.startLongPoll();
```

### .getLongPoll(longPollParams)

| Parameter       | Type      | Requried  |
| ----------------|:---------:| ---------:|
| longPollParams  | object    | yes       |

Start long poll.

## License

MIT.
