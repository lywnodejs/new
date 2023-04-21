export const securityBps = [
  {value: 'fanshiqiang', label: '范世强'},
  {value: 'zhangyukun', label: '张煜昆'},
  {value: 'xuzheming', label: '许哲铭'},
  {value: 'wywwangyanwei', label: '王言伟'},
  {value: 'zhangyongxin', label: '张永鑫'},
  {value: 'liuxiaofengsec', label: '刘潇锋'},
  {value: 'liukaiwen', label: '刘凯文'},
  {value: 'wanghaozach', label: '王昊'},
  {value: 'huanqi', label: '胡岸琪'}
]

export const language = [
  {value: 'Java', label: 'Java'},
  {value: 'PHP', label: 'PHP'},
  {value: 'Golang', label: 'Golang'},
  {value: 'Python', label: 'Python'},
  {value: 'C/C++', label: 'C/C++'},
  {value: 'JavaScript', label: 'JavaScript'},
  {value: '其它', label: '其它'}
]

export const ruleType = [
  {value: 1, label: '普通规则'},
  {value: 2, label: '兜底规则'},
  {value: 3, label: '底层策略'}
]

export const projectLevel = [
  {value: 'A', label: 'A'},
  {value: 'B', label: 'B'},
  {value: 'C', label: 'C'},
  {value: 'D', label: 'D'}
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
