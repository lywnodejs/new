// components/apply/item-view/date-view/index.js
Component({
  properties: {
    attribute: {
      type: Object,
      value: {}
    },
  },


  data: {
    showSelectPopup: false,
    maxDate: new Date().getTime(),
  },

  observers: {
    "attribute": function (attribute) {
      let value = new Date().getTime();
      if (attribute.value !== undefined && attribute.value !== null && attribute.value !== '') {
        value = new Date(attribute.value).getTime();
      }
      this.setData({
        value
      })
    },
  },


  methods: {
    onClick(e) {
      let value = new Date().getTime();
      let attribute = this.data.attribute;
      if (attribute.value !== undefined && attribute.value !== null && attribute.value !== '') {
        value = new Date(attribute.value).getTime();
      }
      this.setData({
        showSelectPopup: true,
        value,
      })
    },


    onCancel(e) {
      this.setData({
        showSelectPopup: false,
      })
    },

    onConfirm({
      detail
    }) {
      let date = new Date(detail);
      let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
      let value = [year, month, day].join('-');
      let completed = true;
      this.data.attribute.value = value
      this.data.attribute.completed = completed
      this.setData({
        showSelectPopup: false,
        attribute: this.data.attribute
      })
      this.triggerEvent('valuechange', {
        value,
        id:this.data.attribute.id,
        completed
      });
    },
  }
})