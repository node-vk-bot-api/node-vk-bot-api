const API = require('../index')
const { TOKEN } = process.env

const bot = new API(TOKEN)

bot.command('start', ({ reply }) => reply('This is start!'))

bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))

bot.on(({ reply }) => reply('What?'))

bot.listen()
