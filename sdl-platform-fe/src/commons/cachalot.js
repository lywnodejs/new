export const vulStatus = [
    {value: 0, label: '待确认'},
    {value: 1, label: '待修复'},
    {value: 2, label: '待修复且延期中'},
    {value: 3, label: '修复中'},
    {value: 4, label: '修复中且延期中'},
    {value: 5, label: '已修复'},
    {value: 6, label: '确认不修复'},
    {value: 7, label: '验证不修复'},
    {value: 8, label: '不修复结束'},
    {value: 9, label: '修复完成'},
    {value: 10, label: '确认被忽略'},
    {value: 11, label: '已忽略'}
]

export const vulLevel = [
    {value: 0, label: '(S0)严重'},
    {value: 1, label: '(S1)高危'},
    {value: 2, label: '(S2)中危'},
    {value: 3, label: '(S3)低危'},
    {value: 4, label: '忽略'},
    {value: 10, label: '未定级'}
]

// 漏洞一级分类
export const vulType1 = [
    {value: 1001, label: 'Web安全漏洞'},
    {value: 1003, label: '移动客户端安全漏洞'}
]

// 漏洞二级分类 web安全漏洞
export const vulType2Web = [
    {value: 1006, label: '普通反射型XSS'},
    {value: 1007, label: 'DOM型的XSS'},
    {value: 1008, label: 'Flash型的XSS'},
    {value: 1009, label: '存储型XSS'},
    {value: 1010, label: 'CSRF'},
    {value: 1011, label: '登录接口认证漏洞'},
    {value: 1012, label: 'CRLF注入'},
    {value: 1013, label: 'SQL注入'},
    {value: 1014, label: '远程命令执行'},
    {value: 1015, label: '任意代码执行'},
    {value: 1016, label: '文件包含'},
    {value: 1017, label: '管理后台对外'},
    {value: 1018, label: '列目录'},
    {value: 1019, label: 'SSRF'},
    {value: 1020, label: '越权'},
    {value: 1021, label: '其他业务逻辑漏洞'},
    {value: 1022, label: '用户敏感信息泄漏'},
    {value: 1023, label: '上传漏洞'},
    {value: 1024, label: '文件读取'},
    {value: 1025, label: 'URL跳转'},
    {value: 1026, label: 'ClickJacking'},
    {value: 1027, label: '拒绝服务'},
    {value: 1028, label: '远程拒绝服务'},
    {value: 1029, label: 'JSON劫持'},
    {value: 1030, label: '目录穿越'},
    {value: 1031, label: 'SEO暗链'},
    {value: 1032, label: '短信SPAM'},
    {value: 1252, label: 'XML外部实体注入'},
    {value: 1254, label: '认证信息明文传输'},
    {value: 1256, label: '敏感文件泄漏'},
    {value: 1258, label: '敏感信息不安全存储'},
    {value: 1260, label: '遗留后门'},
    {value: 1262, label: 'LDAP注入'},
    {value: 1264, label: '硬编码'},
    {value: 1265, label: '第三方组件安全漏洞'},
    {value: 1266, label: '证书验证漏洞'},
    {value: 1268, label: '弱加密算法'},
    {value: 1270, label: '不安全随机数'},
    {value: 1525, label: '未授权访问'},
    {value: 2031, label: '客户端IP伪造'},
    {value: 1033, label: '其他'}
]

// 漏洞二级分类 移动客户端安全漏洞
export const vulType2Mobile = [
    {value: 1042, label: '不安全加密'},
    {value: 1043, label: '代码逻辑漏洞'},
    {value: 1044, label: '拒绝服务漏洞'},
    {value: 1045, label: '敏感非授权访问/认证绕过'},
    {value: 1046, label: '敏感信息泄露'},
    {value: 1047, label: '钓鱼欺骗'},
    {value: 1048, label: '代码执行'},
    {value: 1049, label: '证书校验漏洞'},
    {value: 1050, label: '组件权限漏洞'},
    {value: 1051, label: '其他'}
]

// 漏洞一级来源
export const vulSource1 = [
    {value: 1056, label: '内部'},
    {value: 1057, label: '外部'},
    {value: 1058, label: '其他'}
]

