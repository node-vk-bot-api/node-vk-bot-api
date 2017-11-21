const { Router } = require('express')
const bodyParser = require('body-parser')

module.exports = function ({ key, groupId }) {
    this.key = key
    this.groupId = groupId
    let router = new Router
    router.use(bodyParser.json())
    router.post('/', (req, res) => {
        let { body } = req

        switch (body.type) {
            case "confirmation":
                if (this.groupId == body.group_id) {
                    return res.send(key)
                }
                return res.send('No match group id.')
                break;
            case 'message_new':
                body.object.message_id = body.object.id
                if(body.object.attachments==null) body.object.attachments = []
                this.message(body.object)
                break;
            default:
                res.send('ok')
                break;
        }
    })

    return router
}    