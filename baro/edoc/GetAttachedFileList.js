const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/EDOC.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/EDOC.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/전자문서-API#GetAttachedFileList
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const userId  = ''
	const mgtKey  = ''

	const response = await client.GetAttachedFileListAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		UserID : userId,
		MgtKey : mgtKey,
	})

	const result = response[0].GetAttachedFileListResult

	if (result && result.AttachedFile[0].FileIndex < 0) { // 호출 실패
		console.log(result.AttachedFile[0].FileIndex)
	} else { // 호출 성공
		const attachedFiles = !result ? [] : result.AttachedFile

		for (const attachedFile of attachedFiles) {
			console.log(attachedFile)
		}
	}

})()
