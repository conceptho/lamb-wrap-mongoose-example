'use strict'

const Response = function (data, action) {
  this.data = data
  this.action = action
  this.send = () => action.context.succeed(data)
}

module.exports = Response
