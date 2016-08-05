'use strict'

const mongoose = require('mongoose')
const Promise = require('bluebird')
const Schema = mongoose.Schema

const connetcionUrl = 'mongodb://example:example@ds145385.mlab.com:45385/example-lamb-wraper'

var userSchema = new Schema({
  name: String,
  email: String,
  apiKey: String,
  jwtToken: String,
  password: String,
  logins: [String]
}, { timestamps: true })

userSchema.statics.attributeRules = () => {
  return {
    _id: 'protected',
    name: 'public',
    email: (identity, model) => 'public',
    apiKey: (identity, model) => 'protected',
    created_at: 'protected',
    password: 'private',
    logins: 'protected'
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

userSchema.statics.getIdentityByJwtToken = (jwtToken) => {
  return this.findOneAsync({jwtToken: jwtToken})
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

userSchema.statics.getIdentityByApiToken = (apiToken) => {
  return this.findOneAsync({apiKey: apiToken})
  .then((res) => {
    return res
  })
  .catch((err) => {
    return err
  })
}

userSchema.statics.findAllowed = (identity) => {
  return this.findAsync({_id: identity._id})
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

let User = mongoose.model('User', userSchema)

mongoose.connect(connetcionUrl)

mongoose.disconnect()
