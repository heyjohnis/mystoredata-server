import soap from 'soap'; // https://www.npmjs.com/package/soap
import { config } from '../../config.js';
(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CARD.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CARD.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카드조회-API#RegistCard
	// ---------------------------------------------------------------------------------------------------
	const certKey     = config.baro.certKey
	const corpNum     = config.baro.corpNum
	const cardCompany = 'HANA'
	const cardType    = 'C'
	const cardNum     = '9440819003506534'
	const webId       = 'BETHELEAN'
	const webPwd      = 'hj@28480404'
	const alias       = ''
	const usage       = ''

	const response = await client.RegistCardAsync({
		CERTKEY    : certKey,
		CorpNum    : corpNum,
		CardCompany: cardCompany,
		CardType   : cardType,
		CardNum    : cardNum,
		WebId      : webId,
		WebPwd     : webPwd,
		Alias      : alias,
		Usage      : usage,
	})

	const result = response[0].RegistCardResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
