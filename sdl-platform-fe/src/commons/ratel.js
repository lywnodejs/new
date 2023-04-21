export const engineer = [
  {value: 'wangyilaniris', label: '王一岚', phone: '18600230135'},
  {value: 'panshuoyu', label: '潘烁宇', phone: '13126569250'},
  {value: 'zhangyukun', label: '张煜昆', phone: '18513347964'},
  {value: 'fanshiqiang', label: '范世强', phone: '15810558604'},
  {value: 'wenxin_i', label: '温馨'},
  {value: 'liliang_i', label: '李良'},
  {value: 'zhuzixuan_i', label: '祝紫轩'},
  {value: 'liuxiaofengsec', label: '刘潇锋', phone: '18610555985'},
  {value: 'wanghaozach', label: '王昊', phone: '18810623699'},
  {value: 'wangyanwei', label: '王彦伟', phone: '18658852393'},
  {value: 'yangjuanjuan', label: '杨娟娟', phone: '15652217882'},
  {value: 'huanqi', label: '胡岸琪', phone: '13207120736'},
  {value: 'liukaiwen', label: '刘凯文', phone: '17610149697'},
  {value: 'panxiting', label: '潘玺廷', phone: '15221219001'},
  {value: 'sakihuangcan', label: '黄灿', phone: '15010255485'},
  {value: 'shaozun', label: '邵尊', phone: '13260251897'},
  {value: 'qinbo', label: '秦波', phone: '18874085588'},
  {value: 'liwenqing_i', label: '李雯晴'}
]

export const taskStatus = [
  {value: '0', label: '待扫描'},
  {value: '1', label: '待审计'},
  {value: '2', label: '已完成'}
]

export const vulLevel = [
  {value: 0, label: '严重(S0)'},
  {value: 1, label: '高危(S1)'},
  {value: 2, label: '中危(S2)'},
  {value: 3, label: '低危(S3)'}
]

export const omissionStatus = [
  {value: '0', label: '风险'},
  {value: '1', label: '未审计'},
  {value: '2', label: '漏洞'},
  {value: '3', label: '误报'},
  {value: '4', label: '已忽略'}
]

export const workorderStatus = [
  {value: '1', label: '待修复'},
  {value: '2', label: '待修复且延期中'},
  {value: '3', label: '修复中'},
  {value: '4', label: '修复中且延期中'},
  {value: '5', label: '已修复'},
  {value: '6', label: '确认不修复'},
  {value: '7', label: '验证不修复'},
  {value: '8', label: '不修复结束'},
  {value: '9', label: '修复完成'},
  {value: '10', label: '确认被忽略'},
  {value: '11', label: '已忽略'}
]

export const appType = [
  {value: 'app', label: 'Android'},
  {value: 'ipa', label: 'iOS'}
]

export const vulStatus = [
  {value: 0, label: '未修复'},
  {value: 1, label: '已修复'}
]

export const anquanVulStatus = [
  {value: 1, label: '修复中'},
  {value: 2, label: '已修复'},
  {value: 3, label: '不修复结束'},
  {value: 4, label: '已忽略'}
]

export const ratelTaskStatus = [
  {value: 0, label: '待扫描'},
  {value: 1, label: '扫描中'},
  {value: 2, label: '待审计'},
  {value: 3, label: '审计中'},
  {value: 4, label: '已完成'},
  {value: 5, label: '已关闭'},
  {value: 6, label: '无需扫描'},
  {value: 7, label: '扫描失败'},
  {value: 8, label: '已取消'}
]

export const dataLevel = [
  {value: '高', label: '高'},
  {value: '中', label: '中'},
  {value: '低', label: '低'}
]

export const sdkType = [
  {value: '自建', label: '自建'},
  {value: '开源', label: '开源'},
  {value: '第三方', label: '第三方'}
]

export function
preHandleParam(param, params, defaultValue = '未知') {
  if (param === '') {
    return defaultValue
  }
  for (let i = 0; i < params.length; i++) {
    if (params[i]['value'] === param) {
      param = params[i]['label']
      break;
    }
  }
  return param
}

export function handleTimestamp(timestamp) {
  let dateStr = ''
  if (timestamp) {
    let date = new Date(timestamp * 1000)
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds()
    dateStr = Y + M + D + h + m + s
  }
  return dateStr
}
