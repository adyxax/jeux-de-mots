import db from "./db.js";

const getGameStatement = db.prepare("SELECT * from games where id = ?;");
const listGamesStatement = db.prepare("SELECT * from games where player1 = ?1 OR player2 = ?1 ORDER BY last_move_at;");
const newGameStatement = db.prepare("INSERT INTO games (player1, player2, data) VALUES (?, ?, ?);");

export function getGame(id) {
	try {
		return getGameStatement.get(id);
	} catch (err) {
		return null;
	}
}

export function listGames(userId) {
	try {
		return listGamesStatement.all({ 1: userId });
	} catch (err) {
		console.log(err);
		return [];
	}
}

export function newGame(player1, player2, data) {
	try {
		return newGameStatement.run(player1, player2, JSON.stringify(data)).lastInsertRowid;
	} catch (err) {
		return null;
	}
}
