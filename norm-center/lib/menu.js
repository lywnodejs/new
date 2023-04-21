const menu = [
  {
    pageKey: 'norm0',
    icon: 'database',
    pageName: '首页',
    path: '/',
    children: [],
  },
  {
    pageKey: 'norm1',
    icon: 'setting',
    pageName: '系统管理',
    path: '',
    children: [
      {
        pageKey: 'norm1-1',
        pageName: '帐号管理',
        path: '/system/account',
      },
      {
        pageKey: 'norm1-2',
        pageName: '角色管理',
        path: '/system/role',
      },
    ],
  },
  {
    pageKey: 'norm2',
    icon: 'database',
    pageName: '数据源管理',
    path: '/data',
    children: [],
  },
  {
    pageKey: 'norm3',
    icon: 'dashboard',
    pageName: '指标管理',
    path: '',
    children: [
      {
        pageKey: 'norm3-1',
        pageName: '基础指标',
        path: '/norm/base',
      },
      {
        pageKey: 'norm3-2',
        pageName: '衍生指标',
        path: '/norm/derivative',
      },
      {
        pageKey: 'norm3-3',
        pageName: '告警管理',
        path: '/norm/warning',
      },
    ],
  },
  {
    pageKey: 'norm4',
    icon: 'container',
    pageName: '统计分析',
    path: '',
    children: [
      {
        pageKey: 'norm4-1',
        pageName: '统计报表',
        path: '/statistical/report',
      },
      {
        pageKey: 'norm4-2',
        pageName: '调用查询',
        path: '/statistical/query',
      },
    ],
  },
  {
    pageKey: 'norm5',
    icon: 'bar-chart',
    pageName: '指标调用',
    path: '',
    children: [
      {
        pageKey: 'norm5-1',
        pageName: '开发文档',
        path: '',
        children: [
          {
            pageKey: 'norm5-1-0',
            pageName: '简介',
            path: '/doc/detail/1',
          },
          {
            pageKey: 'norm5-1-1',
            pageName: '接入综述',
            path: '/doc/detail/2',
          },
          {
            pageKey: 'norm5-1-2',
            pageName: '指标查询接口',
            path: '/doc/detail/3',
          },
          {
            pageKey: 'norm5-1-3',
            pageName: '指标详情接口',
            path: '/doc/detail/4',
          },
          {
            pageKey: 'norm5-1-4',
            pageName: '指标计算接口',
            path: '/doc/detail/5',
          },
        ],
      },
      {
        pageKey: 'norm5-2',
        pageName: '指标测试',
        path: '/norm/testing',
      },
    ],
  },
]

export {menu}
