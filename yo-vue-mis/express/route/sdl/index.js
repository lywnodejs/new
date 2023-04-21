/**
 *
 * @param {*} app Express App服务器
 */
const path = require('path'),
  ROOT = require('../../Constanst').ROOT

module.exports = function (app) {

  /**
   * 显示的主页
   */
  app.get('/project/mis/sdl.html', (req, rsp) => {
    rsp.sendFile(path.resolve(ROOT, './index.html'))
  })

  app.post('/sdl/claim', (req, rsp) => {
    let index = Math.round(Math.random()),
      errno = 0,
      errmsg = 'ok'
    if (index > 0) {
      errno = 1005,
        errmsg = '代码扫描任务已被认领'
    }
    rsp.json({
      errno,
      errmsg
    })
  })

  app.post('/sdl/changeVulnAuditStatus', (req, rsp) => {
    rsp.json({
      "errno": "1005",
      "errmsg": "the logon user has no permissions"
    })
  })

  app.post('/inStats/secplate/udpateSecPlate', (req, rsp) => {
    setTimeout(() => {
      rsp.json({
        "errno": 0,
        "errmsg": "the logon user has no permissions"
      })
    }, 2000)
  })

  app.post('/sdl/commitVulnAuditResult', (req, rsp) => {
    setTimeout(() => {
      rsp.json({
        "errno": 0,
        "errmsg": "the logon user has no permissions"
      })
    }, 3000)
  })



  app.get('/sdl/dept', (req, rsp) => {
    const len = Math.round(Math.random() * 10),
      results = []
    for (let i = 0; i < len; i++) {
      results.push({
        label: 'LABEL_' + len + i,
        value: len + i
      })
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1388', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1490,
        "dName": "ODIN部署",
        "parentId": 1388,
        "linkContent": null
      }, {
        "id": 1492,
        "dName": "人工创建",
        "parentId": 1388,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1320', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1321,
        "dName": "处置中",
        "parentId": 1320,
        "linkContent": null
      }, {
        "id": 1322,
        "dName": "调查中",
        "parentId": 1320,
        "linkContent": null
      }, {
        "id": 1323,
        "dName": "已关闭",
        "parentId": 1320,
        "linkContent": null
      }, {
        "id": 1324,
        "dName": "终止",
        "parentId": 1320,
        "linkContent": null
      }, {
        "id": 1325,
        "dName": "误报",
        "parentId": 1320,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })


  app.get('/dictionary/listByDataAuth/1550', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1551,
        "dName": "18年场景",
        "parentId": 1550,
        "linkContent": {
          "tip": "2018年已有的违规场景检测出的事件"
        }
      }, {
        "id": 1552,
        "dName": "权限不合规",
        "parentId": 1550,
        "linkContent": null
      }, {
        "id": 1553,
        "dName": "安全意识不到位",
        "parentId": 1550,
        "linkContent": {
          "tip": "以下条件全部满足：1. 能明确找到相关责任人的事件。2.责任人未获利且不知道该行为是违规的事件。"
        }
      }, {
        "id": 1554,
        "dName": "不涉及以上标签",
        "parentId": 1550,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1330', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1340,
        "dName": "内网安全-其它",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1333,
        "dName": "内网安全-横向攻击",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1336,
        "dName": "内网安全-病毒木马",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1335,
        "dName": "内网安全-钓鱼邮件",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1334,
        "dName": "内网安全-黑客入侵",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1339,
        "dName": "内部违规-数据泄露",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1338,
        "dName": "内部违规-账号共享",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1337,
        "dName": "内部违规-违规操作",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1544,
        "dName": "外网边界-0day漏洞",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1355,
        "dName": "外网边界-信息泄露",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1357,
        "dName": "外网边界-其他",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1545,
        "dName": "外网边界-外网入侵",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1356,
        "dName": "外网边界-黑客入侵",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1546,
        "dName": "数据安全-信息泄露-WIKI专项",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1331,
        "dName": "数据安全-信息泄露-其他",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1332,
        "dName": "数据安全-安全风险",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1358,
        "dName": "数据安全-离职异常",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1341,
        "dName": "生产网络-webshell",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1353,
        "dName": "生产网络-刷接口",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1342,
        "dName": "生产网络-反弹shell",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1351,
        "dName": "生产网络-后门木马",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1343,
        "dName": "生产网络-命令注入",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1543,
        "dName": "生产网络-异常DNS解析",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1540,
        "dName": "生产网络-异常登录事件",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1541,
        "dName": "生产网络-异常网络流量",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1350,
        "dName": "生产网络-本地提权",
        "parentId": 1330,
        "linkContent": null
      }, {
        "id": 1352,
        "dName": "生产网络-竞对刷接口",
        "parentId": 1330,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1300', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1301,
        "dName": "一级(低危)",
        "parentId": 1300,
        "linkContent": null
      }, {
        "id": 1302,
        "dName": "二级(中危)",
        "parentId": 1300,
        "linkContent": null
      }, {
        "id": 1303,
        "dName": "三级(高危)",
        "parentId": 1300,
        "linkContent": null
      }, {
        "id": 1304,
        "dName": "四级(严重)",
        "parentId": 1300,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1310', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1311,
        "dName": "主动发现",
        "parentId": 1310,
        "linkContent": null
      }, {
        "id": 1312,
        "dName": "被动发现",
        "parentId": 1310,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1700', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1701,
        "dName": "待确认",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1702,
        "dName": "未评估",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1703,
        "dName": "评估中",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1704,
        "dName": "已结束",
        "parentId": 1700,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1710', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
          "id": 1711,
          "dName": "高危",
          "parentId": 1710,
          "linkContent": null
        },
        {
          "id": 1712,
          "dName": "中危",
          "parentId": 1710,
          "linkContent": null
        },
        {
          "id": 1713,
          "dName": "低危",
          "parentId": 1710,
          "linkContent": null
        }
      ]
    }
    rsp.json(results)
  })


  app.get('/dictionary/listByDataAuth/1880', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1881,
        "dName": "高敏",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1882,
        "dName": "敏感",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1883,
        "dName": "一般",
        "parentId": 1700,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1890', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1891,
        "dName": "SSO",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1892,
        "dName": "passport",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1893,
        "dName": "自建账号管理",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1894,
        "dName": "其他",
        "parentId": 1700,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1900', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1901,
        "dName": "UPM",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1902,
        "dName": "自建授权管理系统",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1909,
        "dName": "其他",
        "parentId": 1700,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1910', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1911,
        "dName": "仅页面控制",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1912,
        "dName": "仅功能控制",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1913,
        "dName": "数量级控制",
        "parentId": 1700,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1920', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1921,
        "dName": "是",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1922,
        "dName": "否",
        "parentId": 1700,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })

  app.get('/dictionary/listByDataAuth/1930', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1931,
        "dName": "公开数据（C1）",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1932,
        "dName": "内部数据（C2）",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1933,
        "dName": "秘密数据（C3）",
        "parentId": 1700,
        "linkContent": null
      }, {
        "id": 1934,
        "dName": "机密数据（C4）",
        "parentId": 1700,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })
  // 检查分灰
  app.get('/dictionary/listByDataAuth/1750', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
        "id": 1751,
        "dName": "检查字典",
        "parentId": 1750,
        "linkContent": null
      }, {
        "id": 1752,
        "dName": "自定义",
        "parentId": 1750,
        "linkContent": null
      }]
    }
    rsp.json(results)
  })
  // 安全评估项目-评估内容
  app.get('/dictionary/listByDataAuth/1730', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
          "id": 1731,
          "dName": "个人隐私评估",
          "parentId": 1730
        },
        {
          "id": 1732,
          "dName": "数据安全",
          "parentId": 1730
        },
        {
          "id": 1733,
          "dName": "系统功能&权限管理",
          "parentId": 1730
        },
        {
          "id": 1734,
          "dName": "代码评估",
          "parentId": 1730
        },
        {
          "id": 1735,
          "dName": "漏洞扫描",
          "parentId": 1730
        },
        {
          "id": 1736,
          "dName": "渗透测试",
          "parentId": 1730
        },
        {
          "id": 1737,
          "dName": "内容安全评估",
          "parentId": 1730
        },
        {
          "id": 1738,
          "dName": "安全审计",
          "parentId": 1730
        },
        {
          "id": 1739,
          "dName": "系统安全",
          "parentId": 1730
        },
        {
          "id": 1740,
          "dName": "其它信息安全问题",
          "parentId": 1730
        }
      ]
    }
    rsp.json(results)
  })

  // 自评结果
  app.get('/dictionary/listByDataAuth/1940', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
          "id": 1941,
          "dName": "待自评",
          "parentId": 1940,
          "linkContent": null
        },
        {
          "id": 1942,
          "dName": "待整改",
          "parentId": 1940,
          "linkContent": null
        },
        {
          "id": 1943,
          "dName": "已整改",
          "parentId": 1940,
          "linkContent": null
        },
        {
          "id": 1944,
          "dName": "不适用",
          "parentId": 1940,
          "linkContent": null
        },
        {
          "id": 1945,
          "dName": "符合",
          "parentId": 1940,
          "linkContent": null
        },
        {
          "id": 1946,
          "dName": "不整改",
          "parentId": 1940,
          "linkContent": null
        }
      ]
    }
    return rsp.json(results)
  })
  // 评估结果
  app.get('/dictionary/listByDataAuth/1720', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
          "id": 1721,
          "dName": "待评估",
          "parentId": 1920
        },
        {
          "id": 1722,
          "dName": "待整改",
          "parentId": 1920
        },
        {
          "id": 1723,
          "dName": "已整改",
          "parentId": 1920
        },
        {
          "id": 1724,
          "dName": "不适用",
          "parentId": 1920
        },
        {
          "id": 1725,
          "dName": "符合",
          "parentId": 1920
        },
        {
          "id": 1726,
          "dName": "不整改",
          "parentId": 1920
        }
      ]
    }
    rsp.json(results)
  })
  // 安全评估项目-整改结果
  app.get('/dictionary/listByDataAuth/1950', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
          "id": 1951,
          "dName": "待整改",
          "parentId": 1950
        },
        {
          "id": 1952,
          "dName": "已整改",
          "parentId": 1950
        },
        {
          "id": 1953,
          "dName": "不适用",
          "parentId": 1950
        },
        {
          "id": 1954,
          "dName": "符合",
          "parentId": 1950
        },
        {
          "id": 1955,
          "dName": "不整改",
          "parentId": 1950
        }
      ]
    }
    rsp.json(results)
  })
  // 检查结果
  app.get('/dictionary/listByDataAuth/1960', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
          "id": 1961,
          "dName": "待检查",
          "parentId": 1960,
          "linkContent": null
        },
        {
          "id": 1962,
          "dName": "待整改",
          "parentId": 1960,
          "linkContent": null
        },
        {
          "id": 1963,
          "dName": "已整改",
          "parentId": 1960,
          "linkContent": null
        },
        {
          "id": 1964,
          "dName": "不适用",
          "parentId": 1960,
          "linkContent": null
        },
        {
          "id": 1965,
          "dName": "符合",
          "parentId": 1960,
          "linkContent": null
        },
      ]
    }
    rsp.json(results)
  })

  // 数据启动状态
  app.get('/dictionary/listByDataAuth/1850', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
          "id": 1851,
          "dName": "启用",
          "parentId": 1850,
          "linkContent": null
        },
        {
          "id": 1852,
          "dName": "禁用",
          "parentId": 1850,
          "linkContent": null
        }
      ]
    }
    rsp.json(results)
  })

  app.get('/pages', (req, rsp) => {
    let total = Math.round(Math.random() * 100),
      data = []
    let size = total > 10 ? 10 : total
    for (let i = 0; i < size; i++) {
      let record = {}
      record.task_create_time = i
      record.task_end_time = i + 10
      record.id = i + 1
      data.push(record)
    }
    rsp.json({
      total,
      data
    })
  })

  app.post('/event/addMyEvent', (req, rsp) => {
    rsp.json({
      "errno": "0",
      "errmsg": "ok"
    })
  })

  app.post('/event/modifyMyEvent', (req, rsp) => {
    rsp.json({
      "errno": "0",
      "errmsg": "ok"
    })
  })

  app.post('/event/revokeMyEvent', (req, rsp) => {
    rsp.json({
      "errno": "0",
      "errmsg": "ok"
    })
  })

  app.get('/event/findMyEventInfo', (req, rsp) => {

    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": {
        "id": 10000,
        "name": "XXXXX平台疑似遭受CC攻击",
        "status": 1284,
        "status_name": "待受理",
        "event_time": "2018-01-24 15:59:09",
        "create_time": "2018-01-24 15:59:09",
        "creator": {
          "department": "信息安全部>安全平台部>安全架构部",
          "email": "zhangsan@didichuxing.com",
          "name": "张三"
        },
        "audit_time": "2018-01-24 15:59:09",
        "auditor": {
          "department": "信息安全部>安全平台部>安全架构部",
          "email": "lisi@didichuxing.com",
          "name": "李四"
        },
        "description": '<p>XXXXX平台疑似遭受CC攻击.......<img src="data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAAPAAAAB4CAYAAAG7sU+xAAABYWlDQ1BrQ0dDb2xvclNwYWNlRGlzcGxheVAzAAAokWNgYFJJLCjIYWFgYMjNKykKcndSiIiMUmB / yMAOhLwMYgwKicnFBY4BAT5AJQwwGhV8u8bACKIv64LMOiU1tUm1XsDXYqbw1YuvRJsw1aMArpTU4mQg / QeIU5MLikoYGBhTgGzl8pICELsDyBYpAjoKyJ4DYqdD2BtA7CQI + whYTUiQM5B9A8hWSM5IBJrB + API1klCEk9HYkPtBQFul8zigpzESoUAYwKuJQOUpFaUgGjn / ILKosz0jBIFR2AopSp45iXr6SgYGRiaMzCAwhyi + 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"></p>'
      }
    }
    rsp.json(results)
  })

  app.get('/secEvent/findInfo', (req, rsp) => {

      let results = {"errno":0,"errmsg":"ok","data":{"id":12751,"event_no":"SEC-EVENT-20200008","name":"fyg-test-event-record","type":1974,"type_name":"内容安全-外部攻击","level":1302,"level_name":"一般事件","source":1311,"source_name":"主动发现","system":"ffsdf","occured_time":"2020-05-10 00:00:00","confirm_time":"2020-05-10 09:00:00","repair_time":null,"create_time":"2020-05-11 16:49:52","close_time":null,"rccd_time":null,"status":1322,"status_name":"调查中","attachmentList":["2323323.jpg","3434343.jpg"],"punish_result":"","survey_result":"","remark":"","emps":[{"event_id":12751,"emp_id":9647,"emp_name":"范永刚","emp_email":"fanyonggang@didiglobal.com","dept_id":101384,"dept_name":"安全产品技术部>信息安全部>工程平台部>安全架构部","dept_t1_id":0}],"depts":[{"event_id":12751,"emp_id":0,"emp_name":null,"emp_email":null,"dept_id":101384,"dept_name":"安全产品技术部>信息安全部>工程平台部>安全架构部","dept_t1_id":0}],"emp_json":null,"dept_json":null,"mttd":"9","mttr":null,"mtth":null,"submit_rccd":0,"rccd":0,"rccd_result":"","button_state":0,"survey_members":"fanyonggang,dongliwei,haochenghao","review_members":"lhyliuhongyan","auth_label_json":null,"rccd_json":null,"label_json":"","create_user":"范永刚(fanyonggang@didiglobal.com)","update_user":null,"userAccount":null,"auth_labels":null,"rccds":null,"labels":null,"add_emps":null,"del_emps":null,"add_depts":null,"del_depts":null,"survey_members_list":[{"event_id":0,"emp_id":9647,"emp_name":"范永刚","emp_email":"fanyonggang@didiglobal.com","dept_id":101384,"dept_name":"安全产品技术部>信息安全部>工程平台部>安全架构部","dept_t1_id":0},{"event_id":0,"emp_id":19828,"emp_name":"董利伟","emp_email":"dongliwei@didiglobal.com","dept_id":101384,"dept_name":"安全产品技术部>信息安全部>工程平台部>安全架构部","dept_t1_id":0},{"event_id":0,"emp_id":489281,"emp_name":"程浩","emp_email":"haochenghao@didiglobal.com","dept_id":101384,"dept_name":"安全产品技术部>信息安全部>工程平台部>安全架构部","dept_t1_id":0}],"review_members_list":null,"alarm_ids":null,"alarmOrderIds":null,"dept_ids":null,"accounts":null,"survey_status":null,"review_status":null,"reviewType":null,"isReview":null,"reviewTime":null,"reviewParticipant":null,"reviewResult":null,"reviewAttachments":null,"notReviewReason":null,"handleTime":null,"apply_status":0,"recordList":[{"id":6,"eventId":12751,"createTime":"2020-05-11 00:00:00","status":2041,"statusName":"新建","type":0,"operatorUser":"范永刚(fanyonggang@didiglobal.com)","remark":"","responseRemark":null},{"id":7,"eventId":12751,"createTime":"2020-05-11 00:00:00","status":1322,"statusName":"调查中","type":0,"operatorUser":"范永刚(fanyonggang@didiglobal.com)","remark":"","responseRemark":null},{"id":9,"eventId":12751,"createTime":"2020-05-14 00:00:00","status":2045,"statusName":"撤回申诉","type":1,"operatorUser":"黄晓梅(huangxiaomei@didiglobal.com)","remark":"顶顶顶顶","responseRemark":"测试"},{"id":10,"eventId":12751,"createTime":"2020-05-18 00:00:00","status":2045,"statusName":"撤回申诉","type":1,"operatorUser":"黄晓梅(huangxiaomei@didiglobal.com)","remark":"测试","responseRemark":null},{"id":11,"eventId":12751,"createTime":"2020-05-19 00:00:00","status":2042,"statusName":"发起申诉","type":1,"operatorUser":"黄晓梅(huangxiaomei@didiglobal.com)","remark":"ddddfgdsgfdgs噶刚打个地方官的观点是噶","responseRemark":null}],"applyRecord":{"id":11,"eventId":12751,"createTime":"2020-05-19 00:00:00","status":2042,"statusName":"发起申诉","type":1,"operatorUser":"黄晓梅(huangxiaomei@didiglobal.com)","remark":"ddddfgdsgfdgs噶刚打个地方官的观点是噶","responseRemark":null}}}
    rsp.json(results)
  })

  app.get('/secEvent/apply/info', (req, rsp) => {

    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": {
        "eventId": 12662,
        eventName: "事件名称",
        eventTypeName: "事件类型",
        eventLevelName: "事件等级",
        managerEmps: [],
        "emps": [{
          "event_id": 12662,
          "emp_id": 26884,
          "emp_name": "黄晓梅",
          "emp_email": "huangxiaomei@didiglobal.com",
          "dept_id": 101384,
          "dept_name": "安全产品技术部>信息安全部>工程平台部>安全架构部",
          "dept_t1_id": 0
        }],
        "depts": [{
          "event_id": 12662,
          "emp_id": 0,
          "emp_name": null,
          "emp_email": null,
          "dept_id": 101384,
          "dept_name": "安全产品技术部>信息安全部>工程平台部>安全架构部",
          "dept_t1_id": 0
        }],
        applyUser: "申诉人",
        applyTime: "申诉时间",
        applyRemark: "事件申诉说明"
      }
  }
  rsp.json(results)
})

