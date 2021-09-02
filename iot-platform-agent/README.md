# IoT Platform Agent

## Usage

```js
const IotPlatformAgent = require('iot-platform-agent')
const agent = new IotPlatformAgent({
  interval: 20000
})

agent.on('agent/message', payload => {
  console.log(payload)
})

setTimeout(()=> agent.disconnect(), 20000)

```