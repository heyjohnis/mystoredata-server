const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/바로빌-공통-API#GetSMSFromNumbers
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''

	const response = await client.GetSMSFromNumbersAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
	})

	const result = response[0].GetSMSFromNumbersResult

	if (result && /^-[0-9]{5}$/.test(result.FromNumber[0].Number)) { // 호출 실패
		console.log(result.FromNumber[0].Number)
	} else { // 호출 성공
		const fromNumbers = !result ? [] : result.FromNumber

		for (const fromNumber of fromNumbers) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(fromNumber)
		}
	}

})()

