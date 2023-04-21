// components/apply/loan-info/index.js

const comma_reg = /(?=(\B)(\d{3})+$)/g;
Component({

  properties: {
    loanInfo: {
      type: Object,
      value: {}
    },
    showInput:{
      type:Boolean,
      value:true
    }
  },

  data: {
    showUnCorrectTip: false,
    isFocus: false,
    showClearBtn: false,
  },

  observers: {
    "loanInfo": function (loanInfo) {
      let value = loanInfo.maxAmount.toString().replace(/^\s+|\s+$/g, '');
      let valueFormat = value.replace(comma_reg, ",");
      let minLoanTerm = loanInfo.termType == 1 ?
        loanInfo.loanTerms[0] :
        loanInfo.minLoanTerm;
      let maxLoanTerm = loanInfo.termType == 1 ?
        loanInfo.loanTerms[loanInfo.loanTerms.length - 1] :
        loanInfo.maxLoanTerm;

      this.setData({
        minLoanTerm,
        maxLoanTerm,
        term: maxLoanTerm,
        amount: valueFormat,
        inputMaxLength: valueFormat ? valueFormat.length : 9,
      })
      if (loanInfo.termType == 1) {
        this.setData({
          loanTermIndex: loanInfo.loanTerms.length - 1,
        });
      }
    },
  },

  methods: {
    onTermChange: function ({
      detail: {
        value
      }
    }) {
      this.setData({
        term: value
      });
      this.triggerEvent('termchange', value);
    },

    onTermIndexChange({
      detail: {
        value
      }
    }) {
      let term = this.data.loanInfo.loanTerms[value]
      this.setData({
        loanTermIndex: value,
        term
      });
      this.triggerEvent('termchange', term);
    },

    onAmountChange: function ({
      detail: {
        value
      }
    }) {
      value = value.replace(/^\s+|\s+$/g, '')
      if (value.indexOf("0") === 0) {
        value = value.slice(1);
      }
      if (parseInt(value) === 0) {
        value = ''
      }

      this.setData({
        amount: value,
        showUnCorrectTip: !(value <= this.data.loanInfo.maxAmount),
        showClearBtn: !!value,
        inputMaxLength: this.data.loanInfo.maxAmount.toString().length
      });
      this.triggerEvent('amountchange', value);
    },

    focusInput: function (e) {
      let value = this.data.amount.toString().replace(/,/g, "")
      this.setData({
        amount: value,
        showUnCorrectTip: !(value <= this.data.loanInfo.maxAmount),
        showClearBtn: !!this.data.amount,
        inputMaxLength: this.data.loanInfo.maxAmount.toString().length
      });
      this.triggerEvent('amountchange', value);
    },

    blurInput: function ({
      detail: {
        value
      }
    }) {
      if (value === undefined || value == null || value == "" || value < this.data.loanInfo.minAmount || value > this.data.loanInfo.maxAmount) {
        this.setData({
          isFocus: false,
          showUnCorrectTip: true,
          amount: '',
          showClearBtn: false,
        })
        this.triggerEvent('amountchange', '');
        return
      }
      value = value.replace(/^\s+|\s+$/g, '');
      let valueFormat = value.replace(comma_reg, ",");
      this.setData({
        amount: valueFormat,
        isFocus: false,
        showUnCorrectTip: false,
        showClearBtn: false,
        inputMaxLength: valueFormat.length
      })
      this.triggerEvent('amountchange', value);
    },

    clearInput: function () {
      this.setData({
        amount: "",
        showClearBtn: false,
        showUnCorrectTip: false,
        isFocus: true,
      });
    },

  },

})