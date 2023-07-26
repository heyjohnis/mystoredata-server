const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/SMS.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/SMS.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/문자전송-API#GetSMSHistoryURL
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const id      = ''
	const pwd     = ''

	const response = await client.GetSMSHistoryURLAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		ID     : id,
		PWD    : pwd,
	})

	const result = response[0].GetSMSHistoryURLResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
