const request = require('request');

module.exports = (method, options = {}) => {
  if (!options.v) {
    options.v = 5.68;
  }

  return new Promise((resolve, reject) => {
    request({
      url: `https://api.vk.com/method/${method}`,
      method: 'post',
      formData: options,
      json: true
    }, (err, res, body) => {
      if (!err && res.statusCode === 200 && body.response) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};
