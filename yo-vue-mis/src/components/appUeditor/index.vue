<template>
  <div>
    <script :id="editorId"
            type="text/plain"></script>
  </div>
</template>
<script>
import '../../../static/lib/ueditor/themes/iframe.css'
import '../../../static/lib/ueditor/themes/default/css/ueditor.css'

window.UE.Editor.prototype._bkGetActionUrl = window.UE.Editor.prototype.getActionUrl
window.UE.Editor.prototype.getActionUrl = function (action) {
  if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage' || action == 'uploadfile') {
    return '/soc/threatInfo/upload'
  }
  //return this._bkGetActionUrl(this, action)
  return ''
}

export default {
  name: 'APP-UEDITOR',
  data() {
    return {
      editor: null
    }
  },
  props: {
    defaultMsg: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object
    },

    // 提供id,当一个页面需要渲染多个富文本编辑器时提供
    editorId: {
      type: String,
      default: 'edit'
    }
  },
  watch: {
    defaultMsg(value) {
      if (!this.changed) {
        this.changed = true
        this.editor.setContent(value)
      }
    }
  },
  created() {
    this.changed = false // 默认值首次改变
  },
  mounted() {
    const _this = this;

    // 添加富文本编辑器默认配置, 后续继续完善默认配置
    let editConfig = _.assign({
      autoFloatEnabled: false,
      initialFrameWidth: null
    }, {
        readonly: this.readonly
      }, this.config)
    this.editor = window.UE.getEditor(this.editorId, editConfig); // 初始化UE
    this.editor.addListener('ready', function () {
      _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
    })
    this.editor.addListener('contentChange', (editor) => {
      this.change()
    })
  },
  methods: {
    getUEContent() { // 获取内容方法
      return this.editor.getContent()
    },
    change() {
      this.$emit('change', this.getUEContent())
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  }
}
</script>
