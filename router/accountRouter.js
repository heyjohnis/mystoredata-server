import express from 'express';
import * as controller from '../controller/accountController.js';

const router = express.Router();

router.get('/list', controller.getAccounts);

router.post('/reg', controller.regAccount)

router.post('/log', controller.getAccountLog);

export default router;