app.post('/file/upload', (req, rsp) => {
  let results = {
    "errno": 1,
    "errmsg": "非法文件",
    "data": "http://img-ys011.didistatic.com/static/architectureimg/do1_Cfa5pjsMG9j13uX2SrXl"
  }
  rsp.json(results)
})

app.get('/secEvent/reviewers/get', (req, rsp) => {

  let results = {
    "errno": 0,
    "errmsg": "ok",
    "data": [{
      "id": 5,
      "name": "张三",
      "email": "zhangsan@didichuxing.com"
    }, {
      "id": 6,
      "name": "李四",
      "email": "lisi@didichuxing.com"
    }, {
      "id": 7,
      "name": "王五",
      "email": "wangwu@didichuxing.com"
    }, {
      "id": 8,
      "name": "赵六",
      "email": "zhaoliu@didichuxing.com"
    }, {
      "id": 9,
      "name": "田七",
      "email": "tianqi@didichuxing.com"
    }]
  }
  rsp.json(results)
})

app.get('/secEvent/review/get', (req, rsp) => {

  let results = {
    "errno": 0,
    "data": {
      "businessReview": {
        "id": 43,
        "eventId": 12694,
        "reviewType": 1982,
        "reviewTypeName": "业务线复盘",
        "isReview": 1,
        "reviewTime": "2019-10-17 17:29:14",
        "reviewParticipant": [{
          "id": 1037,
          "name": "尤丹丹",
          "email": "youdandan@didiglobal.com",
          "department": null,
          "deptId": null
        }, {
          "id": 1066,
          "name": "刘佳达",
          "email": "liujiada@didiglobal.com",
          "department": null,
          "deptId": null
        }],
        "reviewResult": "ddddddddd",
        "reviewAttachments": [{
          "name": "钻石A座入住指南.pdf",
          "url": "http://img-ys011.didistatic.com/static/architectureimg/do1_8NJRV3iqCildK8TpDZxu"
        }],
        "notReviewReason": null
      },
      "secureInformationReview": {
        "id": 42,
        "eventId": 12694,
        "reviewType": 1981,
        "reviewTypeName": "信息安全复盘",
        "isReview": 0,
        "reviewTime": null,
        "reviewParticipant": null,
        "reviewResult": null,
        "reviewAttachments": null,
        "notReviewReason": "no reason"
      }
    },
    "errmsg": "ok"
  }
  rsp.json(results)
})


