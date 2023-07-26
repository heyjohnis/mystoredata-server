const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#GetDailyTaxInvoicePurchaseList
	// ---------------------------------------------------------------------------------------------------
	const certKey      = ''
	const corpNum      = ''
	const userId       = ''
	const taxType      = 1
	const dateType     = 1
	const baseDate     = ''
	const countPerPage = 10
	const currentPage  = 1

	const response = await client.GetDailyTaxInvoicePurchaseListAsync({
		CERTKEY     : certKey,
		CorpNum     : corpNum,
		UserID      : userId,
		TaxType     : taxType,
		DateType    : dateType,
		BaseDate    : baseDate,
		CountPerPage: countPerPage,
		CurrentPage : currentPage,
	})

	const result = response[0].GetDailyTaxInvoicePurchaseListResult

	if (result.CurrentPage < 0) { // 호출 실패
		console.log(result.CurrentPage)
	} else { // 호출 성공
		console.log(result.CurrentPage)
		console.log(result.CountPerPage)
		console.log(result.MaxPageNum)
		console.log(result.MaxIndex)

		const simpleTaxInvoices = !result.SimpleTaxInvoiceExList ? [] : result.SimpleTaxInvoiceExList.SimpleTaxInvoiceEx

		for (const simpleTaxInvoice of simpleTaxInvoices) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(simpleTaxInvoice)
		}
	}

})()
