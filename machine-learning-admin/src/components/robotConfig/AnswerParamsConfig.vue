<template>
    <!--参数配置组件-->

  <el-table
    :data="answerParameList" :header-cell-style="answerConfigHeaderStyle"
    style="width: 100%">
    <el-table-column prop="name" label="参数名" width="100"></el-table-column>
    <el-table-column prop="key" label="参数" width="120"></el-table-column>
    <el-table-column prop="example" label="示例" width="120"></el-table-column>
    <el-table-column prop="entities.name" label="实体名" width="120"></el-table-column>
  </el-table>
</template>

<script>
    export default {
        name: "AnswerParamsConfig",
        props:{
           answerParameList:{
             type:Array,
             required:true
           },
        },
        data(){
           return{
             paramsList:[{name:1},{name:2}],
             answerConfigHeaderStyle:{
               color: '#7F8FA4',
               padding: '0',
               height:"40px",
             },
           }
        },
        methods:{

        },

      watch:{
        answerParameList:{//深度监听，可监听到对象、数组的变化
          handler(val, oldVal){
            console.log(val)
          },
          deep:true
        }
      },
    }
</script>

<style scoped>
  .elButtonEdit,
  .elButtonDele
  {
    padding: 4px 8px;
  }
  .elButtonDele{
    background-color: red;
    border: none;
  }

</style>
