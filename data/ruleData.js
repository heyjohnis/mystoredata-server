import { DefaultPersonalCategory, DefaultCorpCategory } from "../cmmCode.js";
import CategoryRuleModel from "../model/categoryRule.js";
import KeywordRuleModel from "../model/keywordRule.js";

export async function getCategoryRule(req) {
  try {
    const user = req.query.user;
    const query = user ? { user } : {};
    const categoryRule = await CategoryRuleModel.find(query);
    console.log({ categoryRule });
    return categoryRule;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getKeywordCategoryRule(req) {
  try {
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function createKeywordCategoryRule(req) {
  const { useKind } = req.query;
  let DefaultCategory =
    useKind === "BIZ" ? DefaultCorpCategory : DefaultPersonalCategory;
  try {
    DefaultCategory.forEach(async (category) => {
      new KeywordRuleModel({ ...category, useKind }).save();
    });
  } catch (error) {
    console.log({ error });
    return { error };
  }
}
