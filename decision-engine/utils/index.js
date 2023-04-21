import {cloneDeep, isString, flow, curry} from 'lodash'

export function cookies(cookie = '') {
  return cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=')
    prev[name] = value
    return prev
  }, {})
}
export const formatMoney = function (s) {
  if (!s) {
    return 0
  }
  var noNegative = true //默认是正值。
  s = parseFloat(s + '')
  s = s + '' //转换成字符串
  if (parseFloat(s) < 0) {
    //是负数
    s = Math.abs(s) + ''
    noNegative = false
  }
  var zheng = s.split('.')[0]
  var dian = s.split('.')[1]
  //将整数部分，利用字符串的charAt() 方法，转换成数组。
  var zhengArr = []
  for (var i = 0; i < zheng.length; i++) {
    zhengArr.push(zheng.charAt(i))
  }
  zhengArr = zhengArr.reverse()
  var t = ''
  for (var i = 0; i < zhengArr.length; i++) {
    if (i % 3 == 2 && i != zhengArr.length - 1) {
      //为第三位，并且并不是最后了。如123456时，6并不加,
      t += zhengArr[i] + ','
    } else {
      t += zhengArr[i] + '' //加上空格
    }
  }
  return (
    (noNegative ? '' : '-') +
    t.split('').reverse().join('') +
    `${dian ? '.' + dian : ''}`
  )
}

export function isEmpty(param) {
  if (param.length == 0) {
    return true
  } else {
    return false
  }
}

export function isNumber(param) {
  if (isNaN(param)) {
    return false
  } else {
    return true
  }
}

//匹配IP地址的正则表达式
export function isIP(strIP) {
  var re = /^(\d+|\*{1})\.(\d+|\*{1})\.(\d+|\*{1})\.(\d+|\*{1})$/g
  if (re.test(strIP)) {
    if (
      (RegExp.$1 < 256 || RegExp.$1 == '*') &&
      (RegExp.$2 < 256 || RegExp.$2 == '*') &&
      (RegExp.$3 < 256 || RegExp.$3 == '*') &&
      (RegExp.$4 < 256 || RegExp.$4 == '*')
    ) {
      return true
    }
  }
  return false
}

export function computeUnit(val) {
  var arr = [
    {name: '万', value: 5},
    {name: '十万', value: 6},
    {name: '百万', value: 7},
    {name: '千万', value: 8},
    {name: '亿', value: 9},
    {name: '十亿', value: 10},
    {name: '百亿', value: 11},
    {name: '千亿', value: 12},
    {name: '万亿', value: 13},
  ]
  if (val) {
    let len = Number(val).toFixed(0).length
    let findOne = arr.find((v) => v.value == len)
    return findOne ? findOne.name : ''
  }
  return null
}
