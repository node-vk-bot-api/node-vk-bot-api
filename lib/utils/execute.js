const api = require('../api');
const ApiError = require('../errors/ApiError');

const INVALID_RESPONSE = [undefined, null, false];

module.exports = (methods, token) => {
  const promises = [];
  const calls = [];

  methods.forEach((item, index) => {
    promises.push({
      resolve: item.resolve,
      reject: item.reject,
    });

    calls.push(`"${index + 1}": ${item.code}`);
  });

  for (let i = 0, j = Math.ceil(calls.length / 25); i < j; i++) {
    const code = calls
      .slice(i * 25, i * 25 + 25)
      .join(',');

    api('execute', {
      code: `return { ${code} };`,
      access_token: token,
    })
      .then(({ response, execute_errors: errors = [] }) => {
        const apiErrors = errors.filter(item => item.method !== 'execute');

        Object.entries(response).forEach(([index, response]) => {
          const { resolve, reject } = promises[index - 1];

          if (INVALID_RESPONSE.includes(response)) {
            reject(new ApiError(apiErrors.shift()));
          } else {
            resolve(response);
          }
        });
      })
      .catch(console.error);
  }
};