// 告警详情
app.get('/alarm/findInfo', (req, rsp) => {

  let results = {
    "errno": 0,
    "errmsg": "ok",
    "data": {
      "id": 'test1234',
      "state_name": "处置中",
      "type_name": "数据泄露",
      "level_name": "一级",
      "audit_name": '违规操作',
      "mode_name": "派发工单",
      "event": 0,
      "alarm_time": "2018-03-12 12:12:23",
      "occured_time": "2018-03-12 12:12:23",
      "update_time": "2018-03-12 12:12:23",
      "merge_num": "15",
      "processer": "zhangsan",
      "remark": '123',
      "workorder_id": '1234'
    }
  }
  rsp.json(results)
})

/**
 * 查找涉及人员
 */
app.get('/secEvent/searchEmpList', (req, rsp) => {

    let results = {
      "errno": 0,
      "errmsg": "ok",
      "total": 5,
      "data": [{
          "id": 17844,
          "name": "牛东玲",
          "email": "niudongling_i@didichuxing.com",
          "department": "R lab>大区运营",
          "deptId": '13'
        },
        {
          "id": 11213,
          "name": "董丽杰",
          "email": "donglijie@didichuxing.com",
          "department": "R2 lab>大区运营",
          "deptId": '12'
        },
        {
          "id": 22696,
          "name": "董令海",
          "email": "donglinghai@didichuxing.com",
          "department": "R2 lab>大区运营",
          "deptId": '1'
        },
        {
          "id": 18112,
          "name": "董利伟",
          "email": "dongliwei@didichuxing.com",
          "department": "R1 lab>大区运营",
          "deptId": '23'
        },
        {
          "id": 21340,
          "name": "董黎箫",
          "email": "donglixiao_i@didichuxing.com",
          "department": "R1 lab>大区运营",
          "deptId": '15'
        }
      ]
    }
    rsp.json(results)
  }),

  /**
   * 查找涉及人员
   */
  app.get('/secEvent/searchDeptList', (req, rsp) => {

    let results = {
      "errno": 0,
      "errmsg": "ok",
      "total": 5,
      "data": [{
          "id": 17844,
          "email": "niudongling_i@didichuxing.com",
          "name": "R lab>大区运营"
        },
        {
          "id": 11213,
          "email": "donglijie@didichuxing.com",
          "name": "R2 lab>大区运营"
        },
        {
          "id": 22696,
          "email": "donglinghai@didichuxing.com",
          "name": "R2 lab>大区运营"
        },
        {
          "id": 18112,
          "email": "dongliwei@didichuxing.com",
          "name": "R1 lab>大区运营"
        },
        {
          "id": 21340,
          "email": "donglixiao_i@didichuxing.com",
          "name": "R1 lab>大区运营"
        }
      ]
    }
    rsp.json(results)
  }),

  app.get('/alarm/queryListByEventId', (req, rsp) => {

    let results = {
      "errno": 0,
      "errmsg": "ok",
      "total": 5,
      "data": [{
          "id": 17844,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17845,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17846,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17847,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17848,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        }
      ]
    }
    rsp.json(results)
  }),

  app.get('/alarm/queryList', (req, rsp) => {

    let results = {
      "errno": 0,
      "errmsg": "ok",
      "total": 5,
      "data": [{
          "id": 17847,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17848,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17849,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17850,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17851,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        }
      ]
    }
    rsp.json(results)
  }),

  app.get('/secEvent/queryListByAlarmId', (req, rsp) => {

    let results = {
      "errno": 0,
      "errmsg": "ok",
      "total": 5,
      "data": [{
          "id": 17847,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17848,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17849,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17850,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        },
        {
          "id": 17851,
          "state_name": '待处理',
          "type_name": '事件类型1',
          "level_name": '高',
          "audit_name": '研判结果1',
          "mode_name": '处置方式1',
          "event": 0,
          "alarm_time": '2018-03-26 15:30:30',
          "occured_time": '2018-03-26 15:30:30',
          "update_time": '2018-03-26 15:30:30',
          "merge_num": '5',
          "processer": '黄晓梅'
        }
      ]
    }
    rsp.json(results)
  }),

  app.post('/secEvent/addSecEvent', (req, rsp) => {
    rsp.json({
      "errno": "0",
      "errmsg": "ok"
    })
  })

