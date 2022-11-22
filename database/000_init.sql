CREATE TABLE schema_version (
	version INTEGER NOT NULL
);
CREATE TABLE users (
	id INTEGER PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	hash TEXT,
	email TEXT,
	created_at DATE DEFAULT (datetime('now'))
);
-- TODO deleted column
