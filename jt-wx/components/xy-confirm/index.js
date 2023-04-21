Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: "",
    },
    contentText: {
      type: String,
      value: "",
    },
    leftText: {
      type: String,
      value: "取消",
    },
    rightText: {
      type: String,
      value: "确定",
    },
    isAlert: {
      type: Boolean,
      value: false,
    },
    textLeft: {
      type: Boolean,
      value: false,
    },
    alertBtnText: {
      type: String,
      value: "我知道了",
    },
  },
  data: {},
  methods: {
    onClose: function () {
      this.closePopup();
      this.triggerEvent("close");
    },
    onCancel: function () {
      this.closePopup();
      this.triggerEvent("cancel");
    },
    onOk: function () {
      this.closePopup();
      this.triggerEvent("ok");
    },
    closePopup: function () {
      if (this.data.isAlert) {
        this.setData({ show: false });
      }
    },
  },
});
