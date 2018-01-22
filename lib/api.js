const axios = require('axios')
const { stringify } = require('querystring')

module.exports = async function (method, options = {}) {
  if (!options.v) {
    options.v = this.v || 5.69
  }

  if (!options.access_token) {
    options.access_token = this.token
  }

  return axios.post(`https://api.vk.com/method/${method}`, stringify(options))
}
