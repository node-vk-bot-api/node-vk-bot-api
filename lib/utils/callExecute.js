const api = require('../api');

module.exports = function (methods) {
  for (let i = 0, j = Math.ceil(methods.length / 25); i < j; i++) {
    const slicedMethods = methods.slice(i * 25, i * 25 + 25);

    api('execute', {
      code: `return [ ${slicedMethods.map(item => item.code)} ];`,
      access_token: this.settings.token,
    })
      .then(({ response, execute_errors = [] }) => {
        execute_errors.forEach(err => console.error(`Execute Error: ${JSON.stringify(err)}`));
        response.forEach((body, i) => slicedMethods[i].callback(body));
      })
      .catch(err => console.error(err));
  }
};
