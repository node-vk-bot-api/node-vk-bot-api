const api = require('../api');
const callbackHandler = require('./callbackHandler');

module.exports = (methods) => {
  methods.forEach(({ access_token, items }) => {
    const code = items.map(({ code }) => code);
    const callbacks = items.map(({ callback }) => callback);

    for (let i = 0, j = Math.ceil(code.length / 25); i < j; i++) {
      api('execute', {
        code: `return [ ${code.slice(i * 25, i * 25 + 25)} ];`,
        access_token
      })
        .then(({ data }) => callbackHandler(data, callbacks))
        .catch(err => callbackHandler(err, callbacks));
    }
  });
};
