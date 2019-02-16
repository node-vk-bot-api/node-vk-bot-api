const VkBot = require('../lib');
const Markup = require('../lib/markup');

const bot = new VkBot(process.env.TOKEN);

bot.command('/sport', (ctx) => {
  ctx.reply('Select your sport', null, Markup
    .keyboard([
      'Football',
      'Basketball',
    ])
    .oneTime());
});

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
    ]));
});

bot.command('/stats', (ctx) => {
  ctx.reply('Select the period of time:', null, Markup
    .keyboard([
      [
        Markup.button('For month', 'primary', { command: 'stats', period: 'month' }),
        Markup.button('For year', 'default', 'year'),
      ],
    ])
    .oneTime());
});

bot.button({ command: 'stats', period: 'month' }, ctx => ctx.reply('For month'));
bot.button('year', ctx => ctx.reply('For year'));

bot.startPolling();
