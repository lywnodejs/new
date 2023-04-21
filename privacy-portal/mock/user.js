module.exports = {
  'GET /rest/auth/state': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'GET /rest/auth/weixin': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'GET /rest/notice/list': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'GET /rest/user/scores': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'GET /rest/user/info': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'POST /rest/user/modify': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'GET /rest/user/checkUserName': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  // 'POST /rest/notice/remove': {
  //   errno: 0,
  //   errmsg: 'ok',
  //   data: ''
  // },

  // 'POST /rest/notice/read': {
  //   errno: 0,
  //   errmsg: 'ok',
  //   data: ''
  // },

  'POST /rest/notice/*': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'GET /auth/user': {
    errno: 0,
    errmsg: 'ok',
    data: {
      user: {
        id: 6,
        nikeName: '老司机00002',
        userName: null,
        headUrl:
          'http://img-ys011.didistatic.com/static/architectureimg/508baf0f-6309-4c00-9198-21fd72183d81',
        allScore: 1010,
        availScore: 710,
        mobile: '',
        userIp: null,
        ejectUserInfo: 2
      },
      noticeNum: 21,
      vulnsNum: 43,
      allScoreNum: 1010,
      scoreNum: 710
    }
  },

  // 'GET /rest/user/info': {
  //   errno: 0,
  //   errmsg: 'ok',
  //   // data: ''
  //   data: {
  //     id: '123',
  //     userName: '平台小黑',
  //     nickName: '',
  //     realName: '',
  //     pHome: 'http://sec.didichuxing.com',
  //     sex: '男',
  //     headUrl: '',
  //     email: 'sec@didichuxing.com',
  //     bind: 'wechat',
  //     mobile: '156****2268',
  //     borthday: '2018-08-20',
  //     qq: '',
  //     weixin: '',
  //     team: '',
  //     addr: '',
  //     recommender: '',
  //     allScore: 100,
  //     availScore: 30,
  //     registerTime: '2018-08-20'
  //   }
  // },

  // 'GET /rest/auth/logout': {
  //   errno: 0,
  //   errmsg: 'ok',
  //   data: ''
  // },

  // 'GET /auth/state': {
  //   errno: 0,
  //   errmsg: 'ok',
  //   data: '12345678'
  // },

  // 'GET /auth/weixin': {
  //   errno: 0,
  //   errmsg: 'ok',
  //   data: ''
  // },

  'POST /rest/oauth/wb': {
    errno: 0,
    errmsg: 'ok',
    data: '12345678'
  },

  'GET /rest/auth/*': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  }
}
