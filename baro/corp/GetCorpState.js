const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CORPSTATE.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CORPSTATE.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/사업자등록-상태조회-API#GetCorpState
	// ---------------------------------------------------------------------------------------------------
	const certKey      = ''
	const corpNum      = ''
	const checkCorpNum = ''

	const response = await client.GetCorpStateAsync({
		CERTKEY     : certKey,
		CorpNum     : corpNum,
		CheckCorpNum: checkCorpNum,
	})

	const result = response[0].GetCorpStateResult

	if (result.State < 0) { // 호출 실패
		console.log(result.State);
	} else { // 호출 성공
		// 필드정보는 레퍼런스를 참고해주세요.
		if (result < 0) { // 호출 실패
			console.log(result);
		} else { // 호출 성공
			console.log(result);
		}
	}

})()
