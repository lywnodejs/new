// pages/withdraw/index/index.js
import {
  getLocation
} from "../../../utils/wx-api";

const fetch = require("../../../utils/fetch.js");
var app = getApp();
Page({

  data: {
    isShowLimit: false,
    isShowDetail: false,
    showErrorDialog: false,
    errorCode: 0,
    errorDesc: '',
    min: 0,
    max: 0,
    isAmountError: false,
    showClearBtn: false,
    placeholder: '请输入提现金额',
    amount: "",
    isOpenServices:false, //是否关闭交易管理
    showOpenServices:false,
    repayTypeIndex: 0, //还款方式索引
    repayType: '',
    repayTypes: [],
    showRepayTypes: false,
    showRepayPlan: true, //是否显示还款试算
    showRepayPlanPop: false,

    showLoanTerms: false,
    loanTerms: [],
    termUnit: '',
    loanTerm: '',
    loanTermIndex: 0, // 借款期限索引

    isSelect: false, // 协议是否勾选
    protocolList: null,

    loanPurpose:{},
    loanPurposeList:[],
    selsectLoan:false,
    iswrite:false,
    mobilePhone:'',
    showCodePopup:false,
    isCountdown:false,
    isCodeError:false,
    // 最短时间
    minterm:"",
    // 最长时间
    maxterm:"",
    checkuseridcar:false,
     mustTocheck:false
  },

  onLoad: function (options) {
    this.setData({
      productId: options.productId
    });
    try {
      getLocation();
    } catch (e) {
      this.setData({
        showLocationTips: true
      });
    }
  },
  // 校验资金交易开启/关闭
  async getOpenServices(){
    try {
      const {code, data,desc} = await fetch('bank.api.read.securitycenterservice.fundservicesisopen')
      if(code===0){
        this.setData({
          isOpenServices:data
        })
      }else{
        wx.showToast({
          title: desc,
          icon:'none'
        })
      }
    } catch (error) {
      console.log(error)
    }
  },

  onClose(){
      this.setData({
        selsectLoan:false
      })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      loanPurpose: this.data.loanPurposeList[e.detail.value]
    })
  },
  
  onShow: function () {
    this.getLoanLimit();
    this.getOpenServices();
    this.getWithdrawProtocol();
    if (this.data.isShowDetail) {
      this.getWithdrawDetail()
    }
  },

  getLoanLimit: async function () {
    let {
      code,
      data,
      desc
    } = await fetch(
      "bank.api.read.personal.cashoutpersonalreadservice.cashoutrange", {
        productId: this.data.productId
      }
    )

    if (code == 0) {
      const min = data.minLoanAmount,
        max = data.maxLoanAmount,
        multiple = data.multiple;
      const amountErrorTip = `提现金额必须在可借金额范围内，且是${multiple}的整数倍`
      this.setData({
        min,
        max,
        multiple,
        amountErrorTip,
        errorCode: code,
        errorDesc: desc,
        showErrorDialog: false,
        isShowLimit: true,
      })
    } else {
      this.setData({
        errorCode: code,
        errorDesc: desc,
        showErrorDialog: true,
        isShowLimit: false,
      })
    }
  },

  changeAmount: function (e) {
    let value = e.detail.value;
    if (value == 0) {
      value = ''
    }
    let amount = value
    let isShowDetail = false,
      isAmountError = false;

    if (amount >= this.data.min && amount <= this.data.max) {
      if (amount % this.data.multiple == 0) {
        isAmountError = false;
        isShowDetail = true;
      } else {
        isAmountError = true;
        isShowDetail = false;
      }
    }

    if (amount > this.data.max) {
      isAmountError = true;
      isShowDetail = false;
    }

    this.setData({
      amount,
      isAmountError,
      isShowDetail,
    });
    if (isShowDetail) {
      this.getWithdrawDetail()
      this.getWithdrawProtocol()
    }
  },

  blurInput: function (e) {

  },

  focusInput: function (e) {
    this.setData({
      showClearBtn: true
    });
  },

  clearInput: function () {
    setTimeout(() => {
      wx.nextTick(() => {
        this.setData({
          showClearBtn: false,
        });
        this.changeAmount({
          detail: {
            value: ""
          }
        });
      })
    }, 200)
  },

  async getWithdrawDetail() {
    let {
      code,
      data,
    } = await fetch(
      "bank.api.read.personal.cashoutpersonalreadservice.cashoutextinfo", {
        productId: this.data.productId,
        loanAmount: this.data.amount
      }
    )
    if (code == 0) {
      const showRepayPlan = data.showRepayPlanFlag == 1
      const repayTypes = data.repaymentTypes
      const repayTypeIndex = 0
      const repayType = repayTypes[0].repayTypeCode
      const showRepayTypes = false
      this.setData({
        repayTypes,
        repayTypeIndex,
        repayType,
        showRepayTypes,
        showRepayPlan,
      })

      const showLoanTerms = false
      const loanTerms = data.loanTerms
      const termUnit = data.loanTerms[0].unit
      const loanTermIndex = loanTerms.length - 1
      const loanTerm = data.loanTerms[loanTermIndex].term
      this.setData({
        showLoanTerms,
        loanTerms,
        termUnit,
        loanTerm,
        loanTermIndex,
      })

      const isBind = data.bankCardList.length!==0
      this.setData({
        isBind,
      })
      if (isBind) {
        let cardNum = "("+data.bankCardList[0].cardNo.substring(data.bankCardList[0].cardNo.length-4,data.bankCardList[0].cardNo.length)+")";
        const accountInfoDesc = data.bankCardList[0].bankName+cardNum
        const bankIcon = data.bankCardList[0].bankPicUrl
        this.setData({
          accountInfoDesc,
          bankIcon,
          loanPurposeList:data.loanPurposeList,
          loanPurpose: data.loanPurposeList[0],
          mobilePhone:data.mobilePhone
        })
      }

      const minterm = data.loanTerms[0].term
      const maxterm = data.loanTerms[data.loanTerms.length-1].term
      this.setData({
        minterm,
        maxterm
      })
    }
  },

  async getWithdrawProtocol() {
    let {
      code,
      data,
    } = await fetch(
      "bank.api.read.protocolreadservice.queryprotocol", {
        params: {
          productId: this.data.productId,
          loanAmount: this.data.amount,
          loanTerm: this.data.loanTerm,
          repayType: this.data.repayType,
          showPage: '3',
          application: '3'
        },
        isLoading: false
      }
    )
    let isSelect = true,
      protocolList = null;
    if (code == 0 && data != '') {
      isSelect = false
      protocolList = data.protocols
    }
    this.setData({
      isSelect,
      protocolList
    })
  },

  onKnow() {
    // -2009 产品不存在 30011, "您的额度已过期，暂不可提现，请重新申请额度吧"
    // 30012, "您的额度即将过期，暂不能提现"
    // 30007,"您的额度已冻结，暂不可提现"
    // 30004, "单笔提现金额至少为%s元，您的剩余可借额度不足，暂无法提现"
    // 30008, "提现金额必须在可借金额范围内，且是%d的整数倍"
    // 30011 您的额度已过期，暂不可提现，请重新申请额度吧
    const code = this.data.errorCode;
    if (code == 0 || code == -9) {
      return;
    }
    if (code != 30008) {
      wx.switchTab({
        url: '/pages/index/index',
      })
      return;
    }
  },

  withdrawAll() {
    setTimeout(() => {
      wx.nextTick(() => {
        this.changeAmount({
          detail: {
            value: this.data.max+''
          }
        });
      })
    }, 100)
  },
  handleItem: function (e) {
    let {
      type
    } = e.currentTarget.dataset;
    this.setData({
      [type]: !this.data[type],
    });
  },


  onTermChange({
    detail: {
      value
    }
  }) {
    const lastLoanTermIndex = this.data.loanTermIndex
    this.setData({
      loanTermIndex: value,
      loanTerm: this.data.loanTerms[value].term
    });

    if (lastLoanTermIndex != value) {
      this.getWithdrawProtocol()
    }

  },

  showRepayPlanPop(e) {
    this.getPreWithdrawInfo()
  },

  changeSelect: function ({
    detail
  }) {
    this.setData({
      isSelect:detail
    })
  },

  selectItem: function (e) {
    let {
      index,
      item
    } = e.currentTarget.dataset;
    this.setData({
      [item]: index
    });
  },

  onSelectRepayType(e) {
    let {
      index
    } = e.currentTarget.dataset;
    this.setData({
      repayTypeIndex: index,
      repayType: this.data.repayTypes[index].repayTypeCode
    })
  },

  toBindCard() {
    wx.navigateTo({
      url: `/pages/account/card/index?bindType=1`
    });
  },


  async getPreWithdrawInfo() {
    let {
      code,
      data
    } = await fetch(
      "bank.api.read.personal.cashoutpersonalreadservice.cashoutprewithdraw", {
        productId: this.data.productId,
        loanAmount: this.data.amount,
        repayType: this.data.repayType,
        loanTerm: this.data.loanTerm,
      }
    );
    if (code == 0) {
      this.setData({
        plansInfo: data,
        showRepayPlanPop: true
      });
    }
  },


  onClickProtocol: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: `/pages/web/index?url=${url}`
    });
  },
  toOpenServer(){
    this.onCloseServer();
    wx.navigateTo({
      url: '/packageB/pages/detail/index',
    })
  },
  onCloseServer(){
    this.setData({
      showOpenServices:false
    })
  },
  onApply: async function () {
    if(!this.data.isOpenServices){
      this.setData({
        showOpenServices:true
      })
      return false
    }
    if (this.data.isAmountError) {
      return wx.showToast({
        title: "请输入提现金额",
        icon: "none"
      });
    }
    if (!this.data.isBind) {
      return wx.showToast({
        title: "请先绑卡",
        icon: "none"
      });
    }

    if (!this.data.isSelect) {
      return wx.showToast({
        title: "请勾选协议",
        icon: "none"
      });
    }
    if(!this.data.iswrite){
      wx.navigateTo({
        url: '/pages/write/index',
        events:{
          someSend:(data)=>{
             this.setData({
              iswrite:true
             })
             this.getCode()
          }
        }
      })
      return 
    }
    this.getCode()
  },

  onShowChange: function ({
    detail
  }) {
    let placeholder = '请输入提现金额';
    if (detail) {
      placeholder = ''
    }
    this.setData({
      placeholder
    })
  },
  onSend() {
    this.getCode()
  },
  async getCode(){
    let params= {
      mobilePhone:this.data.mobilePhone,
      bizType: 'loan_withdraw'
    }
    try {
      let {data,code}= await fetch('bank.api.write.standard.userpersonwriteservice.sendverifycode',params)
      if (code === 0) {
        this.setData({ showCodePopup: true , isCountdown: true});
      }
      // 异常弹窗提示
      if(code == -90000){
        this.setData({checkuseridcar: true, desc,mustTocheck:false})
      }
    } catch (error) {
      console.log(error);
    }
  },
  onClose() {
    if(this.data.mustTocheck){
      return
    }
    this.setData({checkuseridcar: false})
  },
  onDefine() {
    this.setData({checkuseridcar: false, })
    return wx.navigateTo({
      url: `/pages/apply/idcertificate/index?type=1`
    })
  },
  onComplete({detail: value}) {
    this.applyHandler(value)
  },
  async applyHandler(verifyCode){
    if(!verifyCode){
      return this.getCode()
    }

    const authToken = wx.getStorageSync('authToken')
    let {
      code,
      desc
    } = await fetch(
      "bank.api.read.personal.cashoutpersonalreadservice.withdraw", {
        productId: this.data.productId,
        loanAmount: this.data.amount,
        repayType: this.data.repayType,
        loanTerm: this.data.loanTerm,
        loanPurpose:this.data.loanPurpose.code,
        verifyCode:code,
        authToken
      }
    )
    if(code===-10){
      this.setData({
        isCodeError:true
      })
    }
    this.setData({ showCodePopup: false , isCountdown: false});
    if (code == 0) {
      wx.redirectTo({
        url: "/pages/withdraw/result/index",
      });
    } else {
      this.setData({
        errorCode: code,
        errorDesc: desc,
        showErrorDialog: true,
      })
    }
  }
});