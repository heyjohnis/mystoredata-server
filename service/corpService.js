import { config } from "../config.js";
import { BaroService } from "../utils/baroService.js";
const baraServiceName = "TI";

export async function checkCorpIsMember(req) {
  const { corpNum } = req.body;
  const result = { TEST: false, OPS: false };
  for (let kind in result) {
    const baroSvc = new BaroService(baraServiceName, kind);
    const certKey = baroSvc.certKey;
    const client = await baroSvc.client();
    const response = await client.CheckCorpIsMemberAsync({
      CERTKEY: certKey,
      CorpNum: corpNum,
      CheckCorpNum: corpNum,
    });
    response[0].CheckCorpIsMemberResult;
    console.log(
      "CheckCorpIsMemberAsync: ",
      response[0].CheckCorpIsMemberResult
    );
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
    baroKind,
  } = req.body;
  const baroSvc = new BaroService(baraServiceName, baroKind);
  const client = await baroSvc.client();
  const response = await client.RegistCorpAsync({
    CERTKEY: baroSvc.certKey,
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
  const baroSvc = new BaroService(baraServiceName, baroKind);
  const client = await baroSvc.client();
  const response = await client.UpdateCorpInfoAsync({
    CERTKEY: baroSvc.certKey,
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
