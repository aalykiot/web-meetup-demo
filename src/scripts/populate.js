const packages = require('all-the-package-names');
const { faker } = require('@faker-js/faker');
const { SingleBar, Presets } = require('cli-progress');
const { client, init } = require('../db');

const BATCH_SIZE = 100;
const NPM_START_DATE = '2010-01-01T00:00:00.000Z';
const NPM_END_DATE = '2023-01-01T00:00:00.000Z';

const progressOptions = { hideCursor: true, stopOnComplete: true };
const progress = new SingleBar(progressOptions, Presets.shades_classic);

console.log('Inserting NPM package names to database...\n');

let totalCount = 0;
progress.start(packages.length, 0);

async function insertNextBatch(position) {
  // We reached the end.
  if (position >= packages.length - 1) return;

  const size = Math.min(BATCH_SIZE, packages.length - totalCount);
  const queries = new Array(size).fill(0);

  // Insert next batch of names to DB.
  await Promise.allSettled(
    queries
      .map((_, i) => packages[position + i])
      .map((name) => {
        const publish = faker.date.between(NPM_START_DATE, NPM_END_DATE);
        return client.query(
          `INSERT INTO npm (package_name, published) VALUES ($1, $2);`,
          [name, publish]
        );
      })
  );

  // Update progress.
  totalCount += size;
  progress.update(totalCount);

  return insertNextBatch(position + size);
}

// Start importing package names to DB.
(async () => {
  await init();
  await insertNextBatch(0);
  process.exit(0);
})();