// 漏洞二级来源 内部
export const vulSource2Internal = [
    {'value': 1059, 'label': '安全扫描'},
    {'value': 1060, 'label': '安全监控'},
    {'value': 1061, 'label': '安全评估'},
    {'value': 1062, 'label': '内部报告'},
    {'value': 1063, 'label': '舆情监控'},
    {'value': 1101, 'label': '云盾'},
    {'value': 1213, 'label': 'SDL-白盒测试'},
    {'value': 1214, 'label': 'SDL-黑盒测试-预发自动化'},
    {'value': 1360, 'label': 'SDL-黑盒测试-办公网线下全量'},
    {'value': 1369, 'label': 'SDL-移动安全'},
    {'value': 1370, 'label': 'SDL-黑盒测试-线下Docker'},
    {'value': 1371, 'label': 'SDL-黑盒测试-云测自动化'},
    {'value': 1372, 'label': 'SDL-安全评估'},
    {'value': 1373, 'label': 'SDL-黑盒测试-线上扫描'},
    {'value': 1600, 'label': 'SDL-开源组件扫描'},
    {'value': 1381, 'label': 'SDL-开源组件扫描-应急'},
    {'value': 1309, 'label': 'SDL-基线评估'},
    {'value': 2063, 'label': 'SDL-自研白盒'},
    {'value': 1064, 'label': '其他'}
]

// 漏洞二级来源 外部
export const vulSource2External = [
    {'value': 1065, 'label': 'DSRC'},
    {'value': 1066, 'label': '邮件'},
    {'value': 1067, 'label': '新闻'},
    {'value': 1068, 'label': '论坛'},
    {'value': 1069, 'label': '其他'},
    {'value': 1531, 'label': 'HackerOne'}
]

// 漏洞二级来源 其他
export const vulSource2Other = [
    {'value': 1092, 'label': '其他'}
]

export const isR2 = [
    {'value': 0, 'label': '否'},
    {'value': 1, 'label': '是'}
]

export const isRepetitive = [
    {'value': 0, 'label': '否'},
    {'value': 1, 'label': '是'}
]

export const isWhatReason = [
    {value: 0, label: '未指定'},
    {value: 1, label: '扫描未覆盖'},
    {value: 2, label: '规则未覆盖'}
]

export const isWhoseResponsibility = [
    {value: 0, label: '未指定'},
    {value: 1, label: 'SDL'},
    {value: 2, label: '业务方'}
]

// 黑盒规则转化
export const isTransformBlack = [
    {value: 0, label: '不需要'},
    {value: 1, label: '待添加'},
    {value: 2, label: '已完成'}
]

// 白盒规则转化
export const isTransformWhite = [
    {value: 0, label: '不需要'},
    {value: 1, label: '待添加'},
    {value: 2, label: '已完成'}
]

// 移动端规则转化
export const isTransformMobile = [
    {value: 0, label: '不需要'},
    {value: 1, label: '待添加'},
    {value: 2, label: '已完成'}
]

// 安全设计规范转化
export const isTransformDesign = [
    {value: 0, label: '不需要'},
    {value: 1, label: '待添加'},
    {value: 2, label: '已完成'}
]

export const vulType = [
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
    },
    {
    'value': 1003,
    'label': '移动客户端安全漏洞',
    'children': [
        {'value': 1042, 'label': '不安全加密'},
        {'value': 1043, 'label': '代码逻辑漏洞'},
        {'value': 1044, 'label': '拒绝服务漏洞'},
        {'value': 1045, 'label': '非授权访问/认证绕过'},
        {'value': 1046, 'label': '敏感信息泄露'},
        {'value': 1047, 'label': '钓鱼欺骗'},
        {'value': 1048, 'label': '代码执行'},
        {'value': 1049, 'label': '证书校验漏洞'},
        {'value': 1050, 'label': '组件权限漏洞'},
        {'value': 1051, 'label': '其他'}]
    }
]

