import express from "express";
import { check, validationResult, matchedData } from "express-validator";

import makeLoginController from "../controllers/login.js"
import bodyParser from "../middlewares/formParser.js";
import session from "../middlewares/sessions.js";
import { login } from "../database/users.js";

const router = express.Router();
router.use(session);

router.get("/", (req, res) => {
	if (req.session.user !== undefined) {
		return res.redirect(302, "/play");
	}
	return res.render("login", makeLoginController(req));
});

const checkUsername = check("username")
	.trim()
	.matches(/^[a-z][-a-z0-9_]+$/i)
	.withMessage("Un identifiant d'au moins deux charactères est requis.");
const checkPassword = check("password")
	.isStrongPassword()
	.withMessage("Veuillez utiliser un mot de passe d'au moins 8 caractères contenant au moins une minuscule, majuscule, chiffre et charactère spécial.");

router.post("/", [bodyParser, checkUsername, checkPassword], async (req, res) => {
	if (req.session.user !== undefined) {
		return res.redirect(302, "/play");
	}
	let controller = makeLoginController(req);
	controller.data = req.body;
	controller.errors = validationResult(req).mapped();
	if (Object.keys(controller.errors).length === 0) {
		const user = await login(controller.data.username, controller.data.password);
		if (user !== null) {
			req.session.user = user;
		} else {
			controller.errors.mismatch = "L'identifiant et le mot de passe ne correspondent pas, ou l'identifiant n'existe pas.";
		}
	}
	if (Object.keys(controller.errors).length === 0) {
		return res.redirect(302, "/play");
	}
	return res.render("login", controller);
});

export default router;
