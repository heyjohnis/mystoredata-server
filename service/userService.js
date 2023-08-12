import soap from 'soap';
import { config } from '../config.js';

const certKey = config.baro.certKey

const client = await soap.createClientAsync('https://testws.baroservice.com/TI.asmx?WSDL') // 테스트서버
// const client = await soap.createClientAsync("https://ws.baroservice.com/TI.asmx?WSDL") // 운영서버


export async function checkCorpIsMember (req) {

    const { corpNum, userId, tel, email, name } = req.body;

	const response = await client.AddUserToCorpAsync({
		CERTKEY   : certKey,
		CorpNum   : corpNum,
		MemberName: name,
		ID        : userId,
		PWD       : '12345678',
		Grade     : '',
		TEL       : tel,
		Email     : email,
	})

	return response[0].AddUserToCorpResult
}
