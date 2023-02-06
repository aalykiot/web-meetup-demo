# Web Chapter Meetup

Performance Profiling for Node.js Applications.

## Requirements

- [Node.js v18.x](https://nodejs.org/en/)
- [Autocannon](https://www.npmjs.com/package/autocannon)
- [Clinic](https://www.npmjs.com/package/clinic)

## Installation

Start required services (DB + cache):

```sh
$ docker-compose up
```

Load NPM packages to DB (~40mins):

```sh
$ npm run populate:db
```

Run application:

```sh
$ npm start
```

## Benchmark

Stress test the application using autocannon:

```sh
$ autocannon -c5 -d10 localhost:3000/search/react
```

> Your application must be already running

## Diagnostics

Use node-clinic to collect diagnostic metrics:

```sh
$ clinic doctor --on-port 'autocannon -c5 -d10 http://localhost:$PORT/search/react' -- node index.js
```

## Slides

You can present the slides (built using reveal.js) using:

```sh
$ npm run slides
```
