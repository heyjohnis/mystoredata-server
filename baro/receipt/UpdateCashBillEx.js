const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CASHBILL.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CASHBILL.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/현금영수증-API#UpdateCashBillEx
	// ---------------------------------------------------------------------------------------------------
	const certKey  = ''
	const userId   = ''
	const cashBill = {
		MgtKey              : '',
		FranchiseCorpNum    : '',
		FranchiseMemberID   : '',
		FranchiseCorpName   : '',
		FranchiseCEOName    : '',
		FranchiseAddr       : '',
		FranchiseTel        : '',
		IdentityNum         : '',
		HP                  : '',
		Fax                 : '',
		Email               : '',
		TradeDate           : '',
		TradeType           : '',
		TradeUsage          : '',
		TradeDeductionType  : '',
		TradeMethod         : '',
		ItemName            : '',
		Amount              : '',
		Tax                 : '',
		ServiceCharge       : '',
		CancelType          : '',
		CancelNTSConfirmNum : '',
		CancelNTSConfirmDate: '',
	}

	const response = await client.UpdateCashBillExAsync({
		CERTKEY: certKey,
		CorpNum: cashBill.FranchiseCorpNum,
		UserID : userId,
		Invoice: cashBill,
	})

	const result = response[0].UpdateCashBillExResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
