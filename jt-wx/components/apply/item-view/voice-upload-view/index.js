// components/apply/item-view/voice-upload-view/index.js
const fetch = require("../../../../utils/fetch.js");
var validateBehavior = require('../validate-behavior/index')
import {
  requestRecordPermission
} from '../../../../utils/wx-api'
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
    showPopup: false,
    status: 'start',
    statusDesc: '开始录音',
    onlyPlay: false,
    curPlayIndex: 0,
    curTime: '',
    totalTime: ''
  },


  methods: {
    async onUploadTap(e) {
      let hasPermission = await requestRecordPermission()
      if (!hasPermission) {
        return
      }
      let recorderManager = wx.getRecorderManager()
      this.setData({
        onlyPlay: false,
        showPopup: true,
        status: 'start',
        statusDesc: '开始录音',
        totalTime: '00:00:00',
        curTime: '',
        recorderManager,
        recordFilePath: '',
      })
    },
    onClosePopup(e) {
      if (this.data.onlyPlay) {
        if (this.data.audioContext) {
          this.data.audioContext.stop()
          this.data.audioContext.destroy()
        }
        this.setData({
          showPopup: false,
          audioContext: null,
        })
      } else {
        if (this.data.recorderManager) {
          this.data.recorderManager.stop()
        }
        clearInterval(this.data.intervalId)
        this.setData({
          showPopup: false,
          recorderManager: null,
        })
      }
    },

    onPlay({
      currentTarget: {
        dataset: {
          index
        }
      }
    }) {
      this.setData({
        showPopup: true,
        onlyPlay: true,
        status: "play",
        statusDesc: '播放录音',
        curPlayIndex: index,
        curTime: '',
        totalTime: '',
        audioContext: wx.createInnerAudioContext()
      })
      const audioContext = this.data.audioContext
      audioContext.src = this.data.urlLists[this.data.curPlayIndex]
      let _this = this
      const loadDuration = function () {
        setTimeout(() => {
          if (audioContext.duration === 0) {
            loadDuration();
          } else {
            _this.setData({
              curTime: '00:00:00',
              totalTime: _this._getFormatSecond(audioContext.duration)
            })
          }
        }, 100);
      };
      audioContext.onCanplay(loadDuration)
    },

    onAction(e) {
      let curStatus = this.data.status;
      if (curStatus === 'start') {
        const recorderManager = this.data.recorderManager;
        recorderManager.start()
        let recordCount = 0
        let intervalId = setInterval(() => {
          recordCount++;
          this.setData({
            totalTime: this._getFormatSecond(recordCount)
          })
        }, 1000)
        recorderManager.onStop((res) => {
          console.log('录音完成----详细信息', res)
          let recordFilePath = res.tempFilePath;
          let duration = res.duration;

          if (recordFilePath === null || recordFilePath === undefined || recordFilePath === '' || duration === null || duration === undefined || duration === NaN || duration < 1000) {
            wx.showToast({
              title: '录音时长过短，请重录',
              icon: 'none'
            })
            clearInterval(this.data.intervalId)
            let recorderManager = wx.getRecorderManager()
            this.setData({
              status: "start",
              statusDesc: '开始录音',
              totalTime: '00:00:00',
              curTime: '',
              recorderManager,
              recordFilePath: '',
            })
            return;
          } else {
            const audioContext = wx.createInnerAudioContext()
            audioContext.src = recordFilePath
            this.setData({
              recordFilePath,
              audioContext,
              status: "play",
              statusDesc: '播放录音',
              curTime: '00:00:00',
            })
          }
        })
        this.setData({
          status: "stop",
          statusDesc: '停止录音',
          intervalId,
        })
      } else if (curStatus === 'stop') {
        const recorderManager = this.data.recorderManager;
        recorderManager.stop()
        clearInterval(this.data.intervalId)
        console.log('停止录音--等回调转入播放')
      } else if (curStatus === 'play') {
        const audioContext = this.data.audioContext
        audioContext.play()
        audioContext.onTimeUpdate(e => {
          this.setData({
            curTime: this._getFormatSecond(audioContext.currentTime)
          })
        })
        audioContext.onEnded(() => {
          this.setData({
            status: "play",
            statusDesc: '播放录音'
          })
        })
        audioContext.onError((res) => {
          wx.showToast({
            title: '播放出错' + res.errMsg + res.errCode + ',请重试',
            icon: 'none'
          })
          audioContext.stop()
          this.setData({
            showPopup: false
          })
        })
        this.setData({
          status: "pause",
          statusDesc: '暂停'
        })
      } else if (curStatus === 'pause') {
        const audioContext = this.data.audioContext
        audioContext.pause()
        this.setData({
          status: "play",
          statusDesc: '播放录音'
        })
      }
    },

    onRetry(e) {
      this.data.recorderManager.stop()
      clearInterval(this.data.intervalId)
      let recorderManager = wx.getRecorderManager()
      this.setData({
        status: "start",
        statusDesc: '开始录音',
        totalTime: '00:00:00',
        curTime: '',
        recorderManager,
      })
    },

    onConfirm(e) {
      const recorderManager = this.data.recorderManager;
      recorderManager.stop()
      clearInterval(this.data.intervalId)
      this.setData({
        showPopup: false,
      })
      let recordFilePath = this.data.recordFilePath;
      if (recordFilePath !== undefined && recordFilePath !== null && recordFilePath !== '') {
        console.log('保存语音路径', recordFilePath)
        this._saveRecord(recordFilePath)
      }
    },

    async _saveRecord(filePath) {
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

    _getFormatSecond(value) {
      if (value === null || value === "" || value === undefined || value === NaN) {
        return ""
      }
      let intValue = parseInt(value)
      let hour = (Math.floor(intValue / 3600)).toString().padStart(2, '0')
      let min = (Math.floor(intValue / 60) % 60).toString().padStart(2, '0')
      let sec = (intValue % 60).toString().padStart(2, '0')
      return `${hour}:${min}:${sec}`;
    },

  }
})