import user from "../data/userData.js";

export async function getBlogList(req, res) {
  res.status(200).json(data);
}

export async function getBlogContent(req, res) {
  try {
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
