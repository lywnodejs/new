export const language = [
  {value: 'Java', label: 'Java'},
  {value: 'PHP', label: 'PHP'},
  {value: 'Golang', label: 'Golang'},
  {value: 'Python', label: 'Python'},
  {value: 'C/C++', label: 'C/C++'},
  {value: 'JavaScript', label: 'JavaScript'},
  {value: '其它', label: '其它'}
]
export const framework = [
  {value: 'SpringBoot', label: 'SpringBoot'},
  {value: 'Spring MVC', label: 'Spring MVC'},
  {value: 'Dubbo', label: 'Dubbo'},
  {value: 'Kepler', label: 'Kepler'},
  {value: 'CodeIgniter', label: 'CodeIgniter'},
  {value: 'ThinkPHP', label: 'ThinkPHP'},
  {value: 'Laravel', label: 'Laravel'},
  {value: 'YII2', label: 'YII2'},
  {value: 'Nuwa-Golang', label: 'Nuwa-Golang'},
  {value: 'Go-Gin', label: 'Go-Gin'},
  {value: 'BeeGo', label: 'BeeGo'},
  {value: '原生Go', label: '原生Go'},
  {value: 'Vue.js', label: 'Vue.js'},
  {value: 'React', label: 'React'},
  {value: 'Express', label: 'Express'},
  {value: 'KOA', label: 'KOA'},
  {value: 'Java DRPC', label: 'Java DRPC'},
  {value: 'Java Thrift', label: 'Java Thrift'},
  {value: 'Jersey', label: 'Jersey'},
  {value: 'Dropwizard', label: 'Dropwizard'},
  {value: 'PHP Thrift', label: 'PHP Thrift'},
  {value: 'PHP DRPC', label: 'PHP DRPC'},
  {value: 'Swoole', label: 'Swoole'},
  {value: 'Nuwa-PHP', label: 'Nuwa-PHP'},
  {value: 'Martini', label: 'Martini'},
  {value: 'Fermion', label: 'Fermion'},
  {value: 'Go-Thrift', label: 'Go-Thrift'},
  {value: 'Go-DRPC', label: 'Go-DRPC'},
  {value: '其它', label: '其它'}
]
export const projectType = [
  {value: '出行类服务', label: '出行类服务：指直接面向用户提供出行服务的业务，如专、快、顺，企业级等'},
  {value: '金融服务', label: '金融服务：指开展的自营金融业务以及承接的任何金融业务代理服务或信息辅助服务，如消费金融、（非）车险、支付等'},
  {value: '公共服务', label: '公共服务：指为业务线提供支撑服务的基础类服务，如支付、passport等'},
  {value: 'MIS系统', label: 'MIS系统：指包含Web界面的、BS架构的信息管理系统，如运营Mis等；'},
  {value: 'laaS产品', label: 'laaS产品：指把IT基础设施作为一种服务通过网络对外提供的产品，如滴滴弹性云等'},
  {value: 'SaaS产品', label: 'SaaS产品：指通过互联网提供软件服务的产品，如新出租saas平台等'},
  {value: '内部平台', label: '内部平台：指提供给内部员工使用的系统平台，如橘子堆、会议室预订系统等'},
  {value: '运营活动H5', label: '运营活动H5：指能够实现企业宣传、促销活动等多种营销目的H5页面，如拉新活动页面等'},
  {value: '端上外链第三方H5或JS', label: '端上外链第三方H5或JS：指端上有嵌入第三方H5或JS，如端上的办手机卡、办银行卡、外包开发的活动类H5等'},
  {value: '外采第三方SaaS服务', label: '外采第三方SaaS服务：指对外（第三方）采购的软件服务，如桔子学院、安全事务部服务系统等'},
  {value: '其它', label: '其它：不属于上述类型的项目'}
]
export const SDLProjectProperty = [
  {value: '新项目上线', label: '新项目上线'},
  {value: '旧项目迭代', label: '旧项目迭代'},
  {value: '旧项目重构', label: '旧项目重构'},
  {value: '内部测试', label: '内部测试'},
  {value: '其它', label: '其它'}
]
export const RDProjectProperty = [
  {value: '新项目上线', label: '新项目上线'},
  {value: '旧项目迭代', label: '旧项目迭代'},
  {value: '旧项目重构', label: '旧项目重构'},
  {value: '其它', label: '其它'}
]
export const accessInternet = [
  {value: '0', label: '从外网访问不到，只能在内网访问'},
  {value: '1', label: '从外网可以直接访问到当前服务，没有API网关'},
  {value: '2', label: '从外网可以通过API网关访问到当前服务'},
  {value: '3', label: '从外网可以通过Node代理层访问到当前服务'}
]
export const accessInternet1 = [
  {value: '从外网访问不到，只能在内网访问', label: '外网不能访问，内网通过API网关|node代理|直接 访问'},
  {value: '从外网可以直接访问到当前服务，没有API网关', label: '外网直接访问'},
  {value: '从外网可以通过API网关访问到当前服务', label: '外网通过API网关访问'},
  {value: '从外网可以通过Node代理层访问到当前服务', label: '外网通过Node代理访问'}
]
export const serviceInvoker = [
  {value: '前端页面', label: '前端页面'},
  {value: 'IOT设备', label: 'IOT设备'},
  {value: '手机APP', label: '手机APP'},
  {value: '手机H5', label: '手机H5'},
  {value: '微信类小程序', label: '微信类小程序'},
  {value: '外网服务', label: '外网服务'},
  {value: '内网服务', label: '内网服务', disabled: true},
  {value: '不提供接口', label: '不提供接口'}
]

