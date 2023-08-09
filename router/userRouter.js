import express from 'express';
import * as data from '../data/userData.js';
import * as controller from '../controller/userController.js'
import { isAuth } from '../middleware/auth.js';


const router = express.Router();

router.get('/list', controller.getUserList);
  
//   router.get('/:blogId', async (req, res) => {
//     try {
//       res.status(200).json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({err: error.message});
//     }
//   });
  
//   router.put('/:blogId', async (req, res) => {
//     try {
//       res.status(200).json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({err: error.message});
//     }
//   });
  
//   router.patch('/:blogId/live', async (req, res) => {
//     try {
//       res.status(200).json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({err: error.message});
//     }
//   });
  
  export default router;