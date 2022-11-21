import express from "express";

import { gameId_get } from "../controllers/games/gameId.js";
import { root_get } from "../controllers/games/root.js";
import requireAuth from "../middlewares/requireAuth.js";
import session from "../middlewares/sessions.js";

const router = express.Router();
router.use(session);
router.use(requireAuth);

router.get("/", root_get);
router.get("/:gameId(\\d+)", gameId_get);

export default router;
