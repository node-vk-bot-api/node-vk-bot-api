# VK Bot API

Clean API for VK bots based on long poll with multi-dispatch send messages **(~75 per second)**.

## Install

```
$ npm install node-vk-bot-api
```

## Example

Full example you can check in `examples` folder.

```javascript
const app = require('node-vk-bot-api');

// Set token
app.setToken('88935996c67c2qwed1547b79a0c8b0093227e61sd15ce14c62e490aa96c8f8ed3090c9cbcdda92c8fadf1f5c74c');

// Send 'Hello' to user on command '/start'
app.addCommand('/start', (data) => {
  const uid = data.user_id;

  app.sendMessage({ user_id: uid, message: 'Hello, this is /start command!' }); // => '{ response: [ 1 ] }'
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
```

## Methods

* .setToken(token)
* .addCommand(command, callback)
* .notCommand(callback)
* .sendMessage(opts)
* .getLastMessage(update)
* .getForwardMessage(update)
* .startLongPoll()
* .getLongPoll(longPollParams)

### .setToken(token)

Set token to bot. Function takes one argument: `token` **(string)**.

```javascript
app.setToken('88935996c67c290f47b79a0c8b0093227e916ce14c62e490aa96c8f8ed3090c9cbcdda92c8fadf1f5c74c');
```

### .addCommand(command, callback)

Add command to bot. Function takes two arguments: `command` **(string)** and `callback` **(function)**.

```javascript
app.addCommand('/start', (data) => {
  // Make your magic here...
});
```

### .notCommand(callback)

Set reply if user sent not command. Function takes one argument: `callback` **(function)**.

```javascript
app.notCommand(data => {
  const uid = data.user_id;

  app.sendMessage({ user_id: uid, message: 'Sorry, you sent not command to bot.' });
});
```

### .sendMessage(opts)

Send message (multi-dispatch) to users. Function takes one argument: `opts` **(object)**.

```javascript
app.sendMessage({ user_id: uid, message: 'Hello, world!' });
```

### .getLastMessage(update)

Get last message from forward message. Function takes one argument: `update` **(object)**.

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

Get message info from forward message. If function detects `fwd_messages`, then will call `.getLastMessage(update)`. Function takes one argument: `update` **(object)**.

```javascript
app.getForwardMessage({
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

### .startLongPoll()

Get long poll params. Function doesn't take arguments.

```javascript
app.startLongPoll();
```

### .getLongPoll(longPollParams)

Start long poll. Function takes one argument: `longPollParams` **(object)**.

```
System function. Not used by user in bot.
```

## License

MIT.
