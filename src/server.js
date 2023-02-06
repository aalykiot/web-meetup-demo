const crypto = require('crypto');
const fastify = require('fastify');
const { client } = require('./db');

const server = fastify();

server.get('/search/:term', async (request, reply) => {
  // Get search term from URL.
  const { term } = request.params;

  // Handle bad request.
  if (!term) {
    reply.status(400).send({ massage: 'Search term is required!' });
    return;
  }

  // Get newest packages that includes `term` word.
  const { rows: newestPackages } = await client.query(
    'SELECT * FROM npm WHERE package_name LIKE $1 ORDER BY published DESC LIMIT 10',
    [`%${term}%`]
  );

  // Get oldest packages that includes `term` word.
  const { rows: oldestPackages } = await client.query(
    'SELECT * FROM npm WHERE package_name LIKE $1 ORDER BY published ASC LIMIT 10',
    [`%${term}%`]
  );

  const packages = computeHash(newestPackages, oldestPackages);
  reply.send(packages);
});

function computeHash(newestPackages, oldestPackages) {
  return [...newestPackages, ...oldestPackages]
    .map((row) => row['package_name'])
    .map((name) => {
      const hash = crypto.pbkdf2Sync(name, 'MY_SALT', 2000, 32, 'sha512');
      return `${name} |> ${hash.toString('hex')}`;
    });
}

module.exports = server;
