export default {
    translation: {
        Index: {
            applicationLoadErrorMessage: '애플리케이션 로드 중 오류 발생',
            applicationLoadErrorDescription:
                'ID가 {{applicationId}}인 애플리케이션을 올바르게 로드할 수 없습니다. ' +
                '기본 애플리케이션 구성을 보고 있습니다.',
            errorMessage: '애플리케이션 로드 중 오류 발생',
            errorDescription:
                '애플리케이션을 로드하는 동안 예기치 않은 오류가 발생했습니다. 페이지를 새로 고쳐보세요.',
            reloadButton: '애플리케이션 새로 고침',
        },
        BasicNominatimSearch: {
            placeholder: '장소 이름, 거리 이름, 구역 이름, POI 등',
            noResultsMessage: '결과가 없습니다. 검색을 세분화해 보세요.',
        },
        SideDrawer: {
            title: '필터',
            languageSwitcher: {
                label: '언어 선택'
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
            },
            labels: {
                tactics: '전술',
                raidLocationCategory: '급습 장소 카테고리',
                detailLocation: '상세 위치',
                wasSuccessful: '작업이 성공적이었나요?',
                locationReference: '위치 참조',
                sourceOfInfo: '정보 출처',
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
                ID_CHECK: '신분 확인',
            },
            ALLOWED_RAID_LOCATION_CATEGORY: {
                HOME: '집',
                PUBLIC: '공공장소',
                WORK: '직장',
                COURT: '법원',
                HOSPITAL: '병원',
                BORDER: '국경',
                OTHER: '기타',
            },
            ALLOWED_DETAIL_LOCATION: {
                STREET: '거리',
                CAR_STOP: '차량 정차',
                SHELTER: '대피소',
                PROBATION: '집행유예 사무소',
                PAROLE: '가석방 사무소',
                WORKPLACE: '작업장',
                HOSPITAL_WARD: '병원 병동',
                IMMIGRATION_CENTER: '이민 센터',
                BUS_TERMINAL: '버스 터미널',
                TRAIN_STATION: '기차역',
                AIRPORT: '공항',
                OTHER_FACILITY: '기타 시설',
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
                COMMUNITY_REPORT: '커뮤니티 보고',
                PUBLIC_RECORD: '공공 기록',
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
        },
    },
};