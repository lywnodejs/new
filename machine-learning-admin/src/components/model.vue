<template>
  <div>

  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import {informationService} from '../../service/index';

  export default {
    name: "checkconfusion.",
    data() {
      return {
        showListLoading:false,
        listData:[],
        queryModel: {
          page: 1,
          size: 10
        },
        totalCount: 20,
      }
    },
    components: {
      appHeader
    },
    watch: {},
    methods: {

    },
    mounted: function () {
    },
    created: function () {

    }
  }
</script>

<style scoped>
  .line{
    height: 2px;
    width: 100%;
    margin: 10px 0;
    background: rgb(228,231,237);
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    padding-bottom: 15px;
  }
</style>
