'use strict'

const debug = require('debug')('iot-platform:api:routes')
const express = require('express')

const api = express.Router()

api.get('/agents', (req, res) => {
  debug('A request has come to /agents')
  res.send({})
})

api.get('/agent/:uid', (req, res, next) => {
  const { uid } = req.params

  if (uid !== 'yyy') {
    return next(new Error('Agent no found'))
  }

  res.send({ uid })
})

api.get('/metrics/:uid', (req, res) => {
  const { uid } = req.params
  res.send({ uid })
})

api.get('/metrics/:uid/:type', (req, res) => {
  const { uid, type } = req.params
  res.send({ uid, type })
})
module.exports = api
