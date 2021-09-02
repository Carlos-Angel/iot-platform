# IoT Platform Agent

## Usage

```js
const IotPlatformAgent = require('iot-platform-agent')
const agent = new IotPlatformAgent({
  interval: 20000
})

agent.connect()

// This agent only
agent.on('connected')
agent.on('disconnected')
agent.on('message')

agent.on('agent/connected')
agent.on('agent/disconnected')
agent.on('agent/message', payload => {
  console.log(payload)
})

setTimeout(()=> agent.disconnect(), 20000)

```