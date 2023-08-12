import soap from 'soap';
import { config } from '../config.js';

const certKey = config.baro.certKey

const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

export async function checkCorpIsMember (req) {

	const corpNum      = config.baro.corpNum
	const checkCorpNum = req.query.checkCorpNum

	const response = await client.CheckCorpIsMemberAsync({
		CERTKEY     : certKey,
		CorpNum     : corpNum,
		CheckCorpNum: checkCorpNum,
	})

	const result = response[0].CheckCorpIsMemberResult

	if (result < 0) { // 호출 실패
		console.log("CheckCorpIsMemberResult: ", result);
	} else { // 호출 성공
		console.log("CheckCorpIsMemberResult: ", result);
	}
}

export async function registCorp (req) {
	
	const { corpNum, corpName, ceoName, bizType, bizClass, 
		addr1, addr2, memberName, id, pwd, tel,  email } = req.body;

	const response = await client.RegistCorpAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		CorpName  : corpName,
		CEOName   : ceoName,
		BizType   : bizType,
		BizClass  : bizClass,
		PostNum   : "",
		Addr1     : addr1,
		Addr2     : addr2,
		MemberName: memberName,
		JuminNum  : "",
		ID        : id,
		PWD       : pwd,
		Grade     : "",
		TEL       : tel,
		HP        : "",
		Email     : email,
	})

	const result = response[0].RegistCorpResult

	if (result < 0) { // 호출 실패
		console.log(result);
		return result
	} else { // 호출 성공
		console.log(result);
		return result
	}
}