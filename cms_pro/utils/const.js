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

// 默认投放包、应用宝、华为应用商店、OPPO应用商店、vivo应用商店、小米应用商店、魅族应用商店、360手机助手、百度手机助手
export const CHANNEL_TYPE = [
  {name: '默认投放包', value: 'mzhcb_user'},
  {name: 'App store', value: 'appstore'},
  {name: '应用宝', value: 'yingyongbao'},
  {name: '华为应用商店', value: 'huawei'},
  {name: 'OPPO应用商店', value: 'oppo'},
  {name: 'vivo应用商店', value: 'vivo'},
  {name: '小米应用商店', value: 'xiaomi'},
  {name: '魅族应用商店', value: 'meizu'},
  {name: '360手机助手', value: '360'},
  {name: '百度手机助手', value: 'baidu'},
]

export const BUSINESS_TYPE = [
  {name: '已注册', value: '0'},
  {name: '已授信', value: '1'},
  {name: '已用信', value: '2'},
  {name: '当前授信失败', value: '3'},
  {name: '当前用信失败', value: '4'},
]

// 属性类型
// 数值、文本、枚举、日期、所在城市、图片、视频、音频、验证码验证、实名认证、文件上传、补充信息、身份证正面ocr、身份证反面ocr、人脸识别ocr
export const ATTR_LIST = [
  {name: '数值', value: '5'},
  {name: '文本', value: '1'},
  {name: '枚举', value: '2'},
  {name: '日期', value: '3'},
  {name: '所在城市', value: '4'},
  {name: '图片', value: '6'},
  {name: '视频', value: '7'},
  {name: '音频', value: '8'},
  {name: '验证码验证', value: '9'},
  {name: '实名认证', value: '10'},
  {name: '文件上传', value: '11'},
  {name: '补充信息', value: '12'},
  {name: '身份证正面ocr', value: '13'},
  {name: '身份证反面ocr', value: '14'},
  {name: '人脸识别ocr', value: '15'},
]
// 子属性类型
// 数值、文本、枚举、日期、所在城市、图片、视频、音频、身份证正面ocr、身份证反面ocr、人脸识别ocr
export const CHILD_ATTR_LIST = [
  {name: '数值', value: '5'},
  {name: '文本', value: '1'},
  {name: '枚举', value: '2'},
  {name: '日期', value: '3'},
  {name: '所在城市', value: '4'},
  {name: '图片', value: '6'},
  {name: '视频', value: '7'},
  {name: '音频', value: '8'},
  {name: '身份证正面ocr', value: '13'},
  {name: '身份证反面ocr', value: '14'},
  {name: '人脸识别ocr', value: '15'},
]

// 、、
export const REWARD_TASK = [
  {name: '注册', value: 1},
  {name: '首次获得额度', value: 2},
  {name: '首次放款成功', value: 3},
]
