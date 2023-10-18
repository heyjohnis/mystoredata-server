import { DefaultCorpCategory, DefaultPersonalCategory } from "../cmmCode.js";
import KeywordRuleModel from "../model/keywordRule.js";
import TransModel from "../model/transModel.js";
import UserModel from "../model/userModel.js";

export async function getKeywordCategoryRule(req) {
  try {
    const categoryRule = await KeywordRuleModel.find().sort({ order: 1 });
    return categoryRule;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function updateKeywordCategoryRule(req) {
  try {
    const { code } = req.params;
    const { keywordString } = req.body;
    const keyword = keywordString?.split(",").map((item) => item.trim());
    console.log({ code, keyword });
    const categoryRule = await KeywordRuleModel.findOneAndUpdate(
      { code },
      { keyword }
    );
    console.log({ categoryRule });
    return categoryRule;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function keywordCategory(asset) {
  try {
    // TODO: redis로 변경
    const categorys = await KeywordRuleModel.find({ useKind: asset.useKind });
    const categoryObj = {};
    categorys.forEach((cate) => {
      cate.keyword.forEach((key) => {
        if (key) categoryObj[key] = cate.code;
      });
    });
    return categoryObj;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getNonCategory(req) {
  try {
    const { userId } = req.query;
    const defaultCate = [...DefaultCorpCategory, ...DefaultPersonalCategory];
    const notCate = defaultCate.map((item) => item.code);
    console.log({ notCate });

    const nonAccountCategories = await TransModel.aggregate([
      {
        $match: {
          category: { $nin: notCate },
        },
      },
      {
        $group: {
          _id: {
            remark: "$transRemark",
            useKind: "$useKind",
            category: "$category",
          },
          total: { $sum: 1 },
          lastDate: { $last: "$transDate" },
          userId: { $last: "$userId" },
          user: { $last: "$user" },
          corpName: { $last: "$corpName" },
          useKind: { $last: "$useKind" },
          finClass: { $last: "$finClassCode" },
        },
      },
    ]);

    const nonCardCategories = await TransModel.aggregate([
      {
        $match: {
          category: { $nin: notCate },
        },
      },
      {
        $group: {
          _id: {
            remark: "$useStoreName",
            useKind: "$useKind",
            category: "$category",
          },
          total: { $sum: 1 },
          lastDate: { $last: "$transDate" },
          userId: { $last: "$userId" },
          user: { $last: "$user" },
          corpName: { $last: "$corpName" },
          useKind: { $last: "$useKind" },
          finClass: { $last: "$finClassCode" },
        },
      },
    ]);
    return [...nonAccountCategories, ...nonCardCategories].filter(
      (item) => !!item._id.remark
    );
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function setCategory(log) {
  let category = "";
  let categoryName = "";

  const myInfo = await UserModel.findOne({ _id: log.user });
  const userCates = myInfo.userCategory;
  // 등록된 카테고리가 하나도 없는 경우
  if (userCates && userCates?.length === 0) {
    category = "1000";
    await createCategory({
      user: log.user,
      code: category,
      name: log.transRemark || log.useStoreName || log.transOffice,
    });
  } else {
    const userCate = userCates.find(
      (c) => c.name === (log.transRemark || log.useStoreName || log.transOffice)
    );
    if (userCate) {
      category = userCate.code;
      categoryName = userCate.name;
    } else {
      const maxCode = userCates.reduce((acc, cur) => {
        return acc > parseInt(cur.code) ? acc : parseInt(cur.code);
      }, 0);
      category = maxCode + 1 + "";
      categoryName = log.transRemark || log.useStoreName || log.transOffice;
      await createCategory({
        user: log.user,
        code: category,
        name: categoryName,
      });
    }
  }
  return { category, categoryName };
}

async function createCategory({ user, code, name, finClass }) {
  await UserModel.updateOne(
    { _id: user },
    {
      $push: {
        userCategory: {
          code,
          name,
        },
      },
    }
  );
}
