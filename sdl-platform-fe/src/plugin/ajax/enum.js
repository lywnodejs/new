const error = {
  FORMAT: 1, // 格式错误
  SERVER: 2 // 服务错误
}
const status = {
  SUCCESS: 0, // 成功
  SUCMIN: 210,
  SUCMAX: 220,
  UPDATE: 201, // 系统升级
  LOGINFAIL: 202, // 用户名密码错误
  AUTHCODE: 203, // 验证码错误
  LOCK: 204, // 账号锁定
  FORBIDDEN: 205, // 账号禁用
  LOGOUT: 1000, // 未登录
  LOGINTIMEOUT: 304, // 登录超时
  EXPIRED: 400, // 密码过期
  AUTH: 403, // 权限限制
  ERROR: 500, // 服务器内部错误
  ESERROR: 501 // ES初始化失败
}

export {
  error,
  status
}
