'use strict'

const Action = require('../../src/action')
const Application = require('../../src/application')
const UserModel = require('../mocks/user.model')

let application = Application.create({
  identityModel: UserModel,
  jwtSecret: 'aHashedSecret'
})

describe('Application Class', () => {
  describe('.run', () => {
    it('Should work when runing with a valid action', (done) => {
      return application.run(Action.create({
        event: {
          body: {},
          headers: {
            apiKey: 'aHashedApiKey'
          },
          pathParams: {},
          queryParams: {
            id: 'aHashedAccountId'
          }
        },
        context: {
          success: () => null,
          fail: (err) => console.log(err)
        },
        model: UserModel,
        operation: Action.CREATE,
        body: (action, identity, model) => model
      }))
        .then((data) => {
          return done()
        })
    })
  })
  describe('.handler', () => {
    it('Should not work if there are problems at action creation', (done) => {
      (() => application.handler(Action.create())).should.throw(Error)
      return done()
    })
    it('Should not work if there is no action as input', (done) => {
      (() => application.handler()).should.throw(Error)
      return done()
    })
    it('Should be valid for a valid action', (done) => {
      const handler = application.handler(Action.create({model: UserModel, operation: Action.DELETE, body: () => null}))
      ;(typeof handler).should.be.eql('function')
      return done()
    })
  })
})
