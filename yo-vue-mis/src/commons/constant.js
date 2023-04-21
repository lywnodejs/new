export const APP_AJAX_TIMEOUT = 0
export const APP_AJAX_BASEURL = '/admin'

export const APP_BASEURL = '/'
export const APP_ROUTE_MODE = 'history'
export const APP_ROUTE_SEC = 'app-router'

export const APP_THEME_DEFAULT = 'default'
export const APP_THEME_BLUE = 'blue'
export const APP_THEME_ORANGE = 'orange'

export const APP_LANG_ZH = 'zh'

export const APP_ERROR_404 = 'error_404'
export const APP_ERROR_403 = 'error_403'

export const APP_EVENT_PREFIX = 'app-event'

export const APP_SERVER_ERROR = '未知错误'
export const APP_PROCESS_ERROR = '接口处理错误'
export const APP_FORMAT_ERROR = '接口数据格式错误'
export const APP_FORMDATA_ERROR = '请使用FormData格式'
export const APP_PROCESS_HINT = '请检查参数，接口是否正确'
export const APP_FORMAT_HINT = '请检查数据返回格式'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

// 数据字典
export const CODE_TYPE_PROTOCOL = 10000           // URL访问协议
export const CODE_TYPE_METHOD = 10010             // URL请求方式
export const CODE_TYPE_AUDIT = 10020              // 数据处理状态
export const CODE_TYPE_DATA_LEVEL = 10030         // 数据级别
export const CODE_TYPE_BOOLEAN = 10040            // 布尔状态
export const CODE_TYPE_SIGNATURE_STATUS = 10050   // URL签名验证状态
export const CODE_TYPE_POSITION = 10060           // URL参数位置
export const CODE_TYPE_LEVEL = 10070              // 规则优先级
export const CODE_TYPE_PARAM_STATUS = 10090       // URL参数状态
export const CODE_TYPE_RULE_TYPE = 10100          // URL规则类型
export const CODE_TYPE_DOMAIN_TYPE = 10130 // 域名类型
export const CODE_TYPE_DOMAIN_SOURCE = 10140 // 域名数据来源
export const CODE_TYPE_DOMAIN_RES = 10150 // 域名解析

export const DARA_STATUS_ON = 1                    // 数据启用/有效数据
export const DARA_STATUS_OFF = 0                   // 禁用
export const DARA_STATUS_IGNORE = 9                // 删除/忽略

export const DATE_OPTIONS = {
  shortcuts: [{
      text: '最近一周',
      onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
      }
  }, {
      text: '最近30天',
      onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', [start, end]);
      }
  }, {
      text: '最近90天',
      onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit('pick', [start, end]);
      }
  }, {
    text: '本月',
    onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setDate(1);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        picker.$emit('pick', [start, end]);
    }
}, {
  text: '上月',
  onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
      start.setMilliseconds(0);
      end.setDate(0);
      end.setHours(0);
      end.setMinutes(0);
      end.setSeconds(0);
      end.setMilliseconds(0);
      picker.$emit('pick', [start, end]);
  }
}]
}

export const LOOPHOLE_STATUS_OPTIONS = ['待确认', '待修复', '修复中', '已关闭', '已忽略']

export const DATA_STATUS_OPTIONS = [{
    code: 1,
    name: '启用'
  }, {
    code: 0,
    name: '禁用'
  }]

export const DATA_HAVE_OPTIONS = [{
    code: 0,
    name: '无'
  }, {
    code: 1,
    name: '有'
  }]

export const LOG_MESSAGE_TYPE_OPTION = [{
  value: 180,
  from: '1',
  label: '首页滚动图片添加'
}, {
  value: 181,
  from: '1',
  label: '首页滚动图片编辑'
}, {
  value: 182,
  from: '1',
  label: '首页滚动图片删除'
}, {
  value: 160,
  from: '1',
  label: '添加字典'
}, {
  value: 161,
  from: '1',
  label: '编辑字典'
}, {
  value: 102,
  from: '1',
  label: '漏洞编辑'
}, {
  value: 103,
  from: '2',
  label: '漏洞评论添加'
}, {
  value: 100,
  from: '0',
  label: '漏洞添加'
}, {
  value: 140,
  from: '2',
  label: '礼品提交'
}, {
  value: 171,
  from: '1',
  label: '编辑兑换信息'
}, {
  value: 110,
  from: '1',
  label: '礼品添加or更新'
}, {
  value: 111,
  from: '1',
  label: '礼品删除'
}, {
  value: 1,
  from: '2',
  label: '登陆信息'
}, {
  value: 2,
  from: '2',
  label: '登出信息'
}, {
  value: 120,
  from: '1',
  label: '文章添加'
}, {
  value: 121,
  from: '1',
  label: '文章删除'
}, {
  value: 122,
  from: '1',
  label: '文章置顶'
}, {
  value: 123,
  from: '1',
  label: '文章置顶取消'
}, {
  value: 130,
  from: '1',
  label: '添加or更新漏洞短信'
}, {
  value: 131,
  from: '1',
  label: '删除漏洞短信'
}, {
  value: 190,
  from: '1',
  label: '漏洞列表导出'
}, {
  value: 191,
  from: '1',
  label: '用户列表导出'
}, {
  value: 192,
  from: '1',
  label: '兑换记录导出'
}]

// 京东卡面值
export const DJ_VALUE_OPTION = [{
  value: 1000,
  label: '1000元'
}, {
  value: 500,
  label: '500元'
}, {
  value: 100,
  label: '100元'
}, {
  value: 50,
  label: '50元'
}]

// 兑换类型
export const DEALS_TYPE = [{
  value: 0,
  label: '积分兑换'
}, {
  value: 1,
  label: '活动奖励'
}]

// 状态
export const STATUS_OPTION = [{
  value: 1,
  label: '已发放'
}, {
  value: 0,
  label: '未发放'
}]

export const READ_OPTION = [{
  value: 1,
  label: '已读'
}, {
  value: 0,
  label: '未读'
}]
