export default {
    translation: {
        Index: {
            applicationLoadErrorMessage: 'Lỗi khi tải ứng dụng',
            applicationLoadErrorDescription:
                'Ứng dụng với ID {{applicationId}} không thể được tải đúng cách. ' +
                'Bạn đang xem cấu hình ứng dụng mặc định.',
            errorMessage: 'Lỗi khi tải ứng dụng',
            errorDescription:
                'Đã xảy ra lỗi không mong muốn khi tải ứng dụng. Vui lòng thử tải lại trang.',
            reloadButton: 'Tải lại ứng dụng',
        },
        BasicNominatimSearch: {
            placeholder: 'Tên địa điểm, tên đường, tên quận, POI, v.v.',
            noResultsMessage: 'Không tìm thấy kết quả. Hãy thử tinh chỉnh tìm kiếm của bạn.',
        },
        SideDrawer: {
            title: 'Bộ lọc',
            languageSwitcher: {
                label: 'Chọn ngôn ngữ'
            },
            clearAllButton: 'Xóa tất cả bộ lọc',
            applyButton: 'Áp dụng bộ lọc',
        },
        ToggleDrawerButton: {
            tooltip: 'Hiện/ẩn bộ lọc',
        },
        ReportModal: {
            title: 'Gửi báo cáo',
            loadingMessage: 'Đang tải...',
            successMessage: 'Báo cáo của bạn đã được gửi thành công!',
            errorMessage: 'Gửi báo cáo không thành công. Vui lòng thử lại.',
            cancelButton: 'Hủy',
            submitButton: 'Gửi',
            resetButton: 'Đặt lại',
            formErrors: {
                requiredField: 'Trường này là bắt buộc.',
                invalidDate: 'Ngày này không hợp lệ.',
                invalidUrl: 'Vui lòng nhập URL hợp lệ.'
            },
            labels: {
                tactics: 'Chiến thuật',
                filters: 'Chi tiết',
                raidLocationCategory: 'Danh mục địa điểm đột kích',
                detailLocation: 'Địa điểm chi tiết',
                wasSuccessful: 'Có ai bị giam giữ không?',
                locationReference: 'Tham chiếu địa điểm',
                sourceOfInfo: 'Nguồn thông tin',
                dateOfRaid: '(Tùy chọn) Ngày',
                sourceOfInfoUrl: 'URL nguồn',
                sourceOfInfoUrlPlaceholder: 'Nhập URL của nguồn (nếu có)'
            },
        },
        Enums: {
            ALLOWED_TACTICS: {
                SURVEILLANCE: 'Giám sát',
                WARRANTLESS_ENTRY: 'Vào mà không có lệnh',
                RUSE: 'Mưu kế',
                COLLATERAL_ARREST: 'Bắt giữ phụ',
                USE_OF_FORCE: 'Sử dụng vũ lực',
                CHECKPOINT: 'Trạm kiểm soát',
                KNOCK_AND_TALK: 'Gõ cửa và nói chuyện',
                ID_CHECK: 'Kiểm tra ID',
            },
            ALLOWED_RAID_LOCATION_CATEGORY: {
                HOME: 'Nhà',
                PUBLIC: 'Công cộng',
                WORK: 'Công việc',
                COURT: 'Tòa án',
                HOSPITAL: 'Bệnh viện',
                BORDER: 'Biên giới',
                OTHER: 'Khác',
            },
            ALLOWED_DETAIL_LOCATION: {
                STREET: 'Đường',
                CAR_STOP: 'Dừng xe',
                SHELTER: 'Nơi trú ẩn',
                PROBATION: 'Văn phòng quản chế',
                PAROLE: 'Văn phòng tha tù',
                WORKPLACE: 'Nơi làm việc',
                HOSPITAL_WARD: 'Khoa bệnh viện',
                IMMIGRATION_CENTER: 'Trung tâm nhập cư',
                BUS_TERMINAL: 'Bến xe buýt',
                TRAIN_STATION: 'Ga tàu',
                AIRPORT: 'Sân bay',
                OTHER_FACILITY: 'Cơ sở khác',
                SCHOOL: 'Trường học'
            },
            ALLOWED_WAS_SUCCESSFUL: {
                YES: 'Có',
                NO: 'Không',
                UNKNOWN: 'Không xác định',
            },
            ALLOWED_LOCATION_REFERENCE: {
                INTERSECTION: 'Ngã tư',
                BUS_STOP: 'Điểm dừng xe buýt',
                TRAIN_STATION: 'Ga tàu',
                ZIP_CODE: 'Mã bưu điện',
                LANDMARK: 'Điểm mốc',
                NONE: 'Không có',
            },
            ALLOWED_SOURCE_OF_INFO: {
                NEWS_ARTICLE: 'Bài báo',
                PERSONAL_OBSERVATION: 'Quan sát cá nhân',
                COMMUNITY_REPORT: 'Báo cáo cộng đồng',
                PUBLIC_RECORD: 'Hồ sơ công',
                LEGAL_AID_ORG: 'Tổ chức'
            },
        },
        Common: {
            loadingMessage: 'Đang tải, vui lòng chờ...',
            errorOccurred: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
            backButton: 'Quay lại',
            nextButton: 'Tiếp theo',
            resetButton: 'Đặt lại',
            closeButton: 'Đóng',
            searchPlaceholder: 'Tìm kiếm...',
            confirmButton: 'Xác nhận',
            cancelButton: 'Hủy',
            unknown: 'Không xác định',
            createdAt: 'Ngày tạo',
            viewOnMap: 'Xem trên bản đồ',
            navigate: 'Xem trên bản đồ',
            filter: 'Lọc',
        },
        communityResources: "Tài nguyên cộng đồng",
        glaHotline: "Đường dây nóng GLAHR",
        disclaimer: "Tất cả các báo cáo trên AvoidThis.Zone đều được gửi bởi người dùng và phản ánh các quan sát cũng như trải nghiệm cá nhân của từng cộng tác viên. Khi sử dụng trang web này và dựa vào thông tin của nó, bạn xác nhận và đồng ý rằng AvoidThis.Zone không chịu trách nhiệm về độ chính xác, độ tin cậy hay tính đầy đủ của bất kỳ báo cáo nào. Người dùng được khuyến khích tự kiểm tra thông tin một cách độc lập trước khi thực hiện bất kỳ hành động nào. Công nghệ này được CastroForGeorgia phát triển như một phần trong cam kết trao quyền cho giai cấp lao động và phơi bày những thất bại của một hệ thống tham nhũng. Việc sử dụng trang web này đồng nghĩa với việc bạn chấp nhận các điều khoản này và hiểu rằng dữ liệu được trình bày được cung cấp ‘nguyên trạng’ mà không có bất kỳ bảo đảm nào."
    },
};
