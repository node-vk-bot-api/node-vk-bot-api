const api = require('./api')

module.exports = (gid, uid) => {
  return new Promise((resolve, reject) => {
    api('groups.isMember', {
      group_id: gid,
      user_id: uid,
      v: 5.62
    }).then(body => {
      if (body.response) {
        resolve(true)
      } else {
        resolve(false)
      }
    }).catch(reject)
  })
}
