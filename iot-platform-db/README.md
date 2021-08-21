# iot platform db

## Usage

```js
const setupDatabase = require('iot-platform-db');
setupDatabase(config)
  .then((db) => {
    const { Agent, Metric } = db;
  })
  .catch((err) => console.log(err));
```
