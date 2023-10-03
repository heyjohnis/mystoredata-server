import mongoose from "mongoose";
import { createCorp } from "./corpData.js";
import UserModel from "../model/userModel.js";
import { DefaultCorpCategory, DefaultPersonalCategory } from "../cmmCode.js";
import CategoryRuleModel from "../model/categoryRule.js";
import TransModel from "../model/transModel.js";
import KeywordRuleModel from "../model/keywordRule.js";
import { getFinClassByCategory } from "./finClassData.js";

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
  const user = await new UserModel({
    ...data,
    persnalCategory: DefaultPersonalCategory,
    corpCategory: DefaultCorpCategory,
  })
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

export async function updateUserHometaxInfo(req) {
  const { _id, hometaxID, HometaxPWD, hometaxLoginMethod } = req.body;
  return await UserModel.findOneAndUpdate(
    { _id },
    {
      $set: {
        hometaxID,
        HometaxPWD,
        hometaxLoginMethod,
      },
    }
  );
}

export async function resetCategory(req) {
  const userId = req.body.userId;
  return await UserModel.updateOne(
    { userId },
    {
      $set: {
        personalCategory: DefaultPersonalCategory,
        corpCategory: DefaultCorpCategory,
      },
    }
  );
}

export async function getCategory(req) {
  return await KeywordRuleModel.find();
}

export async function getUserCategory(req) {
  const _id = mongoose.Types.ObjectId(req.params.user || req.body.user);
  const userInfo = await UserModel.findOne({ _id });
  console.log(userInfo.userCategory);
  return {
    personalCategory: userInfo.personalCategory,
    corpCategory: userInfo.corpCategory,
    userCategory: userInfo.userCategory,
  };
}

export async function createCategoryRule(req) {
  const {
    user,
    useStoreName,
    transRemark,
    category,
    categoryName,
    useKind,
    userId,
  } = req.body;
  const { finClassCode, finClassName } = await getFinClassByCategory(req);
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
      { category, categoryName, useKind, userId, finClassCode, finClassName }
    );
  } else {
    const addRule = await new CategoryRuleModel({
      ...req.body,
      finClassCode,
      finClassName,
    }).save();
    console.log("addRule", addRule);
  }

  const result = await TransModel.updateMany(query, {
    $set: { category, useKind, categoryName, finClassCode, finClassName },
  });

  console.log("result", result);
  return result;
}

export async function getHomeTaxUsers() {
  return await UserModel.find({ hometaxID: { $ne: null } });
}
