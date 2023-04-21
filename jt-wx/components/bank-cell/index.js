// components/bank-cell/index.js
import util from "../../utils/util";
const fetch = require("../../utils/fetch.js");
Component({
  /**
   * Component properties
   */
  externalClasses: ["custom-class"],
  properties: {
    selectBank: {
      type: Object,
      value: null,
    },
    bindType:{
      type:String,
      value:''
    },
    placeholder: {
      type: String,
      value: '请输入本人的银行卡',
    },
    showInput:{
      type:Boolean,
      value:true,
    }
  },

  /**
   * Component initial data
   */
  data: {
    callback: null,
    bankInfo: null,
    cardNo: "",
    btnText: "",
    isError:false,
    errorMessage:''
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        callback: util.debounce(this.getBankInfo, 600).bind(this),
      });
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  observers: {
    selectBank: function (bankInfo) {
      if (!!bankInfo) {
        let data = !this.data.bankInfo ? {} : this.data.bankInfo;
        let bankMsg = { ...data, ...bankInfo };
        this.setData({
          bankInfo: bankMsg,
        });
        this.triggerEvent("emitBank", bankMsg);
      }
    },
  },
  /**
   * Component methods
   */
  methods: {
    changeCardNo({ detail: { value } }) {
      let cardNo = value
        .replace(/\s/g, "")
        .replace(/[^\d]/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ");
      let bankCardNo = cardNo.replace(/\s/g, "")
      if (bankCardNo.length > 5) {
        this.data.callback(cardNo.replace(/\s/g, ""));
      }
      
      this.setData({ cardNo,isError:false });
    },
    async getBankInfo(bankCardNo) {
      if (bankCardNo.length < 19) {
        return;
      }
      let {
        code,
        data,
        desc,
      } = await fetch(
        "bank.api.read.personal.seceleaccpersonalreadservice.accquerybankcardbin",
        { params: { bankCardNo, bindType:this.data.bindType == 3 ?'0':'1' }, isLoading: false }
      );
      let bankInfo = { bankCardNo };
      if (code === 0) {
        this.triggerEvent("emitBank", { bankCardNo });
        bankInfo = { ...bankInfo, ...data };
      }
      if(code == -90000){
         this.setData({
           isError:true,
           errorMessage:desc
         })
      }
      this.setData({ bankInfo });
    },
    onCamera(e) {
      wx.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (result) => {
          console.log(result);
        },
        fail: (res) => {
          console.log(res);
        },
      });
    },
    jumpBank: function (e) {
      let { type } = e.target.dataset;
      wx.navigateTo({ url: `/pages/withdraw/bank/index?type=${type}&bindType=${this.data.bindType}` });
    },
  },
});
