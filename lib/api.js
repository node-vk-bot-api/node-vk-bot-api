const axios = require('axios');
const { stringify } = require('querystring');

module.exports = async function (method, settings = {}) {
  try {
    const { data } = await axios.post(`https://api.vk.com/method/${method}`, stringify({
      v: 5.80,
      ...settings,
    }));

    if (data.error) {
      throw JSON.stringify(data);
    }

    return data;
  } catch (err) {
    throw (typeof err === 'object' ? JSON.stringify(err) : err);
  }
};
