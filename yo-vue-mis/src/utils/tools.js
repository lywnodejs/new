
/**
 * 将'', null以及undefined参数过滤掉
 * @param {*} obj 过滤的参数对象
 */
function interceptParams(obj) {
  let param = {};
  if (obj === null || obj === undefined || obj === '') {
    return param
  }
  for (let key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      if (typeof (obj[key]) == 'string') {
        obj[key] = obj[key].trim()
      } else if ((obj[key]) instanceof Array && obj[key].length == 0) {

        // 去掉空数组参数
        delete obj[key]
      }
      param[key] = obj[key]
    }
  }
  return param
}

export {
  interceptParams
}