export const serviceInvoker1 = [
  {label: '有前端页面，上游调用方是',
   options: [
    {value: '前端页面', label: '前端页面'},
    {value: 'IOT设备', label: 'IOT设备'},
    {value: '手机APP', label: '手机APP'},
    {value: '手机H5', label: '手机H5'},
    {value: '微信类小程序', label: '微信类小程序'}
  ]},
  {label: '没有前端页面，上游调用方是',
   options: [
    {value: '外网服务', label: '外网服务'},
    {value: '内网服务', label: '内网服务', disabled: true},
    {value: '不提供接口', label: '不提供接口'}
  ]}
]
export const isModule = [
  {value: 1, label: '一个独立的系统或独立的服务，如MIS系统或FTP服务'},
  {value: 2, label: '系统中的某个服务或模块，如数据引擎、Dubbo服务中的某个模块等'},
  {value: 3, label: '纯前端，不含服务端'}
]
export const isGateway = [
  {value: 1, label: '有Node代理: 由node将客户端请求转发到服务端'},
  {value: 2, label: '有API网关: 由API网关将客户端请求转发到服务端'},
  {value: 3, label: '上述都没有'}
]
export const targetUser1 = [
  {value: '外网用户，如司机、乘客等', label: '外网用户，如司机、乘客等', disabled: true},
  {value: '企业用户，如高德、阿里等', label: '企业用户，如高德、阿里等', disabled: true},
  {value: '合作伙伴，如北京大数据局，各高校等', label: '合作伙伴，如北京大数据局，各高校等', disabled: true},
  {value: '政府，如交管局、各地政府等', label: '政府，如交管局、各地政府等'},
  {value: '滴滴正式员工', label: '滴滴正式员工'},
  {value: '滴滴外包员工', label: '滴滴外包员工'},
  {value: '滴滴实习生', label: '滴滴实习生'},
  {value: '其它服务或系统', label: '其它服务或系统'}
]
export const targetUser = [
  {value: '个人用户', label: '外网用户，如司机、乘客等', disabled: true},
  {value: '企业用户', label: '企业用户，如高德、阿里等', disabled: true},
  {value: '合作伙伴', label: '合作伙伴，如北京大数据局，各高校等', disabled: true},
  {value: '政府', label: '政府，如交管局、各地政府等'},
  {value: '正式员工', label: '滴滴正式员工'},
  {value: '外包员工', label: '滴滴外包员工'},
  {value: '实习生', label: '滴滴实习生'},
  {value: '其它', label: '其它服务或系统'}
]
export const dataLevel = [
  {value: 'C1', label: 'C1-公开数据：公司正式渠道发布信息，如官方微博、微信发布的信息等'},
  {value: 'C2', label: 'C2-内部数据：用户汽车车身长度、车门数、手机型号等或员工国籍、民族等'},
  {value: 'C3', label: 'C3-秘密数据：用户姓名、性别、车牌、IMEI等或员工出生年月、家庭住址等或业务订单量、注册司乘数等'},
  {value: 'C4', label: 'C4-机密数据：用户隐私信息或员工隐私信息或公司财务、经营信息等'}
]
export const projectLevel = [
  {value: 'A', label: 'A'},
  {value: 'B', label: 'B'},
  {value: 'C', label: 'C'},
  {value: 'D', label: 'D'}
]
export const engineer = [
  {value: 'fanshiqiang', label: '范世强', dingId: 'lgfqbp0'},
  {value: 'xuzheming', label: '许哲铭', dingId: 'gm9i40e'},
  {value: 'wywwangyanwei', label: '王言伟', dingId: 'gm9i40e'},
  {value: 'zengjinlin', label: '曾金霖'},
  {value: 'zhangyongxin', label: '张永鑫'},
  {value: 'wenxin_i', label: '温馨'},
  {value: 'liliang_i', label: '李良'},
  {value: 'zhuzixuan_i', label: '祝紫轩'},
  {value: 'chenhaojun', label: '陈浩军', dingId: 'gm9i40e'},
  {value: 'zhangyukun', label: '张煜昆', dingId: 'kl6-21szurt40'},
  {value: 'wangyilaniris', label: '王一岚', dingId: 'c793nqi'},
  {value: 'panshuoyu', label: '潘烁宇', dingId: 'v25eigd'},
  {value: 'sakihuangcan', label: '黄灿', dingId: 'me5ajez'},
  {value: 'liuxiaofengsec', label: '刘潇锋', dingId: 'leolxf'},
  {value: 'liukaiwen', label: '刘凯文', dingId: 'vrcicjh'},
  {value: 'qinbo', label: '秦波', dingId: 'bobkey'},
  {value: 'yangjuanjuan', label: '杨娟娟', dingId: 'uiwl638'},
  {value: 'harleywangxiaotong_i', label: '王晓彤', dingId: 'gm9i40e'},
  {value: 'shaozun', label: '邵尊', dingId: 'j1lzloy'},
  {value: 'huanqi', label: '胡岸琪', dingId: 'gm9i40e'},
  {value: 'panxiting', label: '潘玺廷', dingId: 'ht3il1l'},
  {value: 'wanghaozach', label: '王昊', dingId: 'y2xhqn7'},
  {value: 'wangyanwei', label: '王彦伟', dingId: 'p9cg0x1'},
  {value: 'lijie1', label: '李杰', dingId: 'gm9i40e'},
  {value: 'zhangmiao_i', label: '张苗', dingId: 'gm9i40e'},
  {value: 'liwenqing_i', label: '李雯晴'},
  {value: 'huangzhicong_i', label: '黄志聪'},
  {value: 'ryancaohui_i', label: '曹辉', dingId: 'gm9i40e'}
]
export const projectStatus = [
  {
    'value': 0,
    'label': '普通流程',
    'children': [
      {value: 1, label: '待分配SDL工程师'},
      {value: 2, label: '设计安全评估-待提交资料'},
      {value: 3, label: '设计安全评估-评估中'},
      {value: 4, label: '设计安全评估-待确认结果'},
      {value: 5, label: '代码安全评估-待提交资料'},
      {value: 6, label: '代码安全评估-评估中'},
      {value: 7, label: '代码安全评估-待确认结果'},
      {value: 8, label: '代码安全评估-已确认'},
      {value: 9, label: '评估完成'}]
  },
  {
    'value': 1,
    'label': '基线流程',
    'children': [
      {value: 100, label: '待RD确认基线要求'},
      {value: 101, label: '待RD提交评估材料'},
      {value: 102, label: 'SDL复核基线确认结果'},
      {value: 103, label: '代码检测中'},
      {value: 104, label: 'SDL审计基线检测结果'},
      {value: 105, label: '待RD修复检出问题'},
      {value: 106, label: '代码复测中'},
      {value: 107, label: '已完成'}]
  }
]

