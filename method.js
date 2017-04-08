const request = require('request');

module.exports = (method, options) => {
  if (!options.v) {
    options.v = 5.63;
  }

  return new Promise((resolve, reject) => {
    request({
      url: `https://api.vk.com/method/${method}`,
      method: 'POST',
      form: options,
      json: true
    }, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};
