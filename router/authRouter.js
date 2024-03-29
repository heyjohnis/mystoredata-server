import express from "express";
import {} from "express-async-errors";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import * as authController from "../controller/authController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

const validateCredential = [
  body("userId").trim().notEmpty().withMessage("로그인ID를 입력하세요"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("로그인ID는 최소 5자이상 입력하세요"),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body("userName").notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
  validate,
];
router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateCredential, authController.login);

export default router;
