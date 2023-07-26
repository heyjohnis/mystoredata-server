import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV,
  protocol: process.env.PROTOCOL,
  port: process.env.PORT,
  domain: process.env.DOMAIN,
  jwt: {
    secretKey: required('JWT_SECRET'),
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
  },
  db: {
    host: required('DB_HOST'),
  },
  ssl : {
    path: process.env.SSL_PATH,
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT,
    ca: process.env.SSL_CA,
  },
  baro : {
    certKey: process.env.CERT_KEY,
    corpNum: process.env.CORP_NUM,
  }
};
