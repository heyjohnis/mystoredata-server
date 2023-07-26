const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CASHBILL.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CASHBILL.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/현금영수증-API#GetCashBillEx
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const userId  = ''
	const mgtKey  = ''

	const response = await client.GetCashBillExAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		UserID : userId,
		MgtKey : mgtKey,
	})

	const result = response[0].GetCashBillExResult

	if (result.TradeType < 0) { // 호출 실패
		console.log(result.TradeType);
	} else { // 호출 성공
		// 필드정보는 레퍼런스를 참고해주세요.
		if (result < 0) { // 호출 실패
			console.log(result);
		} else { // 호출 성공
			console.log(result);
		}
	}

})()
