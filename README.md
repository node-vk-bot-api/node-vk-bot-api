[![node-vk-bot-api](https://img.shields.io/npm/v/node-vk-bot-api.svg?style=flat-square)](https://www.npmjs.com/package/node-vk-bot-api/)
[![node-vk-bot-api](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# node-vk-bot-api

🤖 VK bot framework for Node.js, based on [Bots Long Poll API](https://vk.com/dev/bots_longpoll).

## Install

```sh
$ npm i node-vk-bot-api@2 -S # bots longpoll api
$ npm i node-vk-bot-api@1 -S # user longpoll api
```

## Usage

```javascript
const VkBot = require('node-vk-bot-api')

const bot = new VkBot({
  token: process.env.TOKEN,
  group_id: process.env.GROUP_ID
})

bot.command('/start', (ctx) => {
  ctx.reply('Hello!')
})

bot.startPolling()
```

## Examples

[There's a few simple examples.](/examples)

## Methods

* [constructor(settings)](#constructorsettings)
* [.use(middleware)](#usemiddleware)
* [.command(triggers, ...middlewares)](#commandtriggers-middlewares)
* [.event(triggers, ...middlewares)](#eventtriggers-middlewares)
* [.on(...middlewares)](#onmiddlewares)
* [.sendMessage(userId, message, attachment, keyboard, sticker)](#sendmessageuserid-message-attachment-keyboard-sticker)
* [.startPolling()](#startpollingtimeout)

### constructor(settings)

Create bot.

```javascript
const bot = new VkBot({
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

Add middlewares with triggers for `message_new` event.

```javascript
bot.command('start', (ctx) => {
  ctx.reply('Hello!')
})
```

### .event(triggers, ...middlewares)

Add middlewares with triggers for selected events.

```javascript
bot.event('message_edit', (ctx) => {
  ctx.reply('Your message was editted')
})
```

### .on(...middlewares)

Add reserved middlewares without triggers.

```javascript
bot.on((ctx) => {
  ctx.reply('No commands for you.')
})
```

### .sendMessage(userId, message, attachment, keyboard, sticker)

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

* [.reply(message, attachment, keyboard, sticker)](#replymessage-attachment-keyboard-sticker)

### .reply(message, attachment, keyboard, sticker)

Helper method for reply to the current user.

```javascript
bot.command('start', (ctx) => {
  ctx.reply('Hello!')
})
```

## Markup

Add keyboard in message.

```javascript
const VkBot = require('node-vk-bot-api')
const Markup = require('node-vk-bot-api/lib/markup')

const bot = new VkBot({
  token: process.env.TOKEN,
  group_id: process.env.GROUP_ID,
})

bot.command('/sport', (ctx) => {
  ctx.reply('Select your sport', null, Markup
    .keyboard([
      'Football',
      'Basketball',
    ])
    .oneTime())
})

bot.command('/mood', (ctx) => {
  ctx.reply('How are you doing?', null, Markup
    .keyboard([
      [
        Markup.button('Normally', 'primary'),
      ],
      [
        Markup.button('Fine', 'positive'),
        Markup.button('Bad', 'negative'),
      ],
    ]))
})
```

## Sessions

Store anything for current user in local (or [redis](https://github.com/node-vk-bot-api/node-vk-bot-api-session-redis)) memory.

### Usage

```javascript
const VkBot = require('node-vk-bot-api')
const Session = require('node-vk-bot-api/lib/session')

const bot = new VkBot({
  token: process.env.TOKEN,
  group_id: process.env.GROUP_ID,
})
const session = new Session()

bot.use(session.middleware())

bot.on((ctx) => {
  ctx.session.counter = ctx.session.counter || 0
  ctx.session.counter++

  ctx.reply(`You wrote ${ctx.session.counter} messages.`)
})

bot.startPolling()
```

### API

#### Options

* `key`: Context property name (default: `session`)
* `getSessionKey`: Getter for session key

##### Default `getSessionKey(ctx)`

```js
const getSessionKey = (ctx) => {
 return `${ctx.message.from_id}:${ctx.message.from_id}` 
}
````

## Stage

Scene manager.
```javascript
const VkBot = require('node-vk-bot-api')
const Scene = require('node-vk-bot-api/lib/scene')
const Session = require('node-vk-bot-api/lib/session')
const Stage = require('node-vk-bot-api/lib/stage')

const bot = new VkBot({
  token: process.env.TOKEN,
  group_id: process.env.GROUP_ID,
})
const scene = new Scene('meet',
  (ctx) => {
    ctx.scene.next()
    ctx.reply('How old are you?')
  },
  (ctx) => {
    ctx.session.age = +ctx.message.text

    ctx.scene.next()
    ctx.reply('What is your name?')
  },
  (ctx) => {
    ctx.session.name = ctx.message.text

    ctx.scene.leave()
    ctx.reply(`Nice to meet you, ${ctx.session.name} (${ctx.session.age} years old)`)
  }
)
const session = new Session()
const stage = new Stage(scene)

bot.use(session.middleware())
bot.use(stage.middleware())

bot.command('/meet', (ctx) => {
  ctx.scene.enter('meet')
})

bot.startPolling()
```

### API

#### Stage

* `constructor(...scenes)`: Register scenes
* `enter(name)`: Enter in scene
* `leave()`: Leave from scene
* `next()`: Go to the next step in scene

#### Scene

* `constructor(name, ...middlewares)`: Create scene

## License

MIT.
