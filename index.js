'use strict'
// Should use require('lamb-wrap') instead
const Application = require('./app.js')
const Action = require('lamb-wrap').Action
const userModel = require('./models/User')
const passwordHash = require('password-hash')
const Promise = require('bluebird')


var body = (action, identity, model) => {
  model.name = action.event.body.name
  // model.email = action.event.body.email
  model.password = passwordHash.generate(action.event.body.plainPassword)
  return model.save()
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

module.exports = {
  body: body,
  handler: Application.handler(Action.create({body: body, operation: Action.CREATE, model: userModel}))
}

