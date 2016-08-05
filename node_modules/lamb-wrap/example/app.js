'use strict'
const Application = require('../index').Application
const userModel = require('../models/user')

let application = Application.create({
  identityModel: userModel,
  jwtSecret: 'aHashedSecret'
})

module.exports = application
