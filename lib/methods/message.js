
module.exports = function message (ctx){
    const { commands, hears, on: reservedCallback } = this.actions
    
    let getForward = GetForward.bind(this)
    return getForward(ctx).then(()=>{

        getForward(ctx)
        .then((forward) => {
          if (forward) {
            ctx.forward = forward
            ctx.body = forward.body
          }

          const attachmentsKeys = Object.keys(ctx.attachments).filter(key => key.search('attach') > -1 && key.search('type') === -1 && key.search('kind') === -1)
          const attachments = []

          attachmentsKeys.forEach((key) => {
            const file = {}

            file['type'] = ctx.attachments[`${key}_type`]
            file[file.type] = ctx.attachments[key]

            attachments.push(file)
          })

          ctx.attachments = attachments
          ctx.body = ctx.body.replace(/<br>/g, '\n')

          ctx.reply = (message, attachment) => this.reply(ctx.user_id, message, attachment)
          ctx.sendMessage = (userId, message, attachment) => this.reply(ctx.user_id, message, attachment)

          const message = ctx.body.toLowerCase()
          const commandKey = Object.keys(commands).filter(item => item.search(message) > -1)[0]
          const commandCallback = commands[commandKey]
          const hearsKey = Object.keys(hears).filter((item) => {
            const index = item.split(';')
              .filter((item) => {
                if (/\/[\S]{1,}\/[a-z]{1,2}/.test(item)) {
                  const string = item.substr(1).replace(/\/[a-z]{1,2}/i, '')
                  const type = item.substr(1).match(/\/[a-z]{1,2}/i)[0].substr(1)

                  return new RegExp(string, type).test(message)
                } else {
                  return new RegExp(item, 'i').test(message)
                }
              })
            return index.length
          })[0]
          const hearsCallback = hears[hearsKey]

          if (commandCallback !== undefined) {
            return commandCallback(ctx)
          } else if (hearsCallback !== undefined) {
            return hearsCallback(ctx)
          } else if (reservedCallback !== undefined) {
            return reservedCallback(ctx)
          }
        })
    })

}


function GetForward (ctx) {
    return new Promise((resolve) => {
      if (!ctx.attachments || !ctx.attachments.fwd) {
        resolve(null)
      }

      this.execute('messages.getById', {
        message_ids: ctx.message_id,
        v: 5.67
      }, this.token, (data) => {
        resolve(this.getLastMessage(data.items[0]))
      })
    })
  }