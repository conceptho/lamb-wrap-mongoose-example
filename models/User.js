'use strict'

const Promise = require('bluebird')
const mongoose = Promise.promisifyAll(require('mongoose'))
const Schema = mongoose.Schema

const connetcionUrl = 'mongodb://example:example@ds145385.mlab.com:45385/example-lamb-wraper'
mongoose.connect(connetcionUrl)
  .then((res) => {
    console.log(res)
  })

var userSchema = new Schema({
  name: String,
  email: String,
  apiKey: String,
  jwtToken: String,
  password: String,
  logins: [String]
}, { timestamps: true })

userSchema.statics.attributeRules = function () {
  return {
    _id: 'protected',
    name: 'public',
    email: (identity, model) => 'public',
    apiKey: (identity, model) => 'protected',
    createdAt: 'protected',
    updatedAt: 'protected',
    password: 'private',
    plainPassword: 'public',
    logins: 'private'
  }
}

userSchema.statics.accessRules = function (identity, model) {
  return {
    VIEW: (identity, model) => true,
    UPDATE: (identity, model) => true,
    DELETE: false,
    CREATE: true,
    LIST: true
  }
}

userSchema.statics.getIdentityByJwtToken = function (jwtToken) {
  return this.findOneAsync({jwtToken: jwtToken})
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

userSchema.statics.getIdentityByApiToken = function (apiToken) {
  return this.findOneAsync({apiKey: apiToken})
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

userSchema.statics.findAllowed = function (identity) {
  return this.findAsync({_id: identity._id})
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

let User = mongoose.model('User', userSchema)

module.exports = User
