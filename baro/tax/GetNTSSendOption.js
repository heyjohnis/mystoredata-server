const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#GetNTSSendOption
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''

	const response = await client.GetNTSSendOptionAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
	})

	const result = response[0].GetNTSSendOptionResult

	if (result.TaxationOption < 0) { // 호출 실패
		console.log(result.TaxationOption)
	} else { // 호출 성공
		// 필드정보는 레퍼런스를 참고해주세요.
		if (result < 0) { // 호출 실패
			console.log(result);
		} else { // 호출 성공
			console.log(result);
		}
	}

})()
