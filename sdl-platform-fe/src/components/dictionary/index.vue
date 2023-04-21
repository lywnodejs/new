<template>
  <app-dictionary :data="dict"></app-dictionary>
</template>

<script>
import {connect} from '@/lib'

export default connect(() => {
  return {
    dictionaryOptions: 'dictionary/dictionaryOptions'
  }
}, {
  getDictionary: 'dictionary/getDictionary'
})({
  name: 'app-hight-dictionary',
  props: {
    type: [ Number, String ],
    code: null
  },
  computed: {
    dict() {
      return _.find(this.dictionaryOptions[this.type], {code: this.code})
    }
  },
  created() {
    this.getDictionary(this.type)
  }
})
</script>
