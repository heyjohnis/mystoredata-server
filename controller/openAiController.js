import * as openAiService from "../service/openAiService.js";

export async function checkHumanName(req, res) {
  try {
    const { name } = req.body;
    const data = await openAiService.checkHumanName(name);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
