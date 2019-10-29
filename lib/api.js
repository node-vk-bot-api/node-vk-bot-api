const axios = require('axios');
const { stringify } = require('querystring');
const ApiError = require('./errors/ApiError');

module.exports = async function (method, settings = {}) {
  const { data } = await axios.post(`https://api.vk.com/method/${method}`, stringify({
    v: 5.103,
    ...settings,
  }));

  if (data.error) {
    throw new ApiError(data.error);
  }

  return data;
};
