const pg = require('pg');
const config = require('./config');

const client = new pg.Client({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password
});

const init = async () => await client.connect();

module.exports = {
  client,
  init
};
