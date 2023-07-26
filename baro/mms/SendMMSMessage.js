const soap = require('soap'); // https://www.npmjs.com/package/soap
const fs   = require('fs');

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/SMS.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/SMS.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/문자전송-API#SendMMSMessage
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const senderId   = ''
	const fromNumber = ''
	const toName     = ''
	const toNumber   = ''
	const txtSubject = ''
	const txtMessage = ''
	const imageFile  = fs.readFileSync('./테스트용이미지/barobill-logo.jpg', 'base64')
	const sendDT     = ''
	const refKey     = ''

	const response = await client.SendMMSMessageAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		SenderID  : senderId,
		FromNumber: fromNumber,
		ToName    : toName,
		ToNumber  : toNumber,
		TXTSubject: txtSubject,
		TXTMESSAGE: txtMessage,
		ImageFile : imageFile,
		SendDT    : sendDT,
		RefKey    : refKey,
	})

	const result = response[0].SendMMSMessageResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
