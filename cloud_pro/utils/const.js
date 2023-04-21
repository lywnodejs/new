export const VARIABLETABS = [
  {name: '基础变量', key: 0},
  {name: '输出变量', key: 1},
  {name: '常量', key: 2},
  {name: '衍生变量', key: 3},
]

export const FLOWCONFIG = [
  {
    referenceType: 0,
    ptype: 'out',
    type: 'EXEC',
    name: '开始',
    nodeName: 'START',
    color: 'rgb(0,192,255)',
  },
  {
    referenceType: 99,
    ptype: 'out',
    type: 'EXEC',
    name: '结束',
    nodeName: 'END',
    color: 'rgb(0,192,255)',
  },
  {
    referenceType: 2,
    ptype: 'out',
    type: 'EXEC',
    name: '规则集',
    nodeName: '请选择规则集',
    color: 'rgb(0,192,255)',
  },
  {
    referenceType: 3,
    ptype: 'out',
    type: 'EXEC',
    name: '评分卡',
    nodeName: '请选择评分卡',
    color: 'rgb(0,192,255)',
  },
  {
    referenceType: 4,
    ptype: 'out',
    type: 'EXEC',
    name: '矩阵',
    nodeName: '请选择矩阵',
    color: 'rgb(0,192,255)',
  },
  {
    referenceType: 1,
    ptype: 'out',
    type: 'EXEC',
    name: '衍生规则',
    nodeName: '请选择衍生规则',
    color: 'rgb(0,192,255)',
  },
  {
    ptype: 'in',
    type: 'REF',
    name: '条件',
    color: 'rgb(221,137,46)',
  },
]

export const USER_AUTH = [
  // 无权限、个人、部门、全部
  // 0-无,1-个人,2-部门,3-全部
  {name: '无权限', key: 0},
  {name: '个人', key: 1},
  {name: '部门', key: 2},
  {name: '全部', key: 3},
]

export const ORDER_STATUS = [
  {name: '待补充', key: 0},
  {name: '已补充', key: 1},
  {name: '未关联', key: 2},
  // {name: '解除关联', key: 3},
]

// 上报标识
export const REPORT_TYPE = [
  {name: '待统计', key: '0'},
  {name: '未上报', key: '1'},
  {name: '已上报', key: '2'},
]

// Ⅱ类户上报状态
export const SECOND_REPORT_TYPE = [
  {name: '待上报', key: '0'},
  {name: '系统上报', key: '1'},
  {name: '手工上报', key: '2'},
]

// Ⅱ类户信息类型 开户、变更、销户
export const SECOND_REPORT_MSG_TYPE = [
  {name: '开户', key: '1'},
  {name: '变更', key: '2'},
  {name: '销户', key: '3'},
]

// 检查状态
export const CHECK_TYPE = [
  {name: '检查中', key: '1'},
  {name: '待检查', key: '0'},
]

// 检查原因 0=人工 1=风控 2=策略
export const CHECK_REASON = [
  {name: '人工检查', key: '0'},
  {name: '策略检查', key: '2'},
]
//检查原因：下拉框。默认值”全部“。选项：人工检查、策略检查。

// 是否委派：下拉框。默认值”全部“。选项：是、否。delegate
export const DELEGATE_TYPE = [
  {name: '是', key: '1'},
  {name: '否', key: '0'},
]

// 综合资质 qualifi 1:优 2:良 3:中 4:一般 5:较低
export const QUALIFI_TYPE = [
  {name: '优', key: '1'},
  {name: '良', key: '2'},
  {name: '中', key: '3'},
  {name: '一般', key: '4'},
  {name: '较低', key: '5'},
]

export const CREDIT_TYPE = [
  {name: '循环授信', key: 1},
  {name: '单次授信', key: 2},
]
