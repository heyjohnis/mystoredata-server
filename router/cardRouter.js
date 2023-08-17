import express from 'express';
import * as controller from '../controller/cardController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/log', isAuth, controller.getCardLog);

router.post('/reg', isAuth, controller.regCard);

router.post('/stop', isAuth, controller.stopCard);

router.get('/list', isAuth, controller.getCardList);

router.delete('/delete', isAuth, controller.deleteCard);

export default router;