app.post('/secEvent/updateSecEvent', (req, rsp) => {
    rsp.json({
      "errno": "0",
      "errmsg": "ok"
    })
  }),

  //   app.get('/inStats/alarm/secevent', (req, rsp) => {

  //     let results = {
  //       "errno": 0,
  //       "errmsg": "ok",
  //       "data": [
  //         {
  //           "id": '1310',
  //           "name": "主动发现",
  //           "value": 124
  //         },
  //         {
  //           "id": '1311',
  //           "name": "被动发现",
  //           "value": 94
  //         }
  //       ]
  //     }
  //     rsp.json(results)
  // })

  //   app.get('/inStats/alarm/secevent', (req, rsp) => {

  //     let results = {
  //       "errno": 0,
  //       "errmsg": "ok",
  //       "data": [
  //         {
  //           "stat_time": "2018-01",
  //           "stat_close": 124,
  //           "stat_finding": 124,
  //           "stat_disposal": 124,
  //           "stat_total": 372
  //         },
  //         {
  //           "stat_time": "2018-02",
  //           "stat_close": 124,
  //           "stat_finding": 124,
  //           "stat_disposal": 124,
  //           "stat_total": 372
  //         }
  //       ]
  //     }
  //     rsp.json(results)
  // })

  app.get('/inStats/alarm/secevent', (req, rsp) => {

    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": [{
          "stat_time": "2018-01",
          "stat_mttd": 124,
          "stat_mttr": 124,
          "stat_total": 372
        },
        {
          "stat_time": "2018-02",
          "stat_mttd": 124,
          "stat_mttr": 124,
          "stat_total": 372
        }
      ]
    }
    rsp.json(results)
  })

//   app.get('/inStats/alarm/secevent', (req, rsp) => {

//     let results = {
//       "errno": 0,
//       "errmsg": "ok",
//       "data": [
//         {
//           "stat_time": "2018-01",
//           "stat_level1": 124,
//           "stat_level2": 150,
//           "stat_level3": 134,
//           "stat_level4": 80,
//           "stat_total": 372
//         },
//         {
//           "stat_time": "2018-02",
//           "stat_close": 98,
//           "stat_level2": 124,
//           "stat_level3": 140,
//           "stat_level4": 100,
//           "stat_total": 372
//         }
//       ]
//     }
//     rsp.json(results)
// })

app.get('/inStats/secevent/irftstatindicator1', (req, rsp) => {

  let results = {
    "errno": 0,
    "data": [{
        "name": "一级",
        "value": "13"
      },

      {
        "name": "二级",
        "value": "1"
      },
      {
        "name": "三级",
        "value": "1"
      },
      {
        "name": "四级",
        "value": "1"
      }
    ],
    "errmsg": "ok"
  }
  rsp.json(results)
})

app.get('/inStats/secevent/irftstatindicator2', (req, rsp) => {

  let results = {
    "errno": 0,
    "data": [{
        "name": "账号共享",
        "value": "11"
      },
      {
        "name": "权限滥用",
        "value": "3"
      },
      {
        "name": "信息泄露",
        "value": "1"
      }
    ],
    "errmsg": "ok"
  }
  rsp.json(results)
})

app.get('/inStats/secevent/irftstatindicator3', (req, rsp) => {

  let results = {
    "errno": 0,
    "data": [{
        "total": 13,
        "level_4": 0,
        "deptName": "安全产品与技术部",
        "level_3": 0,
        "deptId": "100561",
        "level_2": 1,
        "level_1": 12
      },
      {
        "total": 6,
        "level_4": 0,
        "deptName": "暂未识别部门",
        "level_3": 1,
        "deptId": "null",
        "level_2": 0,
        "level_1": 5
      },
      {
        "total": 1,
        "level_4": 0,
        "deptName": "R lab",
        "level_3": 0,
        "deptId": "103752",
        "level_2": 0,
        "level_1": 1
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "产品&服务部",
        "level_3": 0,
        "deptId": "103052",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "快捷出行事业群",
        "level_3": 0,
        "deptId": "102678",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "地方政府事务部",
        "level_3": 0,
        "deptId": "103243",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "HM",
        "level_3": 0,
        "deptId": "103416",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "信息安全战略部",
        "level_3": 0,
        "deptId": "900096",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "Comm Ops",
        "level_3": 0,
        "deptId": "900001",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "品质出行事业群",
        "level_3": 0,
        "deptId": "102677",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "顺风车事业部",
        "level_3": 0,
        "deptId": "100109",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "智慧交通事业部",
        "level_3": 0,
        "deptId": "102676",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "战略部",
        "level_3": 0,
        "deptId": "100238",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "市场部",
        "level_3": 0,
        "deptId": "100245",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "公关部",
        "level_3": 0,
        "deptId": "100264",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "中央政府事务部",
        "level_3": 0,
        "deptId": "100280",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "人力资源部",
        "level_3": 0,
        "deptId": "100319",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "滴滴学院",
        "level_3": 0,
        "deptId": "100380",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "FLPW（财务/法务/采购/行政）",
        "level_3": 0,
        "deptId": "100445",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "风控合规部",
        "level_3": 0,
        "deptId": "100468",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "安全事务部",
        "level_3": 0,
        "deptId": "100490",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "智能出行部",
        "level_3": 0,
        "deptId": "100510",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "金融事业部",
        "level_3": 0,
        "deptId": "100508",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "创意设计部",
        "level_3": 0,
        "deptId": "100530",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "基础平台部",
        "level_3": 0,
        "deptId": "100565",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "质量技术部",
        "level_3": 0,
        "deptId": "100580",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "效能平台部",
        "level_3": 0,
        "deptId": "100581",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "地图事业部",
        "level_3": 0,
        "deptId": "100523",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "客户服务部",
        "level_3": 0,
        "deptId": "100610",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "产品部",
        "level_3": 0,
        "deptId": "101809",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "平台技术部",
        "level_3": 0,
        "deptId": "101896",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "战略合作部",
        "level_3": 0,
        "deptId": "101509",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "总办",
        "level_3": 0,
        "deptId": "102429",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "汽车资产管理中心",
        "level_3": 0,
        "deptId": "102202",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "企业社会责任",
        "level_3": 0,
        "deptId": "102643",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "滴滴研究院",
        "level_3": 0,
        "deptId": "102681",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "Voyager",
        "level_3": 0,
        "deptId": "102682",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "国际事业部",
        "level_3": 0,
        "deptId": "102683",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "后市场",
        "level_3": 0,
        "deptId": "102714",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "数据科学部",
        "level_3": 0,
        "deptId": "103730",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "AI Labs",
        "level_3": 0,
        "deptId": "104179",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "CTO Office",
        "level_3": 0,
        "deptId": "104373",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "滴滴云",
        "level_3": 0,
        "deptId": "104284",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "DiDi Labs",
        "level_3": 0,
        "deptId": "104742",
        "level_2": 0,
        "level_1": 0
      },
      {
        "total": 0,
        "level_4": 0,
        "deptName": "IBT",
        "level_3": 0,
        "deptId": "104668",
        "level_2": 0,
        "level_1": 0
      }
    ],
    "errmsg": "ok"
  }
  rsp.json(results)
})

