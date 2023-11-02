export function setDepositTransData(transLog) {
  const length =
    (transLog.bankAccountNum.length > 4 ? 4 : transLog.bankAccountNum.length) *
    -1;
  const bankAccountNumShort = transLog.bankAccountNum.slice(length);
  transLog.category = "-" + bankAccountNumShort;
  transLog.categoryName = "보통예금" + bankAccountNumShort;
  transLog.finClassCode = "IN3";
  transLog.finClassName = "나머지(자산-)";
  // 출금의 경우
  if (transLog.transMoney < 0) {
    transLog.finClassCode = "OUT3";
    transLog.finClassName = "나머지(자산+)";
  }
  return transLog;
}
