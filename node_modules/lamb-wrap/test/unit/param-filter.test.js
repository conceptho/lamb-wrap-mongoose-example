'use strict'

const sampleIdentity = require('../mocks/identity.sample')
const ParamFilter = require('../../src/param-filter')

describe('Param-filter Class', () => {
  describe('.filterInput', () => {
    it('Should work when runing with a valid action with a valid indentity', (done) => {
      let sampleAction = require('../mocks/action.sample')()
      return ParamFilter.filterInput(sampleIdentity, sampleIdentity, sampleAction)
        .then((data) => {
          data.event.body.should.have.property('name')
          data.event.headers.should.have.property('apiKey')
          data.event.queryParams.should.not.have.property('id')
          return done()
        })
    })
    it('Should work when runing without params', (done) => {
      let sampleAction = Object.assign({}, require('../mocks/action.sample')(),
        {
          event: {
            body: {},
            headers: { apiKey: 'aHashedSecretKey' },
            pathParams: {},
            queryParams: {},
            method: 'PUT',
            resourcePath: '/User',
            source: 'aws.apiGateway'
          }
        })
      return ParamFilter.filterInput(sampleIdentity, sampleIdentity, sampleAction)
        .then((data) => {
          return done()
        })
    })
  })
  describe('.filterOutput', () => {
    it('Should work when runing with valid identity, model and action', (done) => {
      let sampleAction = require('../mocks/action.sample')()
      sampleAction.response = {
        data: sampleIdentity
      }
      return ParamFilter.filterOutput(sampleIdentity, sampleIdentity, sampleAction)
        .then((data) => {
          data.response.data.should.have.property('name')
          data.response.data.should.have.property('email')
          data.response.data.should.have.property('apiKey')
          data.response.data.should.have.property('created_at')
          data.response.data.should.have.property('logins')
          data.response.data.should.not.have.property('password')
          data.response.data.should.not.have.property('id')
          return done()
        })
    })
  })
})
