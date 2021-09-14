'use strict'

const metrics = require('./metricsData')

const agentFixtures = require('./agent')

const newMetric = {
  type: 'IS',
  value: 'Lexus'
}

const createdMetric = {
  id: 101,
  type: 'IS',
  value: 'Lexus',
  createdAt: '4/30/2021',
  updatedAt: '7/20/2021',
  agentId: 4
}

function onlyUnique (value, index, self) {
  return self.indexOf(value) === index
}

function findByAgentUuid (uuid) {
  const agent = agentFixtures.findByUuid(uuid)

  if (!agent) {
    return []
  }

  const metricsFiltered = metrics.filter(m => m.agentId === agent.id)
  const types = metricsFiltered.map(m => m.type)

  return types.filter(onlyUnique)
}

function findByTypeAgentUuid (type, uuid) {
  const agent = agentFixtures.findByUuid(uuid)

  if (!agent) {
    return []
  }

  let metricsFilters = metrics.filter(m => m.agentId === agent.id && m.type === type)

  if (metricsFilters.length > 20) {
    metricsFilters = metricsFilters.splice(0, 20)
  }

  return metricsFilters.map(m => {
    return {
      id: m.id,
      type: m.type,
      value: m.value,
      createdAt: m.createdAt
    }
  })
}

module.exports = {
  newMetric,
  createdMetric,
  findByAgentUuid,
  findByTypeAgentUuid
}
