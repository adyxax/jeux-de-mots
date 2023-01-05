import express from 'express';

import { gameId_get } from '../controllers/games/gameId.js';
import { root_get, root_post } from '../controllers/games/root.js';
import bodyParser from '../middlewares/formParser.js';
import requireAuth from '../middlewares/requireAuth.js';
import session from '../middlewares/sessions.js';
import { checkName, checkUsername } from '../utils/checks.js';

const router = express.Router();
router.use(session);
router.use(requireAuth);

router.get('/', root_get);
router.post('/', [bodyParser, checkName, checkUsername], root_post);
router.get('/:gameId(\\d+)', gameId_get);

export default router;
