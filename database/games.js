import db from "./db.js";

const createGameStatement = db.prepare("INSERT INTO games (player1, player2, data) VALUES (?, ?, ?);");
const getGameStatement = db.prepare("SELECT * from games where id = ?;");
const listGamesStatement = db.prepare("SELECT * from games where player1 = ?1 OR player2 = ?1 ORDER BY last_move_at;");

export function createGame(player1, player2, data) {
	try {
		return createGameStatement.run(player1, player2, data).lastInsertRowId;
	} catch {
		return null;
	}
}

export function getGame(id) {
	try {
		return getGameStatement.get(id);
	} catch {
		return null;
	}
}

export function listGames(userId) {
	try {
		return listGamesStatement.all({ 1: userId });
	} catch {
		return [];
	}
}
