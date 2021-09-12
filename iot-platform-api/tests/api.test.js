'use strict'

const test = require('ava')
const request = require('supertest')
const server = require('../server')

test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents')
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = res.body
      t.deepEqual(body, {}, 'response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/agent/:uid', t => {
  request(server)
    .get('/api/agent/yyy')
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const { uid } = res.body
      t.deepEqual(uid, 'yyy', 'response param should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uid', t => {
  request(server)
    .get('/api/metrics/yyy')
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const { uid } = res.body
      t.deepEqual(uid, 'yyy', 'response param should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uid/:type', t => {
  request(server)
    .get('/api/metrics/yyy/memory')
    .expect(200)
    .expect('Content-type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const { uid, type } = res.body
      t.deepEqual(uid, 'yyy', 'response param should be the expected')
      t.deepEqual(type, 'memory', 'response param should be the expected')
      t.end()
    })
})
