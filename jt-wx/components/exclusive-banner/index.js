// components/exclusive-banner/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    datas: {
      type: Array,
      value: []
    }
  },

  /**
   * Component initial data
   */
  data: {
    indicatorDots: false,
    vertical: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
    circular: true,
    index: 0
  },

  /**
   * Component methods
   */
  methods: {
    onChange({detail: {current}}){
      this.setData({index: current})
    },
    onClick(e) {
      console.log(e);
      this.triggerEvent('click', e.currentTarget.dataset.item)
    }
  }
})
