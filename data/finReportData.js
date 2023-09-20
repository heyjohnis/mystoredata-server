import KeywordRuleModel from "../model/keywordRule.js";
import TransModel from "../model/transModel.js";

export async function getCategoryReportData(req) {
  try {
    const cateList = await KeywordRuleModel.find();
    for (cate of cateList) {
    }
  } catch (error) {
    console.log({ error });
    return { error };
  }
}
