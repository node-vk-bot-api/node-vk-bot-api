const VK = require('../index')

const bot = new VK({ token: process.env.TOKEN })

bot.command('attach', (ctx) => {
  ctx.reply('Do you need attachment? Take it easy!', 'wall145003487_2068')
})

bot.hears('hello', (ctx) => {
  ctx.sendMessage(ctx.user_id, 'Did you say hello to me?!')
})

bot.on((ctx) => {
  ctx.reply('I don\'t understand you!')
})

bot.listen()
