[![node-vk-bot-api](https://img.shields.io/npm/v/node-vk-bot-api.svg?style=flat-square)](https://www.npmjs.com/package/node-vk-bot-api/)
![node-vk-bot-api](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=flat-square)
![node-vk-bot-api](https://img.shields.io/travis/node-vk-bot-api/node-vk-bot-api.svg?branch=master&style=flat-square)

# node-vk-bot-api

🤖 VK bot framework for Node.js, based on [Bots Long Poll API](https://vk.com/dev/bots_longpoll) and [Callback API](https://vk.com/dev.php?method=callback_api).

## Install

```sh
$ npm i node-vk-bot-api -S
```

## Usage

```javascript
const VkBot = require('node-vk-bot-api');

const bot = new VkBot(process.env.TOKEN);

bot.command('/start', (ctx) => {
  ctx.reply('Hello!');
});

bot.startPolling();
```

## Webhooks

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const VkBot = require('node-vk-bot-api');

const app = express();
const bot = new VkBot({
  token: process.env.TOKEN,
  confirmation: process.env.CONFIRMATION,
});

bot.on((ctx) => {
  ctx.reply('Hello!');
});

app.use(bodyParser.json());

app.post('/', bot.webhookCallback);

app.listen(process.env.PORT);
```

## Examples

[There's a few simple examples.](/examples)

## Community support

Any questions you can ask in the [telegram chat](https://tele.click/joinchat/BXuo0kxMRNVyfdKKjMHpQQ). [russian/english]

## Tests

```sh
$ npm test
```


## API

```js
const api = require('node-vk-bot-api/lib/api');

api('users.get', {
  user_ids: 1,
  access_token: process.env.TOKEN,
}); // => Promise
```

## Error handling

```js
// bad
bot.command('/start', (ctx) => {
  ctx.reply('Hello, world!');
});

// not bad
bot.command('/start', async (ctx) => {
  try {
    await ctx.reply('Hello, world!');
  } catch (e) {
    console.error(e);
  }
});

// good
bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e);
  }
});

bot.command('/start', async (ctx) => {
  await ctx.reply('Hello, world!');
});
```

```js
// bad
bot.startPolling();

// good
bot.startPolling((err) => {
  if (err) {
    console.error(err);
  }
});
```

## Methods

* [constructor(settings)](#constructorsettings)
* [.execute(method, settings)](#executemethod-settings)
* [.use(middleware)](#usemiddleware)
* [.command(triggers, ...middlewares)](#commandtriggers-middlewares)
* [.event(triggers, ...middlewares)](#eventtriggers-middlewares)
* [.on(...middlewares)](#onmiddlewares)
* [.sendMessage(userId, message, attachment, keyboard, sticker)](#sendmessageuserid-message-attachment-keyboard-sticker)
* [.startPolling([callback])](#startpollingcallback)
* [.webhookCallback(...args)](#webhookcallbackargs)
* [.stop()](#stop)
* [.start()](#start)

### constructor(settings)

Create bot.

```javascript
// Simple usage
const bot = new VkBot(process.env.TOKEN);

// Advanced usage
const bot = new VkBot({
  token: process.env.TOKEN,
  group_id: process.env.GROUP_ID,
  execute_timeout: process.env.EXECUTE_TIMEOUT, // in ms   (50 by default)
  polling_timeout: process.env.POLLING_TIMEOUT, // in secs (25 by default)

  // webhooks options only
  secret: process.env.SECRET,                   // secret key (optional)
  confirmation: process.env.CONFIRMATION,       // confirmation string
});
```

### .execute(method, settings)

Execute request to the VK API.

```js
const response = await bot.execute('users.get', {
  user_ids: 1,
});
``` 

### .use(middleware)

Add simple middleware.

```javascript
bot.use((ctx, next) => {
  ctx.message.timestamp = new Date().getTime();

  return next();
});
```

### .command(triggers, ...middlewares)

Add middlewares with triggers for `message_new` event.

```javascript
bot.command('start', (ctx) => {
  ctx.reply('Hello!');
});
```

### .event(triggers, ...middlewares)

Add middlewares with triggers for selected events.

```javascript
bot.event('message_edit', (ctx) => {
  ctx.reply('Your message was editted');
});
```

### .on(...middlewares)

Add reserved middlewares without triggers.

```javascript
bot.on((ctx) => {
  ctx.reply('No commands for you.');
});
```

### .sendMessage(userId, message, attachment, keyboard, sticker)

Send message to user.

```javascript
// Simple usage
bot.sendMessage(145003487, 'Hello!', 'photo1_1');

// Multiple recipients
bot.sendMessage([145003487, 145003488], 'Hello!', 'photo1_1');

// Advanced usage
bot.sendMessage(145003487, {
  message: 'Hello!',
  lat: 59.939095,
  lng: 30.315868,
});
```

### .startPolling([callback])

Start polling with optional callback.

```js
bot.startPolling((err) => {
  if (err) {
    console.error(err);
  }
});
```

### .webhookCallback(...args)

Get webhook callback.

```js
// express
bot.webhookCallback(req, res, next);

