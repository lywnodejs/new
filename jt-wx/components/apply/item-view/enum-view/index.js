// components/apply/item-view/enum-view/index.js
Component({

  properties: {
    attribute: {
      type: Object,
      value: {}
    },
  },

  data: {
    subAttrs: [],
    showSelectPopup: false,
    selectedIndex: -1,
  },


  observers: {
    "attribute": function (attribute) {
      let subAttrs = [],
        selectedIndex = -1;
      if (attribute.value !== undefined && attribute.value !== null && attribute.value !== '') {
        try {
          selectedIndex = attribute.selectValue.findIndex(item => item.value === attribute.value)
          if (selectedIndex !== -1) {
            subAttrs = attribute.selectValue[selectedIndex].childList
          }
        } catch (error) {
          subAttrs = [];
          selectedIndex = -1;
        }
      }
      if (subAttrs === undefined) {
        subAttrs = []
      }
      subAttrs.forEach(item => {
        item.productId = attribute.productId;
      })
      let options = attribute.selectValue.map(item => item.name);
      this.setData({
        subAttrs,
        options,
        selectedIndex,
      })
    },
  },

  methods: {

    onClick(e) {
      this.setData({
        showSelectPopup: true,
      })
    },

    onClose(e) {
      this.setData({
        showSelectPopup: false,
      })
    },

    onOptionSelect: function ({
      currentTarget: {
        dataset: {
          index
        }
      }
    }) {
      this.setData({
        showSelectPopup: false,
      });
      let attribute = this.data.attribute;
      let selectedIndex = index;
      let selectItem = attribute.selectValue[selectedIndex];
      let subAttrs = selectItem.childList
      let value = selectItem.value
      let showValue = selectItem.name

      if (subAttrs === undefined) {
        subAttrs = []
      }

      subAttrs.forEach(item => {
        item.productId = attribute.productId;
      })

      this.setData({
        showSelectPopup: false,
        subAttrs,
        selectedIndex,
        attribute: {
          ...attribute,
          showValue,
          value
        },
      })

      this.triggerEvent('valuechange', {
        value,
        id: attribute.id,
        completed: true,
        showValue
      });
    },

    onValueChange: function ({
      detail: {
        id,
        value,
        completed,
        showValue
      }
    }) {
      console.log(`组件收到事件---id:${id}--value:${value}--completed:${completed}--showValue:${showValue}`)
      this.triggerEvent('valuechange', {
        value,
        id,
        enumId: this.data.attribute.id,
        completed,
        showValue,
      });
    },
  }
})