[![node-vk-bot-api](https://img.shields.io/npm/v/node-vk-bot-api.svg?style=flat-square)](https://www.npmjs.com/package/node-vk-bot-api/)
[![node-vk-bot-api](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# node-vk-bot-api

API for VK bots, based on [Long Poll](https://vk.com/dev/using_longpoll).

## Install

```sh
$ npm i node-vk-bot-api
```

## Example

```javascript
const API = require('node-vk-bot-api')

const bot = new API(process.env.TOKEN)

bot.command('start', ({ reply }) => reply('This is start!'))
bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))
bot.on(({ reply }) => reply('What?'))

bot.listen()
```

## Methods

* [constructor(options)](#constructoroptions)
* [.use(callback)](#usecallback)
* [.command(command, callback)](#commandcommand-callback)
* [.hears(command, callback)](#hearscommand-callback)
* [.on(callback)](#oncallback)
* [.listen()](#listen)

### constructor(options)

| Parameter  | Type      | Required  |
|:-----------|:---------:| ---------:|
| token      | string    | yes       |

Create bot.

```javascript
const bot = new API(process.env.TOKEN)
```

### .use(callback)

| Parameter  | Type      | Required  |
| -----------|:---------:| ---------:|
| callback   | function  | yes       |

Add middleware.

```js
bot.use(ctx => ctx.date = new Date())

bot.on(({ date }) => {
  // Fri Nov 24 2017 16:00:21 GMT+0300 (MSK)
})
```

### .command(command, callback)

| Parameter  | Type      | Required  |
| -----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

Add command w/ strict match.

```javascript
bot.command('start', ({ reply }) => reply('This is start!'))
```

### .hears(command, callback)

| Parameter  | Type      | Required  |
| -----------|:---------:| ---------:|
| command    | string/regexp | yes   |
| callback   | function  | yes       |

Add command w/ match like RegEx.

```javascript
bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))
```

### .on(callback)

| Parameter  | Type      | Required  |
|:-----------|:---------:| ---------:|
| callback   | function  | yes       |

Add reserved callback.

```javascript
bot.on(({ reply }) => {
  reply('What?')
})
```

### .listen()

Start listen.

## Context Methods

* [.reply(peer_id, message, attachment, callback)](#replypeer_id-message-attachment-callback)

### .reply(peer_id, message, attachment, callback)


| Parameter  | Type             | Requried  |
| -----------|:----------------:| ---------:|
| user_id     | number or array  | yes       |
| message    | string           | yes (no, if setten attachment)   |
| attachment | string           | yes (no, if setten message)      |
| callback   | function         | no        |

Send a message to user.

```javascript
bot.command('start', (ctx) => {
  // with shortcut from context
  ctx.reply('Hi, this is start!')
  // function from context
  ctx.sendMessage(ctx.peer_id, 'Hi, this is start!')
  // simple usage
  bot.reply(ctx.peer_id, 'Hi, this is start!')
})
```

## License

MIT.
