import soap from 'soap'; // https://www.npmjs.com/package/soap
import { config } from '../../config.js';

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/BANKACCOUNT.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/BANKACCOUNT.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/계좌조회-API#GetBankAccountEx
	// ---------------------------------------------------------------------------------------------------
	const certKey   = config.baro.certKey
	const corpNum   = config.baro.corpNum
	const availOnly = 1

	const response = await client.GetBankAccountExAsync({
		CERTKEY  : certKey,
		CorpNum  : corpNum,
		AvailOnly: availOnly,
	})

	const result = response[0].GetBankAccountExResult

	if (result && /^-[0-9]{5}$/.test(result.BankAccount[0].BankAccountNum)) { // 호출 실패
		console.log(result.BankAccount[0].BankAccountNum)
	} else { // 호출 성공
		const bankAccounts = !result ? [] : result.BankAccount

		for (const bankAccount of bankAccounts) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(bankAccount)
		}
	}

})()
