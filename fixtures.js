import { newGame } from './database/games.js';
import { createUser } from './database/users.js';
import { emptyBoard } from './utils/board.js';

await createUser('Alice', 'Alice42!', 'alice@example.com');
await createUser('Bob', 'Bob42!', 'bob@example.com');
const data = {
	board: emptyBoard,
	name: 'Alice vs Bob',
	player1: {
		id: 1,
		username: 'Alice',
		score: 0,
		letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
	},
	player2: {
		id: 2,
		username: 'Bob',
		score: 0,
		letters: ['T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
	},
};
newGame(1, 2, data);
