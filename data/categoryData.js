import { DefaultCorpCategory, DefaultPersonalCategory } from "../cmmCode.js";
import KeywordRuleModel from "../model/keywordRule.js";
import TransModel from "../model/transModel.js";

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
        categoryObj[key] = cate.code;
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
          category: { $ne: notCate },
        },
      },
      {
        $group: {
          _id: {
            remark: "$transRemark",
            useKind: "$useKind",
          },
          total: { $sum: 1 },
          lastDate: { $last: "$transDate" },
          userId: { $last: "$userId" },
          corpName: { $last: "$corpName" },
          useKind: { $last: "$useKind" },
        },
      },
    ]);

    const nonCardCategories = await TransModel.aggregate([
      {
        $match: {
          category: { $ne: notCate },
        },
      },
      {
        $group: {
          _id: {
            remark: "$useStoreName",
            useKind: "$useKind",
          },
          total: { $sum: 1 },
          lastDate: { $last: "$transDate" },
          userId: { $last: "$userId" },
          corpName: { $last: "$corpName" },
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
