import mecab from "mecab-ya";

export function keywordGen(words) {
  return new Promise((resolve, reject) => {
    mecab.nouns(words, function (err, result) {
      const set = new Set(result);
      resolve([...set]);
    });
  });
}
