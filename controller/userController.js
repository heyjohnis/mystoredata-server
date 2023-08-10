import * as data from '../data/userData.js';

export async function getUserList(req, res) {
  const users = await data.getUserList(req);
  console.log("users: ", users);
  res.status(200).json({ users });
}
