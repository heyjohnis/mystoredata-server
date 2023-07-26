const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CORPSTATE.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CORPSTATE.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/사업자등록-상태조회-API#GetCorpStates
	// ---------------------------------------------------------------------------------------------------
	const certKey          = ''
	const corpNum          = ''
	const checkCorpNumList = ['', '', '']

	const response = await client.GetCorpStatesAsync({
		CERTKEY         : certKey,
		CorpNum         : corpNum,
		CheckCorpNumList: {'string': checkCorpNumList},
	})

	const result = response[0].GetCorpStatesResult.CorpState

	if (result.length === 1 && result[0].CorpNum === '' && result[0].State < 0) { // 호출 실패
		console.log(result[0].State)
	} else { // 호출 성공
		for (const corpState of result) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(corpState)
		}
	}

})()
