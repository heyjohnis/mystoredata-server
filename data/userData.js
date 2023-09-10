import mongoose from "mongoose";
import { createCorp } from "./corpData.js";
import UserModel from "../model/userModel.js";
import { DefaultCategory } from "../cmmCode.js";
import CategoryRuleModel from "../model/categoryRule.js";
import TransModel from "../model/transModel.js";
import KeywordRuleModel from "../model/keywordRule.js";

export async function getUserList(req) {
  const userType =
    req?.query && req.query.userType ? { userType: req.query.userType } : {};
  const users = await UserModel.find(userType).sort({ createdAt: -1 });
  return users;
}

export async function findById(_id) {
  return UserModel.findOne({ _id });
}

export async function findByUserId(userId) {
  return await UserModel.findOne({ userId });
}

export async function createUser(data) {
  const user = await new UserModel({ ...data, category: DefaultCategory })
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
  return await UserModel.updateOne(
    { corpNum },
    { $set: { category: DefaultCategory } }
  );
}

export async function getCategory(req) {
  return await KeywordRuleModel.find();
}

export async function getUserCategory(req) {
  const _id = mongoose.Types.ObjectId(req.params.user);
  const category = await UserModel.findOne({ _id }, "category");

  return category;
}

export async function createCategoryRule(req) {
  const { user, useStoreName, transRemark, category, categoryName, useKind } =
    req.body;
  const query = { user };

  query.$or = query.$or || [];
  if (useStoreName) {
    query.$or.push({ useStoreName });
  }
  if (transRemark) {
    query.$or.push({ transRemark });
  }
  const existingData = await CategoryRuleModel.findOne(query);
  if (existingData) {
    await CategoryRuleModel.updateOne(
      { _id: existingData._id },
      { category, categoryName, useKind }
    );
  } else {
    const addRule = await new CategoryRuleModel({ ...req.body }).save();
    console.log("addRule", addRule);
  }

  const result = await TransModel.updateMany(query, {
    $set: { category, useKind, categoryName },
  });

  console.log("result", result);
  return result;
}
