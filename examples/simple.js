const API = require('../index')
const { settings } = require('../config')

const bot = new API(settings)

bot.command('start', ({ reply }) => reply('This is start!'))

bot.hears('car', ({ reply }) => reply('I love Tesla!'))

bot.on(({ reply }) => reply('What?'))

bot.listen()
