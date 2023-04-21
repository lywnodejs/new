const url = 'https://gw-test.jjyjsjr.com'
const sm2 = require('miniprogram-sm-crypto').sm2;
const sm3 = require('miniprogram-sm-crypto').sm3;
const sm4 = require('miniprogram-sm-crypto').sm4;


let deviceUid =null;
//生成唯一字符串
function create_uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("");
  return uuid;
}
if(wx.getStorageSync('deviceUid')){
  deviceUid = wx.getStorageSync('deviceUid');
}else{
  deviceUid = create_uuid()
}


let publicKey = '04cbb0d2e6f5b87415aefed12cbd04a44819b99434a5b31b2f2ece5e7dbe3daf2275ed2a33582042770715d9d1b451381cd47ceeb599ee9834f54024bbcf646765' // 后端公钥
let privateKey = '7fcc50b14a716966ec5d7ba9a39bbb6433c1d21eb20468aa99b29a1a3b3f7d03' // 前端私钥
const key = '0123456789abcdeffedcba9876543210'  //sm4秘钥
let sm4Key = sm2.doEncrypt(key, publicKey, 1) // sm2加密后的sm4秘钥

const excludeCode = [0, -30, -31, -10, -11, -13, -80000, -80001, 30004, 30011, 30012, 30007, 30008, 10007, 10008, 10009, 10010, 10011, -1014,1,-60,-90000,-70000]
const excludeMethodName = [
  'com.rongzhijia.ydq.api.dubbo.ksrcb.repaymentksrcbfacadestub.dorepayment',
  'bank.api.read.personal.seceleaccpersonalreadservice.transfermoney',
  'bank.api.write.personal.facepersonalservice.ocr',
  'bank.api.read.personal.seceleaccpersonalreadservice.accquerybankcardbin'
]
const fetch = (methodName, parameter = {}, header) => {
  let requestTask
  const p = (parameter.method === undefined && parameter.isLoading === undefined) ? {
    params: parameter
  } : parameter

  const {
    params,
    isLoading,
    method
  } = Object.assign({
    isLoading: true,
    method: 'post'
  }, p)

  let encryptData = null; //加密后的值
  if(params){
    encryptData = {
      cipherText:sm4.encrypt(JSON.stringify(params), key),
      extraParams:[
        {
          key:sm4Key
        }
      ]
    }
  }

  const timestamp =  Date.now()
  let sign = ''
  if(params){
    sign = sm3(`${timestamp}:method:${methodName}:cipher:${encryptData.cipherText}:key:${sm4Key}:${timestamp}`)
  } else {
    sign = sm3(timestamp+":method:"+methodName+":"+timestamp);
  }
  let headers = {
    'content-type': 'application/json',
    'appType': 'miniapp',
    'appVersion': getApp().version,
    'sessionId': getApp().getSessionId(),
    'minChannel': getApp().getChannel(),
    'brokerCode': getApp().getBrokerCode(),
    'orgId': getApp().getOrgId(),
    'deviceUid':deviceUid,
    'platform': 'miniProgram',
    timestamp,
    sign
  }
  if (header) {
    headers = {
      ...headers,
      ...header
    }
  }
  const request = (resolve, reject) => {
    isLoading && wx.showLoading({
      title: '加载中',
      mask: true
    })
    requestTask = wx.request({
      url: `${url}/gateway.action`,
      data: {
        methodName: methodName,
        paramValues: params ? [encryptData] : []
      },
      header: headers,
      method,
      success(res) {
        isLoading && wx.hideLoading()
        console.log(res);
        if(res.data.data){
          let extraParams = res.data.data.extraParams[0];
          let sm2key = extraParams.key.substring(2,extraParams.key.length);
          let sm4Key =  sm2.doDecrypt(sm2key,privateKey,1);
          var stringtoHex = function (str) {
            var val = "";
            for (var i = 0; i < str.length; i++) {
                if (val == "")
                    val = str.charCodeAt(i).toString(16);
                else
                    val += str.charCodeAt(i).toString(16);
            }
            return val
        }
          sm4Key = stringtoHex(sm4Key)
         let sm4Data =  sm4.decrypt(res.data.data.cipherText, sm4Key);
          res.data.data =JSON.parse(sm4Data)
        }
        console.log(res.data);
        resolve(res.data)
        if (res.data.code === -8) {
          getApp().setSessionId('')
          return wx.reLaunch({
            url: '/pages/login/index/index',
          })
        }
        if(methodName ==='bank.api.read.messagelogreadservice.getnewestmessage'){
          return 
        }

        if (!~excludeCode.indexOf(res.data.code) && !~excludeMethodName.indexOf(methodName) && res.data.desc) {
          wx.showToast({
            title: res.data.desc,
            icon: 'none'
          })
        }

      },
      fail(error) {
        // console.log(error)
        isLoading && wx.hideLoading()
        reject(error)
      }
    })
  }
  const promise = new Promise(request)
  promise.requestTask = requestTask
  return promise
}

fetch.get = (url, params) => {
  return fetch(url, params, 'get')
}

fetch.post = (url, params) => {
  return fetch(url, params)
}

fetch.uploadFile = (url, filePath, formData) => {
  let uploadTask
  const request = (resolve, reject) => {
    uploadTask = wx.uploadFile({
      url,
      filePath,
      name: 'file',
      formData,
      success(res) {
        // const data = res.data
        //do something
        resolve(res.data)
      },
      fail(error) {
        reject(error)
      }
    })
  }
  const promise = new Promise(request)
  promise.uploadTask = uploadTask
  return promise
}

fetch.getPwdData = (doSuccess, doFail) => {
  var session_id = wx.getStorageSync('sessionId'); //本地取存储的sessionID
  if (session_id != "" && session_id != null) {
    var header = {
      'content-type': 'application/json; charset=UTF-8',
      'Cookie': 'JSESSIONID=' + session_id
    }
  } else {
    var header = {
      'content-type': 'application/json; charset=UTF-8'
    }
  }
  wx.request({
    url: pwdUrl,
    method: 'GET',
    header,
    success: function (res) {
      let psIndex = res.header['Set-Cookie'].match(/ps_index=([\s\S]*?);/)[1]
      // str.match(/ps_index=([\s\S]*?);/)
      var resdata = res.data;
      doSuccess(resdata, psIndex);
    },
    fail: function () {
      wx.showToast({
        title: '系统异常，请稍后再试',
        icon: 'none'
      })
    },
  })
}

module.exports = fetch