<template>
  <div id="ocean-intra-fatbird" >
      <fatbird-false-rate></fatbird-false-rate>
      
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import fatbirdFalseRate from './components/fatbirdFalseRate'

  export default connect(() => {
    return {
    }
  }, {
      ruleFalseIndex: 'ocean_fatbird/ruleFalseIndex'
  })({
    data() {
      return {
          data: '',
          time: ['2020-04-05', '2020-05-08'],
          start_day: '',
          end_day: ''
      }
    },
    components: { fatbirdFalseRate },
    created() {
        this.fetchData()
    },
    mounted() {
    },
    methods: {
      fetchData() {
      }
    }
  })
</script>

<style lang="less">
#ocean-intra-fatbird{
}
</style>

