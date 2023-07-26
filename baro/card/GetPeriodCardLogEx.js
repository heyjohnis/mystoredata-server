const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CARD.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CARD.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/카드조회-API#GetPeriodCardLogEx
	// ---------------------------------------------------------------------------------------------------
	const certKey        = ''
	const corpNum        = ''
	const id             = ''
	const cardNum        = ''
	const startDate      = ''
	const endDate        = ''
	const countPerPage   = 10
	const currentPage    = 1
	const orderDirection = 1

	const response = await client.GetPeriodCardLogExAsync({
		CERTKEY       : certKey,
		CorpNum       : corpNum,
		ID            : id,
		CardNum       : cardNum,
		StartDate     : startDate,
		EndDate       : endDate,
		CountPerPage  : countPerPage,
		CurrentPage   : currentPage,
		OrderDirection: orderDirection,
	})

	const result = response[0].GetPeriodCardLogExResult

	if (result.CurrentPage < 0) { // 호출 실패
		console.log(result.CurrentPage)
	} else { // 호출 성공
		console.log(result.CurrentPage)
		console.log(result.CountPerPage)
		console.log(result.MaxPageNum)
		console.log(result.MaxIndex)

		const cardLogs = !result.CardLogList ? [] : result.CardLogList.CardLogEx

		for (const cardLog of cardLogs) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(cardLog)
		}
	}

})()
