const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/Kakaotalk.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/Kakaotalk.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카카오톡전송-API#GetKakaotalkTemplates
	// ---------------------------------------------------------------------------------------------------
	const certKey   = ''
	const corpNum   = ''
	const channelId = ''

	const response = await client.GetKakaotalkTemplatesAsync({
		CERTKEY  : certKey,
		CorpNum  : corpNum,
		ChannelId: channelId,
	})

	const result = response[0].GetKakaotalkTemplatesResult

	if (result && result.KakaotalkTemplate[0].Status < 0) { // 호출 실패
		console.log(result.KakaotalkTemplate[0].Status)
	} else { // 호출 성공
		const templates = !result ? [] : result.KakaotalkTemplate

		for (const template of templates) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(template)
		}
	}

})()

