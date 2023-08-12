import * as data from '../data/userData.js';
import * as service from '../service/userService.js';

export async function getUserList(req, res) {
  const users = await data.getUserList(req);
  console.log("users: ", users);
  res.status(200).json({ users });
}


export async function regBaroUser( req ) {
  const code = await service.regBaroUser(req);
  return code;  

}