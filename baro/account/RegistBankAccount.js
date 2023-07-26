import soap from 'soap'; // https://www.npmjs.com/package/soap
import { config } from '../../config.js';

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/BANKACCOUNT.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/BANKACCOUNT.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/계좌조회-API#RegistBankAccount
	// ---------------------------------------------------------------------------------------------------
	const certKey         = config.baro.certKey
	const corpNum         = config.baro.corpNum
	const collectCycle    = 'MINUTE10'
	const bank            = 'HANA'
	const bankAccountType = 'C'
	const bankAccountNum  = '37691003113404'
	const bankAccountPwd  = '2848'
	const webId           = ''
	const webPwd          = ''
	const identityNum     = config.baro.corpNum
	const alias           = ''
	const usage           = ''

	const response = await client.RegistBankAccountAsync({
		CERTKEY        : certKey,
		CorpNum        : corpNum,
		CollectCycle   : collectCycle,
		Bank           : bank,
		BankAccountType: bankAccountType,
		BankAccountNum : bankAccountNum,
		BankAccountPwd : bankAccountPwd,
		WebId          : webId,
		WebPwd         : webPwd,
		IdentityNum    : identityNum,
		Alias          : alias,
		Usage          : usage,
	})

	const result = response[0].RegistBankAccountResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