app.get('/inStats/secevent/irftstatindicator4', (req, rsp) => {

  let results = {
    "errno": 0,
    "data": [{
        "total": 13,
        "deptName": "安全产品与技术部",
        "信息泄露": 10,
        "端口转发": 1,
        "权限滥用": 1,
        "deptId": "100561",
        "账号共享": 1
      },
      {
        "total": 6,
        "deptName": "暂未识别部门",
        "信息泄露": 3,
        "端口转发": 1,
        "权限滥用": 1,
        "deptId": "null",
        "账号共享": 1
      },
      {
        "total": 1,
        "deptName": "R lab",
        "信息泄露": 0,
        "端口转发": 0,
        "权限滥用": 0,
        "deptId": "103752",
        "账号共享": 1
      },
      {
        "total": 1,
        "deptName": "IBT",
        "信息泄露": 0,
        "端口转发": 0,
        "权限滥用": 1,
        "deptId": "104668",
        "账号共享": 0
      }
    ],
    "errmsg": "ok"
  }
  rsp.json(results)
})

app.get('/inStats/secevent/irftstatindicator5', (req, rsp) => {

  let results = {
    "errno": 0,
    "data": [{
        "total": "29",
        "level_4": "0",
        "level_3": "0",
        "stat_time": "2018-01",
        "level_2": "2",
        "level_1": "27"
      },
      {
        "total": "114",
        "level_4": "0",
        "level_3": "2",
        "stat_time": "2018-02",
        "level_2": "8",
        "level_1": "104"
      },
      {
        "total": "37",
        "level_4": "1",
        "level_3": "1",
        "stat_time": "2018-03",
        "level_2": "4",
        "level_1": "31"
      },
      {
        "total": "15",
        "level_4": "0",
        "level_3": "1",
        "stat_time": "2018-04",
        "level_2": "1",
        "level_1": "13"
      }
    ],
    "errmsg": "ok"
  }
  rsp.json(results)
})

app.get('/inStats/secevent/irftstatindicator6', (req, rsp) => {

  let results = {
    "errno": 0,
    "previousStr": "2018_03",
    "currentStr": "2018_04",
    "data": [{
        "deptName": "安全产品与技术部",
        "previous": 0,
        "diff": 13,
        "current": "13",
        "deptId": "100561"
      },
      {
        "deptName": "R lab",
        "previous": "1",
        "diff": 0,
        "current": "1",
        "deptId": "103752"
      },
      {
        "deptName": "产品&服务部",
        "previous": "2",
        "diff": -2,
        "current": 0,
        "deptId": "103052"
      },
      {
        "deptName": "暂未识别部门",
        "previous": "30",
        "diff": -24,
        "current": "6",
        "deptId": "null"
      }
    ],
    "errmsg": "ok"
  }
  rsp.json(results)
})

app.get('/inStats/secevent/irftstatindicator7', (req, rsp) => {

  let results = {
    "errno": 0,
    "data": [{
        "total": 127,
        "level_4": 1,
        "deptName": "暂未识别部门",
        "level_3": 4,
        "score": -168,
        "deptId": "null",
        "level_2": 14,
        "level_1": 108
      },
      {
        "total": 15,
        "level_4": 0,
        "deptName": "安全产品与技术部",
        "level_3": 0,
        "score": 81,
        "deptId": "100561",
        "level_2": 1,
        "level_1": 14
      },
      {
        "total": 1,
        "level_4": 0,
        "deptName": "后市场",
        "level_3": 0,
        "score": 99,
        "deptId": "102714",
        "level_2": 0,
        "level_1": 1
      },
      {
        "total": 1,
        "level_4": 0,
        "deptName": "AI Labs",
        "level_3": 0,
        "score": 99,
        "deptId": "104179",
        "level_2": 0,
        "level_1": 1
      }
    ],
    "errmsg": "ok"
  }
  rsp.json(results)
})

