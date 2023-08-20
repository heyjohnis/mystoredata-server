import express from "express";
import data from "../data/blogData.js";
import Mongoose from "mongoose";
const router = express.Router();
const { isValidObjectId } = Mongoose;

router.get("/", async (req, res) => {
  try {
    const data = await data.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ err: error.message });
  }
});

router.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) {
      res.status(400).send({ err: "invalid blog id" });
      return;
    }
    const data = await data.findById(blogId);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ err: error.message });
  }
});

router.put("/:blogId", async (req, res) => {
  try {
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ err: error.message });
  }
});

router.patch("/:blogId/live", async (req, res) => {
  try {
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ err: error.message });
  }
});

export default router;
