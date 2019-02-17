const { expect } = require('chai');
const VkBot = require('../lib');
const { TRIGGER_TYPES } = require('../lib/constants');

const bot = new VkBot(process.env.TOKEN);

describe('triggers', () => {
  const test = (middleware, triggers, type) => {
    expect(middleware).to.be.an('object');
    expect(middleware.fn).to.be.a('function');
    expect(middleware.triggers).to.be.an('array').to.have.length(triggers.length);
    expect(middleware.type).to.be.equal(type);

    triggers.forEach((trigger, index) => {
      expect(middleware.triggers[index], trigger);
    });
  };

  beforeEach(() => {
    bot.middlewares = [];
  });

  describe('unit', () => {
    it('should create event trigger', () => {
      bot.event('message_reply', () => {});

      test(bot.middlewares[0], ['message_reply'], TRIGGER_TYPES.EVENT);
    });

    it('should create text trigger', () => {
      bot.command('start', () => {});

      test(bot.middlewares[0], ['start'], TRIGGER_TYPES.TEXT);
    });

    it('should create text trigger without commands', () => {
      bot.on(() => {});

      test(bot.middlewares[0], [], TRIGGER_TYPES.TEXT);
    });

    it('should create button trigger', () => {
      bot.button({ command: 'start' }, () => {});

      test(bot.middlewares[0], [JSON.stringify({ command: 'start' })], TRIGGER_TYPES.PAYLOAD);
    });
  });

  describe('e2e', () => {
    it('should match event trigger', (done) => {
      bot.event('message_reply', () => done());

      bot.next({
        message: {
          type: 'message_reply',
          text: 'Bye!',
        },
      });
    });

    it('should match text trigger without commands', (done) => {
      bot.on(() => done());

      bot.next({
        message: {
          type: 'message_new',
          text: 'AJSDkj',
        },
      });
    });

    it('should match text trigger', (done) => {
      bot.command('help', () => done());

      bot.next({
        message: {
          type: 'message_new',
          text: 'help me, please',
        },
      });
    });

    it('should match regex trigger', (done) => {
      bot.command(/^hello/i, () => done());

      bot.next({
        message: {
          type: 'message_new',
          text: 'Hello, world!',
        },
      });
    });

    it('should match button trigger with payload json', (done) => {
      bot.button({ command: 'start' }, () => {
        done();
      });

      bot.next({
        message: {
          type: 'message_new',
          text: 'Start',
          payload: JSON.stringify({ command: 'start' }),
        },
      });
    });

    it('should match button trigger with default payload', (done) => {
      bot.button('help', () => {
        done();
      });

      bot.next({
        message: {
          type: 'message_new',
          text: 'Start',
          payload: JSON.stringify({ button: 'help' }),
        },
      });
    });
  });
});
