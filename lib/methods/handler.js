module.exports = function (update) {
  const [ type ] = update
  if (type === 4) {
    const [ , message_id, flags, peer_id, date, body, attachments ] = update

    if ((flags & 2) === 0){
      const ctx = {
        peer_id,
        message_id,
        body,
        attachments,
        date,
      }

      if (attachments.from) {
        ctx.from = +attachments.from
      }

      this.getForward(ctx)
        .then(async (forward) => {
          if (forward) {
            ctx.forward = forward
            ctx.original = { body: ctx.body }
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

          ctx.reply = (message, attachment) => this.reply(ctx.peer_id, message, attachment)
          ctx.sendMessage = (userId, message, attachment) => this.reply(userId, message, attachment)

          const { middlewares, commands, hears, on: reserved } = this.actions

          if (middlewares.length) {
            await Promise.all(middlewares.map(callback => callback(ctx)))
          }

          const [ command ] = commands.filter(({ command }) => command === body)
          const [ hear ] = hears.filter(({ command }) => command.test(body))

          if (command) {
            command.callback(ctx)
          } else if (hear) {
            hear.callback(ctx)
          } else if (reserved) {
            reserved(ctx)
          }
        })
        .catch((error) => {
          this.longPollParams = null
          console.error(`${new Date()} - ERROR! - ${error}`)
          return this.listen()
        })
    }
  }
}
