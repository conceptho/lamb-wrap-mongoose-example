'use strict'
// Should use require('lamb-wrap') instead
const Application = require('./app.js')
const Action = require('lamb-wrap').Action
const userModel = require('./models/User')

var body = (action, identity, model) => {
  model.name = action.event.body.name
  return model.save()
}

module.exports = {
  body: body,
  handler: Application.handler(Action.create({body: body, operation: Action.CREATE, model: userModel}))
}

