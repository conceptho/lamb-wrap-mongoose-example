'use strict'

const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))

const authenticator = {}

authenticator.getIdentity = (action, identity) => {
  if (action.event.headers.jwtToken) {
    return jwt.verifyAsync(action.event.headers.jwtToken, identity.jwtSecret)
      .then((payload) => {
        return identity.model.getIdentityByJwtToken(payload)
      })
      .catch((err) => {
        throw action.context.fail(err)
      })
  }
  if (action.event.headers.apiKey) {
    return identity.model.getIdentityByApiToken(action.event.headers.apiKey)
      .catch((err) => {
        throw action.context.fail(err)
      })
  }
  return Promise.reject(action.context.fail('No credentials found'))
}

module.exports = authenticator
