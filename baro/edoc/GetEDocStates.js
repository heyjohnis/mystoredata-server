const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/EDOC.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/EDOC.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/전자문서-API#GetEDocStates
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const userId     = ''
	const mgtKeyList = ['', '', '']

	const response = await client.GetEDocStatesAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		UserID    : userId,
		MgtKeyList: {'string': mgtKeyList},
	})

	const result = response[0].GetEDocStatesResult

	if (result.EDocState.length === 1 && result.EDocState[0].MgtKey === '' && result.EDocState[0].BarobillState < 0) { // 호출 실패
		console.log(result.EDocState[0].BarobillState)
	} else { // 호출 성공
		for (const state of result.EDocState) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(state)
		}
	}

})()
