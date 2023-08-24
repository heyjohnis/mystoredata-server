import mecab from "mecab-ya";

mecab.pos("아버지가가방에들어가신다", function (err, result) {
  console.log(result);
});
