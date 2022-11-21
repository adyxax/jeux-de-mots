import expressSession from "express-session";
import sqlite from "better-sqlite3";
import sqliteStore from "better-sqlite3-session-store";

const SqliteStore = sqliteStore(expressSession);
const db = new sqlite("sessions.db", process.env.NODE_ENV === "production" ? null : { verbose: console.log });
const secret = process.env.SESSION_SECRET || "secret";
const session = expressSession({
	cookie: {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
		sameSite: "Strict",
		secure: process.env.NODE_ENV === "production" ? true : false,
	},
	name: "JDMSessionId",
	saveUninitialized: false,
	secret: secret,
	store: new SqliteStore({
		client: db,
		expired: {
			clear: true,
			intervalMs: 1000 * 60 * 60, // 60min
		}
	}),
	resave: false,
	unset: "destroy",
});

export default session;
