// import mecab from "mecab-ya";

// var paragraph =
//   "마이크로소프트(MS)가 개발한 운영체제(OS) 최신 버전 ‘윈도우 10’의 무료 업그레이드가 29일부로 종료된다.";

// mecab.nouns(paragraph, function (err, result) {
//   console.log(result);
// });

import { calculateSimilarity } from "./utils/similarity.js";

const similarity = calculateSimilarity("(주)갤러리케이", "호스트센터(주)");
console.log(similarity);
