require('dotenv').config();
const server = require('./src/server');
const { init } = require('./src/db');

async function start() {
  try {
    await init();
    await server.listen({ port: 3000 });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

start();

/**
 * clinic doctor --on-port 'autocannon -c5 -d10 http://localhost:$PORT/search/react' -- node index.js
 */
