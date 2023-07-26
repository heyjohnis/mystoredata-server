const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/Kakaotalk.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/Kakaotalk.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// https://dev.barobill.co.kr/docs/guides/바로빌-API-개발준비#FTP 를 참고하여 FTP에 파일을 업로드하신 후 API를 실행해주세요.
	// ---------------------------------------------------------------------------------------------------

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카카오톡전송-API#SendFWKakaotalk
	// ---------------------------------------------------------------------------------------------------
	const certKey          = ''
	const corpNum          = ''
	const senderId         = ''
	const channelId        = ''
	const sendDT           = ''
	const adYN             = false
	const imageName        = ''
	const imageLink        = ''
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

	const response = await client.SendFWKakaotalkAsync({
		CERTKEY         : certKey,
		CorpNum         : corpNum,
		SenderID        : senderId,
		ChannelId       : channelId,
		SendDT          : sendDT,
		AdYN            : adYN,
		ImageName       : imageName,
		ImageLink       : imageLink,
		SmsReply        : smsReply,
		SmsSenderNum    : smsSenderNum,
		KakaotalkMessage: kakaotalkMessage,
	})

	const result = response[0].SendFWKakaotalkResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
