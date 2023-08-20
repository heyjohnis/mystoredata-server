import soap from "soap";
import { config } from "../config.js";

const certKey = config.baro.certKey;

// const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
const client = await soap.createClientAsync(
  "https://ws.baroservice.com/TI.asmx?WSDL"
); // 운영서버

export async function checkCorpIsMember(req) {
  const { corpNum, checkCorpNum } = req.body;

  const response = await client.CheckCorpIsMemberAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    CheckCorpNum: corpNum,
  });

  return response[0].CheckCorpIsMemberResult;
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

  console.log("req.body: ", req.body);
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
    postNum,
    addr1,
    addr2,
  } = req.body;

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
