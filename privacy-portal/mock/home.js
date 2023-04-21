module.exports = {
  'GET /rest/index': {
    target: 'http://10.96.88.90',
    pathRewrite(path) {
      return path.replace(/^http:\/\/sec.didichuxing.com/, '');
    }
  }
};
