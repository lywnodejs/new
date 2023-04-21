// pages/account/form/index.js
const fetch = require('../../../utils/fetch')
const app = getApp()
let SMConfig = app.SMConfig
Page({
  /**
   * Page initial data
   */
  data: {
    selectType: 1,
    iswrite: false,
    password1: false,
    password2: false,
    paddingBottom: '0',
    showTypePopup: false,
    showCodePopup: false,
    showTipsPopup: false,
    userInfo: null,
    isSelect: false,
    isError: true,
    bankInfo: null,
    placeholder: '请输入本人的银行卡',
    params: null,
    isCountdown: false,
    isCodeError: false,
    protocolList: [],
    starstr: [],
    placeholderPass: ['设置交易密码', '确认交易密码', ''],
    managerNumber: '', // 客户经理工号
    license: SMConfig.miniPKbLicense,
    SM24publickey: SMConfig.SM24publickey,
  },

  bindButtonTap(e) {
    let myComponent = this.selectComponent('#setPassword')
    myComponent.bindButtonTap(e)
    wx.pageScrollTo({
      scrollTop: 10000,
      duration: 0,
    })
  },
  closePWD() {
    let myComponent = this.selectComponent('#setPassword')
    myComponent.close()
  },
  onMyEvent(e) {
    this.setData({
      starstr: e.detail.date.starstr,
    })
    try {
      let myComponent = this.selectComponent('#setPassword')
      if (e.detail.date.starstr[0] === '|') {
        this.setData({
          placeholderPass: ['', '确认交易密码'],
        })
      } else if (e.detail.date.starstr[1] === '|') {
        this.setData({
          placeholderPass: ['设置交易密码', ''],
        })
      }
      if (e.detail.date.callBackfn !== undefined) {
        this.setData({
          placeholderPass: ['设置交易密码', '确认交易密码'],
        })
      }
      if (myComponent.pwdLength('0') === 6) {
        this.setData({
          password1: true,
        })
      }
      if (myComponent.pwdLength('1') === 6) {
        this.setData({
          password2: true,
        })
      }
    } catch (error) {}
  },

  getKeyByEvent: function (e) {
    let type = e.target.dataset.type
    let valueKey = type + '.value',
      errKey = type + '.isError',
      value = e.detail.value
    return {
      type,
      errKey,
      value,
      valueKey,
    }
  },
  isError: function () {
    wx.nextTick(() => {
      let { bankInfo } = this.data
      let isError =
        !bankInfo || !bankInfo.bankCardNo || bankInfo.bankCardNo.length < 16
      this.setData({
        isError,
      })
    })
  },

  toUrl: function (e) {
    let url = e.currentTarget.dataset.url
    console.log(url)
    wx.navigateTo({
      url: '/pages/web/index?url=' + url,
    })
  },
  selectUserType: function (e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      selectType: type,
    })
  },

  getUserInfo: async function () {
    let { code, data } = await fetch(
      'bank.api.read.personal.seceleaccpersonalreadservice.openseceleaccinfo'
    )
    if (code === 0) {
      this.setData({
        userInfo: data,
      })
    }
  },
  getProtocol: async function () {
    let { code, data } = await fetch(
      'bank.api.read.protocolreadservice.queryprotocol',
      {
        params: {
          showPage: '4',
          application: '3',
        },
        isLoading: false,
      }
    )
    let isSelect = true,
      protocolList = null
    if (code == 0 && data != '') {
      isSelect = false
      protocolList = data.protocols
    }
    this.setData({
      isSelect,
      protocolList,
    })
  },
  changeBankInfo: function (e) {
    this.setData({
      bankInfo: e.detail,
    })
    this.isError()
  },
  onApply: function () {
    if (this.data.isError) {
      return
    }
    if (!this.data.password1 || !this.data.password2) {
      return wx.showToast({
        title: '请设置交易密码',
        icon: 'none',
      })
    }
    if (!this.data.bankInfo || !this.data.bankInfo.bankCardNo) {
      return wx.showToast({
        title: '请输入银行卡号',
        icon: 'none',
      })
    }

    if (this.data.bankInfo.bankCardNo.length < 16) {
      return wx.showToast({
        title: '银行卡长度不正确',
        icon: 'none',
      })
    }

    if (this.data.selectType != 1) {
      return this.setData({
        showTypePopup: true,
      })
    }

    if (!this.data.isSelect) {
      return wx.showToast({
        title: '请勾选协议',
        icon: 'none',
      })
    }
    if (!this.data.iswrite) {
      wx.navigateTo({
        url: '/pages/write/index',
        events: {
          someSend: (data) => {
            this.setData({
              iswrite: true,
            })
            this.applyHandler()
          },
        },
      })
      return
    }
    this.applyHandler()
  },
  applyHandler: async function (verifyCode) {
    let { reservedMobile } = this.data.userInfo
    let { bankCardNo, bankCode, bankName } = this.data.bankInfo

    const authToken = wx.getStorageSync('authToken')

    let myComponent = this.selectComponent('#setPassword')
    // let asePwd = myComponent.getoutputSM('0');
    // let confirmAsePwd = myComponent.getoutputSM('1');
    let asePwd = '111111'
    let confirmAsePwd = '111111'
    let { code, desc } = await fetch(
      'bank.api.read.personal.seceleaccpersonalreadservice.confirmopenseceleacc',
      {
        bankCardNo,
        asePwd,
        confirmAsePwd,
        managerNumber: this.data.managerNumber,
        verifyCode,
        authToken,
      }
    )
    if (code === 1) {
      this.setData({ showCodePopup: true, isCountdown: true })
      return
    }
    if (code === -10) {
      // this.setData({ showCodePopup: false , isCountdown: false});
      return this.setData({
        isCodeError: true,
      })
    }
    if (code === 0) {
      this.setData({ showCodePopup: false, isCountdown: false })
      return wx.navigateTo({
        url: '/pages/account/open/result/index?type=1',
      })
    }
    this.setData({ showCodePopup: false, isCountdown: false })
    wx.navigateTo({
      url: `/pages/account/open/result/index?type=0&msg=${desc}`,
    })
  },
  // onSend() {
  // this.getCode()
  // },
  // async getCode(){
  //   let { reservedMobile } = this.data.userInfo;
  //   let params= {
  //     mobilePhone:reservedMobile,
  //     bizType: 'sec_acct_open'
  //   }
  //   try {
  //     let {data,code}= await fetch('bank.api.write.standard.userpersonwriteservice.sendverifycode',params)
  //     console.log(code,data);
  //     if (code === 0) {
  //       this.setData({ showCodePopup: true , isCountdown: true});
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  // },

  managerNumberChange(e) {
    this.setData({
      managerNumber: e.detail.value,
    })
  },
  onComplete({ detail }) {
    this.applyHandler(detail)
  },

  onLoad: function (options) {
    let myComponent = this.selectComponent('#setPassword')

    //设置随机因子(固定)(此处写死随机数是为了前端整个流程跑通，应用到项目中时，需要由后台动态下发随机数)
    myComponent.pwdSetSk(SMConfig.appKbCipherKey)
    //设置映射表(固定)(此处写死映射表是为了前端整个流程跑通，应用到项目中时，需要由后台动态下发映射表)
    myComponent.pwdSetMap(SMConfig.appKbCipherKey2)
    try {
      myComponent.clearpwd('0')
      myComponent.clearpwd('1')
    } catch (error) {
      console.log(error)
    }

    this.setData({
      showTipsPopup: true,
    })
    this.getUserInfo()
    this.getProtocol()
  },

  changeSelect: function ({ detail }) {
    this.setData({
      isSelect: detail,
    })
  },

  onShowChange: function ({ detail }) {
    let placeholder = '请输入本人的银行卡'
    if (detail) {
      placeholder = ''
    }
    this.setData({
      placeholder,
    })
  },
  onShow() {
    this.setData({
      iswrite: false,
    })
  },
})
