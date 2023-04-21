export const ProjectUserAuthorization = [
    {
        role: '系统管理员',
        menuList: [
            // '主页',
            '第三方应用管理',
            '数据标准与规范',
            '数据采集管理',
            '行为日志监测',
            '基础数据管理',
            '教学数据管理',
            '理论模型管理',
            '理论模型配置',
            '量化模型配置',
            '模型使用',
            '报表配置',
            '用户空间',
            
        ],
        router: '/admin',
    },
    {
        role: '第三方应用厂商',
        menuList: [
            // '主页',
            '第三方应用管理',
        ],
        router: '/apps',
    },
    {
        role: '教研员',   // 交互的关键, 教研员如何使用数据配置服务
        menuList: [
            // '主页',
            '开放应用管理',
            '数据、指标与模型服务',
            '用户决策支持服务',
        ],
        router: '/researcher',
    },
    {
        role: '区域管理者',
        menuList: [
            // '主页',
            '开放应用管理',
            '用户决策支持服务',
        ],
        router: '/areaManager',
    },
    {
        role: '学校管理者',
        menuList: [
            // '主页',
            '开放应用管理',
            '用户决策支持服务',
        ],
        router: '/schoolManager',
    },
    {
        role: '教师',
        menuList: [
            // '主页',
            '用户决策支持服务',
        ],
        router: '/teacher',
    },
    {
        role: '学生',
        menuList: [
            // '主页',
            '用户决策支持服务',
        ],
        router: '/student',
    },
];
