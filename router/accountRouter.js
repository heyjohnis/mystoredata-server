import express from 'express';
import * as controller from '../controller/accountController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/list', isAuth, controller.getAccounts);

router.post('/reg', isAuth, controller.regAccount)

router.post('/log', isAuth, controller.getAccountLog);

router.delete('/delete', isAuth, controller.deleteAccount);

export default router;