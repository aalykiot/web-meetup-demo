const crypto = require('crypto');
const fastify = require('fastify');
const { client: db } = require('./db');
const { client: cache } = require('./cache');

const server = fastify();

server.get('/search/:term', async (request, reply) => {
  // Get search term from URL.
  const { term } = request.params;

  // Handle bad request.
  if (!term) {
    reply.status(400).send({ massage: 'Search term is required!' });
    return;
  }

  // Check cache for speed.
  const cachedPackages = await cache.get(term);

  if (cachedPackages) {
    reply.send(JSON.parse(cachedPackages));
    return;
  }

  // Get newest packages that includes `term` word.
  const { rows: newestPackages } = await db.query(
    'SELECT * FROM npm WHERE package_name LIKE $1 ORDER BY published DESC LIMIT 10',
    [`%${term}%`]
  );

  // Get oldest packages that includes `term` word.
  const { rows: oldestPackages } = await db.query(
    'SELECT * FROM npm WHERE package_name LIKE $1 ORDER BY published ASC LIMIT 10',
    [`%${term}%`]
  );

  const packages = await Promise.all(
    computeHash(newestPackages, oldestPackages)
  );

  // Update cache.
  await cache.set(term, JSON.stringify(packages));
  reply.send(packages);
});

function computeHash(newestPackages, oldestPackages) {
  return [...newestPackages, ...oldestPackages]
    .map((row) => row['package_name'])
    .map((name) => {
      return new Promise((resolve) => {
        crypto.pbkdf2(name, 'MY_SALT', 2000, 32, 'sha512', (_, hash) => {
          resolve(`${name} |> ${hash.toString('hex')}`);
        });
      });
    });
}

module.exports = server;
