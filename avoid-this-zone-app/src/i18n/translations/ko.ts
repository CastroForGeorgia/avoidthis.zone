export default {
    translation: {
        Index: {
            applicationLoadErrorMessage: '애플리케이션 로드 중 오류 발생',
            applicationLoadErrorDescription:
                'ID {{applicationId}}를 가진 애플리케이션을 올바르게 로드할 수 없습니다. ' +
                '기본 애플리케이션 구성 화면이 표시되고 있습니다.',
            errorMessage: '애플리케이션 로드 중 오류 발생',
            errorDescription:
                '애플리케이션 로드 중 예기치 않은 오류가 발생했습니다. 페이지를 새로 고쳐 주세요.',
            reloadButton: '애플리케이션 새로 고침',
        },
        BasicNominatimSearch: {
            placeholder: '장소 이름, 거리 이름, 구역 이름, POI 등',
            noResultsMessage: '결과가 없습니다. 검색을 세분화해 보세요.',
        },
        SideDrawer: {
            title: '필터',
            languageSwitcher: {
                label: "언어 선택"
            },
            clearAllButton: '모든 필터 지우기',
            applyButton: '필터 적용',
        },
        ToggleDrawerButton: {
            tooltip: '필터 표시/숨기기',
        },
        ReportModal: {
            title: '보고서 제출',
            loadingMessage: '로딩 중...',
            successMessage: '보고서가 성공적으로 제출되었습니다!',
            errorMessage: '보고서 제출에 실패했습니다. 다시 시도해 주세요.',
            cancelButton: '취소',
            submitButton: '제출',
            resetButton: '초기화',
            formErrors: {
                requiredField: '이 필드는 필수입니다.',
                invalidDate: "유효하지 않은 날짜입니다.",
                invalidUrl: "유효한 URL을 입력해 주세요."
            },
            labels: {
                tactics: '전술',
                filters: "세부사항",
                raidLocationCategory: '급습 장소 카테고리',
                detailLocation: '세부 위치',
                wasSuccessful: '누구든지 구금되었나요?',
                locationReference: '위치 참조',
                sourceOfInfo: '정보 출처',
                dateOfRaid: '(선택 사항) 날짜',
                sourceOfInfoUrl: "출처 URL",
                sourceOfInfoUrlPlaceholder: "출처의 URL을 입력해 주세요 (해당되는 경우)"
            },
        },
        Enums: {
            ALLOWED_TACTICS: {
                SURVEILLANCE: '감시',
                WARRANTLESS_ENTRY: '영장 없는 진입',
                RUSE: '속임수',
                COLLATERAL_ARREST: '부수적 체포',
                USE_OF_FORCE: '무력 사용',
                CHECKPOINT: '검문소',
                KNOCK_AND_TALK: '노크 후 대화',
                ID_CHECK: '신원 확인',
            },
            ALLOWED_RAID_LOCATION_CATEGORY: {
                HOME: '집',
                PUBLIC: '공공',
                WORK: '직장',
                COURT: '법원',
                HOSPITAL: '병원',
                BORDER: '국경',
                OTHER: '기타',
            },
            ALLOWED_DETAIL_LOCATION: {
                STREET: '거리',
                CAR_STOP: '차량 정지',
                SHELTER: '대피소',
                PROBATION: '보호 관찰소',
                PAROLE: '가석방 사무소',
                WORKPLACE: '직장',
                HOSPITAL_WARD: '병원 병동',
                IMMIGRATION_CENTER: '이민 센터',
                BUS_TERMINAL: '버스 터미널',
                TRAIN_STATION: '기차역',
                AIRPORT: '공항',
                OTHER_FACILITY: '기타 시설',
                SCHOOL: "학교"
            },
            ALLOWED_WAS_SUCCESSFUL: {
                YES: '예',
                NO: '아니오',
                UNKNOWN: '알 수 없음',
            },
            ALLOWED_LOCATION_REFERENCE: {
                INTERSECTION: '교차로',
                BUS_STOP: '버스 정류장',
                TRAIN_STATION: '기차역',
                ZIP_CODE: '우편번호',
                LANDMARK: '랜드마크',
                NONE: '없음',
            },
            ALLOWED_SOURCE_OF_INFO: {
                NEWS_ARTICLE: '뉴스 기사',
                PERSONAL_OBSERVATION: '개인 관찰',
                COMMUNITY_REPORT: '커뮤니티 보고서',
                PUBLIC_RECORD: '공공 기록',
                LEGAL_AID_ORG: "조직"
            },
        },
        Common: {
            loadingMessage: '로딩 중입니다. 잠시만 기다려 주세요...',
            errorOccurred: '오류가 발생했습니다. 나중에 다시 시도해 주세요.',
            backButton: '뒤로',
            nextButton: '다음',
            resetButton: '초기화',
            closeButton: '닫기',
            searchPlaceholder: '검색...',
            confirmButton: '확인',
            cancelButton: '취소',
            unknown: "알 수 없음",
            createdAt: "생성일",
            viewOnMap: "지도에서 보기",
            navigate: "지도에서 보기",
            filter: "필터",
        },
        communityResources: "커뮤니티 자원",
        glaHotline: "GLAHR 핫라인",
        disclaimer: "AvoidThis.Zone의 모든 보고서는 사용자가 제출한 것이며 개별 기여자의 개인적인 관찰과 경험을 반영합니다. 이 사이트를 사용하고 그 정보를 신뢰함으로써, 귀하는 AvoidThis.Zone이 어떠한 보고서의 정확성, 신뢰성 또는 완전성에 대해 책임을 지지 않는다는 것을 인정하고 동의하게 됩니다. 사용자는 어떠한 행동을 취하기 전에 정보를 독립적으로 확인할 것을 권장합니다. 이 기술은 CastroForGeorgia가 부패한 시스템의 실패를 폭로하고 노동계급에 권한을 부여하겠다는 우리의 약속의 일환으로 개발되었습니다. 이 사이트의 사용은 귀하가 이 약관을 수락하며 제공된 데이터가 어떠한 보증 없이 ‘있는 그대로’ 제공된다는 것을 이해함을 의미합니다."
    },
};