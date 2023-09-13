export function strToDate(dateString) {
  dateString = dateString.toString();
  dateString = (dateString || "").replace(/[^0-9]/g, "");
  const strLength = dateString.length;
  if (strLength < 8) return null;
  const year = parseInt(dateString.substring(0, 4));
  const month = parseInt(dateString.substring(4, 6)) - 1; // 월은 0부터 시작하므로 1을 빼줍니다.
  const day = parseInt(dateString.substring(6, 8));
  const hour = strLength > 9 ? parseInt(dateString.substring(8, 10)) : 0;
  const minute = strLength > 11 ? parseInt(dateString.substring(10, 12)) : 0;
  const second = strLength > 13 ? parseInt(dateString.substring(12, 14)) : 0;

  return new Date(year, month, day, hour, minute, second);
}

export function nowDate() {
  // 1. 현재 시간
  const curr = new Date();

  // 2. UTC 시간 계산
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;

  // 3. UTC to KST (UTC + 9시간)
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

  // 4. Timezone 적용
  const now = new Date(utc + KR_TIME_DIFF);
  const year = now.getFullYear();
  const month = now.getMonth() + 1 + "";
  const date = now.getDate() + "";
  const hour = now.getHours() + "";
  const min = now.getMinutes() + "";
  const sec = now.getSeconds() + "";
  const today = `${year}-${month.padStart(2, "0")}-${date.padStart(
    2,
    "0"
  )} ${hour.padStart(2, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;

  return today;
}

export function fromAtDate(str) {
  const fromAt = strToDate(str);
  return new Date(fromAt.setHours(fromAt.getHours()));
}

export function toAtDate(str) {
  const toAt = strToDate(str);
  return new Date(toAt.setHours(toAt.getHours() + 24));
}
