const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#RemoveDocLinkage
	// ---------------------------------------------------------------------------------------------------
	const certKey     = ''
	const corpNum     = ''
	const fromDocType = 1
	const fromMgtKey  = ''
	const toDocType   = 1
	const toMgtKey    = ''

	const response = await client.RemoveDocLinkageAsync({
		CERTKEY    : certKey,
		CorpNum    : corpNum,
		FromDocType: fromDocType,
		FromMgtKey : fromMgtKey,
		ToDocType  : toDocType,
		ToMgtKey   : toMgtKey,
	})

	const result = response[0].RemoveDocLinkageResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
