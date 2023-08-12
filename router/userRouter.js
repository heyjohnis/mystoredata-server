import express from 'express';
import * as data from '../data/userData.js';
import * as controller from '../controller/userController.js'
import { isAuth } from '../middleware/auth.js';


const router = express.Router();

router.get('/list', isAuth, controller.getUserList);

router.post('/baro/reg', isAuth, controller.regBaroUser);
  
export default router;