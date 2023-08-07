import express from 'express';
import * as controller from '../controller/corpController.js';

const router = express.Router();

router.get('/check', controller.checkCorpIsMember);

router.post('/reg', controller.registCorp);

export default router;
