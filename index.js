'use strict'
// Should use require('lamb-wrap') instead
const Application = require('./app.js')
const Action = require('lamb-wrap').Action
const postModel = require('./models/user')

var body = (action, identity, model) => {
  return model.save()
}

module.exports = {
  body: body,
  handler: Application.handler(Action.create({body: body, operation: Action.CREATE, model: postModel}))
}
