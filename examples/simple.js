const API = require('../index')
const { token } = require('../config')

const bot = new API(token)

bot.command('start', ({ reply }) => reply('This is start!'))

bot.hears(/(car|tesla)/, ({ reply }) => reply('I love Tesla!'))

bot.on(({ reply }) => reply('What?'))

bot.listen()
