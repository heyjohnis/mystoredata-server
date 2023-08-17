import * as data from '../data/userData.js';
import * as service from '../service/userService.js';

export async function getUserList(req, res) {
  const baroUser = await service.getCorpMemberContacts(req);
  const users = await data.getUserList(req);
  res.status(200).json({ users });
}


export async function regBaroUser( req ) {

  try {
    const code = await service.regBaroUser(req);
    if(code > 0) {
          res.status(200).json({success: true});    
      } else {
          res.status(400).json(errorCase(code));
      } 
  } catch (error) {
      res.status(500).json(error);
  }

}

export async function updateUser(req, res) {
  
  try {
    const code = await data.updateUser(req);
    if(code > 0) {
          res.status(200).json({success: true});    
      } else {
          res.status(400).json(errorCase(code));
      } 
  } catch (error) {
      res.status(500).json(error);
  }

}