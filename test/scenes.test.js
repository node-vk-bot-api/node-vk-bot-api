const { expect } = require('chai');
const VkBot = require('../lib');
const Scene = require('../lib/scene');
const Stage = require('../lib/stage');
const Session = require('../lib/session');

const bot = new VkBot('TOKEN');

describe('scenes', () => {
  describe('unit', () => {
    let scene;

    it('should create scene', () => {
      scene = new Scene('simple',
        (ctx) => {
          ctx.scene.next();
          ctx.reply('How are you?');
        },
        (ctx) => {
          ctx.scene.leave();
          ctx.reply('OK, bye');
        });

      expect(scene).to.be.an('object').to.have.all.keys(['name', 'middlewares']);
      expect(scene.name).to.be.a('string').to.be.equal('simple');
      expect(scene.middlewares).to.be.an('array').to.have.lengthOf(2);

      scene.middlewares.forEach((middleware) => {
        expect(middleware).to.be.an('object').to.have.all.keys(['fn']);
        expect(middleware.fn).to.be.a('function');
      });

      expect(scene.command).to.be.a('function');
    });

    it('should create stage', () => {
      const stage = new Stage(scene);

      expect(stage).to.be.an('object').to.have.all.keys(['scenes']);
      expect(Object.keys(stage.scenes)).to.be.an('array').to.have.lengthOf(1).to.include('simple');
      expect(stage.enter).to.be.a('function');
      expect(stage.middleware).to.be.a('function');
    });

    it('should create session', () => {
      const session = new Session();

      expect(session).to.be.an('object').to.have.all.keys(['store', 'key', 'getSessionKey']);
      expect(session.store).to.be.a('map');
      expect(session.key).to.be.a('string').to.be.equal('session');
      expect(session.getSessionKey).to.be.a('function');
      expect(session.getSessionKey({ message: { from_id: 'uid' } })).to.be.a('string').to.be.equal('uid:uid');
      expect(session.middleware).to.be.a('function');
    });

    it('should create session with custom settings', () => {
      const session = new Session({
        key: 'my_super_session',
        getSessionKey: ctx => `secure:${ctx.message.text}`,
      });

      expect(session).to.be.an('object').to.have.all.keys(['store', 'key', 'getSessionKey']);
      expect(session.store).to.be.a('map');
      expect(session.key).to.be.a('string').to.be.equal('my_super_session');
      expect(session.getSessionKey).to.be.a('function');
      expect(session.getSessionKey({ message: { text: 'text' } })).to.be.a('string').to.be.equal('secure:text');
      expect(session.middleware).to.be.a('function');
    });
  });

  describe('e2e', () => {
    const session = new Session();

    const testSceneContext = (ctx, current, step) => {
      expect(ctx).to.be.an('object');
      expect(ctx.scene).to.be.an('object').to.have.all.keys(['enter', 'leave', 'next', 'selectStep']);
      expect(ctx.scene.enter).to.be.a('function');
      expect(ctx.scene.leave).to.be.a('function');
      expect(ctx.scene.next).to.be.a('function');
      expect(ctx.scene.selectStep).to.be.a('function');

      if (current === null) {
        expect(ctx.session.__scene).to.be.equal(null);
      }

      if (current !== undefined && current !== null && step !== undefined) {
        expect(ctx.session.__scene).to.be.an('object').to.have.all.keys(['current', 'step']);
        expect(ctx.session.__scene.current).to.be.a('string').to.be.equal(current);
        expect(ctx.session.__scene.step).to.be.a('number').to.be.equal(step);
      }
    };

    bot.use(session.middleware());

    it('should set value in session', (done) => {
      bot.on((ctx) => {
        ctx.session.foo = 'bar';

        expect(ctx.session).to.be.an('object');
        expect(ctx.session.foo).to.be.a('string').to.be.equal('bar');

        done();
      });

      bot.next({
        message: {
          type: 'message_new',
          text: 'Hello!',
        },
      });
    });

    it('should run scene', (done) => {
      bot.middlewares = [];

      const scene = new Scene('test',
        (ctx) => {
          testSceneContext(ctx, 'test', 0);

          ctx.scene.next();

          bot.next({
            message: {
              type: 'message_new',
              text: 'next',
            },
          });
        },
        (ctx) => {
          testSceneContext(ctx, 'test', 1);

          ctx.scene.leave();

          testSceneContext(ctx, null);

          done();
        });
      const stage = new Stage(scene);

      bot.use(session.middleware());
      bot.use(stage.middleware());

      bot.on((ctx) => {
        testSceneContext(ctx);

        ctx.scene.enter('test');
      });

      bot.next({
        message: {
          type: 'message_new',
          text: 'go',
        },
      });
    });

    it('should trigger command in scene', (done) => {
      bot.middlewares = [];

      const scene = new Scene('test',
        (ctx) => {
          testSceneContext(ctx, 'test', 0);

          ctx.scene.next();

          bot.next({
            message: {
              type: 'message_new',
              text: '/cancel',
            },
          });
        },
        (ctx) => {
          ctx.scene.leave();
        });

      scene.command('/cancel', (ctx) => {
        testSceneContext(ctx, 'test', 1);

        ctx.scene.leave();

        testSceneContext(ctx, null);

        done();
      });

      const session = new Session();
      const stage = new Stage(scene);

      bot.use(session.middleware());
      bot.use(stage.middleware());

      bot.on((ctx) => {
        testSceneContext(ctx);

        ctx.scene.enter('test');
      });

      bot.next({
        message: {
          type: 'message_new',
          text: 'go',
        },
      });
    });

    it('should get and step scene step', (done) => {
      bot.middlewares = [];

      const scene = new Scene('test',
        (ctx) => {
          expect(ctx.scene.step).to.be.equal(0);

          ctx.scene.step = 4;

          testSceneContext(ctx, 'test', 4);

          done();
        });

      const session = new Session();
      const stage = new Stage(scene);

      bot.use(session.middleware());
      bot.use(stage.middleware());

      bot.on((ctx) => {
        testSceneContext(ctx);

        ctx.scene.enter('test');
      });

      bot.next({
        message: {
          type: 'message_new',
          text: 'go',
        },
      });
    });
  });
});
