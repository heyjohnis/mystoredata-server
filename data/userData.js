import { createCorp } from "./corpData.js";
import UserModel from "../model/userModel.js";
import { category } from "../cmmCode.js";

export async function getUserList(req) {
  const users = await UserModel.find().sort({ createdAt: -1 });
  return users;
}

export async function findById(_id) {
  return UserModel.findOne({ _id });
}

export async function findByUserId(userId) {
  return await UserModel.findOne({ userId });
}

export async function createUser(data) {
  const user = await new UserModel({ ...data, category })
    .save()
    .then((res) => res._id);
  return createCorp({ ...data, user });
}

export async function updateUser(req) {
  const {
    _id,
    userName,
    email,
    mobile,
    corpNum,
    corpName,
    ceoName,
    bizType,
    bizClass,
    addr1,
    addr2,
    birth,
  } = req.body;
  return await UserModel.updateOne(
    { _id },
    {
      $set: {
        userName,
        email,
        mobile,
        corpNum,
        corpName,
        ceoName,
        bizType,
        bizClass,
        addr1,
        addr2,
        birth,
      },
    }
  );
}

export async function resetCategory(req) {
  const corpNum = req.body.corpNum;
  return await UserModel.updateOne({ corpNum }, { $set: { category } });
}

export async function getCategory(req) {
  const userId = req.query.userId;
  console.log(userId);
  return await UserModel.findOne({ userId }, { category });
}
