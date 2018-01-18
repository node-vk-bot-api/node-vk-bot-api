module.exports = (ctx) => {
  return new Promise((resolve) => {
    if (!ctx.attachments || !ctx.attachments.fwd) {
      resolve(null)
    }

    this.execute('messages.getById', {
      message_ids: ctx.message_id,
      v: this.v
    }, this.token, (data) => {
      resolve(this.getLastMessage(data.items[0]))
    })
  })
}
