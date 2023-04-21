// components/apply/item-view/id-front-view/index.js
const fetch = require("../../../../utils/fetch.js");
Component({

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
    showErrorTip: false,
    errorTip: '',
    confirmIdcard: false,
    isAllAttrCompleted:true,
  },


  methods: {
    onTap(e) {
      console.log('点击了上传');
      wx.chooseImage({
        count: 1,
        sizeType:'compressed',
        sourceType: ["camera"],
        success: async (result) => {
          const base64file = wx.getFileSystemManager().readFileSync(result.tempFilePaths[0], 'base64')
          let attribute = this.data.attribute;
          let {
            code,
            data,
            desc
          } = await fetch(
            "bank.api.write.personal.facepersonalservice.ocr", {
              idCardFrontBase64: base64file,
              attrId: attribute.id,
              batch: attribute.batch,
              parentId: attribute.parentId,
              parentType: attribute.parentType,
              productId: attribute.productId,
            }
          );

          if (code == 0) {

            let nameAttr = {
              id: 1,
              attrType: 'name',
              editFlag: 1,
              name: '姓名',
              value: data.name,
              tips: '请输入姓名',
              completed:true,
              mustFill: 1,
              validate: {
                errMsg: '姓名有误，仅支持中文，至少两个字符',
                jsExpression: '^([\\u4E00-\\u9FA5]|[.]|[·]|[ ]){2,40}$'
              }
            };

            let idAttr = {
              id: 2,
              editFlag: 1,
              attrType: 'idCard',
              name: '身份证号码',
              value: data.idCardNo,
              tips: '请输入身份证号',
              completed:true,
              mustFill: 1,
              validate: {
                errMsg: '身份证号码有误',
                jsExpression: '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$'
              }
            };

            let confirmAttrs = [nameAttr, idAttr];

            this.setData({
              idCardInfo: data,
              confirmIdcard: true,
              confirmAttrs
            })
          } else {
            this.setData({
              errorTip: desc,
              showErrorTip: true
            })
          }
        },
        fail: (res) => {
          console.log(res);
        },
      })
    },

     onSubmit: async function (type) {
      console.log('提交资料', type)
      let attribute = this.data.attribute;
      let attrId = attribute.id;
      let attrValue = JSON.stringify(this.data.idCardInfo)
      let {
        code,
        data,
        desc
      } = await fetch(
        "bank.api.write.personal.userattrpersonalwriteservice.changeuserinfo", {
          list:[{attrId,attrValue}],
          batch: attribute.batch,
          parentId: attribute.parentId,
          parentType: attribute.parentType,
          productId: attribute.productId,
        }
      );

      if (code == 0) {
        this.setData({
          confirmIdcard:false,
        })
        this.triggerEvent('valuechange', {
          id:attrId,
          completed:true,
        });
      } else {
        this.setData({
          confirmIdcard:false,
          errorTip: desc,
          showErrorTip: true
        })
      }
    },

    onCloseTip(e) {
      this.setData({
        showErrorTip: false
      })
    },
    onValueChange: function ({
      detail: {
        id,
        enumId,
        value,
        completed,
        showValue
      }
    }) {
      console.log(`页面收到事件---id:${id}--enumId:${enumId}--value:${value}--completed:${completed}--showValue:${showValue}`)
      let toFindAttrs = this.data.confirmAttrs;
      let temp = toFindAttrs.find(v => v.id == id)
      temp.value = value
      temp.completed = completed
      if(temp.attrType === 'name'){
        this.data.idCardInfo.name = value
      } else if(temp.attrType === 'idCard'){
        this.data.idCardInfo.idCardNo = value
      }
 
      console.log('onValueChange', id, value, completed, temp)
      let hasUncompletedAttr = this._hasUncompletedAttr(this.data.confirmAttrs)
      console.log('全部是否完成', !hasUncompletedAttr)
      this.setData({
        confirmAttrs: this.data.confirmAttrs,
        isAllAttrCompleted: !hasUncompletedAttr
      })
    },

    _hasUncompletedAttr(attrs) {
      for (const i in attrs) {
        let attr = attrs[i]
        if (!attr.completed) {
          return true
        }
        if (attr.attrType === 'enum') {
          let subAttrs = attr.selectValue.find(selectItem => selectItem.value === attr.value).childList;
          if (subAttrs !== null && subAttrs !== undefined && subAttrs.length > 0) {
            for (const j in subAttrs) {
              let subAttr = subAttrs[j]
              if (!subAttr.completed) {
                return true
              }
            }
          }
        }
      }
      return false;
    },
  }
})