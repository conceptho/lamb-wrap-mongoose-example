'use strict'

const idendity = Object.assign({}, require('./User'), {
  id: 'aHashedAccountId',
  name: 'Luciano Pellacani França',
  email: 'lucianopf@outlook.com',
  apiKey: 'aHashedSecretKey',
  created_at: '2016-07-07',
  password: 'aHashedPassword',
  logins: []
})

module.exports = idendity
