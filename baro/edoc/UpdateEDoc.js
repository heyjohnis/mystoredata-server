const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/EDOC.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/EDOC.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/전자문서-API#UpdateEDoc
	// ---------------------------------------------------------------------------------------------------
	const certKey = ''
	const edoc    = {
		MgtKey            : '',
		UserID            : '',
		FormKey           : '',
		EDocInvoiceType   : 1,
		CertYN            : false,
		AutoAcceptYN      : false,
		BusinessLicenseYN : false,
		BankBookYN        : false,
		WriteDate         : '',
		TaxType           : 1,
		PurposeType       : 2,
		AmountTotal       : '',
		TaxTotal          : '',
		TotalAmount       : '',
		Remark1           : '',
		Remark2           : '',
		Remark3           : '',
		SerialNum         : '',
		InvoicerParty     : {
			CorpNum    : '',
			TaxRegID   : '',
			CorpName   : '',
			CEOName    : '',
			Addr       : '',
			BizClass   : '',
			BizType    : '',
			ContactName: '',
			DeptName   : '',
			TEL        : '',
			HP         : '',
			FAX        : '',
			Email      : '',
		},
		InvoiceeParty     : {
			CorpNum    : '',
			TaxRegID   : '',
			CorpName   : '',
			CEOName    : '',
			Addr       : '',
			BizClass   : '',
			BizType    : '',
			ContactName: '',
			DeptName   : '',
			TEL        : '',
			HP         : '',
			FAX        : '',
			Email      : '',
		},
		EDocProperties    : {
			EDocProperty: [
				{
					Name : '',
					Value: ''
				},
				{
					Name : '',
					Value: ''
				},
				{
					Name : '',
					Value: ''
				},
			]
		},
		EDocTradeLineItems: {
			EDocTradeLineItem: [
				{
					PurchaseExpiry: '',
					Name          : '',
					Information   : '',
					ChargeableUnit: '',
					UnitPrice     : '',
					Amount        : '',
					Tax           : '',
					Description   : '',
					Temp1         : '',
					Temp2         : '',
					Temp3         : '',
					Temp4         : '',
					Temp5         : ''
				},
				{
					PurchaseExpiry: '',
					Name          : '',
					Information   : '',
					ChargeableUnit: '',
					UnitPrice     : '',
					Amount        : '',
					Tax           : '',
					Description   : '',
					Temp1         : '',
					Temp2         : '',
					Temp3         : '',
					Temp4         : '',
					Temp5         : ''
				},
			]
		},
	}

	const response = await client.UpdateEDocAsync({
		CERTKEY: certKey,
		CorpNum: edoc.InvoicerParty.CorpNum,
		UserID : edoc.UserID,
		Invoice: edoc,
	})

	const result = response[0].UpdateEDocResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
