const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/바로빌-공통-API#GetBaroBillURL
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const id      = ''
	const pwd     = ''
	const togo    = ''

	const response = await client.GetBaroBillURLAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		ID     : id,
		PWD    : pwd,
		TOGO   : togo,
	})

	const result = response[0].GetBaroBillURLResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()

