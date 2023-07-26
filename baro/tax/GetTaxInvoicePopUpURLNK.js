const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#GetTaxInvoicePopUpURLNK
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const ntsSendKey = ''
	const id         = ''
	const pwd        = ''

	const response = await client.GetTaxInvoicePopUpURLNKAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		NTSSendKey: ntsSendKey,
		ID        : id,
		PWD       : pwd,
	})

	const result = response[0].GetTaxInvoicePopUpURLNKResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
