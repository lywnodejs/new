const fetch = require("./fetch")

const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        resolve(res)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}

const authorize = (scope) => {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope,
      success () {
        resolve(true)
      },
      fail () {
        resolve(false)
      }
    })
  })
}

const openSetting = (scope) => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success (res) {
        // console.log('res.authSetting', res.authSetting)
        resolve(res.authSetting[scope])
      }
    })
  })
}

const popup = (scope, fn, title='位置权限授权', content='请允许获取您的位置信息，用于借款额度评估，否则将无法正常使用借款服务') => {
  wx.showModal({
    title ,
    content,
    confirmText: "去设置",
    success: async (res) => {
      if (res.confirm) {
       const res = await openSetting(scope)
       fn(res)
      } else if (res.cancel) {
        fn(false)
      }
    }
  })
}

const _locationChangeFn = function(location) {
  getApp().globalData.location = location
  // console.log('location change', location)
 }

 const startLocationUpdate = () => {
  wx.startLocationUpdate({
    success: (res) => {
      // console.log(res)
      wx.onLocationChange(_locationChangeFn)
    },
    fail: (error) => {
      console.log('startLocationUpdate fail: ', error)
    }
  })
}

const location = (resolve, reject) => {

  startLocationUpdate()
  wx.getLocation({
    type: 'wgs84',
    success (res) {
      resolve(res)
      const latitude = res.latitude
      const longitude = res.longitude
      const speed = res.speed
      const accuracy = res.accuracy
      // console.log(latitude, longitude, speed, accuracy)
      if (!getApp().getSessionId()) {
        return
      }
      fetch('bank.api.write.appdatauploadwriteservice.uploadappdata', {
        params: {
          data: [{
            latitude,
            longitude
          }], 
          "type": "gps"
        }, 
        isLoading: false
      })
    },
    fail (error) {
      reject(error)
      // console.log(error, '-------------')
    }
   })
}

const getLocation = () => {
  return new Promise(async (resolve, reject) => {
    const res = await getSetting()
    // console.log(res)

    //没有授权过
    if (res.authSetting['scope.userLocation'] === undefined) {
      const res = await authorize('scope.userLocation')
      if (res) {
        location(resolve, reject)
      } else {
        popup('scope.userLocation', (authSetting) => {
          if (authSetting) {
            location(resolve, reject)
          } else {
            resolve(false)
          }
        })
      }
      return
    }

    //拒绝了位置权限授权
    if (res.authSetting['scope.userLocation'] === false) {
      popup('scope.userLocation', (authSetting) => {
        if (authSetting) {
          location(resolve, reject)
        } else {
          resolve(false)
        }
      })
      return
    }

    location(resolve, reject)
  })
}

const locate = () => {
  return new Promise(async (resolve, reject) => {
    const res = await getSetting()
    // console.log(res)

    //没有授权过
    if (res.authSetting['scope.userLocation'] === undefined) {
      // 请求权限
      const res = await authorize('scope.userLocation')
      if (res) {
        location(resolve, reject)
      }
      return
    }

    //已授权
    if (res.authSetting['scope.userLocation'] !== false) {
      return location(resolve, reject)
    }
    
    reject()
  })
}

const WXLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      complete: (res) => {
        resolve(res)
      },
    })
  })
}

const getNetworkType = () => {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: (result) => {
        resolve(result)
      },
      fail: () => {
        resolve({})
      }
    })
  })
}

const getWifiList = async () => {
  return new Promise((resolve, reject) => {
    wx.startWifi({
      success: (res) => {
        wx.getWifiList({
          success: (res) => {
            wx.onGetWifiList((result) => {
              resolve(result)
            })
          },
          fail: (e) => {
            console.log(e)
            resolve({})
          }
        })
      },
      fail: (e) => {
        resolve({})
      }
    })
  })
}

const getConnectedWifi = () => {
    return new Promise((resolve, reject) => {
      wx.getConnectedWifi({
        success: (result) => {
          resolve(result)
        },
        fail: (e) => {
          console.log(e)
          resolve({})
        }
      })
    })
}

const getSystemInfo = async () => {
  const netInfo = await getNetworkType()
  // console.log(netInfo)
  
  // const {wifiList: wifiNameList = ''} = await getWifiList()
  // console.log(wifiNameList)

  const {wifi} = await getConnectedWifi()
  let currentWifi = ''
  if (wifi) {
    currentWifi = [wifi.SSID, wifi.BSSID, wifi.signalStrength]
    console.log(wifi)
  }

  try {
    const res = wx.getSystemInfoSync()
    console.log(res)

    const params = {
      appVersion: getApp().version,
      deviceModel: res.model,
      deviceType: res.platform,
      system: "ziyoudai",
      brand: res.brand,
      deviceOS: res.system,
      netType: netInfo.networkType || '',
      batteryLevel: res.batteryLevel,
      currentWifi,
      displayResolution: `${res.pixelRatio * res.screenWidth}*${res.pixelRatio * res.screenHeight}`
    }
    // console.log(params)

    if (!getApp().getSessionId()) {
      return
    }

    // fetch('bank.api.write.appdatauploadwriteservice.reportdeviceinfo', {
    //   params, 
    //   isLoading: false
    // })
  } catch (error) {
    console.log(error)
  }
}

const requestRecordPermission =()=>{
  return new Promise(async (resolve, reject) => {
    const res = await getSetting()
    //没有授权过
    let permission = res.authSetting['scope.record'] 
    console.log('录音权限初始判断',permission )
    if (!permission) {
      // 请求权限
      const res = await authorize('scope.record')
      console.log('录音权限申请--',res )
      if (res) {
        resolve(true)
      } else {
        popup('scope.record', (authSetting) => {
          if (authSetting) {
            resolve(true)
          } else {
            resolve(false)
          }
        },'录音权限授权','请允许获取您的录音权限用于录制资料，否则将无法正常使用借款服务')
      }
      return
    }

    //已授权
    if (res.authSetting['scope.record'] !== false) {
      resolve(true)
    }
  })
}


module.exports = {
  getSetting,
  authorize,
  getLocation,
  locate,
  WXLogin,
  getSystemInfo,
  requestRecordPermission
}