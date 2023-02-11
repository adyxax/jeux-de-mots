import { getGame } from '../../database/games.js';

function makePageData(user, game) {
	return {
		title: 'Jouer',
		user: user,
		data: game,
	};
}

export function gameId_get(req, res) {
	const gameData = getGame(req.params.gameId);
	if (gameData) {
		const game = JSON.parse(gameData.data);
		if (game) {
			if (game.player1.id === req.session.user.id) {
				game.letters = game.player1.letters;
				delete game.player2.letters;
			} else {
				game.letters = game.player2.letters;
				delete game.player1.letters;
			}
			return res.render('game', makePageData(req.session.user, game));
		}
	} // we got null or undefined from the getGame database request
	return res.redirect('/games');
}
