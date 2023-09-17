import KeywordRuleModel from "../model/keywordRule.js";
import TransModel from "../model/transModel.js";

export async function getKeywordCategoryRule(req) {
  try {
    const categoryRule = await KeywordRuleModel.find();
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

export async function keywordCategory(req) {
  try {
    // TODO: redis로 변경
    const categorys = await KeywordRuleModel.find();
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
    const { userId } = req.params;
    const nonAccountCategories = await TransModel.aggregate([
      { $match: { category: "900" } },
      { $group: { _id: "$transRemark", total: { $sum: 1 } } },
    ]);
    console.log("nonCategories: ", nonAccountCategories);
    const nonCardCategories = await TransModel.aggregate([
      { $match: { category: "900" } },
      { $group: { _id: "$useStoreName", total: { $sum: 1 } } },
    ]);
    console.log("nonCardCategories: ", nonCardCategories);
    return { nonAccountCategories, nonCardCategories };
  } catch (error) {
    console.log({ error });
    return { error };
  }
}
