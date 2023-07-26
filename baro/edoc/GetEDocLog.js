const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/EDOC.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/EDOC.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/전자문서-API#GetEDocLog
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const userId  = ''
	const mgtKey  = ''

	const response = await client.GetEDocLogAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		UserID : userId,
		MgtKey : mgtKey,
	})

	const result = response[0].GetEDocLogResult.InvoiceLog

	if (result[0].Seq < 0) { // 호출 실패
		console.log(result[0].Seq)
	} else { // 호출 성공
		for (const log of result) {
			console.log(log)
		}
	}

})()
