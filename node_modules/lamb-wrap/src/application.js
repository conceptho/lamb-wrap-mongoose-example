'use strict'

const Authenticator = require('./authenticator')
const AccessRules = require('./access-rules')
const ModelLoader = require('./model-loader')
const Promise = require('bluebird')

const Application = function (config) {
  this.identity = {}
  this.identity.model = config.identityModel
  if (config.jwtSecret) {
    this.identity.jwtSecret = config.jwtSecret
  }
  this.handler = (action) => {
    if (!action) {
      throw new Error('Invalid action as input')
    }
    return (event, context) => {
      action.event = event
      action.context = context
      return this.run(action)
    }
  }
  this.run = (action) => {
    return Authenticator.getIdentity(action, this.identity)
      .then((identity) => {
        return Promise.props({
          model: ModelLoader.load(action, identity),
          identity: identity
        })
      })
      .then((data) => {
        return Promise.props({
          accessRules: AccessRules.checkAccess(data.identity, data.model, action),
          identity: data.identity,
          model: data.model
        })
      })
      .then((data) => {
        return Promise.props({
          accessRules: data.accessRules,
          identity: data.identity,
          model: data.model,
          action: action.filterInput(data.identity, data.model)
        })
      })
      .then((data) => {
        return Promise.props({
          accessRules: data.accessRules,
          identity: data.identity,
          model: data.model,
          action: data.action.execute(data.identity, data.model)
        })
      })
      .then((data) => {
        return Promise.props({
          accessRules: data.accessRules,
          identity: data.identity,
          model: data.model,
          action: data.action.filterOutput(data.identity, data.model)
        })
      })
      .then((data) => {
        return data.action.response.send()
      })
      .catch((err) => {
        action.context.fail(err)
      })
  }
}

module.exports = {
  create: (config) => new Application(config)
}
