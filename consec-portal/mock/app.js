module.exports = {
  'GET /consec/indexmg/list': {
    code: 0,
    data: [{
      url: 'https://s3-gzpu-inter.didistatic.com/consec-index-page/banner.png',
      hyperlink: ''
    }]
  },
  'GET /consec/indexmg/randomtext': {
    target: 'http://10.96.84.25:7879/'
  },
  'GET /consec/indexmg/randomimg': {
    target: 'http://10.96.84.25:7879/'
  },
  'POST /consec/indexmg/randomtext/check': {
    target: 'http://10.96.84.25:7879/'
  },
  'POST /consec/indexmg/randomimg/check': {
    target: 'http://10.96.84.25:7879/'
  }
}
