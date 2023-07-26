const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#GetTaxInvoiceLog
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const mgtKey  = ''

	const response = await client.GetTaxInvoiceLogAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		MgtKey : mgtKey,
	})

	const result = response[0].GetTaxInvoiceLogResult.InvoiceLog

	if (result[0].Seq < 0) { // 호출 실패
		console.log(result[0].Seq)
	} else { // 호출 성공
		for (const log of result) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(log)
		}
	}

})()
