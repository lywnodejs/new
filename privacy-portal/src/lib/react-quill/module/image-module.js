/**
 * Based on https://github.com/NextBoy/quill-image-extend-module
 */

/**
 *@description 观察者模式 全局监听富文本编辑器
 */
export const QuillWatch = {
  watcher: {}, // 登记编辑器信息
  active: null, // 当前触发的编辑器
  on: function(imageExtendId, ImageExtend) {
    // 登记注册使用了ImageEXtend的编辑器
    if (!this.watcher[imageExtendId]) {
      this.watcher[imageExtendId] = ImageExtend
    }
  },
  emit: function(activeId, type = 1) {
    // 事件发射触发
    this.active = this.watcher[activeId]
    if (type === 1) {
      imgHandler()
    }
  }
}

/**
 * @description 图片功能拓展： 增加上传 拖动 复制
 */
export class ImageExtend {
  /**
   * @param quill {Quill}富文本实例
   * @param config {Object} options
   * config  keys: action, headers, editForm start end error  size response
   */
  constructor(quill, config = {}) {
    this.id = Math.random()
    this.quill = quill
    this.quill.id = this.id
    this.config = config
    this.file = '' // 要上传的图片
    this.imgURL = '' // 图片地址
    quill.root.addEventListener('paste', this.pasteHandle.bind(this), false)
    quill.root.addEventListener('drop', this.dropHandle.bind(this), false)
    quill.root.addEventListener(
      'dropover',
      function(e) {
        e.preventDefault()
      },
      false
    )
    this.cursorIndex = 0
    QuillWatch.on(this.id, this)
  }

  validate(data) {
    let items = data.items,
      item,
      types

    if (!items) return false
    item = items[0]
    types = data.types || []

    for (let i = 0; i < types.length; i++) {
      if (types[i] === 'Files') {
        item = items[i]
        break
      }
    }

    if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
      return item
    }

