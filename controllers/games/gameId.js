import { getGame } from "../../database/games.js";

function makePageData(user, cwdata) {
	return {
		title: "Jouer",
		user: user,
		CWDATA: cwdata,
	};
}

export function gameId_get(req, res) {
	const game = getGame(req.params.gameId);
	// TODO redirect if null
	let cwdata = game; // TODO reformat this object
	console.log(cwdata);
	return res.render("game", makePageData(req.session.user, cwdata));
}
