import express from 'express';
import * as controller from '../controller/cardController.js';

const router = express.Router();

router.get('/log', controller.getCardLog);

export default router;ß