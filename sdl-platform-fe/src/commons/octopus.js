export const taskStatus = [
  {value: '0', label: '任务中止'},
  {value: '1', label: '任务已创建'},
  {value: '2', label: '等待执行'},
  {value: '3', label: '任务扫描中'},
  {value: '4', label: '任务结束'},
  {value: '5', label: '主动停止'},
  {value: '10', label: '任务未开始'},
  {value: '11', label: '计划任务已保存'},
  {value: '12', label: '周期任务已保存'}
]
export const execType = [
  {value: '1', label: '即时扫描'},
  {value: '2', label: '定时任务'},
  {value: '3', label: '周期任务'}
]

export const taskAction = [
  {value: '异常停止', label: '开启'},
  {value: '新建扫描', label: '开启'},
  {value: '扫描中', label: '停止'},
  {value: '扫描中', label: '停止'},
  {value: '扫描结束', label: '复测'}
]

export const taskType = [
  {value: 'test', label: '测试'},
  {value: 'testing', label: '线下环境'},
  {value: 'pre', label: '预发环境'},
  {value: 'production', label: '线上环境'}
]

export const targetFrom = [
  {value: 'manual', label: '手动下发'},
  {value: 'asset', label: '资产库检索'}
]

export const privilege = [
  {value: 0, label: '普通'},
  {value: 1, label: '优先'}
]

export const requestMethod = [
  {value: 'post', label: 'POST'},
  {value: 'get', label: 'GET'}
]

export const vulLevel = [
  {value: '0', label: '严重'},
  {value: '1', label: '高危'},
  {value: '2', label: '中危'},
  {value: '3', label: '低危'}
]

export const vulStatus = [
  {value: 'fixed', label: '已修复'},
  {value: 'new', label: '新增'}
]

export const sourceType = [
  {value: 1, label: 'OCTOPUS任务'},
  {value: 2, label: 'DORADO任务'}
]

export const vulType = [
  {'value': 'Cross_Site_Scripting', 'label': 'XSS漏洞'},
  {'value': 'SQL_Injection', 'label': 'SQL注入'},
  {'value': 'Command_Execution', 'label': '命令执行'},
  {'value': 'Local_File_Inclusion', 'label': '本地文件包含'},
  {'value': 'Remote_File_Inclusion', 'label': '远程文件包含'},
  {'value': 'Server_Side_Request_Forgery', 'label': 'SSRF漏洞'},
  {'value': 'URL_Redirector_Abuse', 'label': 'URL跳转'},
  {'value': 'XML_External_Entity_Injection', 'label': 'XML外部实体注入'},
  {'value': 'Directory_Traversal', 'label': '目录穿越'},
  {'value': 'spring_actuator_leakage', 'label': 'spring监控信息泄露'},
  {'value': 'back_up_file_leakage', 'label': '备份文件泄露'}
]

export const vulListStatus = [
  {value: 0, label: '未处理', name: 'OCTOPUS_GROUP_VUL_STATUS_PENDING'},
  {value: 1, label: '已推送', name: 'OCTOPUS_GROUP_VUL_STATUS_PUSHED'},
  {value: 2, label: '误报', name: 'OCTOPUS_GROUP_VUL_STATUS_FP'},
  {value: 3, label: '重复漏洞', name: 'OCTOPUS_GROUP_VUL_STATUS_DUPLICATED'},
  {value: 7, label: '其他', name: 'OCTOPUS_GROUP_VUL_STATUS_OTHER'}
]

export const vulListStatusDialog = [
  {value: 1, label: '推送漏洞', name: 'OCTOPUS_GROUP_VUL_STATUS_PUSHED'},
  {value: 2, label: '误报', name: 'OCTOPUS_GROUP_VUL_STATUS_FP'},
  {value: 3, label: '重复漏洞忽略', name: 'OCTOPUS_GROUP_VUL_STATUS_DUPLICATED'},
  {value: 7, label: '其他', name: 'OCTOPUS_GROUP_VUL_STATUS_OTHER'}
]

export const vulListType = [
  {
  'value': 1001,
  'label': 'Web安全漏洞',
  'children': [
      {'value': 1006, 'label': '普通反射型XSS'},
      {'value': 1007, 'label': 'DOM型的XSS'},
      {'value': 1008, 'label': 'Flash型的XSS'},
      {'value': 1009, 'label': '存储型XSS'},
      {'value': 1010, 'label': 'CSRF'},
      {'value': 1011, 'label': '登录接口认证漏洞'},
      {'value': 1012, 'label': 'CRLF注入'},
      {'value': 1013, 'label': 'SQL注入'},
      {'value': 1014, 'label': '远程命令执行'},
      {'value': 1015, 'label': '任意代码执行'},
      {'value': 1016, 'label': '文件包含'},
      {'value': 1017, 'label': '管理后台对外'},
      {'value': 1018, 'label': '列目录'},
      {'value': 1019, 'label': 'SSRF'},
      {'value': 1020, 'label': '越权'},
      {'value': 1021, 'label': '其他业务逻辑漏洞'},
      {'value': 1022, 'label': '用户敏感信息泄漏'},
      {'value': 1023, 'label': '上传漏洞'},
      {'value': 1024, 'label': '文件读取'},
      {'value': 1025, 'label': 'URL跳转'},
      {'value': 1026, 'label': 'ClickJacking'},
      {'value': 1027, 'label': '拒绝服务'},
      {'value': 1028, 'label': '远程拒绝服务'},
      {'value': 1029, 'label': 'JSON劫持'},
      {'value': 1030, 'label': '目录穿越'},
      {'value': 1031, 'label': 'SEO暗链'},
      {'value': 1032, 'label': '短信SPAM'},
      {'value': 1252, 'label': 'XML外部实体注入'},
      {'value': 1254, 'label': '认证信息明文传输'},
      {'value': 1256, 'label': '敏感文件泄漏'},
      {'value': 1258, 'label': '敏感信息不安全存储'},
      {'value': 1260, 'label': '遗留后门'},
      {'value': 1262, 'label': 'LDAP注入'},
      {'value': 1264, 'label': '硬编码'},
      {'value': 1265, 'label': '第三方组件安全漏洞'},
      {'value': 1266, 'label': '证书验证漏洞'},
      {'value': 1268, 'label': '弱加密算法'},
      {'value': 1270, 'label': '不安全随机数'},
      {'value': 1525, 'label': '未授权访问'},
      {'value': 2031, 'label': '客户端IP伪造'},
      {'value': 1033, 'label': '其他'}]
  }
]

export function
preHandleParam(param, params) {
  for (let i = 0; i < params.length; i++) {
    if (params[i]['value'] === param) {
      param = params[i]['label']
      break;
    }
  }
  if (param === '') {
    param = '未知'
  }
  return param
}

