import dotenv from "dotenv";
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV,
  protocol: process.env.PROTOCOL,
  port: process.env.PORT,
  domain: process.env.DOMAIN,
  jwt: {
    secretKey: process.env.JWT_SECRET,
    expiresInSec: process.env.JWT_EXPIRES_SEC,
  },
  bcrypt: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS,
  },
  db: {
    host: process.env.DB_HOST,
  },
  ssl: {
    path: process.env.SSL_PATH,
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT,
    ca: process.env.SSL_CA,
  },
  baro: {
    opsCertKey: process.env.OPS_CERT_KEY,
    testCertKey: process.env.TEST_CERT_KEY,
    corpNum: process.env.CORP_NUM,
    password: process.env.USER_PASSWORD,
    opsUrl: process.env.BARO_OPS_URL,
    testUrl: process.env.BARO_TEST_URL,
  },

  ai: {
    key: process.env.AI_KEY,
  },

  batchTime: {
    t1: process.env.BATCH_TIME_T1,
    t2: process.env.BATCH_TIME_T2,
    t3: process.env.BATCH_TIME_T3,
  },
};
