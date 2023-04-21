// components/protocol-view/index.js
Component({

  properties: {
    isSelected: {
      type: Boolean,
      value: '',
    },
    protocols: {
      type: Array,
      value: []
    }

  },

  observers: {
    "protocols": function (protocols) {
      protocols.forEach(item => {
        item.hasRead = item.forceRead == 0
      })
      this.setData({
        richText: "",
        isFirstShow: true,
        showProtocolPopup: false,
        forceReadProtocols: [],
        btnEnable: false,
        isForceMode: true,
        curIndex: 0,
        btnText: '确认',
        readTip: '请下滑并阅读完协议后，再点击确认',
        scrollTop: 0,
        time:3,
        btnEnableOk:false,
        timeShow:false,
      })
    },

    "isSelected": function (isSelected) {
      let allHasRead = false;
      if (isSelected) {
        allHasRead = true;
      } else {
        allHasRead = this.data.protocols.every((element) => element.hasRead);
      }
      this.setData({
        allHasRead,
      })
    },
  },


  data: {
    richText: "",
    isFirstShow: true,
    showProtocolPopup: false,
    forceReadProtocols: [],
    btnEnable: false,
    btnEnableOk:false,
    isForceMode: true,
    curIndex: 0,
    btnText: '确认',
    readTip: '请下滑并阅读完协议后，再点击确认',
    scrollTop: 0,
    time:3,
    timeShow:false,
    setInterVal:null
  },




  methods: {

    setTime(){
      let time = 3;
      this.setData({
        timeShow:true,
      })
      let setInterVal = setInterval(()=>{
        if(time ===1){
          clearInterval(setInterVal);
          this.setData({
            time:3,
            timeShow:false,
            btnEnableOk:true,
            setInterVal:null
          })
          return false
        }
        time--
        this.setData({
          time
        })
        console.log(time);
      },1000)
      this.setData({
        setInterVal:setInterVal
      })
    },
    changeSelect: function (e) {
      let thas = this;
      if (this.data.allHasRead) {
        const isSelected = !this.data.isSelected
        this.setData({
          isSelected,
        });
        this.triggerEvent('onSelect', isSelected)
      } else {
        const forceReadProtocols = this.data.protocols.filter((element) => element.forceRead == 1)
        let btnText = this.data.btnText
        let readTip = this.data.readTip
        console.log(forceReadProtocols,'1213123')
        if (forceReadProtocols.length > 1) {
          btnText = '确认并继续'
          readTip = `当前有${forceReadProtocols.length}份协议需本人完成阅读，请下滑并阅读完协议后，再点击确认`
        } else {
          btnText = '确认'
          readTip = '请下滑并阅读完协议后，再点击确认'
        }
        let time = 3;
        const curIndex = this.data.curIndex
        this.readProtocol(forceReadProtocols[curIndex].content)
        const btnEnable = forceReadProtocols[curIndex].hasRead
        // console.log(111111);
        // if(!btnEnable && forceReadProtocols[curIndex].forceRead ===1){ // 强制阅读并且没有读过
        //   this.setTime()
        // }else{
        //   this.setData({
        //     btnEnableOk:true
        //   })
        // }

        this.setData({
          showProtocolPopup: true,
          forceReadProtocols,
          isForceMode: true,
          btnText,
          btnEnable,
          readTip,
        })
      }
    },

    readProtocol: function (url) {
      clearInterval(this.data.setInterVal)
      this.setData({
        richText:'',
        time:3,
        timeShow:false,
        setInterVal:null
      })
      let thas = this;
      if (url) {
        url = url.replace(/^\s+|\s+$/gm, '');
        let _ = this;
        wx.downloadFile({
          url,
          success(res) {
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePath,
              encoding: "utf-8",
              success(res) {
                const curIndex = thas.data.curIndex;
                const btnEnable = thas.data.forceReadProtocols[curIndex].hasRead
                if(!btnEnable && thas.data.forceReadProtocols[curIndex].forceRead ===1){ // 强制阅读并且没有读过
                  thas.setTime()
                }else{
                  thas.setData({
                    btnEnableOk:true
                  })
                }
                const REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
                const result = REG_BODY.exec(res.data);
                if (result && result.length === 2) {
                  const temp = result[1].replace('<o:p>', '')
                  const html = temp.replace('<o:p>', '')
                  _.setData({
                    richText: html
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

    onScrollEnd() {
      this.setData({
        btnEnable: true,
      })
      console.log('到底了',this.data.btnEnable);
    },

    confirm: function (e) {
      if (!this.data.btnEnable) {
        return
      }
      if(!this.data.btnEnableOk){return}

      let curIndex = this.data.curIndex;
      this.data.forceReadProtocols[curIndex].hasRead = true;
      const isAllRead = this.data.forceReadProtocols.every((element) => element.hasRead);
      if (isAllRead) {
        if (this.data.isForceMode) {
          const isSelected = true
          this.setData({
            isSelected,
          });
          this.triggerEvent('onSelect', isSelected)
        }
        this.setData({
          showProtocolPopup: false
        });
      } else {
        const btnEnable = false;
        curIndex = this.data.forceReadProtocols.findIndex(item => !item.hasRead)
        let btnText = this.data.btnText;
        let unReads = this.data.forceReadProtocols.filter(item => {
          return !item.hasRead
        })
        if(unReads != null && unReads.length > 1){
          btnText = '确认并继续'
        } else {
          btnText = '确认'
        }
        this.setData({
          btnEnableOk:false
        })
        this.readProtocol(this.data.forceReadProtocols[curIndex].content)
        this.setData({
          curIndex,
          btnEnable,
          btnText,
          scrollTop: 0
        })
      }
    },

    changeProtocol: function ({
      currentTarget: {
        dataset: {
          content,
          index,
        }
      }
    }) {
      this.readProtocol(content);
      let curIndex = index
      const btnEnable = this.data.forceReadProtocols[curIndex].hasRead
      let btnText = this.data.btnText
      let unReads = this.data.forceReadProtocols.filter(item => {
        return !item.hasRead
      })
      if(unReads != null && unReads.length > 0){
        if(unReads.length > 1){
          btnText = '确认并继续'
        } else {
          if(this.data.forceReadProtocols[curIndex].hasRead){
            btnText = '确认并继续'
          } else {
            btnText = '确认'
          }
        } 
      } else {
        btnText = '确认'
      }
      this.setData({
        btnEnable,
        btnText,
        curIndex,
        scrollTop: 0
      })

    },

    onProtocolClick: function (e) {
      const url = e.currentTarget.dataset.url;
      this.readProtocol(url)
      const index = e.currentTarget.dataset.index;
      const protocol = this.data.protocols[index]
      let isForceMode = this.data.isForceMode
      if (protocol.forceRead == 1) {
        isForceMode = true
      } else {
        isForceMode = false
      }
      let forceReadProtocols = [protocol]
      let btnText = this.data.btnText
      let readTip = this.data.readTip
      if (isForceMode) {
        this.data.protocols.forEach((item, i) => {
          if (item.forceRead == 1 && index != i) {
            forceReadProtocols.push(item)
          }
        })
        if (forceReadProtocols.length > 1) {
          readTip = `当前有${forceReadProtocols.length}份协议需本人完成阅读，请下滑并阅读完协议后，再点击确认`
        } else {
          readTip = '请下滑并阅读完协议后，再点击确认'
        }
        let unReads = forceReadProtocols.filter(item => {
          return !item.hasRead
        })
        if(unReads != null && unReads.length > 1){
          btnText = '确认并继续'
        } else {
          btnText = '确认'
        }
      } else {
        btnText = '确认'
      }

      const curIndex = 0
      const btnEnable = forceReadProtocols[curIndex].hasRead
      let time =3;
      if(!btnEnable && forceReadProtocols[curIndex].forceRead ===1){ // 强制阅读并且没有读过
        this.setData({
          timeShow:true,
        })
        let setInterVal = setInterval(()=>{
          if(time ===1){
            clearInterval(setInterVal);
            this.setData({
              time:3,
              timeShow:false,
              btnEnableOk:true
            })
            return false
          }
          time--
          this.setData({
            time
          })
          console.log(time);
        },1000)
      }else{
        this.setData({
          btnEnableOk:true
        })
      }

      this.setData({
        forceReadProtocols,
        isForceMode,
        btnEnable,
        btnText,
        readTip,
        curIndex,
        showProtocolPopup: true,
        scrollTop: 0
      })
    },

    onClose: function () {
      this.setData({
        showProtocolPopup: false,
        curIndex: 0,
        forceReadProtocols: [],
        btnEnable: false,
        isForceMode: true,
        scrollTop: 0,
        time:3,
        btnEnableOk:false,
        richText:''
      });
    },

    onAfterEnter: function () {
      this.triggerEvent('onShow', true)
    },

    onAfterLeave: function () {
      this.triggerEvent('onShow', false)
    },
  }
})