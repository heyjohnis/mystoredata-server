const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#GetLinkedDocs
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const docType = 1
	const mgtKey  = ''

	const response = await client.GetLinkedDocsAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		DocType: docType,
		MgtKey : mgtKey,
	})

	const result = response[0].GetLinkedDocsResult

	if (result && result.LinkedDoc[0].DocType < 0) { // 호출 실패
		console.log(result.LinkedDoc[0].DocType)
	} else { // 호출 성공
		const linkedDocs = !result ? [] : result.LinkedDoc

		for (const linkedDoc of linkedDocs) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(linkedDoc)
		}
	}

})()
