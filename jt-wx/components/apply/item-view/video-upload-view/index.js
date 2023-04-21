// components/apply/item-view/video-upload-view/index.js
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
  },


  methods: {
    async onUploadTap(e) {
      wx.chooseVideo({
        success: async (res) => {
          const filePath = res.tempFilePath
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

    onPlay({
      currentTarget: {
        dataset: {
          index
        }
      }
    }) {
      wx.navigateTo({
        url: `/pages/apply/uploadfile/video-preview/index?url=${encodeURIComponent(this.data.urlLists[index])}`,
      })
    },


    onDelete({
      currentTarget: {
        dataset: {
          index
        }
      }
    }) {
      let urlLists = this.data.urlLists;
      urlLists.splice(index, 1)
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

    },

  }
})