app.get('/inStats/platform/opindicator', (req, rsp) => {
  let results = {
    "errno": 0,
    "data": {
      "安全漏洞": [{
        "module": "安全漏洞",
        "nums": "4004",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "安全漏洞",
        "nums": "514",
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "安全漏洞",
        "nums": "476",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "安全漏洞",
        "nums": "4768",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "安全漏洞",
        "nums": "2838",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "安全漏洞",
        "nums": "2678",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "安全漏洞",
        "nums": "2656",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "安全漏洞",
        "nums": "5712",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "安全漏洞",
        "nums": "156",
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "安全漏洞",
        "nums": "232",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "安全漏洞",
        "nums": "4102",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "安全漏洞",
        "nums": "1898",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "安全漏洞",
        "nums": "1900",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "安全漏洞",
        "nums": "2154",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "安全漏洞",
        "nums": "4422",
        "type": "pv",
        "date": "2018-06-15"
      }],
      "数据安全": [{
        "module": "数据安全",
        "nums": "298",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "数据安全",
        "nums": "6",
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "数据安全",
        "nums": "2",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "数据安全",
        "nums": "510",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "数据安全",
        "nums": "522",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "数据安全",
        "nums": "430",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "数据安全",
        "nums": "410",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "数据安全",
        "nums": "298",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "数据安全",
        "nums": "34",
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "数据安全",
        "nums": "50",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "数据安全",
        "nums": "328",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "数据安全",
        "nums": "390",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "数据安全",
        "nums": "258",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "数据安全",
        "nums": "224",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "数据安全",
        "nums": "296",
        "type": "pv",
        "date": "2018-06-15"
      }],
      "安全告警": [{
        "module": "安全告警",
        "nums": "1662",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "安全告警",
        "nums": "656",
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "安全告警",
        "nums": "352",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "安全告警",
        "nums": "916",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "安全告警",
        "nums": "720",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "安全告警",
        "nums": "882",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "安全告警",
        "nums": "814",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "安全告警",
        "nums": "590",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "安全告警",
        "nums": "412",
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "安全告警",
        "nums": "706",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "安全告警",
        "nums": "960",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "安全告警",
        "nums": "912",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "安全告警",
        "nums": "1540",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "安全告警",
        "nums": "1104",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "安全告警",
        "nums": "1114",
        "type": "pv",
        "date": "2018-06-15"
      }],
      "可疑事件": [{
        "module": "可疑事件",
        "nums": "60",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "可疑事件",
        "nums": 0,
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "可疑事件",
        "nums": 0,
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "可疑事件",
        "nums": "54",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "可疑事件",
        "nums": "12",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "可疑事件",
        "nums": "16",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "可疑事件",
        "nums": "42",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "可疑事件",
        "nums": "14",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "可疑事件",
        "nums": 0,
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "可疑事件",
        "nums": "10",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "可疑事件",
        "nums": "36",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "可疑事件",
        "nums": "6",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "可疑事件",
        "nums": "130",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "可疑事件",
        "nums": "78",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "可疑事件",
        "nums": 0,
        "type": "pv",
        "date": "2018-06-15"
      }],
      "首页": [{
        "module": "首页",
        "nums": "108",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "首页",
        "nums": "18",
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "首页",
        "nums": "32",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "首页",
        "nums": "156",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "首页",
        "nums": "164",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "首页",
        "nums": "126",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "首页",
        "nums": "152",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "首页",
        "nums": "170",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "首页",
        "nums": "24",
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "首页",
        "nums": "46",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "首页",
        "nums": "174",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "首页",
        "nums": "128",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "首页",
        "nums": "118",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "首页",
        "nums": "124",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "首页",
        "nums": "120",
        "type": "pv",
        "date": "2018-06-15"
      }],
      "业务安全": [{
        "module": "业务安全",
        "nums": "50",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "业务安全",
        "nums": "16",
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "业务安全",
        "nums": "26",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "业务安全",
        "nums": "146",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "业务安全",
        "nums": "88",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "业务安全",
        "nums": "316",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "业务安全",
        "nums": "182",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "业务安全",
        "nums": "242",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "业务安全",
        "nums": 0,
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "业务安全",
        "nums": "20",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "业务安全",
        "nums": "258",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "业务安全",
        "nums": "24",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "业务安全",
        "nums": "196",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "业务安全",
        "nums": "374",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "业务安全",
        "nums": "220",
        "type": "pv",
        "date": "2018-06-15"
      }],
      "安全事件": [{
        "module": "安全事件",
        "nums": "304",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "安全事件",
        "nums": "118",
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "安全事件",
        "nums": "324",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "安全事件",
        "nums": "490",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "安全事件",
        "nums": "1276",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "安全事件",
        "nums": "998",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "安全事件",
        "nums": "232",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "安全事件",
        "nums": "274",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "安全事件",
        "nums": "16",
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "安全事件",
        "nums": "166",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "安全事件",
        "nums": "32",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "安全事件",
        "nums": "126",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "安全事件",
        "nums": "178",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "安全事件",
        "nums": "370",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "安全事件",
        "nums": "856",
        "type": "pv",
        "date": "2018-06-15"
      }],
      "指标监控": [{
        "module": "指标监控",
        "nums": 0,
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "指标监控",
        "nums": "28",
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "指标监控",
        "nums": "116",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "指标监控",
        "nums": "260",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "指标监控",
        "nums": "578",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "指标监控",
        "nums": "678",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "指标监控",
        "nums": "436",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "指标监控",
        "nums": "214",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "指标监控",
        "nums": "130",
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "指标监控",
        "nums": "208",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "指标监控",
        "nums": "308",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "指标监控",
        "nums": "162",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "指标监控",
        "nums": "28",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "指标监控",
        "nums": "174",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "指标监控",
        "nums": "54",
        "type": "pv",
        "date": "2018-06-15"
      }],
      "值班管理": [{
        "module": "值班管理",
        "nums": "12",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "值班管理",
        "nums": "26",
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "值班管理",
        "nums": "60",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "值班管理",
        "nums": "110",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "值班管理",
        "nums": "82",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "值班管理",
        "nums": "50",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "值班管理",
        "nums": "44",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "值班管理",
        "nums": "48",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "值班管理",
        "nums": "26",
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "值班管理",
        "nums": "42",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "值班管理",
        "nums": "94",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "值班管理",
        "nums": "268",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "值班管理",
        "nums": "58",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "值班管理",
        "nums": "58",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "值班管理",
        "nums": "6",
        "type": "pv",
        "date": "2018-06-15"
      }],
      "白盒测试": [{
        "module": "白盒测试",
        "nums": "224",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "白盒测试",
        "nums": "44",
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "白盒测试",
        "nums": "6",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "白盒测试",
        "nums": "554",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "白盒测试",
        "nums": "178",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "白盒测试",
        "nums": "304",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "白盒测试",
        "nums": "540",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "白盒测试",
        "nums": "88",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "白盒测试",
        "nums": "4",
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "白盒测试",
        "nums": "54",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "白盒测试",
        "nums": "570",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "白盒测试",
        "nums": "186",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "白盒测试",
        "nums": "78",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "白盒测试",
        "nums": "164",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "白盒测试",
        "nums": "70",
        "type": "pv",
        "date": "2018-06-15"
      }],
      "安全产品、规范": [{
        "module": "安全产品、规范",
        "nums": "54",
        "type": "pv",
        "date": "2018-06-01"
      }, {
        "module": "安全产品、规范",
        "nums": 0,
        "type": "pv",
        "date": "2018-06-02"
      }, {
        "module": "安全产品、规范",
        "nums": "40",
        "type": "pv",
        "date": "2018-06-03"
      }, {
        "module": "安全产品、规范",
        "nums": "198",
        "type": "pv",
        "date": "2018-06-04"
      }, {
        "module": "安全产品、规范",
        "nums": "120",
        "type": "pv",
        "date": "2018-06-05"
      }, {
        "module": "安全产品、规范",
        "nums": "80",
        "type": "pv",
        "date": "2018-06-06"
      }, {
        "module": "安全产品、规范",
        "nums": "206",
        "type": "pv",
        "date": "2018-06-07"
      }, {
        "module": "安全产品、规范",
        "nums": "88",
        "type": "pv",
        "date": "2018-06-08"
      }, {
        "module": "安全产品、规范",
        "nums": "44",
        "type": "pv",
        "date": "2018-06-09"
      }, {
        "module": "安全产品、规范",
        "nums": "14",
        "type": "pv",
        "date": "2018-06-10"
      }, {
        "module": "安全产品、规范",
        "nums": "154",
        "type": "pv",
        "date": "2018-06-11"
      }, {
        "module": "安全产品、规范",
        "nums": "134",
        "type": "pv",
        "date": "2018-06-12"
      }, {
        "module": "安全产品、规范",
        "nums": "142",
        "type": "pv",
        "date": "2018-06-13"
      }, {
        "module": "安全产品、规范",
        "nums": "128",
        "type": "pv",
        "date": "2018-06-14"
      }, {
        "module": "安全产品、规范",
        "nums": "134",
        "type": "pv",
        "date": "2018-06-15"
      }]
    },
    "errmsg": "ok"
  }
  return rsp.json(results)
})

app.get('/inStats/alarm/secevent', (req, rsp) => {

  let results = {
    "errno": 0,
    "data": [{
      "id": "null",
      "name": "未知部门",
      "value": "101"
    }, {
      "id": "103872",
      "name": "快捷区域",
      "value": "9"
    }, {
      "id": "101896",
      "name": "平台技术部",
      "value": "8"
    }, {
      "id": "101809",
      "name": "产品部",
      "value": "6"
    }, {
      "id": "103752",
      "name": "R lab",
      "value": "5"
    }, {
      "id": "100581",
      "name": "效能平台部",
      "value": "5"
    }, {
      "id": "100490",
      "name": "安全事务部",
      "value": "3"
    }, {
      "id": "100064",
      "name": "专车事业部",
      "value": "3"
    }, {
      "id": "102682",
      "name": "Voyager",
      "value": "3"
    }, {
      "id": "100445",
      "name": "FLPW（财务/法务/采购/行政）",
      "value": "3"
    }, {
      "id": "100158",
      "name": "代驾事业部",
      "value": "3"
    }, {
      "id": "100510",
      "name": "智能出行部",
      "value": "3"
    }, {
      "id": "103052",
      "name": "产品&服务部",
      "value": "3"
    }, {
      "id": "100523",
      "name": "地图事业部",
      "value": "2"
    }, {
      "id": "100561",
      "name": "安全产品与技术部",
      "value": "2"
    }, {
      "id": "100508",
      "name": "金融事业部",
      "value": "2"
    }, {
      "id": "100565",
      "name": "基础平台部",
      "value": "1"
    }, {
      "id": "103243",
      "name": "地方政府事务部",
      "value": "1"
    }, {
      "id": "104132",
      "name": "快捷区域战略中心",
      "value": "1"
    }, {
      "id": "100387",
      "name": "企业级事业部",
      "value": "1"
    }, {
      "id": "100580",
      "name": "质量技术部",
      "value": "1"
    }, {
      "id": "102202",
      "name": "汽车资产管理中心",
      "value": "1"
    }, {
      "id": "103416",
      "name": "HM",
      "value": "1"
    }],
    "errmsg": "ok"
  }
  rsp.json(results)
})

