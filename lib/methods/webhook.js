const { Router } = require('express')
const bodyParser = require('body-parser')

module.exports = function ({ key, groupId }) {
  this.key = key
  this.groupId = groupId
  let router = new Router
  router.use(bodyParser.json())

  router.post('/', (req, res) => {
    res.setHeader('Last-Modified', (new Date()).toUTCString())
    const { body } = req
    const { type, object } = body

    if (type === 'confirmation') {
      if (this.groupId == body.group_id) {
        return res.send(key)
      }
      return res.status(500).send('No match group id.')
    }
    else if (type === 'message_new') {
      if (object.attachments == null) {
        object.attachments = []
      }
      this.message(object)
      res.status(200).send('ok')
    }
    else {
      res.status(200).send('ok')
    }
  })

  return router
}    