import express from "express";

import makePlayController from "../controllers/play.js";
import requireAuth from "../middlewares/requireAuth.js";
import session from "../middlewares/sessions.js";

const router = express.Router();
router.use(session);
router.use(requireAuth);

router.get("/", (req, res) => {
	const cwdata = {
		board: [
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ],
			[ "", "", "", "", "","", "", "", "", "", "", "", "", "", "" ]
		],
		letters: [ "A", "B", "C", "D", "E", "F", "JOKER" ]
	};
	return res.render("play", makePlayController(req, cwdata));
});

export default router;
