const VkBot = require('../')

const bot = new VkBot(process.env.TOKEN)

bot.command('/start', (ctx) => {
  ctx.reply('Hello, this is start command!')
})

bot.startPolling()
