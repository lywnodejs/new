export const engineer = [
    {value: 'wangyilaniris', label: '王一岚', phone: '18600230135'},
    {value: 'panshuoyu', label: '潘烁宇', phone: '13126569250'},
    {value: 'zhangyukun', label: '张煜昆', phone: '18513347964'},
    {value: 'fanshiqiang', label: '范世强', phone: '15810558604'},
    {value: 'wenxin_i', label: '温馨'},
    {value: 'liliang_i', label: '李良'},
    {value: 'zhuzixuan_i', label: '祝紫轩'},
    {value: 'liwenqing_i', label: '李雯晴'},
    {value: 'liuxiaofengsec', label: '刘潇锋', phone: '18610555985'},
    {value: 'yangjuanjuan', label: '杨娟娟', phone: '15652217882'},
    {value: 'liukaiwen', label: '刘凯文', phone: '17610149697'},
    {value: 'sakihuangcan', label: '黄灿', phone: '15010255485'},
    {value: 'qinbo', label: '秦波', phone: '18874085588'},
    {value: 'huanqi', label: '胡岸琪', phone: '13207120736'},
    {value: 'wanghaozach', label: '王昊', phone: '18810623699'},
    {value: 'wangyanwei', label: '王彦伟', phone: '18658852393'},
    {value: 'shaozun', label: '邵尊', phone: '13260251897'},
    {value: 'panxiting', label: '潘玺廷', phone: '15221219001'}
  ]
export const status = [
    {value: 0, label: '待扫描'},
    {value: 1, label: '扫描中'},
    {value: 2, label: '待审计'},
    {value: 3, label: '审计中'},
    {value: 4, label: '已完成'},
    {value: 5, label: '已关闭'},
    {value: 6, label: '语言不支持'},
    {value: 7, label: '无需扫描'},
    {value: 8, label: '扫描失败'},
    {value: 9, label: '已取消'}
]
export const SDLAuditStatus = [
    {value: 0, label: '未审计'},
    {value: 1, label: '漏洞(自动)'},
    {value: 2, label: '漏洞(人工)'},
    {value: 3, label: '漏洞(已推修)'},
    {value: 4, label: '误报(自动)'},
    {value: 5, label: '误报(人工)'},
    {value: 6, label: '误报(不可信规则)'},
    {value: 7, label: '忽略'}
]
export const vulLevel = [
    {value: 0, label: '严重(S0)'},
    {value: 1, label: '高危(S1)'},
    {value: 2, label: '中危(S2)'},
    {value: 3, label: '低危(S3)'}
]
export const vulStatus = [
    {value: 0, label: '待确认'},
    {value: 1, label: '待修复'},
    {value: 2, label: '已修复'},
    {value: 3, label: '不修复'},
    {value: 4, label: '已忽略'}
]
export const language = [
    {value: 'Java', label: 'Java'},
    {value: 'PHP', label: 'PHP'},
    {value: 'Go', label: 'Golang'},
    {value: 'JavaScript', label: 'JavaScript'}
]

export const STSTUS_OPTIONS = ['待扫描', '扫描中', '待审计', '审计中', '已完成', '已关闭', '语言不支持', '无需扫描', '扫描失败', '任务取消']
// eslint-disable-next-line camelcase
export const STSTUS_OPTIONSCopy = {
  2: '已完成',
  4: '语言引擎扫描失败',
  6: '规则引擎扫描失败',
  7: '构建失败'
}
