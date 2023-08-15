import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as data from '../data/userData.js';
import { config } from '../config.js';
import { checkCorpIsMember } from '../service/userService.js';

export async function signup(req, res) {
  const { userId, corpName, password, name, email, url } = req.body;
  const found = await data.findByUserId(userId);
  if (found) {
    return res.status(409).json({ error: { message: `${userId} 이미 존재하는 아이디입니다` } });
  }
  const hashed = await bcrypt.hash(password, parseInt(config.bcrypt.saltRounds));
  const resultCode = await checkCorpIsMember(req);
  console.log("resultCode: ", resultCode);
  const _id = await data.createUser({ ...req.body, password: hashed });
  const token = createJwtToken(_id);
  res.status(201).json({ token, _id });
}

export async function login(req, res) {
  const { userId, password } = req.body;
  const user = await data.findByUserId(userId);
  if (!user) {
    return res.status(401).json({ error: { code: 'Invalid', message: 'Invalid user or password' }});
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: { code: 'Invalid', message: 'Invalid user or password' }});
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, userId, id: user.id });
}

function createJwtToken(_id) {
  return jwt.sign({ _id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}

export async function me(req, res, next) {
  const user = await data.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
