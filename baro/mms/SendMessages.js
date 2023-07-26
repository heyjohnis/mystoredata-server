const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/SMS.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/SMS.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/문자전송-API#SendMessages
	// ---------------------------------------------------------------------------------------------------
	const certKey  = ''
	const corpNum  = ''
	const senderId = ''
	const cutToSMS = true
	const messages = [
		{
			SenderNum   : '',
			ReceiverName: '',
			ReceiverNum : '',
			Message     : '',
			RefKey      : '',
		},
		{
			SenderNum   : '',
			ReceiverName: '',
			ReceiverNum : '',
			Message     : '',
			RefKey      : '',
		}
	]
	const sendDT   = ''

	const response = await client.SendMessagesAsync({
		CERTKEY  : certKey,
		CorpNum  : corpNum,
		SenderID : senderId,
		SendCount: messages.length,
		CutToSMS : cutToSMS,
		Messages : {'XMSMessage': messages},
		SendDT   : sendDT,
	})

	const result = response[0].SendMessagesResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
