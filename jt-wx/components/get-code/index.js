// components/get-code/index.js
import util from "../../utils/util";
const app = getApp()
const fetch = app.require('utils/fetch.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bizType :{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    text:'获取验证码',
    time:60,
    disabled:false,
    isErr:false,
    islock:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getCode(){
      let mobilePhone =  wx.getStorageSync('customerPhone')
     if(this.data.islock){
       this.setData({
        islock:false
       })
      try {
        const {code, data, desc} = await fetch('bank.api.write.standard.userpersonwriteservice.sendverifycode', {
          params: {
            mobilePhone: mobilePhone.replace(/\s/g, ''),
            bizType: this.data.bizType
          },
          isLoading: false
        })
        
        //弹出图形验证码输入
        if (code === -10) {
         return this.setData({img: data.captchaCode, focus: false, verifyError: !!captchaCode})
        }
  
        //图形验证码输入错误
        if (code === -11) {
          return this.setData({verifyError: true})
        }
        
        if (code === 0 || code === -12) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'none'
          })
        }
      let str = 's后重新发送';
      let num = this.data.time-1;
      let time = null;
      this.setData({
        text:num+str,
        disabled:true
      })
      time = setInterval(() => {
        if(num===1){
          clearInterval(time);
          this.setData({
            text:'获取验证码',
            time:60,
            disabled:false,
            islock:true
          })
          return 
        }
        num--;
        this.setData({
          text:num+str,
          disabled:true
        })
      }, 1000);
      } catch (error) {
        console.log(error)
      }
     }
   
      
    },
    bindinput(e){
      console.log(e)
      this.triggerEvent('value',{clickGetCode:this.data.disabled,value:e.detail.value})
    }
  }
})
