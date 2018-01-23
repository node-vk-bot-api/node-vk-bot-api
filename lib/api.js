const axios = require('axios')
const { stringify } = require('querystring')

module.exports = async function (method, options = {}) {
  if (!options.v) {
    options.v = this.v || 5.71
  }

  if (!options.access_token) {
    options.access_token = this.token
  }

  try {
    const { data } = await axios.post(`https://api.vk.com/method/${method}`, stringify(options))
    const { error } = data

    if (error) {
      throw data
    }

    return data
  } catch (error) {
    throw error
  }
}
