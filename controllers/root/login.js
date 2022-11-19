import { validationResult } from "express-validator";

import { login } from "../../database/users.js";

function makePageData(user) {
	return {
		title: "Connexion",
		user: user,
		data: {
			username: "",
			password: "",
		},
		errors: {},
	};
}

export function login_get(req, res) {
	if (req.session.user !== undefined) {
		return res.redirect(302, "/play");
	}
	return res.render("login", makePageData(req.session.user));
}

export async function login_post(req, res) {
	if (req.session.user !== undefined) {
		return res.redirect(302, "/play");
	}
	let page = makePageData(req.session.user);
	page.data = req.body;
	page.errors = validationResult(req).mapped();
	if (Object.keys(page.errors).length === 0) {
		const user = await login(page.data.username, page.data.password);
		if (user !== null) {
			req.session.user = user;
		} else {
			page.errors.mismatch = "L'identifiant et le mot de passe ne correspondent pas, ou l'identifiant n'existe pas.";
		}
	}
	if (Object.keys(page.errors).length === 0) {
		return res.redirect(302, "/games");
	}
	return res.render("login", page);
}
