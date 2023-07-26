const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/Kakaotalk.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/Kakaotalk.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카카오톡전송-API#SendFTKakaotalks
	// ---------------------------------------------------------------------------------------------------
	const certKey           = ''
	const corpNum           = ''
	const senderId          = ''
	const channelId         = ''
	const sendDT            = ''
	const adYN              = false
	const smsReply          = ''
	const smsSenderNum      = ''
	const kakaotalkMessages = [
		{
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
		},
		{
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
		},
	]

	const response = await client.SendFTKakaotalksAsync({
		CERTKEY          : certKey,
		CorpNum          : corpNum,
		SenderID         : senderId,
		ChannelId        : channelId,
		SendDT           : sendDT,
		AdYN             : adYN,
		SmsReply         : smsReply,
		SmsSenderNum     : smsSenderNum,
		KakaotalkMessages: {'KakaotalkFTMessage': kakaotalkMessages},
	})

	const result = response[0].SendFTKakaotalksResult.string

	if (/^-[0-9]{5}$/.test(result[0])) { // 호출 실패
		console.log(result[0])
	} else { // 호출 성공
		for (const sendKey of result) {
			console.log(sendKey)
		}
	}

})()
