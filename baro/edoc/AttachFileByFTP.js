const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/EDOC.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/EDOC.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// https://dev.barobill.co.kr/docs/guides/바로빌-API-개발준비#FTP 를 참고하여 FTP에 파일을 업로드하신 후 API를 실행해주세요.
	// ---------------------------------------------------------------------------------------------------

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/전자문서-API#AttachFileByFTP
	// ---------------------------------------------------------------------------------------------------
	const certKey         = ''
	const corpNum         = ''
	const userId          = ''
	const mgtKey          = ''
	const fileName        = ''
	const displayFileName = ''

	const response = await client.AttachFileByFTPAsync({
		CERTKEY        : certKey,
		CorpNum        : corpNum,
		UserID         : userId,
		MgtKey         : mgtKey,
		FileName       : fileName,
		DisplayFileName: displayFileName,
	})

	const result = response[0].AttachFileByFTPResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
