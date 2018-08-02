const VkBot = require('../lib')
const Markup = require('../lib/markup')

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

bot.startPolling()
