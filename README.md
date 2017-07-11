[![node-vk-bot-api](https://img.shields.io/npm/v/node-vk-bot-api.svg?style=flat-square)](https://www.npmjs.com/package/node-vk-bot-api/)
[![node-vk-bot-api](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# VK Bot API

Clean API for VK bots based on long poll with multi-dispatch send messages **(75 per second)**.

## Install

```
$ npm i node-vk-bot-api
```

## Example

```javascript
const VK = require('node-vk-bot-api')

const bot = new VK({ token: process.env.TOKEN })

bot.command('attach', (ctx) => {
  ctx.reply('Do you need attachment? Take it easy!', 'wall145003487_2068')
})

bot.hears('hello', (ctx) => {
  ctx.sendMessage(ctx.user_id, 'Did you say hello to me?!')
})

bot.on((ctx) => {
  ctx.reply('I don\'t understand you!')
})

bot.listen()
```

## Methods

* [constructor(options)](#constructoroptions)
* [.command(command, callback)](#commandcommand-callback)
* [.hears(command, callback)](#hearscommand-callback)
* [.on(callback)](#oncallback)
* [.listen()](#listen)

### constructor(options)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| options    | string    | yes       |

You need to set a key if your bot.

```javascript
const bot = new VK({ token: process.env.TOKEN })
```

### .command(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

If the bot get a message which equal to command, then will run a callback.

```javascript
bot.command('attach', (ctx) => {
  ctx.reply('Do you need attachment? Take it easy!', 'wall145003487_2068')
})
```

### .hears(command, callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

If the bot hears a command in message from user, then will run callback (e.g. user sent 'Hello, world' and bot hears 'hello', then bot will run a callback).

```javascript
bot.hears('hello', (ctx) => {
  ctx.sendMessage(ctx.user_id, 'Did you say hello to me?!')
})
```

### .on(callback)

| Parameter  | Type      | Requried  |
| -----------|:---------:| ---------:|
| callback   | function  | yes       |

If the bot receives a message and doesn't find an answer to it, it will run a callback.

```javascript
bot.on((ctx) => {
  ctx.reply('I don\'t understand you!')
})
```

### .listen()

Start listening without any parameters.

## Context Methods

* [.reply(message, attachment)](#replymessage-attachment)
* [.sendMessage(peerId, command, callback)](#sendmessagepeerid-command-callback)

### .reply(message, attachment)

| Parameter  | Type      | Requried                         |
| -----------|:---------:| --------------------------------:|
| message    | string    | yes (no, if setten attachment)   |
| attachment | string    | yes (no, if setten message)      |

Send a message to the current user.

### .sendMessage(peerId, command, callback)

| Parameter  | Type      | Requried                         |
| -----------|:---------:| --------------------------------:|
| peerId     | number    | yes                              |
| message    | string    | yes (no, if setten attachment)   |
| attachment | string    | yes (no, if setten message)      |

Send a message to any user.

## License & Author

MIT.
