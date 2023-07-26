const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CASHBILL.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CASHBILL.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/현금영수증-API#GetCashBillLog
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const userId  = ''
	const mgtKey  = ''

	const response = await client.GetCashBillLogAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		UserID : userId,
		MgtKey : mgtKey,
	})

	const result = response[0].GetCashBillLogResult.CashBillLog

	if (result[0].Seq < 0) { // 호출 실패
		console.log(result[0].Seq)
	} else { // 호출 성공
		for (const log of result) {
			console.log(log)
		}
	}

})()
