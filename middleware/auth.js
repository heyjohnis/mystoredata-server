import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/userData.js';

const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return res.status(401).json(AUTH_ERROR);
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    console.log("decode: ", decoded);
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded._id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.userId;
    req._id = user._id;
    next();
  });
};

export async function authError(err, req) {
  console.log("err: ", err);
  const errReason = err.response.data || '';
  console.log("인증 errReason : ", errReason);
  return err;
}