export const status = {
  1: '待分配SDL工程师',
  2: '设计安全评估-待提交资料',
  3: '设计安全评估-评估中',
  4: '设计安全评估-待确认结果',
  5: '代码安全评估-待提交资料',
  6: '代码安全评估-评估中',
  7: '代码安全评估-待确认结果',
  8: '代码安全评估-已确认',
  9: '评估完成',
  100: '待RD确认基线要求',
  101: '待RD提交评估材料',
  102: 'SDL复核基线确认结果',
  103: '代码检测中',
  104: 'SDL审计基线检测结果',
  105: '待RD修复检出问题',
  106: '代码复测中',
  107: '已完成'
}
export const odinStatus = [
  {value: 'sdl_creating', label: '待RD创建SDL工单'},
  {value: 'SafeApproving', label: '待审批'},
  {value: 'approved', label: '已审批'},
  {value: 'rejected', label: '已拒绝'}
]
export const safeApprover = [
  {value: 'wanghaozach', label: '王昊'},
  {value: 'liuxiaofengsec', label: '刘潇锋'},
  {value: 'wangyanwei', label: '王彦伟'},
  {value: 'fanshiqiang', label: '范世强'},
  {value: 'huanqi', label: '胡岸琪'},
  {value: 'liukaiwen', label: '刘凯文'},
  {value: 'zhangyukun', label: '张煜昆'}
]

