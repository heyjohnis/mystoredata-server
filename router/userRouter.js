import express from 'express';
import data from '../data/userData.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const result = await data.find({});
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({err: error.message});
    }
  });
  
  router.get('/:blogId', async (req, res) => {
    try {
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({err: error.message});
    }
  });
  
  router.put('/:blogId', async (req, res) => {
    try {
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({err: error.message});
    }
  });
  
  router.patch('/:blogId/live', async (req, res) => {
    try {
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({err: error.message});
    }
  });
  
  export default router;