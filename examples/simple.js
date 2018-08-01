const VkBot = require('../')

const bot = new VkBot({
  token: process.env.TOKEN,
  group_id: process.env.GROUP_ID,
})

bot.command('/start', (ctx) => {
  ctx.reply('Hello!')
})

bot.startPolling()