app.get('/dictionary/listByDataAuth/1500', (req, rsp) => {
  let results = {
    "errno": 0,
    "errmsg": "ok",
    "data": [{
      "id": 1501,
      "dName": "帐号共享",
      "parentId": 1500,
      "linkContent": null
    }, {
      "id": 1502,
      "dName": "权限滥用",
      "parentId": 1500,
      "linkContent": null
    }]
  }
  return rsp.json(results)
})

app.get('/dictionary/listByDataAuth/1510', (req, rsp) => {
  let results = {
    "errno": 0,
    "errmsg": "ok",
    "data": [{
      "id": 1513,
      "dName": "严重警告",
      "parentId": 1510,
      "linkContent": null
    }, {
      "id": 1515,
      "dName": "移交司法机关",
      "parentId": 1510,
      "linkContent": null
    }, {
      "id": 1512,
      "dName": "警告",
      "parentId": 1510,
      "linkContent": null
    }, {
      "id": 1514,
      "dName": "辞退",
      "parentId": 1510,
      "linkContent": null
    }, {
      "id": 1511,
      "dName": "通报批评",
      "parentId": 1510,
      "linkContent": null
    }]
  }
  return rsp.json(results)
})
app.get('/dictionary/listByDataAuth/2040', (req, rsp) => {
  let results = {"errno":0,"errmsg":"ok","data":[{"id":2042,"dName":"发起申诉","parentId":2040,"linkContent":null},{"id":2044,"dName":"同意申诉","parentId":2040,"linkContent":null},{"id":2045,"dName":"撤回申诉","parentId":2040,"linkContent":null},{"id":2046,"dName":"撤回申诉","parentId":2040,"linkContent":null},{"id":2047,"dName":"撤回申诉","parentId":2040,"linkContent":null},{"id":2041,"dName":"新建","parentId":2040,"linkContent":null},{"id":2043,"dName":"驳回申诉","parentId":2040,"linkContent":null}]}

  return rsp.json(results)
})
app.get('/dictionary/listByDataAuth/1830', (req, rsp) => {
  let results = {
    "errno": 0,
    "errmsg": "ok",
    "data": [{
      "id": 1831,
      "dName": "待整改",
      "parentId": 1830,
      "linkContent": null
    }, {
      "id": 1832,
      "dName": "已整改",
      "parentId": 1830,
      "linkContent": null
    }]
  }
  return rsp.json(results)
})

app.get('/inStats/secplate/getdata', (req, rsp) => {

    let results = {
      "errno": 0,
      "errmsg": "ok",
      "data": {
        "全员": {
          "违规事件": {
            "低危事件数量": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 1,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "高危事件数量": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 2,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "高危事件数量召回率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 3,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "MTTD（h）": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 4,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "MTTR (h)": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 5,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "离职违规率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 6,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            }
          },
          "风险": {
            "合格通过率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 7,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "LCA安装率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 8,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "培训完成度": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 9,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "异常文件传输率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 10,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "隐私信息查询率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 11,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            }
          },
          "体验": {
            "问题反馈数量": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 12,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "内网舆情数量": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 13,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            }
          },
          "能力": {
            "合格通过率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 14,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "LCA安装率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 15,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            }
          }
        },
        "快捷": {
          "违规事件": {
            "低危事件数量": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 16,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "高危事件数量": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 17,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "高危事件数量召回率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 18,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "MTTD（h）": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 19,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "MTTR (h)": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 20,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "离职违规率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 21,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "离职违规人数": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 22,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            }
          },
          "风险": {
            "合格通过率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 23,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "LCA安装率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 24,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "LCA活跃度": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 25,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "培训完成度": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 26,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "异常文件传输率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 27,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "隐私信息查询率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 28,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
          }
        },
        "soda": {
          "违规事件": {
            "离职违规率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 29,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "离职违规人数": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 30,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
          },
          "风险": {
            "LCA安装率": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 31,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "LCA活跃度": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 32,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            },
            "培训完成度": {
              "datas": {
                "1月": 0,
                "2月": 0,
                "3月": 0,
                "4月": 0,
                "5月": 0,
                "6月w1": 0,
                "6月w2": 0,
                "6月w3": 0,
                "6月w4": 0
              },
              "id": 33,
              "2018年目标": '666',
              "本周重点关注": 'qqqq'
            }
          }
        }
      }
    }

    rsp.json(results)
  }),

  app.get('/sa/queryList', (req, rsp) => {
    let results = {
      "errno": 0,
      "errmsg": "ok",
      "total": 10,
      "data": [{
          "id": 17847,
          "project_no": 'RA-2019001',
          "project_name": '金融风险专项评估项目',
          "status": 1701,
          "status_name": '待确认',
          "dept_id": 17847,
          "dept_name": '金融事业部',
          "risk_high": [0, 0],
          "risk_middle": [0, 0],
          "risk_lower": [0, 0],
          "risk_total": [0, 0],
          "create_time": '2019-04-19 11:30:00',
          "create_user_name": '张三',
          "create_user_email": 'zhangsan@didichuxing.com',
          "start_time": '2019-04-19'
        },
        {
          "id": 17848,
          "project_no": 'RA-2019002',
          "project_name": '金融风险专项评估项目',
          "status": 1701,
          "status_name": '待确认',
          "dept_id": 17847,
          "dept_name": '金融事业部',
          "risk_high": [0, 0],
          "risk_middle": [0, 0],
          "risk_lower": [0, 0],
          "risk_total": [0, 0],
          "create_time": '2019-04-19 11:30:00',
          "create_user_name": '张三',
          "create_user_email": 'zhangsan@didichuxing.com',
          "start_time": '2019-04-19'
        },
        {
          "id": 17849,
          "project_no": 'RA-2019003',
          "project_name": '金融风险专项评估项目',
          "status": 1702,
          "status_name": '待评估',
          "dept_id": 17847,
          "dept_name": '金融事业部',
          "risk_high": [0, 0],
          "risk_middle": [0, 0],
          "risk_lower": [0, 0],
          "risk_total": [0, 0],
          "create_time": '2019-04-19 11:30:00',
          "create_user_name": '张三',
          "create_user_email": 'zhangsan@didichuxing.com',
          "start_time": '2019-04-19'
        },
        {
          "id": 17850,
          "project_no": 'RA-2019004',
          "project_name": '金融风险专项评估项目',
          "status": 1703,
          "status_name": '评估中',
          "dept_id": 17847,
          "dept_name": '金融事业部',
          "risk_high": [50, 100],
          "risk_middle": [10, 100],
          "risk_lower": [100, 160],
          "risk_total": [160, 360],
          "create_time": '2019-04-19 11:30:00',
          "create_user_name": '张三',
          "assessment_status": 1821,
          "create_user_email": 'zhangsan@didichuxing.com',
          "start_time": '2019-04-19'
        },
        {
          "id": 17850,
          "project_no": 'RA-2019004',
          "project_name": '金融风险专项评估项目',
          "status": 1704,
          "status_name": '待检查',
          "dept_id": 17847,
          "dept_name": '金融事业部',
          "risk_high": [50, 100],
          "risk_middle": [10, 100],
          "risk_lower": [100, 160],
          "risk_total": [160, 360],
          "create_time": '2019-04-19 11:30:00',
          "create_user_name": '张三',
          "check_status": 1841,
          "create_user_email": 'zhangsan@didichuxing.com',
          "start_time": '2019-04-19'
        },
        {
          "id": 17851,
          "project_no": 'RA-2019005',
          "project_name": '金融风险专项评估项目',
          "status": 1704,
          "status_name": '已结束',
          "dept_id": 17847,
          "dept_name": '金融事业部',
          "risk_high": [100, 100],
          "risk_middle": [100, 100],
          "risk_lower": [160, 160],
          "risk_total": [360, 360],
          "create_time": '2019-04-19 11:30:00',
          "create_user_name": '张三',
          "create_user_email": 'zhangsan@didichuxing.com',
          "start_time": '2019-04-19'
        }
      ]
    }
    rsp.json(results)
  })

