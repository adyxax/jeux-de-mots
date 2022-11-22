import { check } from "express-validator";

export const checkName = check("name")
	.trim()
	.matches(/^[a-z][-a-z0-9_]+$/i)
	.withMessage("Un identifiant d'au moins deux charactères est requis.");

export const checkPassword = check("password")
	.isStrongPassword()
	.withMessage("Veuillez utiliser un mot de passe d'au moins 8 caractères contenant au moins une minuscule, majuscule, chiffre et charactère spécial.");

export const checkUsername = check("username")
	.trim()
	.matches(/^[a-z][-a-z0-9_]+$/i)
	.withMessage("Un identifiant d'au moins deux charactères est requis.");
