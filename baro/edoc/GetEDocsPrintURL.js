const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/EDOC.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/EDOC.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/전자문서-API#GetEDocsPrintURL
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const userId     = ''
	const pwd        = ''
	const mgtKeyList = ['', '', '']

	const response = await client.GetEDocsPrintURLAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		UserID    : userId,
		PWD       : pwd,
		MgtKeyList: {'string': mgtKeyList},
	})

	const result = response[0].GetEDocsPrintURLResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
