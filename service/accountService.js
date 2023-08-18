import soap from 'soap';
import { config } from '../config.js';
import * as accountData from '../data/accountData.js';
import * as accountLogData from '../data/accountLogData.js';

const certKey = config.baro.certKey;
// const client = await soap.createClientAsync('https://testws.baroservice.com/BANKACCOUNT.asmx?WSDL') // 테스트서버
const client = await soap.createClientAsync("https://ws.baroservice.com/BANKACCOUNT.asmx?WSDL") // 운영서버


// 계좌조회 : https://dev.barobill.co.kr/docs/references/계좌조회-API#GetBankAccountEx
export async function getAccounts ( req ) {

	const { accounts } = await accountData.getAccountList( req._id );
	console.log(accounts);
	
	const availOnly = 1

	const response = await client.GetBankAccountExAsync({
		CERTKEY  : certKey,
		CorpNum  : req.corpNum,
		AvailOnly: availOnly,
	});

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

	const { bank, bankAccountType, bankAccountNum, bankAccountPwd, webId, webPwd } = req.body;
	const collectCycle    = 'MINUTE10'
	const corpNum = req.body.corpNum || req.corpNum;

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
		IdentityNum    : bankAccountType === 'C' ? corpNum : '',
		Alias          : '',
		Usage          : '',
	})
	
	return response[0].RegistBankAccountResult;

	const result = await accountData.regAccount(user, newAccount);
	console.log("result: ", code, result);
	return code;
	// const response2 = await client.ReRegistBankAccountAsync({
	// 	CERTKEY       : certKey,
	// 	CorpNum  	  : req.corpNum,
	// 	BankAccountNum: bankAccountNum,
	// })

	// console.log("response[0].ReRegistBankAccountResult: ", response2[0].ReRegistBankAccountResult);

	// const response3 = await client.CancelStopBankAccountAsync({
	// 	CERTKEY       : certKey,
	// 	CorpNum       : req.corpNum,
	// 	BankAccountNum: bankAccountNum,
	// })

	// console.log("response3[0].CancelStopBankAccountResult: ", response3[0].CancelStopBankAccountResult);

}



export async function regAcountLog (req) {
	const { bankAccountNum, baseMonth } = req.body;
	const countPerPage   = 100
	const currentPage    = 1
	const orderDirection = 1

	const response = await client.GetMonthlyBankAccountLogExAsync({
		CERTKEY       : certKey,
		CorpNum       : req.corpNum,
		ID            : req.userId,
		BankAccountNum: bankAccountNum,
		BaseMonth     : '202308',
		CountPerPage  : countPerPage, 
		CurrentPage   : currentPage,
		OrderDirection: orderDirection,
	})

	const result = response[0].GetMonthlyBankAccountLogExResult;
	console.log("result: ", result);
	if (result.CurrentPage < 0) { // 호출 실패
        return result.CurrentPage;
	} else { // 호출 성공
		// console.log(result.CurrentPage)
		// console.log(result.CountPerPage)
		// console.log(result.MaxPageNum)
		// console.log(result.MaxIndex)
		const account = await accountData.getAccount(bankAccountNum);
		const logs = !result.BankAccountLogList ? [] : result.BankAccountLogList.BankAccountLogEx;

		for(let i = 0; i < logs.length; i++) {
			await accountLogData.regAccountLog({
				...logs[i], 
				user: account.user, 
				bank: account.bank, 	
				CorpName: account.corpName
			});
		}
		return logs.length + 1;
	}
}

export async function deleteAccount ( req ) {

	const { bankAccountNum } = req.body;

	const response = await client.StopBankAccountAsync({
		CERTKEY       : certKey,
		CorpNum       : req.corpNum,
		BankAccountNum: bankAccountNum,
	});
	const resultCode = response[0].StopBankAccountResult
	const result = await accountData.deleteAccout(req._id, bankAccountNum );
	console.log("delete account: ", result);

	if (resultCode < 0) { // 호출 실패
		return resultCode;
	} else { // 호출 성공
		
	}
}