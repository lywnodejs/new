/**
 *  @author hhx
 *  @date 2020-04-22 16:36
 */
export const RULE_TYPES = [
  {name: '大于', value: '1', key: 'rule1'},
  {name: '小于', value: '2', key: 'rule2'},
  {name: '等于', value: '3', key: 'rule3'},
  {name: '不等于', value: '4', key: 'rule4'},
  {name: '大于等于', value: '5', key: 'rule5'},
  {name: '小于等于', value: '6', key: 'rule6'},
  {name: '包含...之内', value: '7', key: 'rule7'},
  {name: '不包含...之内', value: '8', key: 'rule8'},
  {name: '介于...之间', value: '9', key: 'rule9'},
  {name: '不介于...之间', value: '10', key: 'rule10'},
]
// 审批状态
export const AUDIT_STATUS = [
  {name: '全部', value: null, key: 'all'},
  {name: '待审核', value: '1', key: 'audit1'},
  {name: '审核通过', value: '2', key: 'audit2'},
  {name: '审核不通过', value: '3', key: 'audit3'},
]
// 减免状态
export const REDUCT_STATUS = [
  {name: '全部', value: null, key: 'all'},
  {name: '减免中待还款', value: '1', key: 'reduct1'},
  {name: '减免中待还款', value: '2', key: 'reduct2'},
  {name: '减免成功', value: '3', key: 'reduct3'},
  {name: '减免失败', value: '4', key: 'reduct4'},
]

export const COLLECT_STATUS = [
  {name: '全部', value: null, key: 'all'},
  {name: '未催收', value: '1', key: 'uncollected'},
  {name: '催收中', value: '2', key: 'underCollection'},
  {name: '已结束', value: '3', key: 'finished'},
]

export const CONTACT_TYPE = [
  {name: '本人', value: '1', key: 'self'},
  {name: '工作电话', value: '2', key: 'workphone'},
  {name: '紧急联系人', value: '3', key: 'emergencyContact'},
  {name: '通讯录', value: '4', key: 'phoneBook'},
]
// 0=初始  1=待还款 2=还款中  3=逾期  4=已结清 5=逾期结清  6=部分还款  7=逾期部分还款
export const REPAY_TYPE = [
  {name: '', value: '0'},
  {name: '待还款', value: '1'},
  {name: '还款中', value: '2'},
  {name: '逾期', value: '3'},
  {name: '已结清', value: '4'},
  {name: '逾期结清', value: '5'},
  {name: '部分还款', value: '6'},
  {name: '逾期部分还款', value: '7'},
]

export const SERVICE_TYPE = [
  {name: '全部', value: ''},
  {name: '开启', value: '1'},
  {name: '关闭', value: '0'},
]

export const TIME_TYPE = [
  {name: '小时', value: 1},
  {name: '分钟', value: 2},
  {name: '天', value: 3},
]

export const QUOTA_TYPE = [
  {name: '稳定性', value: 1},
  {name: '失败次数', value: 2},
  {name: '查得率', value: 3},
]

export const CONDITION_TYPE = [
  {name: '大于', value: 1},
  {name: '小于', value: 2},
  {name: '等于', value: 3},
  {name: '大于等于', value: 4},
  {name: '小于等于', value: 5},
  {name: '不等于', value: 6},
]
