const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#GetTaxInvoiceStatesEX
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const mgtKeyList = ['', '', '']

	const response = await client.GetTaxInvoiceStatesEXAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		MgtKeyList: {'string': mgtKeyList},
	})

	const result = response[0].GetTaxInvoiceStatesEXResult.TaxInvoiceStateEX

	if (result.length === 1 && result[0].MgtKey === '' && result[0].BarobillState < 0) { // 호출 실패
		console.log(result[0].BarobillState)
	} else { // 호출 성공
		for (const state of result) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(state)
		}
	}

})()
