[![node-vk-bot-api](https://img.shields.io/npm/v/node-vk-bot-api.svg?style=flat-square)](https://www.npmjs.com/package/node-vk-bot-api/)
[![node-vk-bot-api](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# node-vk-bot-api

API for VK bots on long poll.

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
## Example for express (webhooks callback api)

```javascript
const express = require('express')
const API = require('node-vk-bot-api')

const app = express()
const bot = new API(process.env.TOKEN)

bot.command('start', ({ reply }) => reply('This is start!'))

bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))

bot.on(({ reply }) => reply('What?'))

app.use('/bot', bot.webhook({key:process.env.KEY, groupId:process.env.groupId}))

app.listen(3123)

```

## Methods

* [constructor(options)](#constructoroptions)
* [.command(command, callback)](#commandcommand-callback)
* [.hears(command, callback)](#hearscommand-callback)
* [.on(callback)](#oncallback)
* [.listen()](#listen)
* [.webhook()](#webhook)

### constructor(options)

| Parameter  | Type      | Requried  |
|:-----------|:---------:| ---------:|
| token      | string    | yes       |

Create bot.

```javascript
const bot = new API({
  token: process.env.TOKEN
})
```

### .command(command, callback)

| Parameter  | Type      | Requried  |
|:-----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

Add command w/ strict match.

```javascript
bot.command('start', ({ reply }) => reply('This is start!'))
```

### .hears(command, callback)

| Parameter  | Type      | Requried  |
|:-----------|:---------:| ---------:|
| command    | string    | yes       |
| callback   | function  | yes       |

Add command w/ match like RegEx.

```javascript
bot.hears('car', ({ reply }) => reply('I love Tesla!'))
```

### .on(callback)

| Parameter  | Type      | Requried  |
|:-----------|:---------:| ---------:|
| callback   | function  | yes       |

Add reserved callback.

```javascript
bot.on(({ reply }) => reply('What?'))
```

### .webhook(options)

| Parameter  | Type      | Requried  |
|:-----------|:---------:| ---------:|
| key        | String    | yes       |
| groupId    | Number    | yes       |

Return express router for listen webhook.

```javascript
app.use('/bot', bot.webhook({key:'e17235ca', groupId:157273165}))
```

### .listen()

Start listen.

## Context Methods

* [.reply(message, attachment)](#replymessage-attachment)
* [.sendMessage(peer, command, callback)](#sendmessagepeerid-command-callback)

### .reply(message, attachment)

| Parameter  | Type      | Requried                         |
|:-----------|:---------:| --------------------------------:|
| message    | string    | yes (no, if setten attachment)   |
| attachment | string    | yes (no, if setten message)      |

Send a message to the current user.

### .sendMessage(peer, command, callback)

| Parameter  | Type      | Requried                         |
|:-----------|:---------:| --------------------------------:|
| peer     | number    | yes                              |
| message    | string    | yes (no, if setten attachment)   |
| attachment | string    | yes (no, if setten message)      |

Send a message to any user.

## License

MIT.
