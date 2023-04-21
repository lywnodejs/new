// components/apply/apply-force-protocol/index.js
let timer = null;
Component({
  properties: {
    showProtocolPopup: {
      type: Boolean,
      value: false,
    },
    protocols: {
      type: Array,
      value: []
    }
  },

  data: {
    richText: "",
    isFirstShow: true,
    counter: 3,
  },

  lifetimes: {
    attached: function () {
      let isFirstShow = wx.getStorageSync("isFirstShowCD");
      isFirstShow = !isFirstShow;
      if (this.data.protocols !== null && this.data.protocols.length > 0) {
        this.readProtocol(this.data.protocols[0].content);
        this.setData({
          isFirstShow
        })
      }
    },
  },

  methods: {
    onClose: function () {
      this.setData({
        showProtocolPopup: false
      });
    },

    onAfterEnter: function () {
      if (this.data.isFirstShow) {
        wx.setStorage({
          key: "isFirstShowCD",
          data: "isFirstShowCD",
        });
        let counter = this.data.counter;
        timer = setInterval(() => {
          counter--;
          if (counter <= 0) {
            clearTimeout(timer);
            timer = null;
            this.setData({
              isFirstShow: false
            });
          } else {
            this.setData({
              counter
            });
          }
        }, 1000);
      }
    },

    onAfterLeave: function () {
      clearTimeout(timer);
      timer = null;
    },

    changeProtocol: function (e) {
      let content = e.currentTarget.dataset.content;
      this.readProtocol(content);

    },

    readProtocol: function (url) {
      console.log(url)
      if (url) {
        url = url.replace(/^\s+|\s+$/gm, '');
        let _ = this;
        wx.downloadFile({
          url,
          success(res) {
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePath,
              encoding :"utf-8",
              success(res) {
                const REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
                const result = REG_BODY.exec(res.data);
                if (result && result.length === 2) {
                  _.setData({
                    richText: result[1]
                  });
                }
              },
            });
          },
          fail(res) {
            console.error('change protocol failed', res)
          }
        });
      } else {
        console.error('协议URL不合法')
      }

    },

    confirm: function (e) {
      this.setData({
        showProtocolPopup: false
      });
      this.triggerEvent('protocolconfirm');
    }
  }
})