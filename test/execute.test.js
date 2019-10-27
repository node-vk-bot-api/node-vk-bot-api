const { expect } = require('chai');
const VkBot = require('../lib');

const bot = new VkBot(process.env.TOKEN);

describe('execute', () => {
  it('should execute one request', async () => {
    const response = await bot.execute('users.get', { user_id: 145003487 });

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('number');
    expect(response[0].first_name).to.be.a('string');
    expect(response[0].last_name).to.be.a('string');
  });

  it('should execute 24 requests with one failed', (done) => {
    Array(24).fill(null).map(() => bot.execute('users.get', { user_id: 145003487 }));

    bot.execute('wall.post', {}).catch((err) => {
      expect(err).to.be.an('object');
      expect(err.method).to.be.a('string');
      expect(err.error_code).to.be.a('number');
      expect(err.error_msg).to.be.a('string');

      done();
    });
  });
});
