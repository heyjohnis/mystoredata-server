const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CARD.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CARD.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카드조회-API#CancelStopCard
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const cardNum = ''

	const response = await client.CancelStopCardAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		CardNum: cardNum,
	})

	const result = response[0].CancelStopCardResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
