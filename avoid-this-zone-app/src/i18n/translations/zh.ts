export default {
    translation: {
        Index: {
            applicationLoadErrorMessage: '加载应用程序时出错',
            applicationLoadErrorDescription:
                'ID为{{applicationId}}的应用程序未能正确加载。' +
                '您看到的是默认的应用程序配置。',
            errorMessage: '加载应用程序时出错',
            errorDescription:
                '加载应用程序时发生了意外错误。请尝试重新加载页面。',
            reloadButton: '重新加载应用程序',
        },
        BasicNominatimSearch: {
            placeholder: '地点名称、街道名称、区域名称、兴趣点等',
            noResultsMessage: '未找到结果。请尝试优化您的搜索。',
        },
        SideDrawer: {
            title: '过滤器',
            languageSwitcher: {
                label: '选择语言'
            },
            clearAllButton: '清除所有过滤器',
            applyButton: '应用过滤器',
        },
        ToggleDrawerButton: {
            tooltip: '显示/隐藏过滤器',
        },
        ReportModal: {
            title: '提交报告',
            loadingMessage: '加载中...',
            successMessage: '您的报告已成功提交！',
            errorMessage: '提交报告失败。请再试一次。',
            cancelButton: '取消',
            submitButton: '提交',
            resetButton: '重置',
            formErrors: {
                requiredField: '此字段为必填项。',
            },
            labels: {
                tactics: '战术',
                raidLocationCategory: '突袭地点类别',
                detailLocation: '详细地点',
                wasSuccessful: '操作是否成功？',
                locationReference: '地点参考',
                sourceOfInfo: '信息来源',
            },
        },
        Enums: {
            ALLOWED_TACTICS: {
                SURVEILLANCE: '监视',
                WARRANTLESS_ENTRY: '无证进入',
                RUSE: '伪装',
                COLLATERAL_ARREST: '附带逮捕',
                USE_OF_FORCE: '使用武力',
                CHECKPOINT: '检查站',
                KNOCK_AND_TALK: '敲门谈话',
                ID_CHECK: '身份检查',
            },
            ALLOWED_RAID_LOCATION_CATEGORY: {
                HOME: '家',
                PUBLIC: '公共场所',
                WORK: '工作',
                COURT: '法院',
                HOSPITAL: '医院',
                BORDER: '边境',
                OTHER: '其他',
            },
            ALLOWED_DETAIL_LOCATION: {
                STREET: '街道',
                CAR_STOP: '车辆停靠',
                SHELTER: '避难所',
                PROBATION: '缓刑办公室',
                PAROLE: '假释办公室',
                WORKPLACE: '工作场所',
                HOSPITAL_WARD: '医院病房',
                IMMIGRATION_CENTER: '移民中心',
                BUS_TERMINAL: '公交车站',
                TRAIN_STATION: '火车站',
                AIRPORT: '机场',
                OTHER_FACILITY: '其他设施',
            },
            ALLOWED_WAS_SUCCESSFUL: {
                YES: '是',
                NO: '否',
                UNKNOWN: '未知',
            },
            ALLOWED_LOCATION_REFERENCE: {
                INTERSECTION: '交叉口',
                BUS_STOP: '公交车站',
                TRAIN_STATION: '火车站',
                ZIP_CODE: '邮政编码',
                LANDMARK: '地标',
                NONE: '无',
            },
            ALLOWED_SOURCE_OF_INFO: {
                NEWS_ARTICLE: '新闻文章',
                PERSONAL_OBSERVATION: '个人观察',
                COMMUNITY_REPORT: '社区报告',
                PUBLIC_RECORD: '公共记录',
            },
        },
        Common: {
            loadingMessage: '加载中，请稍候...',
            errorOccurred: '发生错误。请稍后再试。',
            backButton: '返回',
            nextButton: '下一步',
            resetButton: '重置',
            closeButton: '关闭',
            searchPlaceholder: '搜索...',
            confirmButton: '确认',
            cancelButton: '取消',
        },
    },
};