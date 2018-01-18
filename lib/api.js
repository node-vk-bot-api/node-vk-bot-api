const axios = require('axios');
const { stringify } = require('querystring');

module.exports = (method, options = {}) => {
  if (!options.v) {
    options.v = this.v;
  }

  return axios.post(`https://api.vk.com/method/${method}`, stringify(options));
};
