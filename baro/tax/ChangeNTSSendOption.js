const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#ChangeNTSSendOption
	// ---------------------------------------------------------------------------------------------------
	const certKey       = ''
	const corpNum       = ''
	const id            = ''
	const ntsSendOption = {
		TaxationOption           : 1,
		TaxationAddTaxAllowYN    : 0,
		TaxExemptionOption       : 1,
		TaxExemptionAddTaxAllowYN: 0
	}

	const response = await client.ChangeNTSSendOptionAsync({
		CERTKEY      : certKey,
		CorpNum      : corpNum,
		ID           : id,
		NTSSendOption: ntsSendOption,
	})

	const result = response[0].ChangeNTSSendOptionResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
