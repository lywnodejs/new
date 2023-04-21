// components/apply/item-view/contact-view/index.js

const phone_reg = /^1[3-9]\d{9}$/
const phone_error_tip = '请输入正确手机号'
const name_reg = /^([\u4E00-\u9FA5]|[a-zA-Z]){2,20}$/
const name_error_tip = '仅支持中英文，最多20个字符'

const app = getApp()

Component({

  properties: {
    attrGroup: {
      type: Object,
      value: {}
    },
    allContactAttrs: {
      type: Array,
      value: []
    },
    groupIndex: {
      type: Number,
      value: -1
    },
  },

  options: {
    styleIsolation: 'shared',
  },

  observers: {
    "attrGroup": function (attrGroup) {
      let selectedIndex = attrGroup.attrs.findIndex(
        (v) => v.completed
      );
      let attribute = {};
      if (selectedIndex != -1) {
        attribute = attrGroup.attrs[selectedIndex];
      } else {
        attribute = attrGroup.attrs[0];
      }
      let options = attrGroup.attrs.map(item => item.name)
      let name = '',
        phone = '',
        relation = '';
      if (selectedIndex !== -1) {
        relation = attribute.name;
      }
      if (attribute.completed && attribute.value !== '' && attribute.value !== undefined && attribute.value.indexOf("|") != -1) {
        let arrays = attribute.value.split("|");
        name = arrays[0];
        phone = arrays[1];
      }

      this.setData({
        attribute,
        options,
        selectedIndex,
        relation,
        name,
        phone,
      })
    },
  },


  data: {
    attribute: {},
    relation: "",
    name: '',
    nameErrorMsg: '',
    phone: '',
    phoneErrorMsg: '',
    showSelectPopup: false,
    selectedIndex: -1,
  },


  methods: {
    onRelationClick(e) {
      this.setData({
        showSelectPopup: true
      })
    },

    onInputClick(e) {
      if (this.data.selectedIndex === -1) {
        wx.showToast({
          title: '请先选择关系',
          icon: 'none'
        })
      }
    },

    onNameChange({
      detail: value
    }) {
      let name = value;
      if (this._hasRepeat({
          index: 0,
          value
        })) {
        name = ''
        wx.showToast({
          title: '联系人姓名已存在',
          icon: 'none'
        })
      }
      this.setData({
        name
      })
      this._sendValueChangeEvent();
    },

    onNameFocus({
      detail: {
        value
      }
    }) {
      this.setData({
        nameErrorMsg: ''
      })
      this._sendValueChangeEvent();
    },

    onNameBlur({
      detail: {
        value
      }
    }) {
      let isCorrect = this._validate({
        value,
        reg: name_reg
      })
      if (!isCorrect) {
        this.setData({
          nameErrorMsg: name_error_tip
        })
      }
      this._sendValueChangeEvent();
    },


    onPhoneChange({
      detail: value
    }) {
      let phone = value;
      if (this._hasRepeat({
          index: 1,
          value
        })) {
        phone = ''
        wx.showToast({
          title: '联系人手机号已存在',
          icon: 'none'
        })
      }

      if (this._isRepeatSelf(
          value
        )) {
        phone = ''
        wx.showToast({
          title: '联系人手机号不能与申请人相同',
          icon: 'none'
        })
      }
      this.setData({
        phone
      })

      this._sendValueChangeEvent();
    },



    onPhoneFocus({
      detail: {
        value
      }
    }) {
      this.setData({
        phoneErrorMsg: ''
      })
      this._sendValueChangeEvent();
    },

    onPhoneBlur({
      detail: {
        value
      }
    }) {
      let isCorrect = this._validate({
        value,
        reg: phone_reg
      })
      if (!isCorrect) {
        this.setData({
          phoneErrorMsg: phone_error_tip
        })
      }
      this._sendValueChangeEvent();
    },

    onOptionSelect: function ({
      currentTarget: {
        dataset: {
          index
        }
      }
    }) {
      let selectedIndex = index;
      let attribute = this.data.attrGroup.attrs[selectedIndex];
      let name = '',
        phone = '',
        relation = attribute.name;
      if (attribute.completed && attribute.value !== '' && attribute.value !== undefined && attribute.value.indexOf("|") != -1) {
        let arrays = attribute.value.split("|");
        name = arrays[0];
        phone = arrays[1];
      }
      this.setData({
        attribute,
        showSelectPopup: false,
        selectedIndex,
        name,
        phone,
        relation,
        nameErrorMsg:'',
        phoneErrorMsg:''
      })
      this._sendValueChangeEvent();
    },

    _sendValueChangeEvent() {
      let completed = this._isCompleted();
      let groupIndex = this.data.groupIndex;
      let selectedIndex = this.data.selectedIndex;
      let value = '';
      if (completed) {
        value = `${this.data.name}|${this.data.phone}`
      }
      this.triggerEvent('valuechange', {
        value,
        id: this.data.attribute.id,
        selectedIndex,
        completed,
        groupIndex,
      });
    },

    _isCompleted() {
      return this._isCorrectName(this.data.name) && this._isCorrectPhone(this.data.phone)
    },

    _isCorrectName(value) {
      let isCorrect = this._validate({
        value,
        reg: name_reg
      })
      return isCorrect;
    },

    _isCorrectPhone(value) {
      let isCorrect = this._validate({
        value,
        reg: phone_reg
      })
      return isCorrect;
    },

    _hasRepeat({
      index,
      value
    }) {
      if (value === '' || value === undefined || value === null) {
        return false;
      }
      for (const i in this.data.allContactAttrs) {
        let attr = this.data.allContactAttrs[i]
        if (this.data.attribute.id == attr.id) {
          continue;
        }
        if (attr.completed && attr.value !== '' && attr.value !== undefined && attr.value.indexOf("|") != -1) {
          let arrays = attr.value.split("|");
          if (arrays.length > 1) {
            let otherValue = arrays[index];
            if (value === otherValue) {
              return true;
            }
          }
        }
      }
      return false;
    },

    _isRepeatSelf(value) {
      if (value === '' || value === undefined || value === null) {
        return false;
      }
      let selfPhone = app.globalData.phone;
      if (selfPhone === '' || selfPhone === undefined || selfPhone === null) {
        return false;
      }
      if (selfPhone === value) {
        return true;
      }
      return false;
    },

    _validate({
      value,
      reg
    }) {
      if (value === '' || value === undefined || value === null) {
        return false;
      }
      var mat = value.match(reg);
      if (mat !== null) {
        return true;
      } else {
        return false;
      }
    },


    onClose(e) {
      this.setData({
        showSelectPopup: false,
      })
    },




  }
})