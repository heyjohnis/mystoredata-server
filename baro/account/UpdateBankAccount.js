const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/BANKACCOUNT.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/BANKACCOUNT.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/계좌조회-API#UpdateBankAccount
	// ---------------------------------------------------------------------------------------------------
	const certKey        = ''
	const corpNum        = ''
	const bankAccountNum = ''
	const bankAccountPwd = ''
	const webId          = ''
	const webPwd         = ''
	const identityNum    = ''
	const alias          = ''
	const usage          = ''

	const response = await client.UpdateBankAccountAsync({
		CERTKEY       : certKey,
		CorpNum       : corpNum,
		BankAccountNum: bankAccountNum,
		BankAccountPwd: bankAccountPwd,
		WebId         : webId,
		WebPwd        : webPwd,
		IdentityNum   : identityNum,
		Alias         : alias,
		Usage         : usage,
	})

	const result = response[0].UpdateBankAccountResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
