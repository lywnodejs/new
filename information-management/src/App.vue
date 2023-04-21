<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style>
  body,
  body select{ color: #333; font-family: "Abadi","微软雅黑","黑体", Arial, Helvetica,sans-serif; font-size: 1em; -webkit-tap-highlight-color: transparent;}
  *{ margin: 0; padding: 0;text-decoration: none;}
  h3, h4, h5, h6, b, i, em,strong{ font-style: normal; font-weight: normal;}
  img{ border: none; display: block; width: 100%;}
  a{color: #333; text-decoration: none; cursor: pointer; outline: none;}
  li{ list-style-type: none;}
  ul, ol{ clear: both; zoom: 1; list-style-type: none;}
  input, select, textarea{ border: none; -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0; -moz-appearance: none; -webkit-appearance: none; appearance: none; outline: none;}

  #app {
    width: 100%;
    height: 100%;
  }
</style>
