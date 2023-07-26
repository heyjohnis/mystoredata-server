const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/SMS.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/SMS.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// https://dev.barobill.co.kr/docs/guides/바로빌-API-개발준비#FTP 를 참고하여 FTP에 파일을 업로드하신 후 API를 실행해주세요.
	// ---------------------------------------------------------------------------------------------------

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/문자전송-API#SendMMSMessageFromFTP
	// ---------------------------------------------------------------------------------------------------
	const certKey       = ''
	const corpNum       = ''
	const senderId      = ''
	const fromNumber    = ''
	const toName        = ''
	const toNumber      = ''
	const txtSubject    = ''
	const txtMessage    = ''
	const imageFileName = ''
	const sendDT        = ''
	const refKey        = ''

	const response = await client.SendMMSMessageFromFTPAsync({
		CERTKEY      : certKey,
		CorpNum      : corpNum,
		SenderID     : senderId,
		FromNumber   : fromNumber,
		ToName       : toName,
		ToNumber     : toNumber,
		TXTSubject   : txtSubject,
		TXTMESSAGE   : txtMessage,
		ImageFileName: imageFileName,
		SendDT       : sendDT,
		RefKey       : refKey,
	})

	const result = response[0].SendMMSMessageFromFTPResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
