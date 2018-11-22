const Request = require('../request')
const Context = require('../context')

module.exports = function (...args) {
  const request = new Request(...args)

  if (request.body.type !== 'confirmation') {
    request.body = 'ok'

    return this.next(new Context(request.body, this))
  }

  request.body = this.settings.confirmation
}
