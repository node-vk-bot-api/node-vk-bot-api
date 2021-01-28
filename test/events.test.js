const { expect } = require('chai');
const VkBot = require('../lib');
const Context = require('../lib/context');

const bot = new VkBot(process.env.TOKEN);

// eslint-disable-next-line no-return-assign
const cleanup = () => bot.middlewares = [];

const emit = (type, message) => bot.next(new Context({
  type,
  object: {
    message: {
      text: message,
    },
    client_info: {
      keyboard: true,
    },
  },
  group_id: 1,
  event_id: '1234567890',
}));

describe('events', () => {
  beforeEach(cleanup);
  afterEach(cleanup);

  it('should call middleware w/ text trigger', (done) => {
    const type = 'message_new';
    const message = '/start';

    bot.command('/start', (ctx) => {
      expect(ctx.message.type).to.be.equal(type);
      expect(ctx.message.text).to.be.equal(message);

      expect(ctx.groupId).to.be.a('number');
      expect(ctx.eventId).to.be.a('string');

      expect(ctx.client_info).to.be.an('object');
      expect(ctx.clientInfo).to.be.an('object');

      expect(ctx.client_info).to.be.deep.equal(ctx.clientInfo);

      done();
    });

    emit(type, message);
  });

  it('should call middleware w/ regex trigger', (done) => {
    const type = 'message_new';
    const message = 'Hello, world!';

    bot.command(/hello, ([a-z]*)!/i, (ctx) => {
      expect(ctx.message.type).to.be.equal(type);
      expect(ctx.message.text).to.be.equal(message);
      expect(ctx.match[0]).to.be.equal('hello, world!');
      expect(ctx.match[1]).to.be.equal('world');

      done();
    });

    emit(type, message);
  });

  it('should call middleware w/ event trigger', (done) => {
    const type = 'group_join';

    bot.event(type, (ctx) => {
      expect(ctx.message.type).to.be.equal(type);

      done();
    });

    emit(type);
  });

  it('should call middleware w/o trigger', (done) => {
    const type = 'message_new';
    const message = 'anything';

    bot.use((ctx) => {
      expect(ctx.message.type).to.be.equal(type);
      expect(ctx.message.text).to.be.equal(message);

      done();
    });

    emit(type, message);
  });
});
