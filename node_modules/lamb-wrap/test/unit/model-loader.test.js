'use strict'

const ModelLoader = require('../../src/model-loader')
const sampleAction = require('../mocks/action.sample')()
const sampleIdentity = require('../mocks/identity.sample')
const Action = require('../../src/action')

describe('Model-Loader Class', () => {
  describe('.load', () => {
    it('Should work when runing with a valid CREATE operation and identity', (done) => {
      ModelLoader.load(sampleAction, sampleIdentity)
        .then((model) => {
          model.should.have.property('id')
          model.should.have.property('email')
          model.should.have.property('password')
          model.identityCode.should.be.eql('normal')
          return done()
        })
    })
    it('Should work when runing with a valid LIST operation and identity', (done) => {
      ModelLoader.load(Object.assign({}, sampleAction, {operation: Action.LIST}), sampleIdentity)
        .then((model) => {
          model.should.have.property('id')
          model.should.have.property('email')
          model.should.have.property('password')
          model.identityCode.should.be.eql('listing')
          return done()
        })
    })
    it('Should not work when runing a invalid identity', (done) => {
      ModelLoader.load(Object.assign({}, sampleAction, {operation: Action.LIST}), Object.assign({}, sampleIdentity, {id: 'aDiferentHashedId'}))
        .catch((err) => {
          err.message.should.be.eql('No model allowed')
          return done()
        })
    })
  })
})
