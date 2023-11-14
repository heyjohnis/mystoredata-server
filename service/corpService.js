import { config } from "../config.js";
import { BaroService } from "../utils/baroService.js";
const baraServiceName = "TI";
const testService = new BaroService(baraServiceName, "TEST");
const opsService = new BaroService(baraServiceName, "OPS");
let isOps = true;
const certKey = isOps ? opsService.certKey : testService.certKey;
const client = isOps ? await opsService.client() : await testService.client();

export async function checkCorpIsMember(req) {
  const { corpNum } = req.body;
  const result = { TEST: false, OPS: false };
  for (let kind in result) {
    const service = new BaroService(baraServiceName, kind);
    const certKey = service.certKey;
    const client = await service.client();
    const response = await client.CheckCorpIsMemberAsync({
      CERTKEY: certKey,
      CorpNum: corpNum,
      CheckCorpNum: corpNum,
    });
    response[0].CheckCorpIsMemberResult;
    result[kind] = response[0].CheckCorpIsMemberResult > 0;
  }
  return result;
}

export async function registCorp(req) {
  const {
    corpNum,
    corpName,
    ceoName,
    bizType,
    bizClass,
    userName,
    addr1,
    addr2,
    userId,
    mobile,
    email,
  } = req.body;

  const response = await client.RegistCorpAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    CorpName: corpName,
    CEOName: ceoName,
    BizType: bizType,
    BizClass: bizClass,
    PostNum: "",
    Addr1: addr1,
    Addr2: addr2,
    MemberName: userName,
    JuminNum: "",
    ID: userId,
    PWD: config.baro.password,
    Grade: "",
    TEL: mobile,
    HP: mobile,
    Email: email,
  });

  return response[0].RegistCorpResult;
}

// https://dev.barobill.co.kr/docs/references/바로빌-공통-API#UpdateCorpInfo
export async function updateBoroCorpInfo(req) {
  const {
    corpNum,
    corpName,
    ceoName,
    bizType,
    bizClass,
    addr1,
    addr2,
    baroKind,
  } = req.body;

  const service = new BaroService(baraServiceName, baroKind);
  const certKey = service.certKey;
  const client = await service.client();

  const response = await client.UpdateCorpInfoAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    CorpName: corpName,
    CEOName: ceoName,
    BizType: bizType,
    BizClass: bizClass,
    Addr1: addr1,
    Addr2: addr2,
  });

  return response[0].UpdateCorpInfoResult;
}
