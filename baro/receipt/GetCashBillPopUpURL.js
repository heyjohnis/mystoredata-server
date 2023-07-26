const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/CASHBILL.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/CASHBILL.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/현금영수증-API#GetCashBillPopUpURL
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const corpNum = ''
	const userId  = ''
	const pwd     = ''
	const mgtKey  = ''

	const response = await client.GetCashBillPopUpURLAsync({
		CERTKEY: certKey,
		CorpNum: corpNum,
		UserID : userId,
		PWD    : pwd,
		MgtKey : mgtKey,
	})

	const result = response[0].GetCashBillPopUpURLResult

	if (/^-[0-9]{5}$/.test(result)) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
