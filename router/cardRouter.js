import express from 'express';
import * as controller from '../controller/cardController.js';

const router = express.Router();

router.post('/log', controller.getCardLog);

router.post('/reg', controller.regCard);

router.post('/stop', controller.stopCard);

router.get('/list', controller.getCardList);

export default router;