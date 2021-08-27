# iot-platform-mqtt

## `agent/connected`

```js
{
  agent: {
    uuid, //auto generar
    username, // definir por configuración
    name, // definir por configuración
    hostname, //obtener del sistema operativo
    pid, //obtener del proceso
  }
}
```

## `agent/disconnected`

```js
{
  agent: {
    uuid,
  }
}
```

## `agent/message`

```js
{
  agent,
  metrics: [
    {
      type,
      value
    }
  ],
  timestamp, // generar cuando creamos el mensaje
}
```

## `Example agent/message`

```bash
npx mqtt pub -t 'agent/message' -m '{"agent": {"uuid": "yyy", "name": "platzi", "username": "platzi", "pid": 10, "hostname": "platzibogota"}, "metrics": [{"type": "memory", "value": "1001"}, {"type": "temp", "value": "33"}]}'
```