const VkBot = require('../lib')
const Session = require('../lib/session')

const bot = new VkBot({
  token: process.env.TOKEN,
  group_id: process.env.GROUP_ID,
})
const session = new Session()

bot.use(session.middleware())

bot.command('/add', (ctx) => {
  ctx.session.counter = (ctx.session.counter || 0) + 1

  ctx.reply('Okay')
})

bot.command('/get', (ctx) => {
  ctx.reply(`Counter: ${ctx.session.counter || 0}`)
})

bot.startPolling()
