const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const VkBot = require('../lib');

const app = new Koa();
const router = new Router();
const bot = new VkBot({
  token: process.env.TOKEN,
  confirmation: process.env.CONFIRMATION,
});

bot.on((ctx) => {
  ctx.reply('Hello!');
});

router.post('/', bot.webhookCallback);

app.use(bodyParser());
app.use(router.routes());

app.listen(process.env.PORT);
