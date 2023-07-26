import soap from 'soap'; // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/바로빌-공통-API#RegistCorp
	// ---------------------------------------------------------------------------------------------------
	const certKey    = 'CDA221BC-E57A-41F5-A49A-AE05516FBB23'
	const corpNum    = '6348702350'
	const corpName   = '주식회사 비린'
	const ceoName    = '이혜영'
	const bizType    = '서비스'
	const bizClass   = '프로그래밍'
	const postNum    = ''
	const addr1      = '서울특별시 구로구 가마산로 282'
	const addr2      = '910호(구로동, 대림오피스밸리)'
	const memberName = 'bethelean'
	const id         = 'bethelean'
	const pwd        = 'hj@284804'
	const grade      = ''
	const tel        = '01020070227'
	const hp         = '01020070227'
	const email      = 'bethelean.com@gmail.com'

	const response = await client.RegistCorpAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		CorpName  : corpName,
		CEOName   : ceoName,
		BizType   : bizType,
		BizClass  : bizClass,
		PostNum   : postNum,
		Addr1     : addr1,
		Addr2     : addr2,
		MemberName: memberName,
		ID        : id,
		PWD       : pwd,
		Grade     : grade,
		TEL       : tel,
		HP        : hp,
		Email     : email,
	})

	const result = response[0].RegistCorpResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
