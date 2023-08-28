import CategoryRuleModel from "../model/categoryRule.js";

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
