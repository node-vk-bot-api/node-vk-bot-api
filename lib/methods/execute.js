module.exports = function (method, settings, token = this.token, callback = () => {}) {
  const access_token = token
  const code = `API.${method}(${JSON.stringify(settings)})`

  this.methods = [
    ...this.methods.filter(item => item.access_token !== access_token),
    {
      access_token,
      items: [
        ...this.methods.filter(item => item.access_token === access_token),
        { code, callback }
      ]
    }
  ]

  return this
}
