import express from 'express';
import * as controller from '../controller/transController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/merge', isAuth, controller.mergeTrans);

router.get('/log', isAuth, controller.mergeTransLogs);

// router.post('/words', controller.analyzeWords);

export default router;