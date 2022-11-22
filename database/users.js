import bcrypt from "bcrypt";

import db from "./db.js";

const saltRounds = 10;

const createUserStatement = db.prepare("INSERT INTO users (username, hash, email) VALUES (?, ?, ?);");
const getUserByUsernameStatement = db.prepare("SELECT id, username, email from users WHERE username = ?;");
const loginStatement = db.prepare("SELECT id, username, hash, email FROM users WHERE username = ?;");

export async function createUser(username, password, email) {
	const hash = await bcrypt.hash(password, saltRounds);
	try {
		return createUserStatement.run(username, hash, email).lastInsertRowid;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export function getUserByUsername(username) {
	try {
		return getUserByUsernameStatement.get(username);
	} catch (err) {
		console.log(err);
		return null;
	}
}

export async function login(username, password) {
	try {
		var user = loginStatement.get(username);
	} catch (err) {
		console.log(err);
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
