require('dotenv').config();
const server = require('./src/server');
const { init: dbInit } = require('./src/db');
const { init: cacheInit } = require('./src/cache');

async function start() {
  try {
    await dbInit();
    await cacheInit();
    await server.listen({ port: 3000 });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

start();
