'use strict'
// Should use require('lamb-wrap') instead
const Application = require('app.js')
const Action = require('../index').Action
const postModel = require('../models/post')

var body = (action, identity, model) => {
  return model.save()
}

module.exports = {
  body: body,
  handler: Application.handler(Action.create({body: body, operation: Action.CREATE, model: postModel}))
}
