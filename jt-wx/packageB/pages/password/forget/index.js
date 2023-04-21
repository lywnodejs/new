// pages/account/password/change/index.js
import fetch from '../../../../utils/fetch'
const app = getApp()
let SMConfig = app.SMConfig;
Page({

  /**
   * Page initial data
   */
  data: {
    show:false,
    isCountdown:false,
    password: false,
    password1: false,
    password2: false,
    disabled: true,
    starstr: [],
    isCodeError:false,
    placeholder:['请输入您的身份证号码','请输入6位数字密码','再次输入6位数字密码'],
    reservedMobile:'',
    license: SMConfig.miniPKbLicense,
    SM24publickey: SMConfig.SM24publickey
  },

  /**
   * Lifecycle function--Called when page load
   */

  async reqFetch(isLoading = true) {
    try {
      const {
        code,
        data
      } = await fetch('bank.api.read.homepageproductsservice.homeusercenter', {
        isLoading
      })
      if (code === 0) {
        this.setData({
          reservedMobile: data.customerPhone
        })
      }
    } catch (error) {
      console.log(error)
    }
  },

  onLoad: function (options) {
    console.log(SMConfig);
    this.reqFetch()
    let myComponent = this.selectComponent('#password');

    //设置随机因子(固定)(此处写死随机数是为了前端整个流程跑通，应用到项目中时，需要由后台动态下发随机数)
    myComponent.pwdSetSk(SMConfig.appKbCipherKey);
    //设置映射表(固定)(此处写死映射表是为了前端整个流程跑通，应用到项目中时，需要由后台动态下发映射表)
    myComponent.pwdSetMap(SMConfig.appKbCipherKey2)
  },
  bindButtonTap(e) {
    let myComponent = this.selectComponent("#password");
    myComponent.bindButtonTap(e)
  },
  closePWD(){
    let myComponent = this.selectComponent('#password');
    myComponent.close()
  },
  onMyEvent (e) {
    this.setData({
      starstr: e.detail.date.starstr
    });
    
    let myComponent = this.selectComponent("#password");
    try {
      if(e.detail.date.starstr[0] ==='|'){
        this.setData({
          placeholder:['','请输入6位数字密码','再次输入6位数字密码']
        })
      }else if(e.detail.date.starstr[1] ==='|'){
        this.setData({
          placeholder:['请输入您的身份证号码','','再次输入6位数字密码']
        })
      }else if(e.detail.date.starstr[2] ==='|'){
        this.setData({
          placeholder:['请输入您的身份证号码','请输入6位数字密码','']
        })
      }
  
      if(e.detail.date.callBackfn!==undefined){
        this.setData({
          placeholder:['请输入您的身份证号码','请输入6位数字密码','再次输入6位数字密码']
        })
      }


      if(myComponent.pwdLength('1') ===6){
        this.setData({
          password1:true
        })
      }else{
        this.setData({
          password1:false
        })
      }
      if(myComponent.pwdLength('2') ===6){
        this.setData({
          password2:true
        })
      }else{
        this.setData({
          password2:false
        })
      }
      const {password,password1,password2} = this.data;
      console.log(password,password1,password2)
      if(password && password1 && password2){
        this.setData({
          disabled:false
        })
      }else{
        this.setData({
          disabled:true
        })
      }
    } catch (error) {
      
    }

  },

  inputChange(e){
    let text = e.detail.value;
    this.setData({
      password:text
    })
  },

  async onSubmit(verifyCode) {
    let myComponent = this.selectComponent("#password");
    let miwen1 = myComponent.getoutputSM('1');
    let miwen2 = myComponent.getoutputSM('2');
    try {
      const {code, desc} = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.resetseceleaccpwd', {
        verifyCode,
        asePwd: miwen1,
        confirmAsePwd: miwen2,
      })
      if(code===-10){
        // this.setData({ show: false , isCountdown: false});
        return this.setData({
          isCodeError: true
        })
      }
      if (code === 0) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 500)
      }else{
        wx.showToast({
          title: desc,
          icon: 'none'
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
  onSend() {
    this.getCode() // 发送验证码
  },
  onComplete({detail: value}) {
    this.onSubmit(value)
  },
  async getCode(){
    let { reservedMobile } = this.data;
    let params= {
      mobilePhone:reservedMobile,
      bizType: 'reset_tx_pwd'
    }
    try {
      let {data,code}= await fetch('bank.api.write.standard.userpersonwriteservice.sendverifycode',params)
      console.log(code);
      if (code === 0) {
        this.setData({ show: true , isCountdown: true});
      }
    } catch (error) {
      console.log(error);
    }
    
  },
  onShow(){
    try {
      let myComponent = this.selectComponent('#password');
        myComponent.clearpwd('1')
        myComponent.clearpwd('2')
    } catch (error) {
      console.log(error);
    }
  }
})