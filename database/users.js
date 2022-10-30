import bcrypt from "bcrypt";

import db from "./db.js";

const saltRounds = 10;

const createUserStatement = db.prepare("INSERT INTO users (username, hash, email) VALUES (?, ?, ?);");
const loginStatement = db.prepare("SELECT id, hash, email FROM users WHERE username = ?;");

export async function createUser(username, password, email) {
	const hash = await bcrypt.hash(password, saltRounds);
	try {
		return createUserStatement.run(username, hash, email).lastInsertRowid;
	} catch {
		return null;
	}
}

export async function login(username, password) {
	try {
		var user = loginStatement.get(username);
	} catch {
		return null;
	}
	const result = await bcrypt.compare(password, user.hash);
	if (result === true) {
		return {
			id: user.id,
			username: username,
			email: user.email,
		};
	}
	return null;
}
