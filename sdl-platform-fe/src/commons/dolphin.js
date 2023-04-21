export const stride = [
  {value: 'S', label: '假冒(S)'},
  {value: 'T', label: '篡改(T)'},
  {value: 'R', label: '否认(R)'},
  {value: 'I', label: '信息泄露(I)'},
  {value: 'D', label: '拒绝服务(D)'},
  {value: 'E', label: '权限提升(E)'}
]
export const threatLevel = [
  {value: 1, label: '高'},
  {value: 2, label: '中'},
  {value: 3, label: '低'}
]
export const vulLevel = [
  {value: 0, label: '严重(S0)'},
  {value: 1, label: '高危(S1)'},
  {value: 2, label: '中危(S2)'},
  {value: 3, label: '低危(S3)'}
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
export const platform = [
  {value: 'iOS', label: 'iOS'},
  {value: 'Android', label: 'Android'},
  {value: 'IoT', label: 'IoT'},
  {value: '其它', label: '其它'}
]
export const vulLanguage = [
  {value: '通用', label: '通用'},
  {value: 'Java', label: 'Java'},
  {value: 'PHP', label: 'PHP'},
  {value: 'Golang', label: 'Golang'},
  {value: 'Python', label: 'Python'},
  {value: 'C/C++', label: 'C/C++'},
  {value: 'JavaScript', label: 'JavaScript'},
  {value: '其它', label: '其它'}
]
export const vulPlatform = [
  {value: 'Web', label: 'Web'},
  {value: 'iOS', label: 'iOS'},
  {value: 'Android', label: 'Android'},
  {value: 'IoT', label: 'IoT'},
  {value: '其它', label: '其它'}
]

export const projectLanguage = [
  {value: 'Java', label: 'Java'},
  {value: 'Golang', label: 'Golang'},
  {value: 'PHP', label: 'PHP'},
  {value: 'JavaScript', label: 'JavaScript'},
  {value: 'Python', label: 'Python'},
  {value: 'JSON', label: 'JSON'},
  {value: 'HTML', label: 'HTML'},
  {value: 'C/C++', label: 'C/C++'},
  {value: 'SQL', label: 'SQL'},
  {value: 'XML', label: 'XML'},
  {value: '其它', label: '其它'},
  {value: '通用', label: '通用'}
]

export const projectLevel = [
  {value: 'A', label: 'A'},
  {value: 'B', label: 'B'},
  {value: 'C', label: 'C'},
  {value: 'D', label: 'D'}
]

export const projectType = [
  {value: '出行类服务', label: '出行类服务'},
  {value: '金融服务', label: '金融服务'},
  {value: '公共服务', label: '公共服务'},
  {value: 'MIS系统', label: 'MIS系统'},
  {value: 'laaS产品', label: 'laaS产品'},
  {value: 'SaaS产品', label: 'SaaS产品'},
  {value: '内部平台', label: '内部平台'},
  {value: '运营活动H5', label: '运营活动H5'},
  {value: '端上外链第三方H5或JS', label: '端上外链第三方H5或JS'},
  {value: '外采第三方SaaS服务', label: '外采第三方SaaS服务'},
  {value: '其它', label: '其它'}
]

export const projectProperty = [
  {value: '新项目上线', label: '新项目上线'},
  {value: '旧项目迭代', label: '旧项目迭代'},
  {value: '旧项目重构', label: '旧项目重构'},
  {value: '其它', label: '其它'}
]

export const SDLProjectProperty = [
  {value: '新项目上线', label: '新项目上线'},
  {value: '旧项目迭代', label: '旧项目迭代'},
  {value: '旧项目重构', label: '旧项目重构'},
  {value: '内部测试', label: '内部测试'},
  {value: '其它', label: '其它'}
]

export const accessInternet = [
  {value: '0', label: '从外网访问不到，只能在内网访问'},
  {value: '1', label: '从外网可以直接访问到当前服务，没有API网关'},
  {value: '2', label: '从外网可以通过API网关访问到当前服务'},
  {value: '3', label: '从外网可以通过Node代理层访问到当前服务'}
]
export const isSystem = [
  {value: 0, label: '一个独立的系统，如MIS系统'},
  {value: 1, label: '系统中的某个服务或模块，如数据引擎'},
  {value: 2, label: '纯前端页面'}
]
export const isOffshore = [
  {value: '0', label: '否'},
  {value: '1', label: '是'}
]

export const isPurchase = [
  {value: '0', label: '否'},
  {value: '1', label: '是'}
]

export const serviceInvoker = [
  {label: '没有前端页面',
   options: [
    {value: '外网服务', label: '外网服务'},
    {value: '内网服务', label: '内网服务', disabled: true},
    {value: '不提供接口', label: '不提供接口'}
  ]},
  {label: '有前端页面',
   options: [
    {value: '前端页面', label: '前端页面'},
    {value: 'IOT设备', label: 'IOT设备'},
    {value: '手机APP', label: '手机APP'},
    {value: '手机H5', label: '手机H5'},
    {value: '微信类小程序', label: '微信类小程序'}
  ]}
]

export const projectServiceInvoker = [
  {value: '前端页面', label: '前端页面'},
  {value: 'IOT设备', label: 'IOT设备'},
  {value: '手机APP', label: '手机APP'},
  {value: '手机H5', label: '手机H5'},
  {value: '微信类小程序', label: '微信类小程序'},
  {value: '外网服务', label: '外网服务'},
  {value: '内网服务', label: '内网服务'},
  {value: '不提供接口', label: '不提供接口'}
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

export const dataLevel = [
  {value: 'C1', label: 'C1-非敏感'},
  {value: 'C2', label: 'C2-低敏感'},
  {value: 'C3', label: 'C3-中敏感'},
  {value: 'C4', label: 'C4-高敏感'}
]

export const isForced = [
  {'value': 0, 'label': '否'},
  {'value': 1, 'label': '是'}
]

export const baselineType = [
  {
    'value': 1,
    'label': '自研项目安全基线',
    'children': [
        {'value': 1,
        'label': '服务端安全基线',
        'children': [
          {'value': 1, 'label': '身份认证'},
          {'value': 2, 'label': '资源控制'},
          {'value': 3, 'label': '日志审计'},
          {'value': 4, 'label': '敏感信息控制'},
          {'value': 5, 'label': '权限控制'},
          {'value': 6, 'label': '输入输出验证'},
          {'value': 7, 'label': '第三方组件安全'},
          {'value': 8, 'label': '加密机制'},
          {'value': 9, 'label': '其他'}
          ]
        },
        {'value': 2, 'label': 'APP安全基线'},
        {'value': 3, 'label': 'IoT安全基线'}
      ]
    },
    {
      'value': 2,
      'label': '外采项目安全基线',
      'children': [
          {'value': 1,
          'label': '供应商安全资质基线',
          'children': [
            {'value': 1, 'label': '运维管理'},
            {'value': 2, 'label': '行业资质'},
            {'value': 3, 'label': '风险管理'},
            {'value': 4, 'label': '安全审计'}
            ]
          },
          {'value': 2,
          'label': '系统与网络安全基线',
          'children': [
            {'value': 1, 'label': '入侵防范'},
            {'value': 2, 'label': '访问控制'},
            {'value': 3, 'label': '网络架构'}
            ]
          }]
      }
]

export const isDisabled = [
  {'value': 0, 'label': '否'},
  {'value': 1, 'label': '是'}
]

export const ruleMode = [
  {'value': 0, 'label': '黑名单规则'},
  {'value': 1, 'label': '白名单规则'}
]

export const trust = [
  {'value': 0, 'label': '不可信'},
  {'value': 1, 'label': '需人工审计'},
  {'value': 2, 'label': '可信'}
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

