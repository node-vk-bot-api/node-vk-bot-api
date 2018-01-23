module.exports = async function(ctx) {
  return new Promise((resolve) => {
    if (!ctx.attachments || !ctx.attachments.fwd) {
      resolve(null)
    }

    this.execute('messages.getById', {
      message_ids: ctx.message_id
    }, ({ data }) => {
      resolve(this.getLastMessage(data.items[0]))
    })
  })
}
