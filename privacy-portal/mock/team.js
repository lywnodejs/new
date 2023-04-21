module.exports = {
  'GET /rest/team/list': {
    // errno: 0,
    // errmsg: 'ok',
    // data: [
    //   {
    //     id: '1',
    //     name: '123'
    //   },
    //   {
    //     id: '2',
    //     name: '456'
    //   }
    // ]
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'GET /rest/team/apply/list': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'GET /rest/team/user/list': {
    // errno: 0,
    // errmsg: '',
    // remark: '您的入团申请团队长还没有审核完成，请耐心等待',
    // data: [1]
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'GET /rest/team/name/verify': {
    // errno: 1,
    // errmsg: 'ok'
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'POST /rest/team/create': {
    // errno: 0,
    // errmsg: 'ok'
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'POST /rest/team/verify': {
    // errno: 0,
    // errmsg: 'ok'
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  },

  'POST /rest/team/apply': {
    // errno: 0,
    // errmsg: 'ok'
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '')
    }
  }
}
