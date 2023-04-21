<!--首页&策略列表页-->
<template>
  <el-container>
    <el-header>
      <app-header></app-header>
    </el-header>
    <el-container>
      <div class="container">
        <h2>帮助中心</h2>
      </div>
    </el-container>
  </el-container>
</template>
<script>
  import appHeader from '../components/AppHeader';

  export default {
    name: 'help',
    components: {
      appHeader
    }
  }
</script>
<style scoped>
  .container {
    width: 100%;
    padding: 10px;
    background-color: #ffffff;
    box-sizing: border-box;
  }
</style>
