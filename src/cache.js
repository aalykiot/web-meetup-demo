const redis = require('redis');
const config = require('./config');

const client = redis.createClient({
  socket: {
    host: config.cache.host,
    port: config.cache.port
  },
  password: config.cache.password
});

const init = async () => await client.connect();

module.exports = {
  init,
  client
};
