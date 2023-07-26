const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/바로빌-공통-API#CheckCorpIsMember
	// ---------------------------------------------------------------------------------------------------
	const certKey      = ''
	const corpNum      = ''
	const checkCorpNum = ''

	const response = await client.CheckCorpIsMemberAsync({
		CERTKEY     : certKey,
		CorpNum     : corpNum,
		CheckCorpNum: checkCorpNum,
	})

	const result = response[0].CheckCorpIsMemberResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()

