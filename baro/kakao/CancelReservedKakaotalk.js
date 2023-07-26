const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/Kakaotalk.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/Kakaotalk.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카카오톡전송-API#CancelReservedKakaotalk
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const sendKey = ''

	const response = await client.CancelReservedKakaotalkAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		SendKey: sendKey,
	})

	const result = response[0].CancelReservedKakaotalkResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
