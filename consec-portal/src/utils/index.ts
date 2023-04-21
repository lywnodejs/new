/*
 * @Date: 2020-11-02 15:02:18
 * @Author: 刘亚伟
 * @LastEditTime: 2020-11-12 18:26:47
 */
import { intl } from 'di18n-react'
export function parseQueryString(url: string) {
  let obj = {}
  let key = '',
    value = ''
  let paraString = url.substring(url.indexOf('?') + 1, url.length).split('&')
  for (let i in paraString) {
    if (true) {
      key = paraString[i].substring(0, paraString[i].indexOf('='))
      value = paraString[i].substring(paraString[i].indexOf('=') + 1, paraString[i].length)
      obj[key] = value
    }
  }
  return obj
}

/**
 * 将html转义
 *
 * @param  {string} content
 * @returns string
 */
export function escape(content: string) {
  let _el = document.createElement('div')

  _el.textContent != null ? (_el.textContent = content) : (_el.innerText = content)
  _el = null as any
  return _el.innerHTML
}

/**
 * 将转义后的文本解码
 *
 * @param  {string} content
 */
export function unescape(content: string) {
  let _el = document.createElement('div')
  let output = ''

  _el.innerHTML = content
  output = _el.textContent || _el.innerText
  _el = null as any
  return output
}

export function getCookie(name: string) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return ''
  }
}

/**
 * 国际化翻译
 */
export function t(value: string) {
  return intl.t(value)
}
