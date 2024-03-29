import soap from 'soap'; // https://www.npmjs.com/package/soap
import { config } from '../../config.js';

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CARD.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CARD.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카드조회-API#GetMonthlyCardLogEx2
	// ---------------------------------------------------------------------------------------------------
	const certKey        = config.baro.certKey
	const corpNum        = config.baro.corpNum
	const id             = 'BETHELEAN'
	const cardNum        = '9440819003506534'
	const baseMonth      = '202307'
	const countPerPage   = 100
	const currentPage    = 1
	const orderDirection = 1

	const response = await client.GetMonthlyCardLogEx2Async({
		CERTKEY       : certKey,
		CorpNum       : corpNum,
		ID            : id,
		CardNum       : cardNum,
		BaseMonth     : baseMonth,
		CountPerPage  : countPerPage,
		CurrentPage   : currentPage,
		OrderDirection: orderDirection,
	})

	const result = response[0].GetMonthlyCardLogEx2Result

	if (result.CurrentPage < 0) { // 호출 실패
		console.log(result.CurrentPage)
	} else { // 호출 성공
		console.log(result.CurrentPage)
		console.log(result.CountPerPage)
		console.log(result.MaxPageNum)
		console.log(result.MaxIndex)

		const cardLogs = !result.CardLogList ? [] : result.CardLogList.CardLogEx2

		for (const cardLog of cardLogs) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(cardLog)
		}
	}

})()
