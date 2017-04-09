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

* [.auth(token)](#authtoken)
* [.command(command, callback)](#commandcommand-callback)
* [.hears(command, callback)](#hearscommand-callback)
* [.reserve(callback)](#reservecallback)
* [.sendMessage(uid, msg, attach)](#sendmessageuid-msg-attach)
* [.getLastMessage(update)](#getlastmessageupdate)
* [.getForwardMessage(update)](#getforwardmessageupdate)
* [.startLongPoll()](#startlongpoll)
* [.getLongPoll()](#getlongpoll)

### .auth(token)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| token      | string    | yes       |

Authting with token.

```javascript
app.auth('88935996c67c290f47b79a0c8b0093227e916ce14c62e490aa96c8f8ed3090c9cbcdda92c8fadf1f5c74c');
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

Get message info from forward message. If function detects `fwd_messages`, then will call `.getLastMessage(update)`.

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
