// components/apply/item-view/image-upload-view/index.js
const fetch = require("../../../../utils/fetch.js");
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

  observers: {
    "attribute.value": function (value) {
      let urlLists = []
      if (value !== null && value !== undefined && value !== '') {
        urlLists = value.split(',')
      }
      this.setData({
        urlLists
      })
    },

  },


  data: {
    urlLists: [],
    showPreview: false,
    current: 0,
    height: ''
  },

  lifetimes: {
    attached: function () {
      let winH = wx.getSystemInfoSync().windowHeight;
      this.setData({
        height: winH * 0.6 + 'px'
      })
    },
  },


  methods: {
    onUploadTap(e) {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const filePath = res.tempFilePaths[0]
          let suffix = filePath.substr(filePath.lastIndexOf(".") + 1);
          const fileBase64 = wx.getFileSystemManager().readFileSync(filePath, 'base64')
          const {
            code,
            data: url
          } = await fetch(
            "bank.api.write.standard.uploadservice.uploadfile", {
              fileBase64,
              suffix
            }
          );
          if (code == 0) {
            let urlLists = this.data.urlLists
            urlLists.push(url)
            let value = urlLists.join(',');
            let id = this.data.attribute.id;
            let completed = this._isCompleted(value)
            this.setData({
              urlLists
            })
            this.triggerEvent('valuechange', {
              value,
              id,
              completed
            });
          }
        },
        fail(res) {
          const errMsg = res.errMsg
          const isCancel = !!errMsg && errMsg.indexOf("cancel") != -1
          if(!isCancel){
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        }
      })
    },

    onPreview() {
      this.setData({
        showPreview: true
      })
    },

    onClosePreview() {
      this.setData({
        showPreview: false
      })
    },



    onSwiper({
      detail: {
        current
      }
    }) {
      this.setData({
        current
      })
    },

    onDelete(e) {
      let index = this.data.current
      let urlLists = this.data.urlLists;
      urlLists.splice(index, 1)
      let value = urlLists.join(',');
      let completed = this._isCompleted(value)
      let id = this.data.attribute.id;
      let showPreview = urlLists.length > 0
      this.setData({
        urlLists,
        showPreview,
        current:index > 0 ? index-1 : 0,
      })
      this.triggerEvent('valuechange', {
        value,
        id,
        completed
      });
    },


  }
})