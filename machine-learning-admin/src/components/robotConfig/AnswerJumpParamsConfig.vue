<template>
  <!--参数配置组件-->
  <el-table :data="answerParameList"  border style="width: 100% " :header-cell-style="answerConfigHeaderStyle">
    <el-table-column  width="140"  align="left">
      <template slot-scope="scope" slot="header">
        <el-button class="elButtonEdit" type="primary" size="mini"  @click="addAttribute">新增属性</el-button>
      </template>
      <template slot-scope="scope">
        <el-input
          placeholder="名称"
          v-model="scope.row.name"
          clearable>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column  label="属性值"align="left">
      <template slot-scope="scope">
        <el-input
          v-if="isInputOrSelect"
          placeholder="属性值"
          v-model="scope.row.value"
          clearable>
        </el-input>
        <el-select  v-else style="width: 250px" v-model="scope.row.value" clearable filterable placeholder="选择或搜索属性值">
          <el-option
            v-for="item in slotAttributeValues"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column  width="70" label="操作"align="center">
      <template slot-scope="scope" >
        <el-button class="elButtonDele" type="primary" size="mini"  @click="deleteAttribute(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    name: "AnswerJumpParamsConfig",
    props:{
      answerParameList:{
        type:Array,
        required:true
      },
      slotAttributeValues:{//词槽实体的属性标签（答案配置中心用）
        type:Array
      },
      isInputOrSelect:{//属性值是输入框样式还是选择框样式 true为输入框样式  false为选择框样式
        default:true
      }
    },
    data(){
      return{
        answerConfigHeaderStyle:{
          color: '#7F8FA4',
          padding: '0',
          height:"40px",
        },
      }
    },
    methods:{
      //新增属性
      addAttribute(){
        this.answerParameList.push({name:'',value:''})
      },
      //删除属性
      deleteAttribute(index,obj){
        this.answerParameList.splice(index,1)
      },
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
