import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/userData.js';
import { config } from '../config.js';

export async function signup(req, res) {
  const { userId, corpName, password, name, email, url } = req.body;
  const found = await userRepository.findByUserId(userId);
  if (found) {
    return res.status(409).json({ message: `${userId} 이미 존재하는 아이디입니다` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const id = await userRepository.createUser({ ...req.body, password: hashed });
  const token = createJwtToken(id);
  res.status(201).json({ token, id });
}

export async function login(req, res) {
  const { userId, password } = req.body;
  const user = await userRepository.findByUserId(userId);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  console.log("user.id: ", user.id);
  const token = createJwtToken(user.id);
  res.status(200).json({ token, userId, id: user.id });
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}

export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
