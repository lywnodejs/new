// components/ad-swiper/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    banners: {
      type: Array,
      value: []
    }
  },

  /**
   * Component initial data
   */
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
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
    onClick({currentTarget: {dataset: {banner}}}) {
      this.triggerEvent('click', banner)
    }
  }
})
