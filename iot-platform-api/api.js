'use strict'

const debug = require('debug')('iot-platform:api:routes')
const express = require('express')
const db = require('iot-platform-db')
const config = require('./config')

const api = express.Router()

let services, Agent, Metric

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('connected database')
    try {
      services = await db(config)
    } catch (error) {
      next(error)
    }
    Agent = services.Agent
    Metric = services.Metric
  }
  next()
})

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
