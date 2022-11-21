import { listGames } from "../../database/games.js";

export function root_get(req, res) {
	const data = {
		title: "Liste des parties",
		user: req.session.user,
		games: listGames(req.session.user.id),
	};
	for (let i=0; i<data.games.length; i++) {
		data.games[i].data = JSON.parse(data.games[i].data);
	}
	return res.render("games", data);
}
