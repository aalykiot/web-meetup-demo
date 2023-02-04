CREATE TABLE npm (
	id SERIAL PRIMARY KEY,
	package_name VARCHAR(255) NOT NULL,
	published TIMESTAMP NOT NULL
);

ALTER TABLE npm SET (parallel_workers = 1);

