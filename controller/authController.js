import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {} from "express-async-errors";
import * as data from "../data/userData.js";
import { config } from "../config.js";
import * as corpService from "../service/corpService.js";
import errorCase from "../middleware/baroError.js";

export async function signup(req, res) {
  // Baro Update or Regist
  if (req.body.userKind === "CROP") {
    registerCorpBaro(req, res);
  }
  registerUser(req, res);
}

async function registerCorpBaro(req, res) {
  const isRegistedCorp = await corpService.checkCorpIsMember(req);
  console.log("isRegistedCorp: ", isRegistedCorp);
  let resultCode;
  if (isRegistedCorp > 0) {
    resultCode = await corpService.updateBoroCorpInfo(req);
  } else {
    resultCode = await corpService.registCorp(req);
  }

  if (resultCode < 0) return res.status(400).json(errorCase(resultCode));
}

async function registerUser(req, res) {
  const { userId, corpName, password, name, email, url } = req.body;

  const hasUser = await data.findByUserId(userId);
  console.log("hasUser: ", hasUser);
  if (hasUser) {
    return res.status(409).json({
      error: {
        code: "registed",
        message: `${userId} 이미 존재하는 아이디입니다`,
      },
    });
  }

  const hashed = await bcrypt.hash(
    password,
    parseInt(config.bcrypt.saltRounds)
  );
  const _id = await data.createUser({ ...req.body, password: hashed });

  const token = createJwtToken(_id);
  res.status(201).json({ token, _id });
}

export async function login(req, res) {
  const { userId, password } = req.body;
  const user = await data.findByUserId(userId);
  if (!user) {
    return res.status(401).json({
      error: { code: "Invalid", message: "Invalid user or password" },
    });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      error: { code: "Invalid", message: "Invalid user or password" },
    });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, userId, id: user.id, error: {} });
}

function createJwtToken(_id) {
  return jwt.sign({ _id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
