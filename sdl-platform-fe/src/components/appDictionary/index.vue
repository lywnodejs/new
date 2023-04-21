<template>
  <div :style="{color: textColor}">
    {{ data.name }}
  </div>
</template>

<script>

export default {
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },

  computed: {
    textColor: function() {
      let obj = {}
      if (this.data.description) {
        obj = JSON.parse(this.data.description)
        if (obj) {
          return obj.color
        }
      }
      return ''
    }
  }
}
</script>
