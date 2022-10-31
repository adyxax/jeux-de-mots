import express from "express";

import session from "../middlewares/sessions.js";

const router = express.Router();
router.use(session);

router.get("/", (req, res) => {
	if (req.session.user !== undefined) {
		req.session.destroy();
	}
	return res.redirect(302, "/");
});

export default router;
