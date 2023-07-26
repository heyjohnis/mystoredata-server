const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/바로빌-공통-API#UpdateCorpInfo
	// ---------------------------------------------------------------------------------------------------
	const certKey  = ''
	const corpNum  = ''
	const corpName = ''
	const ceoName  = ''
	const bizType  = ''
	const bizClass = ''
	const postNum  = ''
	const addr1    = ''
	const addr2    = ''

	const response = await client.UpdateCorpInfoAsync({
		CERTKEY : certKey,
		CorpNum : corpNum,
		CorpName: corpName,
		CEOName : ceoName,
		BizType : bizType,
		BizClass: bizClass,
		PostNum : postNum,
		Addr1   : addr1,
		Addr2   : addr2,
	})

	const result = response[0].UpdateCorpInfoResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()

