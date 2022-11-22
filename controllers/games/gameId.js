import { getGame } from "../../database/games.js";

function makePageData(user, game) {
	return {
		title: "Jouer",
		user: user,
		data: game,
	};
}

export function gameId_get(req, res) {
	const game = JSON.parse(getGame(req.params.gameId).data);
	if (game) {
		if (game.player1.id === req.session.user.id) {
			game.letters = game.player1.letters;
			delete game.player2.letters;
		} else {
			game.letters = game.player2.letters;
			delete game.player1.letters;
		}
		return res.render("game", makePageData(req.session.user, game));
	}
	return res.redirect("/games");
}
