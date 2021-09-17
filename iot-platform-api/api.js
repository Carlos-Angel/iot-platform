'use strict'

const debug = require('debug')('iot-platform:api:routes')
const express = require('express')
const db = require('iot-platform-db')
const auth = require('express-jwt')
const config = require('./config')

const api = express.Router()

let services, Agent, Metric

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('connected database')
    try {
      services = await db(config.db)
    } catch (error) {
      next(error)
    }
    Agent = services.Agent
    Metric = services.Metric
  }
  next()
})

api.get('/agents',auth({ secret: config.auth.secret, algorithms: config.auth.algorithms }), async (req, res, next) => {
  debug('A request has come to /agents')
  let agents = []

  const {user} = req

  if(!user || !user.username){
    return next(new Error('Not authorized'))
  }

  try {
    if(user.admin){
      agents = await Agent.findConnected()
    }else {
      agents = await Agent.findByUsername(user.username)
    }
  } catch (err) {
    return next(err)
  }
  res.send(agents)
})

api.get('/agent/:uid', async (req, res, next) => {
  const { uid } = req.params
  debug(`request to /agent/${uid}`)
  let agent

  try {
    agent = await Agent.findByUuid(uid)
  } catch (err) {
    return next(err)
  }

  if (!agent) {
    return next(new Error(`Agent not found with uuid ${uid}`))
  }

  res.send(agent)
})

api.get('/metrics/:uid', async (req, res, next) => {
  const { uid } = req.params
  debug(`request to /metrics/${uid}`)
  let metrics = []

  try {
    metrics = await Metric.findByAgentUuid(uid)
  } catch (err) {
    return next(err)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uid}`))
  }
  res.send(metrics)
})

api.get('/metrics/:uid/:type', async (req, res, next) => {
  const { uid, type } = req.params
  debug(`request to /metrics/${uid}/${type}`)
  let metrics = []

  try {
    metrics = await Metric.findByTypeAgentUuid(type, uid)
  } catch (err) {
    return next(err)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics (${type}) not found for agent with uuid ${uid}`))
  }
  res.send(metrics)
})
module.exports = api
