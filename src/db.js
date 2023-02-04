const pg = require('pg');
const config = require('./config');

const client = new pg.Client({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password
});

const init = async () => await client.connect();

module.exports = {
  client,
  init
};
