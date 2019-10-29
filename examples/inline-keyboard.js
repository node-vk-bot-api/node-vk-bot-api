const VkBot = require('../lib');
const Markup = require('../lib/markup');

const bot = new VkBot(process.env.TOKEN);

bot.command('/select', (ctx) => {
  ctx.reply('Select your age', null, Markup
    .keyboard([
      '10-20',
      '20-30',
      '40-50',
      '50-60',
    ], { columns: 2 })
    .inline(),
  );
});

bot.on((ctx) => {
  ctx.reply(`You are ${ctx.message.text} years old.`);
});

bot.startPolling();
