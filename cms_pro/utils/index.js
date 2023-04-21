import {cloneDeep, isString, flow, curry} from 'lodash'
import fetch from '~/utils/fetch'

export function cookies(cookie) {
  return cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=')
    prev[name] = value
    return prev
  }, {})
}

export function uploadImg(file, cb) {
  const imageType = file.name.split('.').reverse()[0]
  let base64
  return new Promise(function (resolve, reject) {
    const fileReader = new FileReader()
    fileReader.onloadend = async (e) => {
      file.url = e.target.result
      base64 = e.target.result.split('base64,')[1]
      let params = {
        base64String: base64,
        suffix: imageType,
      }

      let {
        data: {code, data},
      } = await fetch('bank.api.appcellconfigservice.uploadfile', [params])
      if (code == 0) {
        resolve(data)
      } else {
        reject()
      }
    }
    fileReader.readAsDataURL(file)
  })
}

export function file2base64(file, cb) {
  const imageType = file.name.split('.').reverse()[0]
  let base64
  return new Promise(function (resolve, reject) {
    const fileReader = new FileReader()
    fileReader.onloadend = async (e) => {
      file.url = e.target.result
      // base64 = e.target.result.split('base64,')[1]
      let params = {
        base64String: e.target.result,
        suffix: imageType,
      }
      resolve(params)
    }
    fileReader.readAsDataURL(file)
  })
}

export function scrollTop() {
  document.querySelector('#primaryLayout').scrollTo({top: 0})
}
