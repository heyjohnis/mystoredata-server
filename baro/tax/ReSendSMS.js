const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#ReSendSMS
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const senderId   = ''
	const fromNumber = ''
	const toCorpNum  = ''
	const toName     = ''
	const toNumber   = ''
	const contents   = ''

	const response = await client.ReSendSMSAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		SenderID  : senderId,
		FromNumber: fromNumber,
		ToCorpNum : toCorpNum,
		ToName    : toName,
		ToNumber  : toNumber,
		Contents  : contents,
	})

	const result = response[0].ReSendSMSResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
