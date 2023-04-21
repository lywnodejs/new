/**
 * 代理配置文件
 * @author 赵波
 * @type {*[]}
 */
const proxy = [
  {
    name:'/robot/semantic/conditionalStock/',
    options:{
      target: 'http://conditionalstock-service:31001/',
      pathRewrite: {
        '/robot/semantic/conditionalStock/': '/'
      },
    }
  },
  {
    name:'/robot/semantic/stock-analysis-service/',
    options:{
      target: 'http://stock-analysis-service:31001/',
      pathRewrite: {
        '/robot/semantic/stock-analysis-service/': '/',
        '/robot/semantic//stock-analysis-service/': '/'
      },
    }
  },
  {
    name:'/robot/semantic/TechnichalAnalysis/',
    options:{
      target: 'http://stock-analysis-service:31001/',
      pathRewrite: {
        '/robot/semantic/TechnichalAnalysis/': '/'
      },
    }
  },
  {
    name:'/robot/semantic/semantic-api-service/semantic/content/',
    options:{
      target: 'http://semantic-api-service-ezt/semantic/content/',
      pathRewrite: {
        '/robot/semantic/semantic-api-service/semantic/content/': '/'
      },
    }
  },
  {
    name:'/robot/semantic/',
    options:{
      target: 'http://semantic-api-service:31001',
      pathRewrite: {
        '/robot/semantic/semantic-api-service/': '/',
        '/robot/semantic//semantic-api-service/': '/',
        '/robot/semantic/tabs/tab': '/tab',
        '/robot/semantic/riskNotices': '/'
      },
    }
  },
  {
    name:'/info/zq88/cn/',
    options:{
      target: 'http://info.zq88.cn:9085/',
      pathRewrite: {
        '/info/zq88/cn/': '/'
      },
    }
  },
  {
    name:'/policycatalogue/',
    options:{
      target: 'http://semantic-policycatalogue-service:31001/',
      pathRewrite: {
        '/policycatalogue/': '/'
      },
    }
  },
  {
    name:'/hangqing-service/',
    options:{
      target: 'http://quota.zq88.cn/',
      pathRewrite: {
        '/hangqing-service/': '/'
      },
    }
  },
  {
    name:'/robot/dataCenter/',
    options:{
      target: 'http://semantic-datacenter-service:31001',
      pathRewrite: {
        '/robot/dataCenter/announce/': '/'
      },
    }
  },
  {
    name:'/eduDomain/',
    options:{
      target: 'http://edu.hczq.com/',
      pathRewrite: {
        '/eduDomain/': '/'
      },
    }
  },
  {
    name:'/robot/hchome/',
    options:{
      target: 'http://info.zq88.cn:9085/',
      pathRewrite: {
        '/robot/hchome/': '/'
      },
    }
  },
  {
    name:'/announce/',
    options:{
      target: 'http://semantic-datacenter-service:31001/',
      pathRewrite: {
        '/announce/': '/'
      },
    }
  },
  {
    name:'/topchtml/',
    options:{
      target: 'http://top-stock.rxhui.com/',
      pathRewrite: {
        '/topchtml/': '/'
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://top-stock.rxhui.com/')
      }
    }
  },
  {
    name:'/e-html/',
    options:{
      target: 'http://c-project.rxhui.com/',
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://c-project.rxhui.com/'+req.url)
      }
    }
  },
  {
    name:'/industryAnalysis/',
    options:{
      target: 'http://report.rxhui.com/',
      pathRewrite: {
        '/industryAnalysis/': ''
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://report.rxhui.com/'+req.url)
      }
    }
  },
  {
    name:'/conceptAnalysis/',
    options:{
      target: 'http://mezt.rxhui.com/',
      pathRewrite: {
        '/conceptAnalysis/': ''
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://mezt.rxhui.com/'+req.url)
      }
    }
  },
  {
    name:'/logs/',
    options:{
      target: 'http://node-log-service/',
      pathRewrite: {
        '/logs/': '/'
      },
    }
  },
  {
    name:'/tabs/',
    options:{
      target: 'http://semantic-tab-service/',
      pathRewrite: {
        '/tabs/': '/'
      },
      //proxy_http_version 1.1;
    }
  },
  {
    name:'/es-head/',
    options:{
      target: 'http://192.168.30.56:9200/',
      pathRewrite: {
        '/es-head/': '/'
      },
    }
  },
  {
    name:'/security-common-service/',
    options:{
      target: 'http://security-common-service/',
      pathRewrite: {
        '/security-common-service/': '/'
      },
    }
  },
  {
    name:'/stockAnalysis/',
    options:{
      target: 'http://192.168.20.200:9000/',
      pathRewrite: {
        '/stockAnalysis/': '/'
      },
    }
  },
  {
    name:'/cproject/',
    options:{
      target: 'http://c-project.jinhui001.com/prospectus',
      pathRewrite: {
        '/cproject/': '/'
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://c-project.jinhui001.com/prospectus')
      }
    }
  },
  {
    name:'/cproject/prospectus/',
    options:{
      target: 'http://c-project.jinhui001.com/prospectus/prospectus',
      pathRewrite: {
        '/cproject/prospectus/': '/'
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://c-project.jinhui001.com/prospectus/prospectus')
      }
    }
  },
  {
    name:'/vop/',
    options:{
      target: 'https://vop.baidu.com/',
      pathRewrite: {
        '/vop/': '/'
      },
    }
  },
  {
    name:'/openapi/',
    options:{
      target: 'https://openapi.baidu.com/oauth/2.0/',
      pathRewrite: {
        '/openapi/': '/'
      },
    }
  },
]

module.exports = proxy
