const { expect } = require('chai')

const Bot = require('../')
const config = require('../config')


describe('Botact', () => {
  before(() => {
    this.bot = new Bot(config.token)
  })

  it('CREATE bot', () => {
    const { bot } = this
    expect(bot).to.be.a('object')
  })

  it('GET fields', () => {
    expect(this.bot)
      .to.be.a('object')
      .to.have.all.keys([
        'actions', 'api', 'command', 'execute', 'getLastMessage', 'hears', 'listen', 'message', 'methods', 'on', 'reply', 'token', 'webhook'
      ])
  })

  it('SET on message callback', ()=>{
    let callback = ()=>{}
    this.bot.on(callback)
    expect(this.bot.actions.on).eq(callback)
  
  })

  it('GET webhook', () => {
    expect(this.bot.webhook({key: config.key, groupId: config.groupId}))
      .to.be.a('function')
  })


  it('SEND message', async () => {
    this.bot.reply(20124065, 'Hello, world!', null, (body) => {
      expect(body).to.be.a('number')
    })
  })

})