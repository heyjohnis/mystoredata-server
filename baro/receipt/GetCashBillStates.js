const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CASHBILL.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CASHBILL.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/현금영수증-API#GetCashBillStates
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const userId     = ''
	const mgtKeyList = ['', '', '']

	const response = await client.GetCashBillStatesAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		UserID    : userId,
		MgtKeyList: {'string': mgtKeyList},
	})

	const result = response[0].GetCashBillStatesResult.CashBillState

	if (result.length === 1 && result[0].MgtKey === '' && result[0].BarobillState < 0) { // 호출 실패
		console.log(result[0].BarobillState)
	} else { // 호출 성공
		for (const state of result) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(state)
		}
	}

})()