    return false
  }

  /**
   * @description 粘贴
   * @param e
   */
  pasteHandle(e) {
    QuillWatch.emit(this.quill.id, 0)
    const self = this
    const clipboardData = e.clipboardData

    if (clipboardData) {
      let item = this.validate(clipboardData)

      if (item) {
        e.preventDefault()
        this.file = item.getAsFile()

        // 如果图片限制大小
        if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
          if (self.config.sizeError) {
            self.config.sizeError()
          }
          return
        }

        // 由于clipboard执行顺序问题，需要延迟执行
        setTimeout(() => {
          if (this.config.action) {
            self.uploadImg()
          } else {
            self.toBase64()
          }
        }, 0)
      }
    }
  }

  /**
   * 拖拽
   * @param e
   */
  dropHandle(e) {
    e.preventDefault()
    QuillWatch.emit(this.quill.id, 0)
    const self = this
    const dataTransfer = e.dataTransfer

    if (dataTransfer) {
      let item = this.validate(dataTransfer)

      if (item) {
        this.file = item.getAsFile()

        // 如果图片限制大小
        if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
          if (self.config.sizeError) {
            self.config.sizeError()
          }
          return
        }
        if (this.config.action) {
          self.uploadImg()
        } else {
          self.toBase64()
        }
      }
    }
  }

  /**
   * @description 将图片转为base4
   */
  toBase64() {
    const self = this
    const reader = new FileReader()
    reader.onload = e => {
      // 返回base64
      self.imgURL = e.target.result
      self.insertImg()
    }
    reader.readAsDataURL(self.file)
  }

  getCookie(name) {
    let arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2])
    } else {
      return null
    }
  }

  /**
   * @description 上传图片到服务器
   */
  uploadImg(fileInput) {
    const self = this
    let quillLoading = self.quillLoading
    let config = self.config
    // 构造表单
    let formData = new FormData()
    formData.append(config.name, self.file)
    formData.append(
      'v',
      Math.random()
        .toString(36)
        .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15)
    )
    // 自定义修改表单
    if (config.editForm) {
      config.editForm(formData)
    }

    // 创建ajax请求
    let xhr = new XMLHttpRequest()
    xhr.open('post', config.action, true)
    xhr.setRequestHeader('userSessionId', this.getCookie('userSessionId'))
    // 如果有设置请求头
    if (config.headers) {
      config.headers(xhr)
    }
    if (config.change) {
      config.change(xhr, formData)
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          //success
          let res = JSON.parse(xhr.responseText)
          self.imgURL = config.response(res)
          QuillWatch.active.uploadSuccess()
          self.insertImg()
          if (self.config.success) {
            self.config.success()
          }
        } else {
          //error
          if (self.config.error) {
            self.config.error()
          }
          QuillWatch.active.uploadError()
        }
        fileInput.value = ''
      }
    }
    // 开始上传数据
    xhr.upload.onloadstart = function(e) {
      QuillWatch.active.uploading()
      // let length = (self.quill.getSelection() || {}).index || self.quill.getLength()
      // self.quill.insertText(length, '[uploading...]', { 'color': 'red'}, true)
      if (config.start) {
        config.start()
      }
    }
    // 上传过程
    xhr.upload.onprogress = function(e) {
      let complete = (((e.loaded / e.total) * 100) | 0) + '%'
      QuillWatch.active.progress(complete)
    }
    // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
    xhr.upload.onerror = function(e) {
      QuillWatch.active.uploadError()
      if (config.error) {
        config.error()
      }
    }
    // 上传数据完成（成功或者失败）时会触发
    xhr.upload.onloadend = function(e) {
      if (config.end) {
        config.end()
      }
    }
    xhr.send(formData)
  }

  /**
   * @description 往富文本编辑器插入图片
   */
  insertImg() {
    const self = QuillWatch.active
    self.quill.insertEmbed(QuillWatch.active.cursorIndex, 'image', self.imgURL)
    self.quill.update()
    self.quill.setSelection(self.cursorIndex + 1)
  }

  /**
   * @description 显示上传的进度
   */
  progress(pro) {
    pro = '[' + 'uploading' + pro + ']'
    QuillWatch.active.quill.root.innerHTML = QuillWatch.active.quill.root.innerHTML.replace(
      /\[uploading.*?\]/,
      pro
    )
  }

  /**
   * 开始上传
   */
  uploading() {
    let length =
      (QuillWatch.active.quill.getSelection() || {}).index || QuillWatch.active.quill.getLength()
    QuillWatch.active.cursorIndex = length
    QuillWatch.active.quill.insertText(
      QuillWatch.active.cursorIndex,
      '[uploading...]',
      {
        color: 'rgba(0, 0, 0, 0.65)'
      },
      true
    )
  }

  /**
   * 上传失败
   */
  uploadError() {
    QuillWatch.active.quill.root.innerHTML = QuillWatch.active.quill.root.innerHTML.replace(
      /\[uploading.*?\]/,
      '[upload error]'
    )
  }

  uploadSuccess() {
    QuillWatch.active.quill.root.innerHTML = QuillWatch.active.quill.root.innerHTML.replace(
      /\[uploading.*?\]/,
      ''
    )
  }
}

/**
 * @description 点击图片上传
 */
export function imgHandler() {
  let fileInput = document.querySelector('.quill-image-input')
  if (fileInput === null) {
    fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.classList.add('quill-image-input')
    fileInput.style.display = 'none'
    // 监听选择文件
    fileInput.addEventListener('change', function() {
      let self = QuillWatch.active
      self.file = fileInput.files[0]
      // fileInput.value = ''
      // 如果图片限制大小
      if (
        self.config &&
        self.config.size &&
        self.file &&
        self.file.size >= self.config.size * 1024 * 1024
      ) {
        if (self.config.sizeError) {
          self.config.sizeError()
        }
        return
      }
      if (self.config.action && self.file) {
        self.uploadImg(fileInput)
      } else {
        self.toBase64()
      }
    })
    document.body.appendChild(fileInput)
  }
  fileInput.click()
}

/**
 *@description 全部工具栏
 */
export const container = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [
    {
      header: 1
    },
    {
      header: 2
    }
  ],
  [
    {
      list: 'ordered'
    },
    {
      list: 'bullet'
    }
  ],
  [
    {
      script: 'sub'
    },
    {
      script: 'super'
    }
  ],
  [
    {
      indent: '-1'
    },
    {
      indent: '+1'
    }
  ],
  [
    {
      direction: 'rtl'
    }
  ],
  [
    {
      size: ['small', false, 'large', 'huge']
    }
  ],
  [
    {
      header: [1, 2, 3, 4, 5, 6, false]
    }
  ],
  [
    {
      color: []
    },
    {
      background: []
    }
  ],
  [
    {
      font: []
    }
  ],
  [
    {
      align: []
    }
  ],
  ['clean'],
  ['link', 'image', 'video']
]
