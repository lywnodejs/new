// components/password-popup/index.js
// const {LICENSE} = require('../../../utils/util.js');
const app = getApp()
let SMConfig = app.SMConfig;
Component({
  /**
   * Component properties
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    values: {
      type: Array,
      value: new Array(6)
    },
    isForget: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: "请输入交易密码"
    },
    error: {
      type: String,
      value: "交易密码不正确"
    },
    isError: {
      type: Boolean,
      value: false
    },
    closeable: {
      type: Boolean,
      value: false
    },
    isSuccess: {
      type: Boolean,
      value: false
    },
    overlay: {
      type: Boolean,
      value: true
    },
    position: {
      type: String,
      value: 'bottom'
    }
  },

  observers: {
    'isError': function (value) {
      if (value) {
        this.setData({
          value: [],
          length: 0,
          isLoading: false,
          stringValue: []
        })
        setTimeout(()=>{
          this.callkeyboard()
        },500)
      }
    },
    'isSuccess': function (value) {
      this.setData({
        success: value
      })
    },
    "show":function(value){
      if(!value){
        this.setData({
          length: 0,
          value: [],
          stringValue: [],
          isLoading: false,
          success: false,
        })
        try {
          let myComponent = this.selectComponent('#bbb');
          myComponent.clearpwd('2')
        } catch (error) {
          
        }
        
      }else{
        try {
        this.callkeyboard()
        } catch (error) {
          console.log(error);
        }
      }
    }
  },
  /**
   * Component initial data
   */
  data: {
    length: 0,
    value: [],
    stringValue: [],
    isLoading: false,
    success: false,
    license: SMConfig.miniPKbLicense,
    SM24publickey: SMConfig.SM24publickey
  },

  ready() {
    let myComponent = this.selectComponent('#bbb');
      //设置随机因子(固定)(此处写死随机数是为了前端整个流程跑通，应用到项目中时，需要由后台动态下发随机数)
      myComponent.pwdSetSk(SMConfig.appKbCipherKey);
      //设置映射表(固定)(此处写死映射表是为了前端整个流程跑通，应用到项目中时，需要由后台动态下发映射表)
      myComponent.pwdSetMap(SMConfig.appKbCipherKey2)
      this.callkeyboard()
  },


  /**
   * Component methods
   */
  methods: {
    onClose() {
      if(this.data.isLoading){return}
      this.setData({
        show: false,
        length: 0,
        isError: false
      });
      this.triggerEvent('onClose')
    },
    // 打开键盘
    callkeyboard() {
      let e = {
        "type": "touchstart",
        "timeStamp": 41963,
        "target": {
          "id": "",
          "offsetLeft": 92,
          "offsetTop": 1,
          "dataset": {}
        },
        "currentTarget": {
          "id": "",
          "offsetLeft": 33,
          "offsetTop": 0,
          "dataset": {
            "p": "2",
            "type": "1"
          }
        },
        "mark": {},
        "detail": {},
        "touches": [{
          "identifier": 0,
          "pageX": 106.46875762939453,
          "pageY": 380.9531555175781,
          "clientX": 106.46875762939453,
          "clientY": 380.9531555175781,
          "force": 1
        }],
        "changedTouches": [{
          "identifier": 0,
          "pageX": 106.46875762939453,
          "pageY": 380.9531555175781,
          "clientX": 106.46875762939453,
          "clientY": 380.9531555175781,
          "force": 1
        }],
        "mut": false,
        "_requireActive": false,
        "_userTap": false
      }
      let myComponent = this.selectComponent('#bbb');
      myComponent.bindButtonTap(e, 1)
      myComponent.clearpwd('2');
    },

    // 组件的监听事件
    onMyEvent: function (e) {
      if (e.detail.date.addfn !== undefined) {
        let length = e.detail.date.addfn[1];
        let stringValue = []
        for (let i = 0; i < length; i++) {
          stringValue.push(true)
        }
        this.setData({
          stringValue
        })
        if (length === 6) {
          let myComponent = this.selectComponent('#bbb');
          let miwen = myComponent.getoutputSM('2');
          myComponent.close();
          this.setData({
            isLoading: true
          })
          this.triggerEvent('getCode', miwen)
        }
      } else if (e.detail.date.delfn !== undefined) {
        let length = e.detail.date.delfn[1];
        let stringValue = []
        for (let i = 0; i < length; i++) {
          stringValue.push(true)
        }
        this.setData({
          stringValue
        })
      }
    },
    onForget() {
      this.triggerEvent('onForget')
      wx.navigateTo({
        url: '/pages/account/password/forget/index',
      })
    },


    completedPwd(pwd) {
      this.setData({
        isError: false
      })
      this.triggerEvent('onComplete', pwd)
      setTimeout(() => {
        this.setData({
          isLoading: true
        })
      }, 300)
    }
  }
})