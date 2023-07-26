const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/EDOC.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/EDOC.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/전자문서-API#IssueEDoc
	// ---------------------------------------------------------------------------------------------------
	const certKey   = ''
	const corpNum   = ''
	const userId    = ''
	const mgtKey    = ''
	const smsSendYN = false
	const memo      = ''
	const mailTitle = ''

	const response = await client.IssueEDocAsync({
		CERTKEY  : certKey,
		CorpNum  : corpNum,
		UserID   : userId,
		MgtKey   : mgtKey,
		SMSSendYN: smsSendYN,
		Memo     : memo,
		MailTitle: mailTitle,
	})

	const result = response[0].IssueEDocResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
