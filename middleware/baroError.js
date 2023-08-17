export default function errorCase( errCode ) {
    switch(errCode) {
        case -10000: return { error: { code: -10000, message: "알 수 없는 오류 발생. API 호출 중 서버오류가 발생한 경우입니다. 바로빌로 문의바랍니다."}};
        case -10003: return { error: { code: -10003, message: "연동서비스가 점검 중입니다."}};
        case -10004: return { error: { code: -10004, message: "해당 기능은 더 이상 사용되지 않습니다."}};
        case -10007: return { error: { code: -10007, message: "해당 기능을 사용할 수 없습니다."}};
        case -10005: return { error: { code: -10005, message: "최대 100건까지만 사용하실 수 있습니다."}};
        case -10006: return { error: { code: -10006, message: "최대 1000건까지만 사용하실 수 있습니다."}};
        case -10008: return { error: { code: -10008, message: "날짜형식이 잘못되었습니다."}};
        case -10148: return { error: { code: -10148, message: "조회 기간이 잘못되었습니다."}};
        case -40001: return { error: { code: -40001, message: "파일을 찾을 수 없습니다."}};
        case -40002: return { error: { code: -40002, message: "빈 파일입니다(0byte)."}};
        case -10002: return { error: { code: -10002, message: "해당 인증키를 찾을 수 없습니다."}};
        case -10001: return { error: { code: -10001, message: "해당 인증키와 연결된 연계사가 아닙니다."}};
        case -24005: return { error: { code: -24005, message: "사업자번호와 아이디가 맞지 않습니다."}};
        case -32000: return { error: { code: -32000, message: "이미 가입된 연계사업자 입니다."}};
        case -32001: return { error: { code: -32001, message: "사업자번호가 유효하지 않습니다."}};
        case -32002: return { error: { code: -32002, message: "회사명이 유효하지 않습니다."}};
        case -32003: return { error: { code: -32003, message: "대표자명이 유효하지 않습니다."}};
        case -32004: return { error: { code: -32004, message: "업태가 유효하지 않습니다."}};
        case -32005: return { error: { code: -32005, message: "업종이 유효하지 않습니다."}};
        case -32006: return { error: { code: -32006, message: "주소가 유효하지 않습니다."}};
        case -32008: return { error: { code: -32008, message: "담당자명이 유효하지 않습니다."}};
        case -32010: return { error: { code: -32010, message: "아이디가 유효하지 않습니다."}};
        case -32015: return { error: { code: -32015, message: "해당 아이디는 이미 사용중입니다."}};
        case -32011: return { error: { code: -32011, message: "패스워드가 유효하지 않습니다."}};
        case -32012: return { error: { code: -32012, message: "연락처가 유효하지 않습니다."}};
        case -32013: return { error: { code: -32013, message: "이메일이 유효하지 않습니다."}};
        case -32016: return { error: { code: -32016, message: "해당 아이디를 찾을 수 없습니다."}};
        case -32017: return { error: { code: -32017, message: "탈퇴한 아이디입니다."}};
        case -26014: return { error: { code: -26014, message: "과금코드를 찾을 수 없습니다."}};
        case -26004: return { error: { code: -26004, message: "과금에 실패하였습니다."}};
        case -26006: return { error: { code: -26006, message: "충전잔액이 부족합니다."}};
        case -26011: return { error: { code: -26011, message: "연동사의 충전잔액이 부족합니다."}};
        case -26015: return { error: { code: -26015, message: "공급받는자의 충전잔액이 부족합니다."}};
        case -51001: return { error: { code: -51001, message: "서비스가 신청되지 않았습니다."}};
        case -51002: return { error: { code: -51002, message: "이미 신청되어 있습니다."}};
        case -51003: return { error: { code: -51003, message: "이미 해지되었습니다."}};
        case -51004: return { error: { code: -51004, message: "해지 상태가 아닙니다."}};
        case -51005: return { error: { code: -51005, message: "해지 당월에만 해지 취소할 수 있습니다."}};
        case -51006: return { error: { code: -51006, message: "해지 당월에는 재신청 할 수 없습니다. 해지 취소로 진행해주세요."}};
        case -51007: return { error: { code: -51007, message: "테스트베드는 최대 2개까지만 등록할 수 있습니다."}};
        case -51008: return { error: { code: -51008, message: "이미 수집중입니다."}};
        case -50101: return { error: { code: -50101, message: "카드를 찾을 수 없습니다."}};
        case -50102: return { error: { code: -50102, message: "카드를 조회할 권한이 없습니다."}};
        case -50111: return { error: { code: -50111, message: "카드사 코드가 잘못 입력되었습니다."}};
        case -50112: return { error: { code: -50112, message: "카드유형이 잘못 입력되었습니다."}};
        case -50113: return { error: { code: -50113, message: "카드번호가 잘못 입력되었습니다."}};
        case -50114: return { error: { code: -50114, message: "카드사 홈페이지 아이디가 잘못 입력되었습니다."}};
        case -50115: return { error: { code: -50115, message: "카드사 홈페이지 비밀번호가 잘못 입력되었습니다."}};
        case -50116: return { error: { code: -50116, message: "카드사 홈페이지 로그인에 실패하였습니다. 카드 정보를 확인해 주시기 바랍니다."}};
        case -50117: return { error: { code: -50117, message: "카드사 홈페이지 로그인에 실패하였습니다. 잠시 후 다시 시도해 주시기 바랍니다."}};
        case -50118: return { error: { code: -50118, message: "이미 등록된 카드번호입니다."}};
        case -50001: return { error: { code: -50001, message: "계좌를 찾을 수 없습니다."}};
        case -50002: return { error: { code: -50002, message: "계좌를 조회할 권한이 없습니다."}};
        case -50004: return { error: { code: -50004, message: "일일 즉시조회 횟수(10회)를 초과하였습니다."}};
        case -50211: return { error: { code: -50211, message: "수집주기가 잘못 입력되었습니다."}};
        case -50212: return { error: { code: -50212, message: "은행 코드가 잘못 입력되었습니다."}};
        case -50213: return { error: { code: -50213, message: "계좌유형이 잘못 입력되었습니다."}};
        case -50214: return { error: { code: -50214, message: "계좌번호가 잘못 입력되었습니다."}};
        case -50215: return { error: { code: -50215, message: "계좌 비밀번호가 잘못 입력되었습니다."}};
        case -50216: return { error: { code: -50216, message: "계좌 비밀번호를 입력하지 않아야하는 은행입니다."}};
        case -50217: return { error: { code: -50217, message: "빠른조회 아이디가 잘못 입력되었습니다."}};
        case -50218: return { error: { code: -50218, message: "빠른조회 아이디를 입력하지 않아야하는 은행입니다."}};
        case -50219: return { error: { code: -50219, message: "빠른조회 비밀번호가 잘못 입력되었습니다."}};
        case -50220: return { error: { code: -50220, message: "빠른조회 비밀번호를 입력하지 않아야하는 은행입니다."}};
        case -50221: return { error: { code: -50221, message: "사업자번호 또는 주민번호(앞6자리)가 잘못 입력되었습니다."}};
        case -50222: return { error: { code: -50222, message: "사업자번호 또는 주민번호(앞6자리)를 입력하지 않아야하는 은행입니다."}};
        case -50223: return { error: { code: -50223, message: "유효한 계좌정보가 아닙니다. 계좌정보를 확인해 주시기 바랍니다."}};
        case -50224: return { error: { code: -50224, message: "계좌정보 검증에 실패하였습니다. 잠시 후 다시 시도해 주시기 바랍니다."}};
        case -50225: return { error: { code: -50225, message: "이미 등록된 계좌번호입니다."}};

        default: return { error: { code: errCode, message: "https://dev.barobill.co.kr/docs/references/바로빌-API-오류코드"}}; break;
    }
}



