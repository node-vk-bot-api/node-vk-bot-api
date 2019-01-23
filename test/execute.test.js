const { expect } = require('chai');
const VkBot = require('../lib');

const bot = new VkBot(process.env.TOKEN);

describe('execute', () => {
  it('should execute one request (promise)', async () => {
    const response = await bot.execute('users.get', { user_id: 145003487 });

    expect(response).to.be.an('object');
    expect(response.id).to.be.a('number');
    expect(response.first_name).to.be.a('string');
    expect(response.last_name).to.be.a('string');
  });

  it('should execute one request (callback)', (done) => {
    bot.execute('users.get', { user_id: 145003487 }, (response) => {
      expect(response).to.be.an('object');
      expect(response.id).to.be.a('number');
      expect(response.first_name).to.be.a('string');
      expect(response.last_name).to.be.a('string');

      done();
    });
  });

  it('should execute 75 requests with one failed (promise)', (done) => {
    Array(75).fill(null).map(() => bot.execute('users.get', { user_id: 145003487 }));

    bot.execute('wall.post', {}).catch((err) => {
      expect(err).to.be.an('object');
      expect(err.method).to.be.a('string');
      expect(err.error_code).to.be.a('number');
      expect(err.error_msg).to.be.a('string');

      done();
    });
  });

  it('should execute 75 requests with one failed (callback)', (done) => {
    Array(75).fill(null).map(() => bot.execute('users.get', { user_id: 145003487 }));

    bot.execute('wall.post', {}, (err) => {
      expect(err).to.be.an('object');
      expect(err.method).to.be.a('string');
      expect(err.error_code).to.be.a('number');
      expect(err.error_msg).to.be.a('string');

      done();
    });
  });
});
