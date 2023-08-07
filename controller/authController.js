import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/authData.js';
import { config } from '../config.js';

export async function signup(req, res) {
  const { loginId, corpName, password, name, email, url } = req.body;
  const found = await userRepository.findByLoginId(loginId);
  if (found) {
    return res.status(409).json({ message: `${loginId} 이미 존재하는 아이디입니다` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    loginId,
    corpName,
    password: hashed,
    name,
    email,
    url,
  });
  const token = createJwtToken(userId);
  res.status(201).json({ token, loginId });
}

export async function login(req, res) {
  const { loginId, password } = req.body;
  const user = await userRepository.findByLoginId(loginId);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const token = createJwtToken(user.loginId);
  res.status(200).json({ token, username });
}

function createJwtToken(loginId) {
  return jwt.sign({ loginId }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
