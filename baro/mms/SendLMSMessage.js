const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/SMS.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/SMS.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/문자전송-API#SendLMSMessage
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const senderId   = ''
	const fromNumber = ''
	const toName     = ''
	const toNumber   = ''
	const subject    = ''
	const contents   = ''
	const sendDT     = ''
	const refKey     = ''

	const response = await client.SendLMSMessageAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		SenderID  : senderId,
		FromNumber: fromNumber,
		ToName    : toName,
		ToNumber  : toNumber,
		Subject   : subject,
		Contents  : contents,
		SendDT    : sendDT,
		RefKey    : refKey,
	})

	const result = response[0].SendLMSMessageResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
