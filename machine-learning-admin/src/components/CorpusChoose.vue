<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="span-title" style="font-weight: bold">语料集选择</span>
        <el-button style="margin-left: 20px" type="primary" size="mini" @click="dialogVisible = true">选择语料集</el-button>
      </div>
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="(item,index) in multipleSelection" :label="item.id" :key="index">{{item.name}}
        </el-checkbox>
      </el-checkbox-group>

      <el-checkbox
        style="margin-top: 20px"
        v-if="showCheckBox" v-model="checked" @change="checkboxChange">未标注预料</el-checkbox>

      <el-dialog title="新建语料样本集" :visible.sync="dialogVisible" width="40%">
        <div  style="max-height: 400px;overflow: auto">
          <el-table
            ref="InfluenceTable"
            :data="listData"
            @selection-change="handleSelectionChange"
            border
            style="width: 100%;">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="标注进度">
              <template slot-scope="scope">
                <div style="display: inline-block;margin-right: 10px" v-for="item in scope.row.humanLabelTypeNumberArr">
                  <span>{{item.name}}：{{item.count}}/{{scope.row.totalNumber}} </span>
                </div>
              </template>
            </el-table-column>
            <p slot="append" style="text-align:center; line-height:30px;" v-loading="loading" v-if="isShowLoadMore">
              <a href="javascript:;"  @click="getMoreData()">加载更多</a>
            </p>
          </el-table>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {informationService} from '../service/index';

  export default {
    name: "testsetting",
    props:{
      showCheckBox:false
    },
    data() {
      return {
        checked: true,
        dialogVisible:false,
        loading: true,
        isShowLoadMore: false, //是否显示“加载更多”
        listData: [],
        taskInfo:{},
        multipleSelection: [],
        radio: '',
        checkList: [],
        UncheckId: '',//要取消选中数据的ID
        UncheckId2: '',//要取消选中数据的ID
        CheckIndex: [],//选中数据的index
        queryModel: {
          direction:'DESC',
          page: 1,
          size: 10
        },
        totalCount: 20,
        totalPage: 1 //数据总页数
      }
    },
    watch: {
      'checkList':{
        handler(newArr, oldArr) {
          if(oldArr && newArr){
            if(oldArr.length>newArr.length){
              this.$refs.InfluenceTable.clearSelection();
              this.listData.forEach((item,index)=>{
                for(let u=0;u<newArr.length;u++){
                if(item.id==newArr[u]){
                  this.CheckIndex.push(index)
                }
              }
            });
            }
            this.$nextTick(function () {
              setTimeout(() => {
                for (let k = 0; k < this.CheckIndex.length; k++) {
                this.$refs.InfluenceTable.toggleRowSelection(this.listData[this.CheckIndex[k]])
              }
              this.CheckIndex=[]
            }, 1);
            });
          }
        },
        deep: true,
        immediate: true,
      }

    },
    methods: {
      goPage(page) {
        this.$router.push({path: page});
      },
      async getList() {

    let result = await informationService.querycorpus(this.queryModel);

    if (result.message.code == 0) {
      let temp=result.data.list;
      temp.forEach((item,index)=>{
        // debugger
        item.humanLabelTypeNumberArr=JSON.parse(item.humanLabelTypeNumber)
    });
      this.listData = temp;

      this.totalCount = result.data.totalCount;
      this.totalPage = result.data.totalPage;
      this.queryModel.cp = result.data.currentPage;
      this.isShowLoadMore = this.totalPage > this.queryModel.cp; //是否显示“加载更多”，即总页数大于当前页码
      this.loading = false;
    }
  },
  //加载更多
  async getMoreData() {
    if (this.isShowLoadMore){
      this.queryModel.cp++;
      let result = await informationService.querycorpus(this.queryModel);
      if (result.message.code == 0) {
        let temp=result.data.list;
        temp.forEach((item,index)=>{
          // debugger
          item.humanLabelTypeNumberArr=JSON.parse(item.humanLabelTypeNumber)
        this.listData.push(item);
      });
        this.queryModel.cp = result.data.currentPage;
        this.isShowLoadMore = this.totalPage > this.queryModel.cp;
        this.loading = false;
      }
    }
  },
  handleSelectionChange(val) {
    this.checkList = [];
    this.multipleSelection = val;
    this.multipleSelection.forEach(item => {
      this.checkList.push(item.id);
  });
    this.$emit('resultChange',this.checkList)
  },
  checkboxChange(val) {
    this.checked = val;
    this.$emit('checkedChange', this.checked);
  }
  },
  mounted: function () {},
  created: function () {
    this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
    this.queryModel.taskId=this.taskInfo.taskId;
    this.getList();
  }
  }
</script>

<style scoped>
  .line {
    height: 1px;
    width: 100%;
    margin: 10px 0;
    background: rgb(228, 231, 237);
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    padding-bottom: 15px;
  }
</style>
