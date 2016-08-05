'use strict'

const sampleEvent = require('./event')
let dockerLambda = require('docker-lambda')
let lambdaCallbackResult = dockerLambda({event: sampleEvent, taskDir: __dirname, dockerArgs: ['-m', '512M']})
console.log(lambdaCallbackResult)