const menu = [
  {
    pageKey: 'sub',
    icon: 'home',
    pageName: '首页看板',
    path: '/dashboard',
    children: [],
  },
  {
    pageKey: 'sub0',
    icon: 'home',
    pageName: '工作台',
    path: '/workbench',
    children: [],
  },
  {
    pageKey: 'sub19',
    icon: 'home',
    pageName: '运营管理',
    path: '/operation',
    children: [
      {
        pageKey: 'sub19-1',
        pageName: 'APP更新管理',
        path: '/operation/appUpDate',
      },
      {
        pageKey: 'sub19-2',
        pageName: '产品管理',
        path: '/operation/product',
        children: [
          {
            pageKey: 'sub19-2-1',
            pageName: '存款产品管理',
            path: '/operation/product/deposit',
          },
          {
            pageKey: 'sub19-2-2',
            pageName: '贷款产品管理',
            path: '/operation/product/loans',
          },
        ],
      },
      {
        pageKey: 'sub19-3',
        icon: 'home',
        pageName: '模板属性管理',
        path: '/operation/attributes/template',
      },
      {
        pageKey: 'sub19-4',
        icon: 'home',
        pageName: '属性库管理',
        path: '/operation/attributes/library',
      },
      {
        pageKey: 'sub19-5',
        icon: 'home',
        pageName: 'Banner配置',
        path: '/operation/banner',
      },
      {
        pageKey: 'sub19-6',
        icon: 'home',
        pageName: '设置页管理',
        path: '/operation/setting',
      },
      {
        pageKey: 'sub19-7',
        icon: 'home',
        pageName: '我的页管理',
        path: '/operation/my',
      },
      {
        pageKey: 'sub19-8',
        icon: 'home',
        pageName: '开屏页管理',
        path: '/operation/launch',
      },
    ],
  },
  {
    pageKey: 'sub20',
    icon: 'appstore',
    pageName: '担保业务管理',
    path: '/guarantee',
    children: [
      {
        pageKey: 'sub20-1',
        pageName: '担保管理',
        path: '/guarantee/list',
      },
      {
        pageKey: 'sub20-2',
        pageName: '担保报表',
        path: '/guarantee/form',
      },
    ],
  },
  {
    pageKey: 'sub1',
    icon: 'appstore',
    pageName: '产品管理',
    path: '',
    children: [
      {
        pageKey: 'sub1-1',
        pageName: '信贷产品',
        path: '/product/information',
      },
    ],
  },
  {
    pageKey: 'sub2',
    icon: 'profile',
    pageName: '进件管理',
    path: '',
    children: [
      {
        pageKey: 'sub2-1',
        pageName: '授信申请列表',
        path: '/feed/order',
      },
      /*{
        pageKey: 'sub2-2',
        pageName: '人工跟单',
        path: '',
        children: [
          {
            pageKey: 'sub2-2-1',
            pageName: '案件分配',
            path: '/feed/artificial/case/assignment',
          },
          {
            pageKey: 'sub2-2-2',
            pageName: '案件跟进',
            path: '/feed/artificial/case/follow-up',
          },
          {
            pageKey: 'sub2-2-3',
            pageName: '跟进记录',
            path: '/feed/artificial/follow-up/record',
          },
          {
            pageKey: 'sub2-2-4',
            pageName: '报表统计',
            path: '/feed/artificial/report',
          },
        ],
      },*/
    ],
  },
  {
    pageKey: 'sub3',
    icon: 'safety-certificate',
    pageName: '信审管理',
    path: '',
    children: [
      {
        pageKey: 'sub3-1',
        pageName: '信审列表',
        path: '/credit/list',
      },
      {
        pageKey: 'sub3-2',
        pageName: '委案列表',
        path: '',
        children: [
          {
            pageKey: 'sub3-2-1',
            pageName: '初审委案',
            path: '/credit/commission/first',
          },
          {
            pageKey: 'sub3-2-2',
            pageName: '复核委案',
            path: '/credit/commission/review',
          },
          {
            pageKey: 'sub3-2-3',
            pageName: '终审委案',
            path: '/credit/commission/final',
          },
        ],
      },
      {
        pageKey: 'sub3-3',
        pageName: '审核列表',
        path: '',
        children: [
          {
            pageKey: 'sub3-3-1',
            pageName: '初审操作',
            path: '/credit/examine/first',
          },
          {
            pageKey: 'sub3-3-2',
            pageName: '复核操作',
            path: '/credit/examine/review',
          },
          {
            pageKey: 'sub3-3-3',
            pageName: '终审操作',
            path: '/credit/examine/final',
          },
        ],
      },
      {
        pageKey: 'sub3-4',
        pageName: '结案列表',
        path: '/credit/closeCase',
      },
      {
        pageKey: 'sub3-5',
        pageName: '报表统计',
        path: '',
        children: [
          {
            pageKey: 'sub3-5-1',
            pageName: '处理中订单统计',
            path: '/credit/setting/commissioner',
          },
          {
            pageKey: 'sub3-5-2',
            pageName: '已结案订单统计',
            path: '/credit/setting/closedCase',
          },
          {
            pageKey: 'sub3-5-3',
            pageName: '绩效考核报表',
            path: '/credit/setting/tactics',
          },
        ],
      },
      {
        pageKey: 'sub3-6',
        pageName: '信审设置',
        path: '',
        children: [
          {
            pageKey: 'sub3-6-1',
            pageName: '信审开关设置',
            path: '/credit/review/switch',
          },
          {
            pageKey: 'sub3-6-2',
            pageName: '委案人员设置',
            path: '/credit/review/personnel',
          },
          {
            pageKey: 'sub3-6-3',
            pageName: '信审策略设置',
            path: '/credit/review/strategy',
          },
          {
            pageKey: 'sub3-6-4',
            pageName: '绩效考核设置',
            path: '/credit/review/assessment',
          },
        ],
      },
    ],
  },
  {
    pageKey: 'sub4',
    icon: 'user',
    pageName: '客户管理',
    path: '',
    children: [
      {
        pageKey: 'sub4-1',
        pageName: '客户列表',
        path: '/customer/list',
      },
    ],
  },
  {
    pageKey: 'sub5',
    icon: 'team',
    pageName: '客户经理管理',
    path: '',
    children: [
      {
        pageKey: 'sub5-1',
        pageName: '机构管理',
        path: '/business/branch',
      },
      {
        pageKey: 'sub5-2',
        pageName: '客户经理列表',
        path: '/business/manager',
      },
      {
        pageKey: 'sub5-3',
        pageName: '业务总列表',
        path: '/business/list',
      },
      {
        pageKey: 'sub5-4',
        pageName: '任务分配统计',
        path: '/business/task',
      },
      {
        pageKey: 'sub5-5',
        pageName: '业绩统计',
        path: '/business/report',
      },
    ],
  },
  {
    pageKey: 'sub6',
    icon: 'form',
    pageName: '贷后管理',
    path: '',
    children: [
      {
        pageKey: 'sub6-1',
        pageName: '催收管理',
        path: '',
        children: [
          {
            pageKey: 'sub6-1-1',
            pageName: '分配列表',
            path: '/collection/distribution',
          },
          {
            pageKey: 'sub6-1-2',
            pageName: '待催列表',
            path: '/collection/reminded',
          },
          {
            pageKey: 'sub6-1-3',
            pageName: '已催回列表',
            path: '/collection/returned',
          },
          {
            pageKey: 'sub6-1-4',
            pageName: '催收历史',
            path: '/collection/history/home',
          },
          {
            pageKey: 'sub6-1-5',
            pageName: '催记历史',
            path: '/collection/history/reminder',
          },
        ],
      },

      {
        pageKey: 'sub6-3',
        pageName: '报表统计',
        path: '',
        children: [
          {
            pageKey: 'sub6-3-1',
            pageName: '催收分配统计',
            path: '/collection/report/distribution',
          },
          {
            pageKey: 'sub6-3-2',
            pageName: '催收逾期报表',
            path: '/collection/report/overdue',
          },
          {
            pageKey: 'sub6-3-3',
            pageName: '催收入催报表',
            path: '/collection/report/urge',
          },
          {
            pageKey: 'sub6-3-4',
            pageName: '催收绩效报表',
            path: '/collection/report/performance',
          },
        ],
      },
      {
        pageKey: 'sub6-4',
        pageName: '催收管理设置',
        path: '',
        children: [
          {
            pageKey: 'sub6-4-1',
            pageName: '催收级别设置',
            path: '/collection/setting/level',
          },
          {
            pageKey: 'sub6-4-2',
            pageName: '催收自动分案设置',
            path: '/collection/setting/automatic',
          },
          {
            pageKey: 'sub6-4-3',
            pageName: '催收绩效考核设置',
            path: '/collection/setting/appraisal',
          },
        ],
      },
    ],
  },
  {
    pageKey: 'sub7',
    icon: '"safety-certificate',
    pageName: '监管报送',
    path: '',
    children: [
      {
        pageKey: 'sub7-1',
        pageName: '征信报送',
        path: '/regulatory/credit',
      },
      {
        pageKey: 'sub7-2',
        pageName: 'Ⅱ类户报送',
        path: '/regulatory/second',
      },
    ],
  },
  {
    pageKey: 'sub8',
    icon: '"safety-certificate',
    pageName: 'BI报表',
    path: '',
    children: [
      {
        pageKey: 'sub8-1',
        icon: '',
        pageName: '核心指标',
        path: '',
        children: [
          {
            pageKey: 'sub8-1-1',
            icon: '',
            pageName: '分渠道报表',
            path: '/bi/core/channel',
          },
          {
            pageKey: 'sub8-1-2',
            icon: '',
            pageName: '分产品报表',
            path: '/bi/core/product',
          },
        ],
      },
      {
        pageKey: 'sub8-2',
        icon: 'bar-chart',
        pageName: '贷前分析',
        path: '',
        children: [
          {
            pageKey: 'sub8-2-1',
            pageName: '授信拒绝原因分布',
            path: '/bi/before/reject',
          },
          {
            pageKey: 'sub8-2-2',
            pageName: '用信拒绝原因分布',
            path: '/bi/before/refuse',
          },
          {
            pageKey: 'sub8-2-3',
            pageName: '授信额度分布',
            path: '/bi/before/line',
          },
          {
            pageKey: 'sub8-2-4',
            pageName: '授信比例报表',
            path: '/bi/before/credit',
          },
          {
            pageKey: 'sub8-2-5',
            pageName: '用信比例报表',
            path: '/bi/before/letter',
          },
        ],
      },
      {
        pageKey: 'sub8-3',
        icon: 'dot-chart',
        pageName: '贷中分析',
        path: '',
        children: [
          {
            pageKey: 'sub8-3-1',
            pageName: '用信客户比例报表',
            path: '/bi/middle/ratio',
          },
          {
            pageKey: 'sub8-3-2',
            pageName: '用信客户额度使用率报表',
            path: '/bi/middle/usage',
          },
          {
            pageKey: 'sub8-3-3',
            pageName: '在贷余额报表',
            path: '/bi/middle/balance',
          },
        ],
      },
      {
        pageKey: 'sub8-4',
        icon: 'line-chart',
        pageName: '贷后分析',
        path: '',
        children: [
          {
            pageKey: 'sub8-4-1',
            pageName: '催收报表',
            path: '/bi/after/collection',
          },
          {
            pageKey: 'sub8-4-2',
            pageName: '不良率报表',
            path: '/bi/after/bad',
          },
          {
            pageKey: 'sub8-4-3',
            pageName: '逾期率报表',
            path: '/bi/after/overdue',
          },
          {
            pageKey: 'sub8-4-4',
            pageName: '迁徙率报表',
            path: '/bi/after/migration',
          },
        ],
      },
    ],
  },
  {
    pageKey: 'sub9',
    icon: 'account-book',
    pageName: '财务核算',
    path: '',
    children: [
      {
        pageKey: 'sub9-0',
        pageName: '资产监测',
        path: '',
        children: [
          {
            pageKey: 'sub9-0-1',
            pageName: '贷款到期台账',
            path: '/accounting/due',
          },
        ],
      },
      {
        pageKey: 'sub9-1',
        pageName: '业务数据查询',
        path: '',
        children: [
          {
            pageKey: 'sub9-1-1',
            pageName: '借据查询',
            path: '/accounting/iou',
          },
          {
            pageKey: 'sub9-1-2',
            pageName: '放款台账',
            path: '/accounting/loan',
          },
          {
            pageKey: 'sub9-1-3',
            pageName: '还款台账',
            path: '/accounting/repayment',
          },
          {
            pageKey: 'sub9-1-4',
            pageName: 'Ⅱ类户交易流水',
            path: '/accounting/second',
          },
          {
            pageKey: 'sub9-1-5',
            pageName: '资产余额',
            path: '/accounting/asset/balance',
          },
        ],
      },
      {
        pageKey: 'sub9-2',
        pageName: '收入核算',
        path: '',
        children: [
          {
            pageKey: 'sub9-2-1',
            pageName: '分日收入',
            path: '/accounting/daily/income',
          },
        ],
      },
      {
        pageKey: 'sub9-3',
        pageName: '成本核算',
        path: '',
        children: [
          {
            pageKey: 'sub9-3-1',
            pageName: '分日成本',
            path: '/accounting/daily/cost',
          },
          {
            pageKey: 'sub9-3-2',
            pageName: '手工核算',
            path: '/accounting/cost/accounting',
          },
          {
            pageKey: 'sub9-3-3',
            pageName: '成本明细',
            path: '',
            children: [
              {
                pageKey: 'sub9-3-3-2',
                pageName: '资金成本',
                path: '/accounting/cost/capital',
              },
              {
                pageKey: 'sub9-3-3-3',
                pageName: '资产成本',
                path: '/accounting/cost/asset',
              },
              {
                pageKey: 'sub9-3-3-4',
                pageName: '短信成本',
                path: '/accounting/cost/sms',
              },
              {
                pageKey: 'sub9-3-3-5',
                pageName: '数据源成本',
                path: '/accounting/cost/data/source',
              },
              {
                pageKey: 'sub9-3-3-6',
                pageName: '电子签章成本',
                path: '/accounting/cost/signature',
              },
              {
                pageKey: 'sub9-3-3-7',
                pageName: '支付成本',
                path: '/accounting/cost/payment',
              },
              {
                pageKey: 'sub9-3-3-8',
                pageName: '银行卡鉴权成本',
                path: '/accounting/cost/authentication',
              },
              {
                pageKey: 'sub9-3-3-9',
                pageName: '智能识别成本',
                path: '/accounting/cost/intelligence',
              },
              {
                pageKey: 'sub9-3-3-10',
                pageName: '营销成本',
                path: '/accounting/cost/marketing',
              },
            ],
          },
        ],
      },
      {
        pageKey: 'sub9-4',
        pageName: '对账管理',
        path: '',
        children: [
          {
            pageKey: 'sub9-4-1',
            pageName: '日损益表',
            path: '/accounting/daily/loss',
          },

          {
            pageKey: 'sub9-4-2',
            pageName: '月利润表',
            path: '/accounting/monthly/profit',
          },
        ],
      },
    ],
  },
  {
    pageKey: 'sub10',
    icon: 'team',
    pageName: '合作机构',
    path: '',
    children: [
      {
        pageKey: 'sub10-1',
        pageName: '合作机构列表',
        path: '/mechanism',
      },
    ],
  },
  {
    pageKey: 'sub11',
    icon: 'team',
    pageName: '协议管理',
    path: '',
    children: [
      {
        pageKey: 'sub11-1',
        pageName: '协议列表',
        path: '/agreement',
      },
      {
        pageKey: 'sub11-3',
        pageName: '协议模板',
        path: '/agreement/template',
      },
      {
        pageKey: 'sub11-2',
        pageName: '签章查询',
        path: '/agreement/inquiry',
      },
    ],
  },
  {
    pageKey: 'sub13',
    icon: 'property-safety',
    pageName: '支付管理',
    path: '',
    children: [
      {
        pageKey: 'sub13-1',
        pageName: '支付通道列表',
        path: '/pay/channel',
      },
      {
        pageKey: 'sub13-2',
        pageName: '支付配置',
        path: '/pay/setting',
      },
    ],
  },
  {
    pageKey: 'sub14',
    icon: 'lock',
    pageName: '权限管理',
    path: '',
    children: [
      {
        pageKey: 'sub14-3',
        pageName: '组织架构管理',
        path: '/authority/department',
      },
      {
        pageKey: 'sub14-1',
        pageName: '角色管理',
        path: '/authority/role',
      },
      {
        pageKey: 'sub14-2',
        pageName: '成员管理',
        path: '/authority/account',
      },
    ],
  },
  {
    pageKey: 'sub15',
    icon: 'setting',
    pageName: '系统设置',
    path: '',
    children: [
      {
        pageKey: 'sub15-1',
        pageName: '白名单配置',
        path: '/system/white',
      },
    ],
  },
  {
    pageKey: 'sub16',
    icon: '',
    pageName: '资产保全',
    path: '',
    children: [
      {
        pageKey: 'sub16-1',
        pageName: '资产列表',
        path: '/assets/list',
      },
      {
        pageKey: 'sub16-2',
        pageName: '导出记录',
        path: '/assets/export/record',
      },
      {
        pageKey: 'sub16-3',
        pageName: '导入记录',
        path: '/assets/import/record',
      },
    ],
  },
  {
    pageKey: 'sub17',
    icon: '',
    pageName: '登记管理',
    path: '',
    children: [
      {
        pageKey: 'sub17-1',
        pageName: '抵质押物列表',
        path: '/register/collateral',
      },
      {
        pageKey: 'sub17-2',
        pageName: '担保人列表',
        path: '/register/guarantor',
      },
    ],
  },
  {
    pageKey: 'sub18',
    icon: '',
    pageName: '风险预警管理',
    path: '',
    children: [
      {
        pageKey: 'sub18-1',
        pageName: '风险预警记录',
        path: '/risk/list',
      },
      {
        pageKey: 'sub18-2',
        pageName: '人工检查管理',
        path: '',
        children: [
          {
            pageKey: 'sub18-2-1',
            pageName: '检查清单',
            path: '/collection/after',
          },
          {
            pageKey: 'sub18-2-2',
            pageName: '委案列表',
            path: '/collection/appoint',
          },
          {
            pageKey: 'sub18-2-3',
            pageName: '检查结果记录',
            path: '/collection/inspection',
          },
        ],
      },
      {
        pageKey: 'sub18-4',
        pageName: '预警策略配置',
        path: '/risk/config',
      },
      {
        pageKey: 'sub18-3',
        pageName: '人工检查配置',
        path: '',
        children: [
          {
            pageKey: 'sub18-3-1',
            pageName: '人工检查开关',
            path: '/collection/setting/inspection/switch',
          },
          {
            pageKey: 'sub18-3-2',
            pageName: '人工检查策略配置',
            path: '/collection/setting/inspection/tactics',
          },
          {
            pageKey: 'sub18-3-3',
            pageName: '人工检查分案配置',
            path: '/collection/setting/inspection/division',
          },
        ],
      },
    ],
  },
]

export {menu}
