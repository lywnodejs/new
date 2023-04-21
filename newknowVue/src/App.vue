<template>
  <div id="app">
    <keep-alive include='index'>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style src="../static/css/index.css"></style>
