export function calculateSimilarity(sentence1, sentence2) {
  // 두 문자열을 소문자로 변환하여 비교합니다.
  sentence1 = sentence1.toLowerCase();
  sentence2 = sentence2.toLowerCase();

  // 두 문자열의 길이를 가져옵니다.
  const len1 = sentence1.length;
  const len2 = sentence2.length;

  // 편집 거리를 저장할 2차원 배열을 생성합니다.
  const dp = [];

  // 배열을 초기화합니다.
  for (let i = 0; i <= len1; i++) {
    dp[i] = [];
    for (let j = 0; j <= len2; j++) {
      dp[i][j] = 0;
    }
  }

  // 초기값 설정
  for (let i = 0; i <= len1; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    dp[0][j] = j;
  }

  // 편집 거리 계산
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = sentence1[i - 1] === sentence2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // 문자열1에서 문자 하나를 삭제하는 경우
        dp[i][j - 1] + 1, // 문자열2에서 문자 하나를 추가하는 경우
        dp[i - 1][j - 1] + cost // 문자열1과 문자열2의 문자가 다른 경우
      );
    }
  }

  // 두 문자열의 유사성을 계산합니다.
  const maxLen = Math.max(len1, len2);
  const similarity = 1 - dp[len1][len2] / maxLen;

  return similarity;
}
