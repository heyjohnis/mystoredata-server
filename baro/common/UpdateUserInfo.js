const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/바로빌-공통-API#UpdateUserInfo
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const corpNum    = ''
	const id         = ''
	const memberName = ''
	const tel        = ''
	const hp         = ''
	const email      = ''
	const grade      = ''

	const response = await client.UpdateUserInfoAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		ID        : id,
		MemberName: memberName,
		TEL       : tel,
		HP        : hp,
		Email     : email,
		Grade     : grade,
	})

	const result = response[0].UpdateUserInfoResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()

