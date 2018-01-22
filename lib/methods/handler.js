module.exports = async function (update) {
  const [ type ] = update
  if (type !== 4) return

  const [ , message_id, flags, peer_id, date, body, attachments ] = update
  if ((flags & 2) !== 0) return

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

  const forward = await this.getForward(ctx)
  if (forward) {
    ctx.forward = forward
    ctx.original = { body: ctx.body }
    ctx.body = forward.body
  }

  ctx.attachments = Object.entries(ctx.attachments)
    .filter(([key]) => key.search('attach') > -1 && key.search('type') === -1 && key.search('kind'))
    .reduce((acc, [key, value]) => [...acc, { 'type': ctx.attachments[`${key}_type`], [ctx.attachments[`${key}_type`]]: value } ], [])

  ctx.reply = (message, attachment) => this.reply(ctx.peer_id, message, attachment)
  ctx.sendMessage = (userId, message, attachment) => this.reply(userId, message, attachment)

  const { middlewares, commands, hears, on: reserved } = this.actions

  if (middlewares.length) {
    try {
      await Promise.all(middlewares.map(callback => callback(ctx)))
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
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
}
