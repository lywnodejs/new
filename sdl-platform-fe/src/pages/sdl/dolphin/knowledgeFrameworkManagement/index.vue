<template>
  <div class="knowledgeFramework">
    <router-link :to="{ path : '/sdl/dolphin/testBaseManagement/whiteRule'}">
      <button type="button" class="knowledgeFramework-btn">威胁列表-知识库</button>
    </router-link>
    <router-link :to="{ path : '/sdl/dolphin/testBaseManagement/blackPlugin'}">
      <button type="button" class='knowledgeFramework-btn'>白盒规则-知识库</button>
    </router-link>
    <router-link :to="{ path : '/sdl/dolphin/testBaseManagement/mobileRule'}">
      <button type="button" class='knowledgeFramework-btn'>黑盒插件-知识库</button>
    </router-link>
    <router-link :to="{ path : '/sdl/dolphin/testBaseManagement/mobileRule'}">
      <button type="button" class='knowledgeFramework-btn'>移动端规则-知识库</button>
    </router-link>
  </div>
</template>
<script>
  export default {}
</script>
<style lang="less" scoped>
  .knowledgeFramework {
    .knowledgeFramework-btn {
      margin-top: 20px;
      margin-right: 15px;
      background: #fc9153;
      border-radius: 4px;
      height: 36px;
      width: 110px;
      padding: 5px;
      border: none;
      color: white;
      cursor: pointer;
      // font-weight: 100;
    }
  }

</style>

