'use strict'
const Application = require('lamb-wrap').Application
const userModel = require('./models/user.js')

let application = Application.create({
  identityModel: userModel,
  jwtSecret: 'aHashedSecret'
})

module.exports = application
