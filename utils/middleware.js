const jwt = require('jsonwebtoken')

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    request.token = authorization.substring(7)
  }
  else request.token = null

  next()
}

module.exports = {
  error,
  tokenExtractor
}
