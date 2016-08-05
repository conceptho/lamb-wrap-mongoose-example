'use strict'

const Authenticator = require('../../src/authenticator')
const sampleAction = require('../mocks/action.sample')()
const UserModel = require('../mocks/user.model')

const configIdentity = {
  model: UserModel,
  jwtSecret: 'aHashedSecret'
}

describe('Authenticator Class', () => {
  describe('.getIdentity', () => {
    it('Should work when runing with a valid action using apiKey', (done) => {
      Authenticator.getIdentity(sampleAction, configIdentity)
        .then((identity) => {
          identity.should.have.property('id')
          identity.should.have.property('name')
          identity.should.have.property('email')
          identity.should.have.property('getIdentityByJwtToken')
          identity.should.have.property('getIdentityByApiToken')
          return done()
        })
        .catch((err) => {
          console.log(err)
        })
    })
    it('Should work when runing with a valid JwtToken', (done) => {
      let customEvent = {
        event: {
          body: { name: 'Luciano Franças' },
          headers: { jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RUb2tlbiI6InNvbWVIYXNoZWRUb2tlbiJ9.2Ui-OuRnnLCS585qUW7zKgRD1CzfK8ZCq5R3uf6iSPo' },
          pathParams: {},
          queryParams: { id: 'aHashedAccountId' },
          method: 'PUT',
          resourcePath: '/User',
          source: 'aws.apiGateway'
        }
      }
      Authenticator.getIdentity(Object.assign({}, sampleAction, customEvent), configIdentity)
        .then((identity) => {
          identity.jwtToken.should.be.eql('someHashedToken')
          return done()
        })
    })
    it('Should not work when runing with a invalid JwtToken', (done) => {
      let customEvent = {
        event: {
          body: { name: 'Luciano Franças' },
          headers: { jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RUb2tlbiI6InNvbWVIYXNoZWRUb2tlbiJ9.2Ui-JuRnnLCS585qUW7zKgRD1CzfK8ZCq5R3uf6iSPo' },
          pathParams: {},
          queryParams: { id: 'aHashedAccountId' },
          method: 'PUT',
          resourcePath: '/User',
          source: 'aws.apiGateway'
        }
      }
      Authenticator.getIdentity(Object.assign({}, sampleAction, customEvent), configIdentity)
        .catch((err) => {
          return done()
        })
    })
    it('Should call context.fail when there\'s no auth method in event', (done) => {
      let customEvent = {
        event: {
          body: { name: 'Luciano França' },
          headers: {},
          pathParams: {},
          queryParams: { id: 'aHashedAccountId' },
          method: 'PUT',
          resourcePath: '/User',
          source: 'aws.apiGateway'
        }
      }
      Authenticator.getIdentity(Object.assign({}, sampleAction, customEvent), configIdentity)
        .catch((err) => {
          err.should.be.eql('No credentials found')
          return done()
        })
    })
  })
})
