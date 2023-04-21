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
    passwordNumErr:false,
    password2: false,
    disabled: true,
    starstr: [],
    placeholder:['请输入','6位数字,不能与原密码相同','再次输入6位数字密码'],
    license: SMConfig.miniPKbLicense,
    SM24publickey: SMConfig.SM24publickey,
    passworddesc:''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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
          placeholder:['','6位数字,不能与原密码相同','再次输入6位数字密码']
        })
      }else if(e.detail.date.starstr[1] ==='|'){
        this.setData({
          placeholder:['请输入','','再次输入6位数字密码']
        })
      }else if(e.detail.date.starstr[2] ==='|'){
        this.setData({
          placeholder:['请输入','6位数字,不能与原密码相同','']
        })
      }
  
      if(e.detail.date.callBackfn!==undefined){
        this.setData({
          placeholder:['请输入','6位数字,不能与原密码相同','再次输入6位数字密码']
        })
      }


      if(myComponent.pwdLength('0') ===6){
        this.setData({
          password:true
        })
      }
      if(myComponent.pwdLength('1') ===6){
        this.setData({
          password1:true
        })
      }
      if(myComponent.pwdLength('2') ===6){
        this.setData({
          password2:true
        })
      }
      const {password,password1,password2} = this.data;
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
  onOk(){
    // return wx.navigateTo({
    //   url: `/pages/withdraw/face/index?bizType=set_deal_psw`,
    //   events:{
    //     result:(data)=>{
    //       console.log(data);
    //       this.onSubmit();
    //     }
    //   }
    // })
    this.onSubmit();
  },

  async onSubmit() {
    let myComponent = this.selectComponent("#password");
    let miwen = myComponent.getoutputSM('0');
    let miwen1 = myComponent.getoutputSM('1');
    let miwen2 = myComponent.getoutputSM('2');
    try {
      const {code, desc} = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.updateseceleaccpwd', {
        isLoading:true,
        params:{
          currentAsePwd: miwen,
          asePwd: miwen1,
          confirmAsePwd: miwen2
        }
      })
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
    this.applyHandler(value) //获取输入的验证码值
  },
  async getCode(){
    let { reservedMobile } = this.data.userInfo;
    let params= {
      mobilePhone:reservedMobile,
      bizType: 'change_tx_pwd'
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
  applyHandler: async function (verifyCode) {
    let url =  'bank.api.read.personal.loanbindreadservice.confirmbindloancard';
    let params = {
      bankCardNo,
      verifyCode,
      bindType:this.data.bindType
    }
    //0=成功 1=需要弹短信验证码 -10=验证码不正确 其他值为业务异常
    let { code ,desc} = await fetch(
      url,
      params
    )
    if(code===-10){
      this.setData({
        isCodeError:true
      })
      return
    }

    if(code ===-70000){
      this.setData({
        popShow:false,
        passwordNumErr:true,
        passworddesc:desc
      })
    }


    this.setData({ show: false , isCountdown: false});
    if (code === 0) {
      wx.showToast({
        title: '修改交易密码成功',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    }else{
      wx.showToast({
        title: desc,
        icon: 'none'
      })
    }
    if (code === -10){
      this.isCodeError = true
    }
  },
  onShow(){
    try {
      let myComponent = this.selectComponent('#password');
        myComponent.clearpwd('0')
        myComponent.clearpwd('1')
        myComponent.clearpwd('2')
    } catch (error) {
      console.log(error);
    }
  },
  toPassword(){
    this.setData({
      passwordNumErr:false
    })
    wx.navigateTo({
      url: '/packageB/pages/password/forget/index',
    })
  },
  onCloseServer(){
    this.setData({
      passwordNumErr:false
    })
  },
})