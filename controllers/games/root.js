import { validationResult } from "express-validator";

import { getUserByUsername } from "../../database/users.js";
import { listGames, newGame } from "../../database/games.js";
import { emptyBoard, Bag } from "../../utils/board.js";

function makePageData(user) {
	return {
		title: "Parties",
		user: user,
		games: listGames(user.id),
		formdata: {
			name: "",
			username: "",
		},
		errors: {},
	};
}

export function root_get(req, res) {
	let page = makePageData(req.session.user);
	page.games.forEach(g => g.data = JSON.parse(g.data));
	return res.render("games", page);
}

function makeNewGameData(name, player1, player2) {
	let bag = new Bag();
	return {
		board: emptyBoard,
		name: name,
		player1: {
			id: player1.id,
			username: player1.username,
			score: 0,
			letters: bag.pick(7),
		},
		player2: {
			id: player2.id,
			username: player2.username,
			score: 0,
			letters: bag.pick(7),
		},
	};
}

export function root_post(req, res) {
	let page = makePageData(req.session.user);
	page.formdata = req.body;
	page.errors = validationResult(req).mapped();
	if (Object.keys(page.errors).length === 0) {
		const player2 = getUserByUsername(page.formdata.username);
		if (player2) {
			const gameId = newGame(req.session.user.id, player2.id, makeNewGameData(page.formdata.name, req.session.user, player2));
			if (gameId) {
				return res.redirect(302, `/games/${gameId}`);
			} else {
				page.errors.mismatch = "Erreur du serveur: la création de partie a échoué";
			}
		} else {
			page.errors.username = { msg: "L'identifiant n'existe pas." };
		}
	}
	return res.render("games", page);
}
