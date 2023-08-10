export default function errorCase( errCode ) {
    switch(errCode) {
        case -24005: return { error: { code: -24005, message: "사업자번호와 아이디가 맞지 않습니다."}};
        case -51007: return { error: { code: -51007, message: "테스트베드는 최대 2개까지만 등록할 수 있습니다."}};
        case -10001: return { error: { code: -10001, message: "해당 인증키와 연결된 연계사가 아닙니다."}};
        case -51003: return { error: { code: -51003, message: "이미 해지되었습니다."}};
        default: return { error: { code: errCode, message: "https://dev.barobill.co.kr/docs/references/바로빌-API-오류코드"}}; break;
    }
}



