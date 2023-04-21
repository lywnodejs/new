// pages/repayment/index/index.js
const fetch = require("../../../utils/fetch.js");
const util = require("../../../utils/util.js");
var app = getApp();
Page({

  data: {
    repaymentType: '1', //当前还款方式1:只还本期 2:提前结清 5:提前还款 6:全部结清
    showAllBtn:true,
    repaymentWay:null,
    amount: "",
    allMoney: 0, // 全部结清应还金额
    showClearBtn: false,
    isShowPaymentDetail: false,
    maxlength: 11,
    orderDetail: "",
    reservedMobile:'',
    coupons: [],
    selectedCoupon: -2, // 选中的优惠券
    couponId: null,
    showCouponPopup: false,
    isOpenServices:false, //是否关闭交易管理
    showOpenServices:false,

    showPayPopup: false,
    plans: [],
    isShowPlan: false,
    isDisabledBtn: true,
    payInfo: null,

    showCodePopup: false,
    isCodeError: false,
    isCountdown: false,
  },

  onLoad: function (options) {
    if(options.repaymentType==6){
      this.setData({
        showAllBtn:false
      })
    }
    let {
      orderId,
      repaymentType
    } = options;
    this.setData({
      orderId,
      repaymentType
    })
    if (repaymentType == 5) {
      this.setData({
        isShowPaymentDetail: false
      })
      // wx.setNavigationBarTitle({
      //   title: "提前还款",
      // });
    } else {
      this.setData({
        isShowPaymentDetail: true
      })
    }
    this.getOrderDetail(true);
  },

  changeBank(){
    this.setData({
      showPayPopup: false,
    });
    wx.navigateTo({
      url: '/pages/account/card/index?bindType=1',
    })
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

  getOrderDetail: async function (
    isLoading = false
  ) {
    let {
      code,
      data,
    } = await fetch(
      "bank.api.read.personal.repaymentjtnsreadservice.prerepaymentplan", {
        params: {
          orderId: this.data.orderId,
          // repayAmount: this.data.amount,
          repayType: this.data.repaymentType,
          // couponId: this.data.couponId
        },
        isLoading
      }
    );
    if (code == 0) {
      let maxlength = 11;
      if (this.data.repaymentType == 2 || this.data.repaymentType == 5) {
        maxlength = data.preRepaymentHead.surplusCapitalAmount.toString().length
        if (data.preRepaymentHead.surplusCapitalAmount.toString().indexOf('.') == -1) {
          maxlength = data.preRepaymentHead.surplusCapitalAmount.toString().length + 2
        }
      }
      let amount = this.data.amount
      if (this.data.repaymentType == 1) {
        amount = data.preRepaymentHead.currentTermAmount
      }
      if (this.data.repaymentType == 6) {
        amount = data.preRepaymentHead.fullSettleAmount
      }
      let coupons = this.formatCoupon(data.couponList);
      this.setData({
        orderDetail: data,
        amount,
        reservedMobile:data.reservedMobile,
        isDisabledBtn: this.data.repaymentType == 1 || this.data.repaymentType == 6 ? false : this.data.isDisabledBtn,
        allMoney: data.preRepaymentHead.surplusCapitalAmount,
        maxlength,
        coupons,
        plans: data.preWithDrawRepayments,
        repaymentWay:data.repaymentWay
      });
    }
  },


  onShow: function () {
    this.getOpenServices()
  },


  changeRepayType() {
    if (this.data.repaymentType == 1) {
      this.setData({
        repaymentType: 6,
        amount: this.data.orderDetail.preRepaymentHead.fullSettleAmount
      })
    } else if (this.data.repaymentType == 6) {
      this.setData({
        repaymentType: 1,
        amount: this.data.orderDetail.preRepaymentHead.currentTermAmount
      })
    }
    if (this.data.repaymentType == 5 || this.data.repaymentType == 2) {
      this.setData({
        repaymentType: 2,
        amount: this.data.orderDetail.preRepaymentHead.surplusCapitalAmount
      })
    }
    this.setData({
      isShowPaymentDetail: true,
      isDisabledBtn: false,
    })
    this.getOrderDetail()
  },

  showCoupon: function () {
    let data = {
      showCouponPopup: !this.data.showCouponPopup,
    };
    if (this.data.selectedCoupon == -1) {
      data.selectedCoupon = this.data.coupons.length - 1;
    }
    this.setData(data);
  },
  onClickCoupon: function (e) {
    let index = e.detail
    this.setData({
      selectedCoupon: index,
      showCouponPopup: false,
      couponId: this.data.coupons[index].couponId,
    });

    this.getOrderDetail();
  },

  showPlans: function () {
    this.setData({
      isShowPlan: true
    });
  },


  inputChange: function (e) {
    let value = e.detail.value.replace(/^\s+|\s+$/gm, '');
    if (this.data.repaymentType == 1 || this.data.repaymentType == 6) {
      return;
    }

    let reg = /^(\d?)+(\.\d{0,2})?$/;
    var regPos = /^\d+(\.\d+)?$/;

    if (parseFloat(value) === 0 || !value) {
      this.setData({
        isDisabledBtn: true,
        isShowPaymentDetail: false
      })
      return
    }
    if (!regPos.test(value)) {
      this.setData({
        isDisabledBtn: true
      });
      return;
    }
    if (!reg.test(value)) {
      this.setData({
        isDisabledBtn: true
      });
      return wx.showToast({
        title: "最多支持两位小数",
        icon: "none"
      });
    }
    if (+value > +this.data.allMoney) {
      this.setData({
        amount: value,
        isDisabledBtn: true,
        isShowPaymentDetail: false
      });
      return;
    }
    if (
      value !== "0" &&
      value.indexOf("0") === 0 &&
      value.indexOf(".") === -1
    ) {
      value = value.slice(1);
    }

    if (parseFloat(value) == this.data.allMoney) {
      this.setData({
        repaymentType: 2,
      })
    } else {
      this.setData({
        repaymentType: 5,
      })
    }

    this.setData({
      isShowPaymentDetail: true,
      amount: value,
      isDisabledBtn: false,
    })
    this.getOrderDetail()
  },
  focusInput: function (e) {
    this.setData({
      showClearBtn: true
    });
  },

  blurInput: function (e) {

  },

  formatCoupon: function (data) {
    if (Array.isArray(data)) {
      let arr = data.map((v) => {
        v.title = v.details;
        return v;
      });
      return arr;
    } else {
      return [];
    }
  },



  clearInput: function () {
    this.setData({
      amount: "",
      showClearBtn: false,
      isShowPaymentDetail: false,
      isDisabledBtn: true,
    });
  },

  onCheckBtn: async function () {
    if (this.data.isDisabledBtn) {
      return;
    }

    if(!this.data.isOpenServices){
      this.setData({
        showOpenServices:true
      })
      return false
    }

    if (this.isLock) return
    this.isLock = true
    setTimeout(() => {this.isLock = false}, 1500)

    let couponsLength = this.data.coupons.length;
    if (couponsLength > 0 && this.data.selectedCoupon == -2) {
      return wx.showToast({
        title: "请选择优惠券",
        icon: "none"
      });
    }

    let params = {
      orderId: this.data.orderId,
      repayAmount: this.data.amount,
      repayType: this.data.repaymentType,
    };
    if (
      couponsLength > 0
    ) {
      params.couponId = this.data.couponId;
    }

    let {
      code,
      data
    } = await fetch(
      "bank.api.read.personal.repaymentreadservice.confirmrepayinfo",
      params
    );
    if (code == 0) {
      this.setData({
        payInfo: data,
        showPayPopup: true,
      });
    }
  },

  checkPay() {
    // this.setCode();
    util.lockButton(()=>this.sendCode())
  },

  async sendCode() {
    let params= {
      mobilePhone:this.data.payInfo.mobilePhone,
      bizType: 'repayment'
    }
    let {data,code}= await fetch('bank.api.write.standard.userpersonwriteservice.sendverifycode',params)

    if (code == 0) {
      this.setData({
        showCodePopup: true,
        isCountdown: true,
        showPayPopup:false
      });
    }

  },

   checkCode({
    detail: verifyCode
  }) {
    util.lockButton(async ()=> {
      let {
        code,
        data,
        desc
      } = await fetch(
        "bank.api.read.personal.repaymentjtnsreadservice.dopay", {
          orderId: this.data.orderId,
          capitalAmount: this.data.amount,
          repaymentType: this.data.repaymentType,
          couponId: this.data.couponId,
          verifyCode: verifyCode,
        }
      );
      if (code == -10) {
        this.setData({
          isCodeError: true
        });
      } else {
        let url = `/pages/repayment/result/index?type=${data.respCode}&orderNum=${this.data.orderId}&desc=${data.respMsg}&repaymentType=${this.data.repaymentType}`;
        if (code == 1) {
          url = `${url}&amount=${data.totalRepayAmount}`;
        }
  
        wx.redirectTo({
          url,
        });
      }
    })
  },
});