// components/apply/item-view/string-view/index.js
var validateBehavior = require('../validate-behavior/index')

Component({
  behaviors: [validateBehavior],
  properties: {
    attribute: {
      type: Object,
      value: {}
    },
  },

  options: {
    styleIsolation: 'shared',
  },


  data: {
    errorMsg: '',
    inputType: 'textarea'
  },

  observers: {
    "attribute.value": function (value) {
      this.setData({
        value
      })
    },
    "attribute.attrType": function (value) {
      let inputType = value === 'number' ? "digit" : "textarea"
      if(value == 'name' || value == 'idCard'){
        inputType = 'text'
      }
      this.setData({
        inputType
      })
    },
  },


  methods: {
    onChange({
      detail: value,
      target: {
        id
      }
    }) {
      let completed = this._isCompleted(value);
      this.triggerEvent('valuechange', {
        value,
        id,
        completed
      });
    },

    onFocus({
      detail: {
        value
      },
      target: {
        id
      }
    }) {
      let completed = this._isCompleted(value);
      this.setData({
        errorMsg: ''
      });
      this.triggerEvent('valuechange', {
        value,
        id,
        completed
      });
    },

    onBlur({
      detail: {
        value
      },
      target: {
        id
      }
    }) {
      let completed = this._isCompleted(value);
      this.setData({
        errorMsg: completed ? '' : this._getErrorMsg(value)
      });
      this.triggerEvent('valuechange', {
        value,
        id,
        completed
      });
    },
  }
})