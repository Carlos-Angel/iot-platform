'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixtures = require('./fixtures/agent')
const metricsFixtures = require('./fixtures/metric')

const config = {
  logging: function () {}
}
let db = null
let sandbox = null
let AgentStub = null
const MetricStub = {
  belongsTo: sinon.spy()
}

const type = 'Teal'
const uuid = 'yyy-yyy-yyy'
const uuidArgs = {
  where: {
    uuid
  }
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }

  // MetricModel create
  MetricStub.create = sandbox.stub()
  MetricStub.create.withArgs(metricsFixtures.newMetric).returns(Promise.resolve({ toJSON () { return metricsFixtures.createdMetric } }))

  // MetricModel findAll
  MetricStub.findAll = sandbox.stub()
  MetricStub.findAll.withArgs({
    attributes: ['type'],
    group: ['type'],
    include: [{
      attributes: [],
      model: AgentStub,
      where: {
        uuid
      }
    }],
    raw: true
  }).returns(Promise.resolve(metricsFixtures.findByAgentUuid(uuid)))

  MetricStub.findAll.withArgs({
    attributes: ['id', 'type', 'value', 'createdAt'],
    where: {
      type
    },
    limit: 20,
    order: [['createdAt', 'DESC']],
    include: [
      {
        attributes: [],
        model: AgentStub,
        where: {
          uuid
        }
      }
    ],
    raw: true
  }).returns(Promise.resolve(metricsFixtures.findByTypeAgentUuid(type, uuid)))

  // AgentModel findOne Stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.findByUuid(uuid)))

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

test('Metric', t => {
  t.truthy(db.Metric, 'Metric service should exist')
})

test.serial('Setup', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')

  t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should to be the AgentModel')
})

test.serial('Metric#create', async t => {
  const metric = await db.Metric.create(uuid, metricsFixtures.newMetric)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
  t.true(AgentStub.findOne.calledWith({
    where: { uuid: uuid }
  }), 'findOne should be called with uuid args')

  t.true(MetricStub.create.called, 'create should be called on model')
  t.true(MetricStub.create.calledOnce, 'create should be called once')
  t.true(MetricStub.create.calledWith(metricsFixtures.newMetric), 'create should be called with specified args')

  t.deepEqual(metric, metricsFixtures.createdMetric, 'metric should be the same')
})

test.serial('Metric#findByAgentUuid', async t => {
  const metrics = await db.Metric.findByAgentUuid(uuid)

  t.true(MetricStub.findAll.called, 'findAll should be called on model')
  t.true(MetricStub.findAll.calledOnce, 'findAll should be called once')
  t.true(MetricStub.findAll.calledWith({
    attributes: ['type'],
    group: ['type'],
    include: [{
      attributes: [],
      model: AgentStub,
      where: {
        uuid
      }
    }],
    raw: true
  }), 'findAll should be called with uuid args')

  t.deepEqual(metrics, metricsFixtures.findByAgentUuid(uuid), 'metrics should be the same')
})

test.serial('Metric#findByTypeAgentUuid', async t => {
  const metrics = await db.Metric.findByTypeAgentUuid(type, uuid)

  t.true(MetricStub.findAll.called, 'findAll should be called on model')
  t.true(MetricStub.findAll.calledOnce, 'findAll should be called once')
  t.true(MetricStub.findAll.calledWith({
    attributes: ['id', 'type', 'value', 'createdAt'],
    where: {
      type
    },
    limit: 20,
    order: [['createdAt', 'DESC']],
    include: [
      {
        attributes: [],
        model: AgentStub,
        where: {
          uuid
        }
      }
    ],
    raw: true
  }), 'findAll should be called with type and uuid args')

  t.deepEqual(metrics, metricsFixtures.findByTypeAgentUuid(type, uuid), 'metrics should be the same')
})
