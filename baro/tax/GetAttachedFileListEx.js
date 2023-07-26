const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#GetAttachedFileListEx
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const mgtKey  = ''

	const response = await client.GetAttachedFileListExAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		MgtKey : mgtKey,
	})

	const result = response[0].GetAttachedFileListExResult

	if (result && result.AttachedFileEx[0].FileIndex < 0) { // 호출 실패
		console.log(result.AttachedFileEx[0].FileIndex)
	} else { // 호출 성공
		const attachedFiles = !result ? [] : result.AttachedFileEx

		for (const attachedFile of attachedFiles) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(attachedFile)
		}
	}

})()
