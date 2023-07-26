const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/Kakaotalk.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/Kakaotalk.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카카오톡전송-API#SendATKakaotalk
	// ---------------------------------------------------------------------------------------------------
	const certKey          = ''
	const corpNum          = ''
	const senderId         = ''
	const templateName     = ''
	const sendDT           = ''
	const smsReply         = ''
	const smsSenderNum     = ''
	const kakaotalkMessage = {
		ReceiverNum : '',
		ReceiverName: '',
		Title       : '',
		Message     : '',
		SmsSubject  : '',
		SmsMessage  : '',
	}

	const response = await client.SendATKakaotalkAsync({
		CERTKEY         : certKey,
		CorpNum         : corpNum,
		SenderID        : senderId,
		TemplateName    : templateName,
		SendDT          : sendDT,
		SmsReply        : smsReply,
		SmsSenderNum    : smsSenderNum,
		KakaotalkMessage: kakaotalkMessage,
	})

	const result = response[0].SendATKakaotalkResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
