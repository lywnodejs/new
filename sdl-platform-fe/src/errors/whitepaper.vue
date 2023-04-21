<template>
  <div id="whitepaper">
      <iframe class="iframe" src="http://10.170.197.98:8080/" 
     :width="screenWidth"
     :height="screenHeight"
      frameborder="0"></iframe>
  </div>
</template>
<script>
 import {connect} from '@/lib'
  export default connect(() => {
    return {
    }
  })({
    name: 'app-manage',
    data() {
      return {
          screenWidth: document.documentElement.clientWidth,
          screenHeight: document.documentElement.clientHeight
      }
    },
    components: {
    }
  })
</script>
<style lang="less">
#whitepaper {
    // .iframe{
    //     width: 100%;
    //     height: 100%;
        
    // }
}
</style>

