import express from "express";
import { check } from "express-validator";

import { login_get, login_post } from "../controllers/root/login.js";
import { logout_get } from "../controllers/root/logout.js";
import { root_get } from "../controllers/root/root.js";
import bodyParser from "../middlewares/formParser.js";
import session from "../middlewares/sessions.js";

const router = express.Router();
router.use(session);

const checkUsername = check("username")
	.trim()
	.matches(/^[a-z][-a-z0-9_]+$/i)
	.withMessage("Un identifiant d'au moins deux charactères est requis.");
const checkPassword = check("password")
	.isStrongPassword()
	.withMessage("Veuillez utiliser un mot de passe d'au moins 8 caractères contenant au moins une minuscule, majuscule, chiffre et charactère spécial.");

router.get("/", root_get);
router.get("/login", login_get);
router.post("/login", [bodyParser, checkUsername, checkPassword], login_post);
router.get("/logout", logout_get);

export default router;
