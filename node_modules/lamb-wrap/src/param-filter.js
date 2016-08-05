'use strict'

const Promise = require('bluebird')

const paramsFilter = {}

const resolveAttribute = (action, attribute, identity, model) => {
  if (!attribute) {
    return 'private'
  }
  if (typeof attribute.then === 'function') {
    return attribute
      .then((res) => {
        if (!res) {
          action.context.fail(res)
        }
        return res
      })
      .catch((err) => action.context.fail(err))
  }
  if (typeof attribute === 'function') {
    return resolveAttribute(action, attribute(identity, model), identity, model)
  }
  return attribute
}

const filterAction = (action, rules, eventKeys, options) => {
  eventKeys.forEach((eventKey) => {
    Object.keys(action.event[eventKey]).forEach((subEventKey) => {
      if (!rules[subEventKey] || options.indexOf(rules[subEventKey]) === -1) {
        delete action.event[eventKey][subEventKey]
      }
    })
  })
  return action
}

paramsFilter.filterInput = (identity, model, action) => {
  const attributeRules = action.model.attributeRules()
  const eventKeys = ['body', 'headers', 'pathParams', 'queryParams']
  let possibleAttributes = eventKeys.reduce((result, current) => {
    Object.keys(action.event[current]).forEach((subEventKey) => {
      result[subEventKey] = resolveAttribute(action, attributeRules[subEventKey], identity, model)
    })
    return result
  }, {})
  return Promise.props(possibleAttributes)
    .then((data) => {
      return filterAction(action, data, eventKeys, ['public'])
    })
    .catch((err) => action.context.fail(err))
}

paramsFilter.filterOutput = (identity, model, action) => {
  const attributeRules = action.model.attributeRules()
  let possibleAttributes = Object.keys(action.response.data).reduce((final, current) => {
    final[current] = resolveAttribute(action, attributeRules[current], identity)
    return final
  }, {})
  return Promise.props(possibleAttributes)
    .then((data) => {
      Object.keys(action.response.data).forEach((key) => {
        if (!data[key] || ['public', 'protected'].indexOf(data[key]) === -1) {
          delete action.response.data[key]
        }
      })
      return action
    })
    .catch((err) => action.context.fail(err))
}

module.exports = paramsFilter