export const vulType = [
  {'value': 1001, 'label': 'Web安全漏洞'},
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
  {'value': 1033, 'label': '其他'},
  {'value': 1002, 'label': '系统网络安全漏洞'},
  {'value': 1034, 'label': 'DDOS'},
  {'value': 1035, 'label': '远程代码执行'},
  {'value': 1036, 'label': '未授权端口'},
  {'value': 1037, 'label': '服务器弱口令'},
  {'value': 1038, 'label': '未授权访问/权限绕过'},
  {'value': 1039, 'label': '系统/服务运维配置不当'},
  {'value': 1040, 'label': '敏感信息泄露'},
  {'value': 1041, 'label': '其他'},
  {'value': 1003, 'label': '移动客户端安全漏洞'},
  {'value': 1042, 'label': '不安全加密'},
  {'value': 1043, 'label': '代码逻辑漏洞'},
  {'value': 1044, 'label': '拒绝服务漏洞'},
  {'value': 1045, 'label': '非授权访问/认证绕过'},
  {'value': 1046, 'label': '敏感信息泄露'},
  {'value': 1047, 'label': '钓鱼欺骗'},
  {'value': 1048, 'label': '代码执行'},
  {'value': 1049, 'label': '证书校验漏洞'},
  {'value': 1050, 'label': '组件权限漏洞'},
  {'value': 1051, 'label': '其他'},
  {'value': 1093, 'label': '数据安全漏洞'},
  {'value': 1094, 'label': '内部(C2)数据泄露'},
  {'value': 1095, 'label': '秘密(C3)数据泄露'},
  {'value': 1096, 'label': '机密(C4)数据泄露'},
  {'value': 1097, 'label': '其他'},
  {'value': 1172, 'label': '注册漏洞'},
  {'value': 1174, 'label': '人脸漏洞'},
  {'value': 1176, 'label': '处罚解除漏洞'},
  {'value': 1178, 'label': '业务规则绕过'},
  {'value': 1180, 'label': '账号漏洞'},
  {'value': 1182, 'label': '套现'},
  {'value': 1184, 'label': '恶意行为'},
  {'value': 1186, 'label': '刷单刷服务分'},
  {'value': 1188, 'label': '营销活动作弊'},
  {'value': 1190, 'label': '作弊软件'},
  {'value': 1192, 'label': '新型作弊情报'},
  {'value': 1194, 'label': '其他'},
  {'value': 1091, 'label': '其他'}
]

export const baselineConfirmStatus = [
  {value: 0, label: '未处理', name: 'BASELINE_STATUS_PENDING', color: 'gray'},
  {value: 1, label: '待改进', name: 'BASELINE_STATUS_TO_BE_IMPROVED', color: 'yellow'},
  {value: 2, label: '不适用', name: 'BASELINE_STATUS_NOT_APPLICABLE', color: 'red'},
  {value: 3, label: '已满足', name: 'BASELINE_STATUS_SATISFIED', color: 'blue'},
  {value: 4, label: '已满足-有规则', name: 'BASELINE_STATUS_SATISFIED_HAVING_RULES', color: 'blue'},
  {value: 5, label: '已满足-无规则', name: 'BASELINE_STATUS_SATISFIED_NO_RULES', color: 'red'},
  {value: 6, label: '已满足-语言不支持', name: 'BASELINE_STATUS_SATISFIED_LANG_UNSUPPORTED', color: 'red'},
  {value: 7, label: '待改进-有规则', name: 'BASELINE_STATUS_TO_BE_IMPROVED_HAVING_RULES', color: 'yellow'},
  {value: 8, label: '待改进-无规则', name: 'BASELINE_STATUS_TO_BE_IMPROVED_NO_RULES', color: 'yellow'},
  {value: 9, label: '待改进-语言不支持', name: 'BASELINE_STATUS_TO_BE_IMPROVED_LANG_UNSUPPORTED', color: 'yellow'},
  {value: 10, label: '检测通过', name: 'BASELINE_STATUS_CHECK_PASS', color: 'green'},
  {value: 11, label: '检测不通过', name: 'BASELINE_STATUS_CHECK_NOT_PASS', color: 'red'},
  {value: 12, label: '确认不适用', name: 'BASELINE_STATUS_CONFIRM_NOT_APPLICABLE', color: 'gray'},
  {value: 13, label: '已修复', name: 'BASELINE_STATUS_FIXED', color: 'blue'},
  {value: 14, label: '接受风险上线', name: 'BASELINE_STATUS_ACCEPT_RISK', color: 'red'},
  {value: 20, label: '检测异常转人工', color: 'red'}
]

