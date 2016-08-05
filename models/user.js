'use strict'

const Promise = require('bluebird')

const User = {}

const promiseSampleFalse = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(false)
    }, 50)
  })
}

const promiseSampleTrue = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, 50)
  })
}

let promiseSamplePublic = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('public')
    }, 50)
  })
}

User.attributeRules = function () {
  return {
    account_id: 'protected',
    name: 'public', // qualquer um pode ver e editar
    email: (identity, model) => 'public',
    apiKey: (identity, model) => promiseSamplePublic(),
    created_at: 'protected', // só pode ver
    password: 'private', // não pode ver nem alterar
    logins: 'protected'
  }
}

User.expandables = function () {
  return {
    logins: true
  }
}

User.accessRules = function (identity, model) {
  return {
    VIEW: (identity, model) => promiseSampleTrue(),
    UPDATE: (identity, model) => true,
    DELETE: false,
    CREATE: true,
    LIST: promiseSampleFalse
  }
}


User.getIdentityByJwtToken = (jwtToken) => {
  return Promise.resolve(Object.assign({}, require('./identity.sample'), jwtToken))
    .catch((err) => new Error(err))
}

User.getIdentityByApiToken = (apiToken) => {
  return Promise.resolve(require('./identity.sample'))
}

User.findAllowed = (identity) => {
  let sampleIdentity = Object.assign({}, require('./identity.sample'), {identityCode: 'listing'})
  if (identity.id === sampleIdentity.id) {
    return Promise.resolve(sampleIdentity)
  }
  return Promise.reject(new Error('No model allowed'))
}

User.findById = (id, cb) => {
  let sampleIdentity = Object.assign({}, require('./identity.sample'), {identityCode: 'normal'})
  let err = null
  cb(err, sampleIdentity)
}

module.exports = User
