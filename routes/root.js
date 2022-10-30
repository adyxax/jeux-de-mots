import express from "express";

import session from "../middlewares/sessions.js";

const router = express.Router();
router.use(session);
router.get("/", (req, res) => {
	if (req.session.user !== undefined) {
		return res.redirect(302, "/play");
	}
	return res.redirect(302, "/login");
});

export default router;
