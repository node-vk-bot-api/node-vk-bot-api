const api = require('../api')
const callbackHandler = require('./callbackHandler')

module.exports = (methods) => {
  Object.entries(methods)
    .map(([ token, methods ]) => ({ token, methods }))
    .forEach(({ token, methods }) => {
      const code = methods.map(item => item.code)
      const callbacks = methods.map(item => item.callback)

      for (let i = 0, j = Math.ceil(code.length / 25); i < j; i++) {
        api('execute', {
          code: `return [ ${code.slice(i * 25, i * 25 + 25).join(',')} ];`,
          access_token: token
        })
          .then(body => callbackHandler(body, callbacks))
          .catch(err => callbackHandler(err, callbacks))
      }
    })
}
