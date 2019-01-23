class Stage {
  constructor(...scenes) {
    this.scenes = {};

    scenes.forEach(({ name, middlewares }) => {
      this.scenes[name] = middlewares;
    });
  }

  enter(ctx) {
    const { current, step } = ctx.session.__scene;

    if (ctx.message.text || ctx.message.body) {
      const text = (ctx.message.text || ctx.message.body).toLowerCase();
      const command = this.scenes[current].find(({ triggers }) => {
        if (!triggers) {
          return false;
        }

        return triggers.some(trigger => (trigger instanceof RegExp ? trigger.test(text) : text.startsWith(trigger)));
      });

      if (command) {
        return command.fn(ctx);
      }
    }

    const simple = this.scenes[current][step];

    if (simple) {
      return simple.fn(ctx);
    }

    console.error(`Middleware not found for ${current} scene at ${step} step`);
  }

  middleware() {
    return (ctx, next) => {
      ctx.scene = {
        enter: (name, step = 0) => {
          ctx.session.__scene = {
            current: name,
            step,
          };

          this.enter(ctx);
        },
        leave: () => {
          ctx.session.__scene = null;
        },
        next: () => {
          ++ctx.session.__scene.step;
        },
        selectStep: (index) => {
          ctx.session.__scene.step = index;
        },
      };

      Object.defineProperty(ctx.scene, 'step', {
        get: () => ctx.session.__scene.step,
        set: (index) => {
          ctx.session.__scene.step = index;
        },
      });

      if (ctx.session.__scene && ctx.message.type === 'message_new') {
        return this.enter(ctx);
      }

      next();
    };
  }
}

module.exports = Stage;
