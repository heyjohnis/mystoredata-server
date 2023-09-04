import * as finItemData from "../data/finItemData.js";
import * as userData from "../data/userData.js";

export async function regFinItem(req, res) {
  try {
    let userInfo = req.body.user
      ? await userData.findById(user)
      : await userData.findByUserId(req.body.userId);
    const { _id, userId } = userInfo;
    const data = await finItemData.regFinItem({
      ...req.body,
      user: _id,
      userId,
    });
    res.status(200).json({ is_success: data });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function listFinItem(req, res) {
  try {
    res.status(200).json(await finItemData.listFinItem(req));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
