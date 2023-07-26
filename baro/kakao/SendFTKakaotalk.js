const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/Kakaotalk.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/Kakaotalk.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카카오톡전송-API#SendFTKakaotalk
	// ---------------------------------------------------------------------------------------------------
	const certKey          = ''
	const corpNum          = ''
	const senderId         = ''
	const channelId        = ''
	const sendDT           = ''
	const adYN             = false
	const smsReply         = ''
	const smsSenderNum     = ''
	const kakaotalkMessage = {
		ReceiverNum : '',
		ReceiverName: '',
		Message     : '',
		SmsSubject  : '',
		SmsMessage  : '',
		Buttons     : {
			KakaotalkButton: [
				{
					Name      : '',
					ButtonType: '',
					Url1      : '',
					Url2      : '',
				},
			]
		},
	}

	const response = await client.SendFTKakaotalkAsync({
		CERTKEY         : certKey,
		CorpNum         : corpNum,
		SenderID        : senderId,
		ChannelId       : channelId,
		SendDT          : sendDT,
		AdYN            : adYN,
		SmsReply        : smsReply,
		SmsSenderNum    : smsSenderNum,
		KakaotalkMessage: kakaotalkMessage,
	})

	const result = response[0].SendFTKakaotalkResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
