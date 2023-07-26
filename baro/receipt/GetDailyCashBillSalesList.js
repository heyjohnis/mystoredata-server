const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CASHBILL.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CASHBILL.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/현금영수증-API#GetDailyCashBillSalesList
	// ---------------------------------------------------------------------------------------------------
	const certKey        = ''
	const corpNum        = ''
	const userId         = ''
	const baseDate       = ''
	const countPerPage   = 10
	const currentPage    = 1
	const orderDirection = 1

	const response = await client.GetDailyCashBillSalesListAsync({
		CERTKEY       : certKey,
		CorpNum       : corpNum,
		UserID        : userId,
		BaseDate      : baseDate,
		CountPerPage  : countPerPage,
		CurrentPage   : currentPage,
		OrderDirection: orderDirection,
	})

	const result = response[0].GetDailyCashBillSalesListResult

	if (result.CurrentPage < 0) { // 호출 실패
		console.log(result.CurrentPage)
	} else { // 호출 성공
		console.log(result.CurrentPage)
		console.log(result.CountPerPage)
		console.log(result.MaxPageNum)
		console.log(result.MaxIndex)

		const simpleCashbills = !result.SimpleCashBillList ? [] : result.SimpleCashBillList.SimpleCashBill

		for (const simpleCashbill of simpleCashbills) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(simpleCashbill)
		}
	}

})()