export const baselineFirstConfirmStatus = [
  {value: 0, label: '未处理'},
  {value: 1, label: '待改进'},
  {value: 2, label: '不需要'},
  {value: 3, label: '已满足'}
]

export const source = [
  {value: 0, label: 'sdl平台'},
  {value: 1, label: 'odin平台'},
  {value: 2, label: 'oe平台'},
  {value: 3, label: 'soc平台'}
]

export const baselineReconfirmStatus = [
  {value: 2, label: '不需要'},
  {value: 1, label: '待改进'},
  {value: 3, label: '已满足'},
  {value: 12, label: '确认不适用'},
  {value: 4, label: '已满足-有规则', disabled: true},
  {value: 5, label: '已满足-无规则', disabled: true},
  {value: 6, label: '已满足-语言不支持', disabled: true}
]

export const baselineReconfirmStatus2 = [
  {value: 1, label: '待改进'},
  {value: 3, label: '已满足'},
  {value: 11, label: '检测不通过'},
  {value: 13, label: '已修复'},
  {value: 14, label: '接受风险上线'}
]

export const baselineReconfirmStatus3 = [
  {value: 1, label: '待改进', disabled: true},
  {value: 3, label: '已满足'},
  {value: 14, label: '接受风险上线'}
]

export const baselineReconfirmStatus4 = [
  {value: 3, label: '已满足', disabled: true},
  {value: 1, label: '待改进'}
]

export const baselineReconfirmStatus5 = [
  {value: 11, label: '检测不通过', disabled: true},
  {value: 13, label: '已修复'},
  {value: 14, label: '接受风险上线'}
]

export const baselineReconfirmStatus6 = [
  {value: 13, label: '已修复', disabled: true},
  {value: 11, label: '检测不通过'}
]

export const baselineReconfirmStatus7 = [
  {value: 14, label: '接受风险上线', disabled: true},
  {value: 1, label: '待改进'},
  {value: 3, label: '已满足'},
  {value: 11, label: '检测不通过'},
  {value: 13, label: '已修复'}
]

export const ruleResults = [
  {value: 0, label: '不通过'},
  {value: 1, label: '通过'}
]

export const ruleModes = [
  {value: 0, label: '黑名单'},
  {value: 1, label: '白名单'}
]

export const issueStatus = [
  {value: 0, label: '未处理'},
  {value: 1, label: '已修复'},
  {value: 2, label: '误报'},
  {value: 3, label: '确认误报'},
  {value: 4, label: '不修复接受风险'},
  {value: 5, label: '延迟修复'}
]

export const issueStatus1 = [
  {value: 0, label: '未处理'},
  {value: 1, label: '已修复'},
  {value: 2, label: '误报'},
  {value: 4, label: '不修复接受风险'},
  {value: 5, label: '延迟修复'}
]

export const testTaskType = [
  {value: 0, label: '首测'},
  {value: 1, label: '复测'},
  {value: 2, label: '定时复测'},
  {value: 3, label: '待改进基线测试'}
]

export const testTaskStatus = [
  {value: 0, label: '未开始'},
  {value: 1, label: '运行中'},
  {value: 2, label: '任务完成'},
  {value: 3, label: '没有Git权限'},
  {value: 4, label: '构建失败'},
  {value: 5, label: '检测异常'}
]

export const testType = [
  {value: 0, label: '保留'},
  {value: 1, label: 'Cobra检测'},
  {value: 2, label: '自研白盒'},
  {value: 3, label: 'Checkmarx'},
  {value: 4, label: 'Octopus'}
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
