module.exports = (body, callbacks) => {
  const { response, error, execute_errors } = body

  if (error) {
    throw new Error(JSON.stringify(error))
  } else if (execute_errors) {
    throw new Error(JSON.stringify(execute_errors))
  }

  if (response) {
    response.forEach((data, i) => {
      const callback = callbacks[i]

      if (typeof callback === 'function') {
        callback({ data })
      }
    })
  }
}
