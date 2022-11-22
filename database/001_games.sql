CREATE TABLE games (
	id INTEGER PRIMARY KEY,
	player1 INTEGER NOT NULL,
	player2 INTEGER NOT NULL,
	data TEXT NOT NULL,
	created_at DATE DEFAULT (datetime('now')),
	last_move_at DATE DEFAULT NULL,
	FOREIGN KEY (player1) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (player2) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_games_player1 ON games(player1);
CREATE INDEX idx_games_player2 ON games(player2);
CREATE INDEX idx_games_last_move_at ON games(last_move_at);
