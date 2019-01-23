const api = require('../api');

module.exports = function (methods) {
  for (let i = 0, j = Math.ceil(methods.length / 25); i < j; i++) {
    const slicedMethods = methods.slice(i * 25, i * 25 + 25).map((item, index) => ({
      callback: item.callback,
      code: `"${i * 25 + index + 1}": ${item.code}`,
    }));

    api('execute', {
      code: `return { ${slicedMethods.map(item => item.code).join(',')} };`,
      access_token: this.settings.token,
    })
      .then(({ response, execute_errors = [] }) => {
        const executeErrors = execute_errors.filter(item => item.method !== 'execute');
        const failedRequests = Object.entries(response).reduce((array, [index, response]) => {
          const { resolve, callback } = methods[index - 1];

          if (!response) {
            array.push(index - 1);
          }

          if (response && callback) {
            callback(response[0]);
          }

          if (response && resolve && !callback) {
            resolve(response[0]);
          }

          return array;
        }, []);

        if (failedRequests.length) {
          failedRequests.forEach((requestIndex, errorIndex) => {
            const { reject, callback } = methods[requestIndex];
            const error = executeErrors[errorIndex];

            if (callback) {
              callback(error);
            } else {
              reject(error);
            }
          });
        }
      })
      .catch(err => console.error(err));
  }
};