// 安全评估检查项列表
app.get('/sa/checkList/queryList', (req, rsp) => {
  let results = {
    "errno": 0,
    "errmsg": "ok",
    "total": 10,
    "data": [{
        "id": 17847,
        "scope": 2019001, //检查项分类
        "scope_name": '分类名称AAA',
        "type": "检查项分类",
        "sub_type": '检查子类',
        "content": `a)个人信息控制者不得欺诈、诱骗、误导个人信息主体提供其个人信息；

 b)个人信息控制者不得隐瞒产品或服务所具有的收集个人信息的功能；

 c)个人信息控制者不得从非法渠道获取个人信息；

 d)个人信息控制者不得收集法律法规明令禁止收集的个人信息。`,
        "status": 1, // 1 启用 2 禁用 9 删除
        "status_name": '启用',
        "create_time": '2019-04-19 11:30:00',
        "create_user_id": "xxxx",
        "create_user_name": '张三',
        "create_user_email": 'zhangsan@didichuxing.com',
        "update_time": '2019-04-19',
        "update_user_id": "xxxx",
        "create_user_name": '张三',
        "create_user_email": 'zhangsan@didichuxing.com'
      },
      {
        "id": 17848,
        "scope": 2019001, //检查项分类
        "scope_name": '分类名称BBB',
        "type": "检查项分类",
        "sub_type": '检查子类',
        "content": "检查内容",
        "status": 2, // 1 启用 2 禁用 9 删除
        "status_name": '禁用',
        "create_time": '2019-04-19 11:30:00',
        "create_user_id": "xxxx",
        "create_user_name": '张三',
        "create_user_email": 'zhangsan@didichuxing.com',
        "update_time": '2019-04-19',
        "update_user_id": "xxxx",
        "create_user_name": '张三',
        "create_user_email": 'zhangsan@didichuxing.com'
      }
    ]
  }
  rsp.json(results)
})
// 安全检查项详情
app.get('/sa/checkList/findInfo/:id', (req, rsp) => {
  let results = {
    "errno": 0,
    "errmsg": "ok",
    "total": 10,
    "data": {
      "id": 17847,
      "scope": 2019001, //检查项分类
      "scope_name": '分类名称AAA',
      "type": "检查项分类",
      "sub_type": '检查子类',
      "content": `a)个人信息控制者不得欺诈、诱骗、误导个人信息主体提供其个人信息；

 b)个人信息控制者不得隐瞒产品或服务所具有的收集个人信息的功能；

 c)个人信息控制者不得从非法渠道获取个人信息；

 d)个人信息控制者不得收集法律法规明令禁止收集的个人信息。`,
      "status": 1, // 1 启用 2 禁用 9 删除
      "status_name": '启用',
      "create_time": '2019-04-19 11:30:00',
      "create_user_id": "xxxx",
      "create_user_name": '张三',
      "create_user_email": 'zhangsan@didichuxing.com',
      "update_time": '2019-04-19',
      "update_user_id": "xxxx",
      "create_user_name": '张三',
      "create_user_email": 'zhangsan@didichuxing.com'
    }
  }
  rsp.json(results)
})
// 添加检查项
app.post('/sa/checkList/insert', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})
app.post('/sa/checkList/update', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})
app.post('/sa/checkList/updateStatus', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})

app.post('/sa/project/object/scope/assessmentSelf', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})

app.post('/sa/project/object/assessmentSelf', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})
app.post('/sa/project/assessmentSelf', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})
app.post('/sa/project/object/scope/repair', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})
app.post('/sa/project/object/repair', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})

app.post('/sa/project/repair', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})
app.post('/sa/project/assessment', (req, rsp) => {
  rsp.json({
    "errno": 0,
    "errmsg": "ok"
  })
})


// 安全检查项详情
app.get('/process/department', (req, rsp) => {
  let results = {
    "errno": 0,
    "errmsg": "ok",
    "data": [{
      "productId": "109037",
      "productName": "安全与政府事务条线"
    }, {
      "productId": "109088",
      "productName": "网约车治理与安全"
    }, {
      "productId": "106579",
      "productName": "交易安全部"
    }, {
      "productId": "900096",
      "productName": "信息安全战略部"
    }, {
      "productId": "106578",
      "productName": "信息安全部"
    }, {
      "productId": "108394",
      "productName": "养车驾驶安全业务部"
    }, {
      "productId": "100161",
      "productName": "品质出行安全部(旧)"
    }, {
      "productId": "100490",
      "productName": "安全事务部"
    }, {
      "productId": "100561",
      "productName": "安全产品技术部"
    }, {
      "productId": "106132",
      "productName": "安全响应中心"
    }, {
      "productId": "106027",
      "productName": "安全应急中心"
    }, {
      "productId": "107290",
      "productName": "安全预防部"
    }, {
      "productId": "105877",
      "productName": "平台安全部"
    }, {
      "productId": "108953",
      "productName": "普惠安全部"
    }, {
      "productId": "107318",
      "productName": "车服安全管理部"
    }, {
      "productId": "103421",
      "productName": "HM>安全管理部(旧)"
    }, {
      "productId": "107052",
      "productName": "上海江苏区域>区域安全"
    }, {
      "productId": "101632",
      "productName": "专车事业部>安全保障部(旧)"
    }, {
      "productId": "108735",
      "productName": "两轮车事业部>安全发展中心"
    }, {
      "productId": "107034",
      "productName": "中西区域>区域安全"
    }, {
      "productId": "105940",
      "productName": "产品部>安全产品"
    }, {
      "productId": "104154",
      "productName": "人力资源部>政府事务与安全职能HR(旧)"
    }, {
      "productId": "107259",
      "productName": "代驾事业部>代驾安全部"
    }, {
      "productId": "101381",
      "productName": "信息安全部>情报中心(旧)"
    }, {
      "productId": "100267",
      "productName": "公关部>快捷出行/安全(旧)"
    }, {
      "productId": "103193",
      "productName": "公关部>政策/安全(旧)"
    }, {
      "productId": "108904",
      "productName": "养车驾驶安全业务部>复盘研究"
    }, {
      "productId": "108906",
      "productName": "养车驾驶安全业务部>隐患分析"
    }, {
      "productId": "108903",
      "productName": "养车驾驶安全业务部>隐患治理"
    }, {
      "productId": "108905",
      "productName": "养车驾驶安全业务部>隐患识别"
    }, {
      "productId": "106839",
      "productName": "华中南区域>区域安全"
    }, {
      "productId": "106743",
      "productName": "华北区域>区域安全"
    }, {
      "productId": "107094",
      "productName": "华南区域>区域安全"
    }, {
      "productId": "106003",
      "productName": "品质出行安全部>专豪安全部(旧)"
    }, {
      "productId": "106002",
      "productName": "品质出行安全部>代驾安全部(旧)"
    }, {
      "productId": "106006",
      "productName": "品质出行安全部>安全处理部(旧)"
    }, {
      "productId": "106004",
      "productName": "品质出行安全部>海棠安全部(旧)"
    }, {
      "productId": "106005",
      "productName": "品质出行安全部>黑马安全部(旧)"
    }, {
      "productId": "107185",
      "productName": "城际事业部>安全管理(旧)"
    }, {
      "productId": "107916",
      "productName": "城际事业部>安全运力保障"
    }, {
      "productId": "103232",
      "productName": "安全事务部>产品技术部(旧)"
    }, {
      "productId": "103649",
      "productName": "安全事务部>地方安全部(旧)"
    }, {
      "productId": "108912",
      "productName": "安全事务部>安全BP和风险防范部"
    }, {
      "productId": "107204",
      "productName": "安全事务部>安全专家部(旧)"
    }, {
      "productId": "108925",
      "productName": "安全事务部>安全中台部"
    }, {
      "productId": "103234",
      "productName": "安全事务部>安全事务保障部(旧)"
    }, {
      "productId": "103233",
      "productName": "安全事务部>安全体系建设部(旧)"
    }, {
      "productId": "107201",
      "productName": "安全事务部>安全宣传部"
    }, {
      "productId": "107200",
      "productName": "安全事务部>安全标准部(旧)"
    }, {
      "productId": "108933",
      "productName": "安全事务部>安全监察和警企合作部"
    }]
  }
  rsp.json(results)
})

}
