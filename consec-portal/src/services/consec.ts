import ajax from 'utils/ajax'

// 首页banner
export function indexxmg() {
  return ajax.get('/consec/indexmg/list')
}

// 随机文本
export function randomText() {
  return ajax.get('/consec/indexmg/randomtext')
}

// 随机图片
export function randomImg() {
  return ajax.get('/consec/indexmg/randomimg')
}

// 验证随机文字
export function randomTextCheck(params) {
  return ajax.post('/consec/indexmg/randomtext/check', params)
}

// 验证随机图片
export function randomImgCheck(params) {
  return ajax.post('/consec/indexmg/randomimg/check', params)
}
