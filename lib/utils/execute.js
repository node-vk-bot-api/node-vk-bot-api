const api = require('../api');

module.exports = (methods, token) => {
  // eslint-disable-next-line no-param-reassign
  methods = methods.map((item, index) => ({
    ...item,
    code: `"${index}": ${item.code}`,
  }));

  for (let i = 0, j = Math.ceil(methods.length / 25); i < j; i++) {
    const code = methods
      .slice(i * 25, i * 25 + 25)
      .map(item => item.code)
      .join(',');

    api('execute', {
      code: `return { ${code} };`,
      access_token: token,
    })
      .then(({ response, execute_errors: errors = [] }) => {
        // eslint-disable-next-line no-param-reassign
        errors = errors.filter(item => item.method !== 'execute');

        Object.entries(response).forEach(([index, response]) => {
          const { resolve, reject } = methods[index];

          if (!response) {
            reject(errors.shift());
          } else {
            resolve(response[0]);
          }
        });
      })
      .catch(console.error);
  }
};