export const vulSource = [
    {
    'value': 1056,
    'label': '内部',
    'children': [
        {'value': 1059, 'label': '安全扫描'},
        {'value': 1060, 'label': '安全监控'},
        {'value': 1061, 'label': '安全评估'},
        {'value': 1062, 'label': '内部报告'},
        {'value': 1063, 'label': '舆情监控'},
        {'value': 1101, 'label': '云盾'},
        {'value': 1213, 'label': 'SDL-白盒测试'},
        {'value': 1214, 'label': 'SDL-黑盒测试-预发自动化'},
        {'value': 1360, 'label': 'SDL-黑盒测试-办公网线下全量'},
        {'value': 1369, 'label': 'SDL-移动安全'},
        {'value': 1370, 'label': 'SDL-黑盒测试-线下Docker'},
        {'value': 1371, 'label': 'SDL-黑盒测试-云测自动化'},
        {'value': 1372, 'label': 'SDL-安全评估'},
        {'value': 1373, 'label': 'SDL-黑盒测试-线上扫描'},
        {'value': 1600, 'label': 'SDL-开源组件扫描'},
        {'value': 1381, 'label': 'SDL-开源组件扫描-应急'},
        {'value': 1309, 'label': 'SDL-基线评估'},
        {'value': 2063, 'label': 'SDL-自研白盒'},
        {'value': 1999, 'label': '渗透测试'},
        {'value': 1064, 'label': '其他'}]
    },
    {
    'value': 1057,
    'label': '外部',
    'children': [
        {'value': 1065, 'label': 'DSRC'},
        {'value': 1066, 'label': '邮件'},
        {'value': 1067, 'label': '新闻'},
        {'value': 1068, 'label': '论坛'},
        {'value': 1069, 'label': '其他'},
        {'value': 1531, 'label': 'HackerOne'}]
    },
    {
    'value': 1058,
    'label': '其他',
    'children': [
        {'value': 1092, 'label': '其他'}]
    }
]

export const R2VulStatus = [
    {value: 101, label: 'R2漏洞'},
    {value: 102, label: '扫描未覆盖'},
    {value: 103, label: '手工分析'},
    {value: 104, label: '转换/覆盖'},
    {value: 105, label: '分析完成'}
]

export const processTransformStatus = [
    {value: 110, label: 'TODO'},
    {value: 111, label: 'DOING'},
    {value: 112, label: 'DONE'}
]

export const projectStatus = [
    {
      'value': 101,
      'label': 'R2漏洞'
    },
    {
      'value': 102,
      'label': '扫描未覆盖'
    },
    {
        'value': 103,
        'label': '手工分析'
      },
      {
        'value': 104,
        'label': '转换/覆盖',
        'children': [
          {value: 'design_transform', label: '设计转换'},
          {value: 'white_transform', label: '白盒转换'},
          {value: 'process_transform', label: '流程卡点转换'},
          {value: 'black_transform', label: '黑盒转换'},
          {value: 'mobile_transform', label: '移动端转换'}]
      },
      {
        'value': 105,
        'label': '分析完成'
      }
]

export const engineer = [
    {value: 'fanshiqiang', label: '范世强', dingId: 'lgfqbp0'},
    {value: 'xuzheming', label: '许哲铭', dingId: 'gm9i40e'},
    {value: 'wywwangyanwei', label: '王言伟', dingId: 'gm9i40e'},
    {value: 'liukaiwen', label: '刘凯文', dingId: 'vrcicjh'},
    {value: 'wenxin_i', label: '温馨'},
    {value: 'liliang_i', label: '李良'},
    {value: 'zhuzixuan_i', label: '祝紫轩'},
    {value: 'chenhaojun', label: '陈浩军', dingId: 'gm9i40e'},
    {value: 'zhangyukun', label: '张煜昆', dingId: 'kl6-21szurt40'},
    {value: 'wangyilaniris', label: '王一岚', dingId: 'c793nqi'},
    {value: 'panshuoyu', label: '潘烁宇', dingId: 'v25eigd'},
    {value: 'sakihuangcan', label: '黄灿', dingId: 'me5ajez'},
    {value: 'liuxiaofengsec', label: '刘潇锋', dingId: 'leolxf'},
    {value: 'qinbo', label: '秦波', dingId: 'bobkey'},
    {value: 'yangjuanjuan', label: '杨娟娟', dingId: 'uiwl638'},
    {value: 'shaozun', label: '邵尊', dingId: 'j1lzloy'},
    {value: 'huanqi', label: '胡岸琪', dingId: 'gm9i40e'},
    {value: 'panxiting', label: '潘玺廷', dingId: 'ht3il1l'},
    {value: 'wanghaozach', label: '王昊', dingId: 'y2xhqn7'},
    {value: 'wangyanwei', label: '王彦伟', dingId: 'p9cg0x1'},
    {value: 'lijie1', label: '李杰', dingId: 'gm9i40e'},
    {value: 'ryancaohui_i', label: '曹辉', dingId: 'gm9i40e'},
    {value: 'zhangmiao_i', label: '张苗', dingId: 'gm9i40e'},
    {value: 'harleywangxiaotong_i', label: '王晓彤', dingId: 'gm9i40e'}
]