// koa
bot.webhookCallback(ctx, next);
```

### .stop()

Stop the bot. Disables any receiving updates from Long Poll or Callback APIs.

```js
bot.stop();
```

### .start()

Start the bot after it was turned off via [.stop()](#stop) method. When you are using Long Poll API, you need to call [`.startPolling([callback])`](#startpollingcallback) again.

```js
bot.start();
```

## Context Structure

* `message` - received message (pure object from VK API)
    * `type` - received type event (e.g. message_new)
    * ... other fields from VK API
* `eventId` - callback's eventId
* `groupId` - callback's groupId
* `match?` - regexp match of your trigger
* `clientInfo?` - received client info (pure object from VK API)
* `bot` - instance of bot, you can call any methods via this instance

## Context Methods

* [.reply(message, attachment, markup, sticker)](#replymessage-attachment-keyboard-sticker)

### .reply(message, attachment, markup, sticker)

Helper method for reply to the current user.

```javascript
bot.command('start', (ctx) => {
  ctx.reply('Hello!');
});
```

## Markup

### Keyboards

* `Markup.keyboard(buttons, options)`: Create keyboard
* `Markup.button(label, color, payload)`: Create custom button
* `Markup.oneTime()`: Set oneTime to keyboard

#### Simple usage

```js
ctx.reply('Select your sport', null, Markup
  .keyboard([
    'Football',
    'Basketball',
  ])
  .oneTime(),
);
```

#### Advanced usage

```js
// custom buttons
ctx.reply('Hey!', null, Markup
  .keyboard([
    Markup.button({
      action: {
        type: 'open_link',
        link: 'https://google.com',
        label: 'Open Google',
        payload: JSON.stringify({
          url: 'https://google.com',
        }),
      },
      color: 'default',
    }),
  ]),
);

// default buttons
ctx.reply('How are you doing?', null, Markup
  .keyboard([
    [
      Markup.button('Normally', 'primary'),
    ],
    [
      Markup.button('Fine', 'positive'),
      Markup.button('Bad', 'negative'),
    ],
  ]),
);
```

### .keyboard(buttons, options)

Create keyboard with optional settings.

```js
/*

  Each string has maximum 2 columns.

  | one   | two   |
  | three | four  |
  | five  | six   |

 */

Markup.keyboard([
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
], { columns: 2 });
```

```js
/*

  By default, columns count for each string is 4.

  | one | two | three |

 */

Markup.keyboard([
  'one',
  'two',
  'three',
]);
```

### .button(label, color, payload)

Create custom button.

```js
Markup.button('Start', 'positive', {
  foo: 'bar',
});
```

### .oneTime()

Helper method for create one time keyboard.

```js
Markup
  .keyboard(['Start', 'Help'])
  .oneTime();
```

### .inline()

Helpers method for create inline keyboard.

```js
Markup
  .keyboard(['Start', 'Help'])
  .inline();
```

## Sessions

Store anything for current user in local (or [redis](https://github.com/node-vk-bot-api/node-vk-bot-api-session-redis)) memory.

### Usage

```javascript
const VkBot = require('node-vk-bot-api');
const Session = require('node-vk-bot-api/lib/session');

const bot = new VkBot(process.env.TOKEN);
const session = new Session();

bot.use(session.middleware());

bot.on((ctx) => {
  ctx.session.counter = ctx.session.counter || 0;
  ctx.session.counter++;

  ctx.reply(`You wrote ${ctx.session.counter} messages.`);
});

bot.startPolling();
```

### API

#### Options

* `key`: Context property name (default: `session`)
* `getSessionKey`: Getter for session key

##### Default `getSessionKey(ctx)`

```js
const getSessionKey = (ctx) => {
  const userId = ctx.message.from_id || ctx.message.user_id;

  return `${userId}:${userId}`;
};
````

## Stage

Scene manager.
```javascript
const VkBot = require('node-vk-bot-api');
const Scene = require('node-vk-bot-api/lib/scene');
const Session = require('node-vk-bot-api/lib/session');
const Stage = require('node-vk-bot-api/lib/stage');

const bot = new VkBot(process.env.TOKEN);
const scene = new Scene('meet',
  (ctx) => {
    ctx.scene.next();
    ctx.reply('How old are you?');
  },
  (ctx) => {
    ctx.session.age = +ctx.message.text;

    ctx.scene.next();
    ctx.reply('What is your name?');
  },
  (ctx) => {
    ctx.session.name = ctx.message.text;

    ctx.scene.leave();
    ctx.reply(`Nice to meet you, ${ctx.session.name} (${ctx.session.age} years old)`);
  },
);
const session = new Session();
const stage = new Stage(scene);

bot.use(session.middleware());
bot.use(stage.middleware());

bot.command('/meet', (ctx) => {
  ctx.scene.enter('meet');
});

bot.startPolling();
```

### API

#### Stage

* `constructor(...scenes)`: Register scenes

#### Scene

* `constructor(name, ...middlewares)`: Create scene
* `.command(triggers, ...middlewares)`: Create commands for scene

#### Context

```js
ctx.scene.enter(name, [step]) // Enter in scene
ctx.scene.leave()             // Leave from scene
ctx.scene.next()              // Go to the next step in scene
ctx.scene.step                // Getter for step in scene
ctx.scene.step=               // Setter for step in scene
```

## License

MIT.
