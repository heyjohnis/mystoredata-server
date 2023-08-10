import soap from 'soap';
import { config } from '../config.js';
import * as data from '../data/userData.js';

const certKey = config.baro.certKey;
const client = await soap.createClientAsync('https://testws.baroservice.com/BANKACCOUNT.asmx?WSDL') // 테스트서버
// const client = await soap.createClientAsync("https://ws.baroservice.com/BANKACCOUNT.asmx?WSDL") // 운영서버


// 계좌조회 : https://dev.barobill.co.kr/docs/references/계좌조회-API#GetBankAccountEx
export async function getAccounts () {

	const corpNum   = config.baro.corpNum
	const availOnly = 1

	const response = await client.GetBankAccountExAsync({
		CERTKEY  : certKey,
		CorpNum  : corpNum,
		AvailOnly: availOnly,
	})

	const result = response[0].GetBankAccountExResult

	if (result && /^-[0-9]{5}$/.test(result.BankAccount[0].BankAccountNum)) { // 호출 실패
		console.log(result.BankAccount[0].BankAccountNum)
	} else { // 호출 성공
		const bankAccounts = !result ? [] : result.BankAccount
		for (const bankAccount of bankAccounts) {
			console.log(bankAccount)
		}
        return bankAccounts;
	}
}

export async function regUserAccount ( req ) {

	const { corpNum, bank, bankAccountType, bankAccountNum, bankAccountPwd} = req.body;
	const collectCycle    = 'MINUTE10'
	const webId           = ''
	const webPwd          = ''
	const identityNum     = corpNum
	const alias           = ''
	const usage           = ''

	const newAccount =  { corpNum, bank, bankAccountType, bankAccountNum, bankAccountPwd };

	const result = await data.regAccount(req._id, newAccount);

	const response = await client.RegistBankAccountAsync({
		CERTKEY        : certKey,
		CorpNum        : corpNum,
		CollectCycle   : collectCycle,
		Bank           : bank,
		BankAccountType: bankAccountType,
		BankAccountNum : bankAccountNum,
		BankAccountPwd : bankAccountPwd,
		WebId          : webId,
		WebPwd         : webPwd,
		IdentityNum    : identityNum,
		Alias          : alias,
		Usage          : usage,
	})

	return response[0].RegistBankAccountResult
}

export async function getAccountLog (req) {
	console.log("body: ", req.body)
	const { user, corpNum, id, bankAccountNum, baseMonth } = req.body;
	const countPerPage   = 100
	const currentPage    = 1
	const orderDirection = 1

	const response = await client.GetMonthlyBankAccountLogExAsync({
		CERTKEY       : certKey,
		CorpNum       : corpNum,
		ID            : id,
		BankAccountNum: bankAccountNum,
		BaseMonth     : baseMonth,
		CountPerPage  : countPerPage, 
		CurrentPage   : currentPage,
		OrderDirection: orderDirection,
	})

	const result = response[0].GetMonthlyBankAccountLogExResult 
	if (result.CurrentPage < 0) { // 호출 실패
        return {error: result.CurrentPage}
	} else { // 호출 성공
		console.log(result.CurrentPage)
		console.log(result.CountPerPage)
		console.log(result.MaxPageNum)
		console.log(result.MaxIndex)

		const bankAccountLogs = !result.BankAccountLogList ? [] : result.BankAccountLogList.BankAccountLogEx
		console.log(bankAccountLogs)
		for (const bankAccountLog of bankAccountLogs) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(bankAccountLog)
		}
	}
}

export async function deleteAccount ( req ) {

	const { corpNum, bankAccountNum } = req.body;

	const response = await client.StopBankAccountAsync({
		CERTKEY       : certKey,
		CorpNum       : corpNum,
		BankAccountNum: bankAccountNum,
	});
	const resultCode = response[0].StopBankAccountResult
	const result = await data.deleteAccout(req._id, bankAccountNum);
	console.log("delete account: ", result);
	
	if (resultCode < 0) { // 호출 실패
		return resultCode;
	} else { // 호출 성공
		
	}
}