userSchema.statics.attributeRules = function () {
  return {
    account_id: 'protected',
    name: 'public', // qualquer um pode ver e editar
    email: function (user, model) { return 'public' },
    secretKey: function (user, model) { return 'protected' }
    created_at: 'protected', // só pode ver
    password: 'private' // não pode ver nem alterar
  }
}

userSchema.statics.expandables = function () {
  return {
    account: true,
    logins: false
  }
}

userSchema.statics.accessRules = function (user, model) {
  return {
    view: function (user, model) {
      return !!user.account_ids.indexOf(model.account_id)
    },
    update: function (user, model) { return false },
    delete: false,
    create: true
  }
}

userSchema.statics.findAllowed = function (user, model) {
  return !!user.account_ids.indexOf(model.account_id)
}

var User = mongoose.model('User', userSchema)
User.findByName('fido', function (err, users) {
  console.log(users)
})

var User = function () {
  return this
}


