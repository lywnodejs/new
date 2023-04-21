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
    icon: 'appstore',
    pageName: '运营配置',
    path: '',
    children: [
      {
        pageKey: 'sub2-1',
        pageName: 'APP更新管理',
        path: '/operation/update',
      },
      {
        pageKey: 'sub2-2',
        pageName: '产品管理',
        path: '/operation/product',
      },
      {
        pageKey: 'sub2-3',
        pageName: '属性模板管理',
        path: '/operation/attributes/template',
      },
      {
        pageKey: 'sub2-4',
        pageName: '属性库管理',
        path: '/operation/attributes/library',
      },
      {
        pageKey: 'sub2-5',
        pageName: 'Banner配置',
        path: '/operation/banner',
      },
      {
        pageKey: 'sub2-6',
        pageName: '设置页管理',
        path: '/operation/setting',
      },
      {
        pageKey: 'sub2-7',
        pageName: '我的页管理',
        path: '/operation/my',
      },
      {
        pageKey: 'sub2-8',
        pageName: '开屏配置',
        path: '/operation/launch',
      },
    ],
  },
  {
    pageKey: 'sub3',
    icon: 'shopping',
    pageName: '营销管理',
    path: '',
    children: [
      {
        pageKey: 'sub3-1',
        pageName: '投放页管理',
        path: '/market/land',
      },
      {
        pageKey: 'sub3-2',
        pageName: '邀请管理',
        path: '',
        children: [
          {
            pageKey: 'sub3-2-1',
            pageName: '邀请列表',
            path: '/market/invite',
          },
          {
            pageKey: 'sub3-2-2',
            pageName: '邀请明细',
            path: '/market/invite/detail',
          },
        ],
      },
      {
        pageKey: 'sub3-3',
        pageName: '免息券管理',
        path: '',
        children: [
          {
            pageKey: 'sub3-3-1',
            pageName: '免息券列表',
            path: '/market/coupon/list',
          },
          {
            pageKey: 'sub3-3-2',
            pageName: '任务管理',
            path: '/market/coupon/task',
          },
          {
            pageKey: 'sub3-3-3',
            pageName: '发放历史',
            path: '/market/coupon/history',
          },
        ],
      },
      {
        pageKey: 'sub3-4',
        pageName: '活动管理',
        path: '/market/activity',
      },
      {
        pageKey: 'sub3-5',
        pageName: '绩效管理',
        path: '/market/performance',
      },
    ],
  },
  {
    pageKey: 'sub4',
    icon: 'shopping',
    pageName: '用户运营',
    path: '',
    children: [
      {
        pageKey: 'sub4-1',
        pageName: '手动短信任务管理',
        path: '/user-operation/sms',
      },
      {
        pageKey: 'sub4-2',
        pageName: '公众号模板消息管理',
        path: '/user-operation/public',
      },
      {
        pageKey: 'sub4-3',
        pageName: '白名单列表',
        path: '/user-operation/whitelist',
      },
      {
        pageKey: 'sub4-4',
        pageName: '黑名单列表',
        path: '/user-operation/blacklist',
      },
      {
        pageKey: 'sub4-5',
        pageName: '用户列表',
        path: '/user-operation/user',
      },
      {
        pageKey: 'sub4-6',
        pageName: '问题反馈',
        path: '/user-operation/feedback',
      },
    ],
  },
  {
    pageKey: 'sub5',
    icon: 'shopping',
    pageName: '资产监控报表',
    path: '',
    children: [
      {
        pageKey: 'sub5-1',
        pageName: '运营分析',
        path: '/monitor/operation',
      },
      {
        pageKey: 'sub5-2',
        pageName: '用户画像分析',
        path: '/monitor/portrait',
      },
    ],
  },
]

export {menu}
