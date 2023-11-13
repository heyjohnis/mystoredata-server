import { BaroService } from "../utils/baroService.js";

const testService = new BaroService("TI", "TEST");
const opsService = new BaroService("TI", "OPS");
let isOps = true;
const certKey = isOps ? opsService.certKey : testService.certKey;
const client = isOps ? await opsService.client() : await testService.client();

export async function getCorpMemberContacts(req) {
  const corpNum = req.corpNum;
  const checkCorpNum = req.corpNum;

  const response = await client.GetCorpMemberContactsAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    CheckCorpNum: checkCorpNum,
  });

  const result = response[0].GetCorpMemberContactsResult.Contact;

  if (/^-[0-9]{5}$/.test(result[0].ContactName)) {
    // 호출 실패
    console.log(result[0].ContactName);
  } else {
    // 호출 성공
    for (const contact of result) {
      // 필드정보는 레퍼런스를 참고해주세요.
      console.log(contact);
    }
  }
}
