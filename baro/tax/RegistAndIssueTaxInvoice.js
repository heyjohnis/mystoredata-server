const soap = require('soap'); // https://www.npmjs.com/package/soap

(async () => {

	const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
	// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버

	// ---------------------------------------------------------------------------------------------------
	// API 레퍼런스 : https://dev.barobill.co.kr/docs/references/세금계산서-API#RegistAndIssueTaxInvoice
	// ---------------------------------------------------------------------------------------------------
	const certKey    = ''
	const taxInvoice = {
		IssueDirection          : 1,
		TaxInvoiceType          : 1,
		ModifyCode              : '',
		TaxType                 : 1,
		TaxCalcType             : 1,
		PurposeType             : 2,
		WriteDate               : '',
		AmountTotal             : '',
		TaxTotal                : '',
		TotalAmount             : '',
		Cash                    : '',
		ChkBill                 : '',
		Note                    : '',
		Credit                  : '',
		Remark1                 : '',
		Remark2                 : '',
		Remark3                 : '',
		Kwon                    : '',
		Ho                      : '',
		SerialNum               : '',
		InvoicerParty           : {
			MgtNum     : '',
			CorpNum    : '',
			TaxRegID   : '',
			CorpName   : '',
			CEOName    : '',
			Addr       : '',
			BizClass   : '',
			BizType    : '',
			ContactID  : '',
			ContactName: '',
			TEL        : '',
			HP         : '',
			Email      : '',
		},
		InvoiceeParty           : {
			MgtNum     : '',
			CorpNum    : '',
			TaxRegID   : '',
			CorpName   : '',
			CEOName    : '',
			Addr       : '',
			BizClass   : '',
			BizType    : '',
			ContactID  : '',
			ContactName: '',
			TEL        : '',
			HP         : '',
			Email      : '',
		},
		BrokerParty             : {
			MgtNum     : '',
			CorpNum    : '',
			TaxRegID   : '',
			CorpName   : '',
			CEOName    : '',
			Addr       : '',
			BizClass   : '',
			BizType    : '',
			ContactID  : '',
			ContactName: '',
			TEL        : '',
			HP         : '',
			Email      : '',
		},
		TaxInvoiceTradeLineItems: {
			TaxInvoiceTradeLineItem: [
				{
					PurchaseExpiry: '',
					Name          : '',
					Information   : '',
					ChargeableUnit: '',
					UnitPrice     : '',
					Amount        : '',
					Tax           : '',
					Description   : '',
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
				},
			]
		},
	}
	const sendSms    = true
	const forceIssue = false
	const mailTitle  = ''

	const response = await client.RegistAndIssueTaxInvoiceAsync({
		CERTKEY   : certKey,
		CorpNum   : taxInvoice.InvoicerParty.CorpNum,
		Invoice   : taxInvoice,
		SendSMS   : sendSms,
		ForceIssue: forceIssue,
		MailTitle : mailTitle,
	})

	const result = response[0].RegistAndIssueTaxInvoiceResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}

})()
