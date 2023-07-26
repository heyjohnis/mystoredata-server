import soap from 'soap'; // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/바로빌-공통-API#AddUserToCorp
	// ---------------------------------------------------------------------------------------------------
	const certKey    = 'CDA221BC-E57A-41F5-A49A-AE05516FBB23'
	const corpNum    = '6348702350'
	const memberName = '김희준'
	const id         = 'juni0227'
	const pwd        = 'hj@284804'
	const grade      = ''
	const tel        = '01020070227'
	const hp         = '01020070227'
	const email      = 'juni0227@naver.com'

	const response = await client.AddUserToCorpAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		MemberName: memberName,
		ID        : id,
		PWD       : pwd,
		Grade     : grade,
		TEL       : tel,
		HP        : hp,
		Email     : email,
	})

	const result = response[0].AddUserToCorpResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
