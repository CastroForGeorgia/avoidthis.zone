export default {
    translation: {
        Index: {
            applicationLoadErrorMessage: '加载应用程序时出错',
            applicationLoadErrorDescription:
                'ID为{{applicationId}}的应用程序未能正确加载。' +
                '您正在查看默认的应用程序配置。',
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
            title: '筛选器',
            languageSwitcher: {
                label: '选择语言'
            },
            clearAllButton: '清除所有筛选器',
            applyButton: '应用筛选器',
        },
        ToggleDrawerButton: {
            tooltip: '显示/隐藏筛选器',
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
                invalidDate: '此日期无效。',
                invalidUrl: '请输入有效的URL。'
            },
            labels: {
                tactics: '战术',
                filters: '详细信息',
                raidLocationCategory: '突袭地点类别',
                detailLocation: '详细地点',
                wasSuccessful: '是否有任何人被拘留？',
                locationReference: '地点参考',
                sourceOfInfo: '信息来源',
                dateOfRaid: '(可选) 日期',
                sourceOfInfoUrl: '来源URL',
                sourceOfInfoUrlPlaceholder: '输入来源的URL（如适用）'
            },
        },
        Enums: {
            ALLOWED_TACTICS: {
                SURVEILLANCE: '监视',
                WARRANTLESS_ENTRY: '无证进入',
                RUSE: '诡计',
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
                SCHOOL: '学校'
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
                LEGAL_AID_ORG: '组织'
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
            unknown: '未知',
            createdAt: '创建于',
            viewOnMap: '在地图上查看',
            navigate: '在地图上查看',
            filter: '筛选',
        },
        communityResources: "社区资源",
        glaHotline: "GLAHR 热线",
        disclaimer: "AvoidThis.Zone 上的所有报告均由用户提交，并反映了各个贡献者的个人观察和经验。使用本网站并依赖其信息，即表示您承认并同意 AvoidThis.Zone 不对任何报告的准确性、可靠性或完整性负责。我们鼓励用户在采取任何行动之前自行核实信息。本技术由 CastroForGeorgia 开发，作为我们致力于赋权工人阶级、揭露腐败体系失败的一部分。您使用本网站即表示接受这些条款，并理解所呈现的数据是按“现状”提供的，且不附带任何形式的保证。"
    },
};