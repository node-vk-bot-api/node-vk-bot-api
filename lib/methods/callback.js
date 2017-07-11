module.exports = (methods, body) => {
  if (!body.response) {
    return console.error(body.error.error_msg)
  }

  body.response.forEach((body, i) => {
    const callback = methods.api[Object.keys(methods.api)[i]]

    if (typeof callback === 'function') {
      callback(body)
    }
  })
}
