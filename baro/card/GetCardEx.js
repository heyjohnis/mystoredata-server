import soap from 'soap'; // https://www.npmjs.com/package/soap
import { config } from '../../config.js';

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CARD.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CARD.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카드조회-API#GetCardEx
	// ---------------------------------------------------------------------------------------------------
	const certKey   = config.baro.certKey
	const corpNum   = config.baro.corpNumnode
	const availOnly = 1

	const response = await client.GetCardExAsync({
		CERTKEY  : certKey,
		CorpNum  : corpNum,
		AvailOnly: availOnly,
	})

	const result = response[0].GetCardExResult

	if (result && /^-[0-9]{5}$/.test(result.Card[0].CardNum)) { // 호출 실패
		console.log(result.Card[0].CardNum)
	} else { // 호출 성공
		const cards = !result ? [] : result.Card

		for (const card of cards) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(card)
		}
	}


})()
