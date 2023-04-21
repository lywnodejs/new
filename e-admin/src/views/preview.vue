<!--
 * @Date: 2020-03-31 16:35:50
 * @Author: 魏愈茜
 * @LastEditTime: 2020-03-31 16:48:46
 -->
<template>
    <div class="test">
        <img :src="src" alt="">
        <div class="append"></div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            src:require('../assets/top.png')
        }
    },
    mounted(){
        $('.append').html(window.sessionStorage.getItem('html'));
    }
    
}
</script>

<style scoped>
.append{
    width: 67%;
    border-top: 2px solid red;
    margin: 0 auto;
}
img{
    width: 100%;
}
</style>