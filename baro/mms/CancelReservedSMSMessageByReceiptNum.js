const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/SMS.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/SMS.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/문자전송-API#CancelReservedSMSMessageByReceiptNum
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const receiptNum = ''

	const response = await client.CancelReservedSMSMessageByReceiptNumAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		ReceiptNum: receiptNum,
	})

	const result = response[0].CancelReservedSMSMessageByReceiptNumResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
