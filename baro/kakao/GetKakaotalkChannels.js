const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/Kakaotalk.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/Kakaotalk.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카카오톡전송-API#GetKakaotalkChannels
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''

	const response = await client.GetKakaotalkChannelsAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
	})

	const result = response[0].GetKakaotalkChannelsResult

	if (result && result.KakaotalkChannel[0].Status < 0) { // 호출 실패
		console.log(result.KakaotalkChannel[0].Status)
	} else { // 호출 성공
		const channels = !result ? [] : result.KakaotalkChannel

		for (const channel of channels) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(channel)
		}
	}

})()
