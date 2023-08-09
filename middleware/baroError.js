export default function errorCase( errCode ) {
    switch(errCode) {
        case -24005: return { error: { code: -24005, message: "사업자번호와 아이디가 맞지 않습니다."}};
        case -51007: return { error: { code: -51007, message: "테스트베드는 최대 2개까지만 등록할 수 있습니다."}};
        default: return { error: { code: errCode, message: "https://dev.barobill.co.kr/docs/references/바로빌-API-오류코드"}}; break;
    }
}



