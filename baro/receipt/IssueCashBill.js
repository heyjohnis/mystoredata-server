const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CASHBILL.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CASHBILL.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/현금영수증-API#IssueCashBill
	// ---------------------------------------------------------------------------------------------------
	const certKey   = ''
	const corpNum   = ''
	const userId    = ''
	const mgtKey    = ''
	const smsSendYN = false
	const mailTitle = ''

	const response = await client.IssueCashBillAsync({
		CERTKEY  : certKey,
		CorpNum  : corpNum,
		UserID   : userId,
		MgtKey   : mgtKey,
		SMSSendYN: smsSendYN,
		MailTitle: mailTitle,
	})

	const result = response[0].IssueCashBillResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
