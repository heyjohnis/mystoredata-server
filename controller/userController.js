import * as data from '../data/userData.js';
import * as service from '../service/userService.js';

export async function getUserList(req, res) {
  const users = await data.getUserList(req);
  res.status(200).json({ users });
}


export async function regBaroUser( req ) {
  const code = await service.regBaroUser(req);
  return code;  

}

export async function updateUser(req, res) {
  const resutlt = await data.updateUser(req);
  return resutlt;
}