'use strict'

const debug = require('debug')('iot-platform:db')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'iot_platform',
    username: process.env.DB_USER || 'iot_platform',
    password: process.env.DB_PASSWORD || 'iot_platform',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s)
  }
}
