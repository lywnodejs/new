// components/bill/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    data: {
      type: Object,
      value: {}
    },
    type: {
      type: Number,
      value: 0 //0 待还款 1已还记录
    },
    line: {
      type: Boolean,
      value: true
    },
    disable: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {

  }
})
