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
const VkBot = require('node-vk-bot-api')

const bot = new VkBot(process.env.TOKEN)

bot.command('/start', (ctx) => {
  ctx.reply('Hello!')
})

bot.startPolling()
```

## Methods

* [constructor(settings)](#constructorsettings)
* [.use(middleware)](#usemiddleware)
* [.command(triggers, ...middlewares)](#commandtriggers-middlewares)
* [.on(...middlewares)](#onmiddlewares)
* [.sendMessage(userId, message, attachment, sticker, keyboard)](#sendmessageuserid-message-attachment-sticker-keyboard)
* [.startPolling()](#startpollingtimeout)

### constructor(settings)

| Parameter | Type | Required |
|:----------|:----:| ---------:|
| settings | object | yes |
| settings.token | string | yes |
| settings.group_id | number | yes |

Create bot.

```javascript
const bot = new API({
  token: process.env.TOKEN,
  group_id: process.env.GROUP_ID
})
```

### .use(middleware)

Add simple middleware.

```javascript
bot.use((ctx, next) => {
  ctx.message.timestamp = new Date().getTime()
  
  next()
})
```

### .command(triggers, ...middlewares)

Add middlewares with triggers.

```javascript
bot.command('start', (ctx) => {
  ctx.reply('Hello!')
})
```

### .on(...middlewares)

Add reserved middlewares without triggers.

```javascript
bot.on((ctx) => {
  ctx.reply('No commands for you.')
})
```

### .sendMessage(userId, message, attachment, sticker, keyboard)

Send message to user.

```javascript
// Simple usage
bot.sendMessage(145003487, 'Hello!', 'photo1_1')

// Advanced usage
bot.sendMessage(145003487, {
  message: 'Hello!',
  lat: 59.939095,
  lng: 30.315868
})
```

### .startPolling([timeout])

Start polling with given timeout (25 by default).

```js
bot.startPolling()
```

## Context Methods

* [.reply(message, attachment, sticker, keyboard)](#replymessage-attachment-sticker-keyboard)

### .reply(message, attachment, sticker, keyboard)

Helper method for reply to the current user.

```javascript
bot.command('start', (ctx) => {
  ctx.reply('Hello!')
})
```

## License

MIT.
