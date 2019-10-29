module.exports = function (method, settings, callback) {
  const request = {
    code: `API.${method}(${JSON.stringify({
      v: '5.103',
      ...settings,
    })})`,
    callback,
  };

  const promise = new Promise((resolve, reject) => {
    request.resolve = resolve;
    request.reject = reject;
  });

  this.methods.push(request);

  return promise;
};
