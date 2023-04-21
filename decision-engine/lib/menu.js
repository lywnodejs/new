const menu = [
  {
    pageKey: 'de-sub0',
    icon: 'database',
    pageName: '首页',
    path: '/home',
    children: [],
  },
  {
    pageKey: 'de-sub1',
    icon: 'database',
    pageName: '产品管理',
    path: '/product',
    children: [],
  },
  {
    pageKey: 'de-sub2',
    icon: 'database',
    pageName: '决策引擎(生产)',
    path: '/decision/produce',
    children: [],
  },
  {
    pageKey: 'de-sub3',
    icon: 'database',
    pageName: '决策引擎(编辑)',
    path: '/decision/edit',
    children: [],
  },
  {
    pageKey: 'de-sub4',
    icon: 'database',
    pageName: '决策分流配置',
    path: '/decision/conf',
    children: [],
  },
  {
    pageKey: 'de-sub5',
    icon: 'database',
    pageName: '发布审批',
    path: '/release',
    children: [],
  },
  {
    pageKey: 'de-sub6',
    icon: 'database',
    pageName: '任务管理',
    path: '/task',
    children: [],
  },
  {
    pageKey: 'de-sub7',
    icon: 'database',
    pageName: '统计分析',
    path: '',
    children: [
      {
        pageKey: 'de-sub7-1',
        pageName: '统计报表',
        path: '/statistics/report',
      },
      {
        pageKey: 'de-sub7-2',
        pageName: '调用监控',
        path: '/statistics/monitor',
      },
      {
        pageKey: 'de-sub7-3',
        pageName: '调用查询',
        path: '/statistics/query',
      },
    ],
  },
  {
    pageKey: 'de-sub8',
    icon: 'setting',
    pageName: '系统管理',
    path: '',
    children: [
      {
        pageKey: 'de-sub8-1',
        pageName: '规则操作日志',
        path: '/system/logs',
      },
      {
        pageKey: 'de-sub8-2',
        pageName: '帐号管理',
        path: '/system/account',
      },
      {
        pageKey: 'de-sub8-3',
        pageName: '角色管理',
        path: '/system/role',
      },
    ],
  },
  {
    pageKey: 'de-sub9',
    icon: 'read',
    pageName: '开发文档',
    path: '',
    children: [
      {
        pageKey: 'de-sub9-1',
        icon: 'read',
        pageName: '简介',
        path: '/doc/detail/1',
        children: [],
      },
      {
        pageKey: 'de-sub9-2',
        icon: 'read',
        pageName: '接入综述',
        path: '/doc/detail/2',
        children: [],
      },
      {
        pageKey: 'de-sub9-3',
        icon: 'read',
        pageName: '调用接口',
        path: '',
        children: [
          {
            pageKey: 'de-sub9-3-1',
            icon: 'read',
            pageName: '测试',
            path: '/doc/detail/3',
            children: [],
          },
        ],
      },
    ],
  },
]

export {menu}
