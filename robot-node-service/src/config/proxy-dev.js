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
    name:'/stocks/',
    options:{
      target: 'http://10.0.0.22:9188/',
      pathRewrite: {
        '/stocks/': '/'
      },
    }
  },
  {
    name:'/robot/conditions/',
    options:{
      target: 'http://10.0.0.22:8992/',
      pathRewrite: {
        '/robot/conditions/': '/'
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
      target: 'http://10.0.0.40:9085/',
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
      target: 'http://10.0.0.105:10011/',
      pathRewrite: {
        '/topchtml/': '/'
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://10.0.0.105:10011/')
      }
    }
  },
  {
    name:'/e-html/',
    options:{
      target: 'http://c-project-dev.jinhui001.com/',
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://c-project-dev.jinhui001.com/'+req.url)
      }
    }
  },
  {
    name:'/industryAnalysis/',
    options:{
      target: 'http://10.0.0.22:10017/',
        pathRewrite: {
        '/industryAnalysis/': ''
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://10.0.0.22:10017/'+req.url)
      }
    }
  },
  {
    name:'/conceptAnalysis/',
    options:{
      target: 'http://mezt-dev.rxhui.com/',
        pathRewrite: {
        '/conceptAnalysis/': ''
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://mezt-dev.rxhui.com/'+req.url)
      }
    }
  },
  {
    name:'/logs/',
    options:{
      target: 'http://10.0.0.21:9097/',
      pathRewrite: {
        '/logs/': '/'
      },
    }
  },
  {
    name:'/robot/javaApi/',
    options:{
      target: 'http://10.0.0.134:9188/',
      pathRewrite: {
        '/robot/javaApi/': '/'
      },
    }
  },
  {
    name:'/stockAnalysis/',
    options:{
      target: 'http://10.0.0.68:9000/',
      pathRewrite: {
        '/stockAnalysis/': '/'
      },
    }
  },
  {
    name:'/cproject/',
    options:{
      target: 'http://10.0.0.105:8086/prospectus',
      pathRewrite: {
        '/cproject/': '/'
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://10.0.0.105:8086/prospectus')
      }
    }
  },
  {
    name:'/cproject/prospectus/',
    options:{
      target: 'http://10.0.0.105:8086/prospectus/prospectus',
      pathRewrite: {
        '/cproject/prospectus/': '/'
      },
      onProxyReq: function (reqProxy, req, res) {
        res.redirect('http://10.0.0.105:8086/prospectus/prospectus')
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
