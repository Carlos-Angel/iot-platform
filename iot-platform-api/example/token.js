const auth = require('jsonwebtoken');

const payload = {
  username: 'admin',
  admin: true,
  permissions: [
  ]
};

function callback(err, token){
  console.log(`Bearer ${token}`);
}

auth.sign(payload, 'secret-iot-platform-api', callback);