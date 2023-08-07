import soap from 'soap'; // https://www.npmjs.com/package/soap
import { config } from '../config.js';

const client = await soap.createClientAsync('https://testws.baroservice.com/CARD.asmx?WSDL') // 테스트서버
// const client = await soap.createClientAsync("https://ws.baroservice.com/CARD.asmx?WSDL") // 운영서버


export async function getDailyCardLog (req) {

	const certKey        = config.baro.certKey
	const { corpNum, id, cardNum, baseDate } = req.body;
	const countPerPage   = 10
	const currentPage    = 1
	const orderDirection = 1

	const response = await client.GetDailyCardLogEx2Async({
		CERTKEY       : certKey,
		CorpNum       : corpNum,
		ID            : id,
		CardNum       : cardNum,
		BaseDate      : baseDate,
		CountPerPage  : countPerPage,
		CurrentPage   : currentPage,
		OrderDirection: orderDirection,
	})

	const result = response[0].GetDailyCardLogEx2Result

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
}

export async function regCard (req, res) {

	const { 
		cardCompany,
		cardType,
		cardNum,
		webId,
		webPwd,
		corpNum
	} = req.body;

	const certKey     = config.baro.certKey
	const alias       = ''
	const usage       = ''

	const response = await client.RegistCardAsync({
		CERTKEY    : certKey,
		CorpNum    : corpNum,
		CardCompany: cardCompany,
		CardType   : cardType,
		CardNum    : cardNum,
		WebId      : webId,
		WebPwd     : webPwd,
		Alias      : alias,
		Usage      : usage,
	})

	const result = response[0].RegistCardResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}
}

export async function stopCard ( req, res ) {

	const { cardNum, corpNum } = req.body;

	const response = await client.StopCardAsync({
		CERTKEY: config.baro.certKey,
		CorpNum: corpNum,
		CardNum: cardNum,
	})

	const result = response[0].StopCardResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}
}

export async function getCardList ( req, res ) {

	const certKey   = config.baro.certKey
	const corpNum   = req.query.corpNum;
	const availOnly = 1

	const response = await client.GetCardExAsync({
		CERTKEY  : certKey,
		CorpNum  : corpNum,
		AvailOnly: availOnly,
	})

	const result = response[0].GetCardExResult

	if (result && /^-[0-9]{5}$/.test(result.Card[0].CardNum)) { // 호출 실패
		console.log(result.Card[0].CardNum)
	} else { // 호출 성공
		const cards = !result ? [] : result.Card

		for (const card of cards) {
			// 필드정보는 레퍼런스를 참고해주세요.
			console.log(card)
		}
	}
}

export async function updateCardInfo ( req, res ) {
	
	const { cardNum, webId, webPwd, corpNum} = req.body;

	const response = await client.UpdateCardAsync({
		CERTKEY: config.baro.certKey,
		CorpNum: corpNum,
		CardNum: cardNum,
		WebId  : webId,
		WebPwd : webPwd,
		Alias  : "",
		Usage  : "",
	})

	const result = response[0].UpdateCardResult

	if (result < 0) { // 호출 실패
		console.log(result);
	} else { // 호출 성공
		console.log(result);
	}
}