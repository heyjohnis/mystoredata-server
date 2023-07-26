const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#IssueTaxInvoiceEx
	// ---------------------------------------------------------------------------------------------------
	const certKey           = ''
	const corpNum           = ''
	const mgtKey            = ''
	const sendSMS           = false
	const smsMessage        = ''
	const forceIssue        = false
	const mailTitle         = ''
	const businessLicenseYN = false
	const bankBookYN        = false

	const response = await client.IssueTaxInvoiceExAsync({
		CERTKEY          : certKey,
		CorpNum          : corpNum,
		MgtKey           : mgtKey,
		SendSMS          : sendSMS,
		SMSMessage       : smsMessage,
		ForceIssue       : forceIssue,
		MailTitle        : mailTitle,
		BusinessLicenseYN: businessLicenseYN,
		BankBookYN       : bankBookYN,
	})

	const result = response[0].IssueTaxInvoiceExResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
