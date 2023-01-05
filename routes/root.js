import express from 'express';

import { login_get, login_post } from '../controllers/root/login.js';
import { logout_get } from '../controllers/root/logout.js';
import { root_get } from '../controllers/root/root.js';
import bodyParser from '../middlewares/formParser.js';
import session from '../middlewares/sessions.js';
import { checkUsername, checkPassword } from '../utils/checks.js';

const router = express.Router();
router.use(session);

router.get('/', root_get);
router.get('/login', login_get);
router.post('/login', [bodyParser, checkUsername, checkPassword], login_post);
router.get('/logout', logout_get);

export default router;
