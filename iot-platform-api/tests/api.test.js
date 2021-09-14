'use strict'

const test = require('ava')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agentFixtures = require('./fixtures/agent')
const metricFixtures = require('./fixtures/metric')

let sandbox = null
let server = null
let dbStub = null
let AgentStub = {}
let MetricStub = {}
const uid = agentFixtures.single.uuid;
const type = 'Pink';

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  dbStub = sandbox.stub()
  dbStub.returns(Promise.resolve({
    Agent: AgentStub,
    Metric: MetricStub
  }))

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected))

  AgentStub.findByUuid = sandbox.stub()
  AgentStub.findByUuid.withArgs(uid).returns(Promise.resolve(agentFixtures.single))
  
  MetricStub.findByAgentUuid = sandbox.stub()
  MetricStub.findByAgentUuid.withArgs(uid).returns(Promise.resolve(metricFixtures.findByAgentUuid(uid)))

  MetricStub.findByTypeAgentUuid = sandbox.stub()
  MetricStub.findByTypeAgentUuid.withArgs(type, uid).returns(Promise.resolve(metricFixtures.findByTypeAgentUuid(type, uid)))

  const api = proxyquire('../api', {
    'iot-platform-db': dbStub
  })

  server = proxyquire('../server', {
    './api': api
  })
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents')
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(agentFixtures.connected)
      t.deepEqual(body, expected, 'response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/agent/:uid', t => {
  request(server)
    .get(`/api/agent/${uid}`)
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(agentFixtures.findByUuid(uid))
      t.deepEqual(body, expected, 'response param should be the expected')
      t.end()
    })
})

test.serial.cb('/api/agent/:uid [not found]', t => {
  request(server)
    .get(`/api/agent/uid-not-found`)
    .expect(404)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify({error: 'Agent not found with uuid uid-not-found'})
      t.deepEqual(body, expected, 'response param should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uid', t => {
  request(server)
    .get(`/api/metrics/${uid}`)
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(metricFixtures.findByAgentUuid(uid))
      t.deepEqual(body, expected, 'response param should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uid [not found]', t => {
  request(server)
    .get(`/api/metrics/uid-not-found`)
    .expect(404)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify({error: 'Metrics not found for agent with uuid uid-not-found'})
      t.deepEqual(body, expected, 'response param should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uid/:type', t => {
  request(server)
    .get(`/api/metrics/${uid}/${type}`)
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(metricFixtures.findByTypeAgentUuid(type, uid))
      t.deepEqual(body, expected, 'response param should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uid/:type [not found]', t => {
  request(server)
    .get('/api/metrics/uid-not-found/not-metric-exist')
    .expect(404)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify({error: 'Metrics (not-metric-exist) not found for agent with uuid uid-not-found'})
      t.deepEqual(body, expected, 'response param should be the expected')
      t.end()
    })
})
