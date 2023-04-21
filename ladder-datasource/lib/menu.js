const menu = [
  {
    pageKey: 'sub1',
    icon: 'setting',
    pageName: '系统管理',
    path: '',
    children: [
      {
        pageKey: 'sub1-1',
        pageName: '帐号管理',
        path: '/system/account',
      },
      {
        pageKey: 'sub1-2',
        pageName: '角色管理',
        path: '/system/role',
      },
    ],
  },
  {
    pageKey: 'sub2',
    icon: 'data',
    pageName: '数据源管理',
    path: '',
    children: [
      {
        pageKey: 'sub2-1',
        pageName: '数据源',
        path: '/data/source',
      },
      {
        pageKey: 'sub2-2',
        pageName: '数据产品',
        path: '/data/product',
      },
    ],
  },
  {
    pageKey: 'sub3',
    icon: 'monitor',
    pageName: '数据监控',
    path: '',
    children: [
      {
        pageKey: 'sub3-1',
        pageName: '数据监控报表',
        path: '/monitor/report',
      },
    ],
  },
  {
    pageKey: 'sub4',
    icon: 'business',
    pageName: '业务管理',
    path: '',
    children: [
      {
        pageKey: 'sub4-1',
        pageName: '业务列表',
        path: '/business/list',
      },
    ],
  },
  {
    pageKey: 'sub5',
    icon: 'report',
    pageName: '报表中心',
    path: '',
    children: [
      {
        pageKey: 'sub5-1',
        pageName: '数据产品分日统计报表',
        path: '/report/data/date',
      },
      {
        pageKey: 'sub5-2',
        pageName: '业务分日统计报表',
        path: '/report/business/date',
      },
      {
        pageKey: 'sub5-3',
        pageName: '数据产品汇总报表',
        path: '/report/data/product',
      },
      {
        pageKey: 'sub5-4',
        pageName: '业务汇总报表',
        path: '/report/business/collect',
      },
    ],
  },
  {
    pageKey: 'sub6',
    icon: 'finance',
    pageName: '财务管理',
    path: '',
    children: [
      {
        pageKey: 'sub6-1',
        pageName: '业务财务报表',
        path: '/finance/business',
      },
      {
        pageKey: 'sub6-2',
        pageName: '数据产品财务报表',
        path: '/finance/data/product',
      },
    ],
  },
  {
    pageKey: 'sub7',
    icon: 'user',
    pageName: '用户明细',
    path: '',
    children: [
      {
        pageKey: 'sub7-1',
        pageName: '用户记录查询',
        path: '/query/record/list',
      },
    ],
  },
  {
    pageKey: 'sub8',
    icon: 'doc',
    pageName: '开发文档',
    path: '/doc/introduction',
    children: [
      {
        pageKey: 'sub8-1',
        icon: 'read',
        pageName: '简介',
        path: '/doc/introduction',
        children: [],
      },
      {
        pageKey: 'sub8-2',
        icon: 'read',
        pageName: '接入综述',
        path: '/doc/summary',
        children: [],
      },
      {
        pageKey: 'sub8-3',
        icon: 'read',
        pageName: '接入数据产品',
        path: '/doc/[id]',
        children: [],
      },
    ],
  },
]

export {menu}
