const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#SendInvoiceSMS
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const senderId   = ''
	const mgtKey     = ''
	const fromNumber = ''
	const toNumber   = ''
	const contents   = ''

	const response = await client.SendInvoiceSMSAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		SenderID  : senderId,
		MgtKey    : mgtKey,
		FromNumber: fromNumber,
		ToNumber  : toNumber,
		Contents  : contents,
	})

	const result = response[0].SendInvoiceSMSResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
