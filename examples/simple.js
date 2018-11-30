const VkBot = require('../lib');

const bot = new VkBot(process.env.TOKEN);

bot.on((ctx) => {
  ctx.reply('Hello!');
});

bot.startPolling();
