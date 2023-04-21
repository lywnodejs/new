<template>
  <div>

    <el-row type="flex" style="height: 60px;line-height: 60px;background-color: #FFFFFF;">
      <el-col align="left" style="padding-left: 30px;padding-top: 20px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: 'trainresult?index=trainresult' }">模型训练</el-breadcrumb-item>
          <el-breadcrumb-item>{{leftTitle}}和{{RightTitle}}混淆语料</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>


    <div style="margin: 20px">
      <el-table :data="tableDataLeft" border style="width: 50%;float: left"  v-loading="loadingLeft"  :height="hei2">
        <el-table-column prop="content" :label="leftTitle"  >
          <template slot-scope="scope">
            <p @click="goPage('/mxxlcorpustaging?index=verificationresult',scope.row)"  class="ellipsis" style="cursor: pointer">
              {{scope.row.content}}
            </p>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="tableDataRight" border style="width: 50%;float: left"   v-loading="loadingRight" :height="hei2">
        <el-table-column prop="content" :label="RightTitle">
          <template slot-scope="scope">
            <p @click="goPage('/mxxlcorpustaging?index=verificationresult',scope.row)"  class="ellipsis" style="cursor: pointer">
              {{scope.row.content}}
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import appHeader from '../../components/AppHeader';
  import {informationService} from '../../service/index';

  export default {
    name: "checkconfusion.",
    data() {
      return {
        taskInfo:{},
        hei:'',
        hei2:0,
        showListLoading:false,
        loadingLeft:false,
        loadingRight:false,
        leftTitle:'',
        RightTitle:'',
        tableDataLeft:[],
        tableDataRight:[],
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
      goPage(page,row) {
        this.$router.push({path: page,
          query: {
            humanLabel:this.$route.query.humanLabel,
            robotLabel:this.$route.query.robotLabel,
            humanLabelId:this.$route.query.humanLabelId,
            robotLabelId:this.$route.query.robotLabelId,
            labelTypeId:this.$route.query.labelTypeId,
            ids:row.id
          }
        });
      },
      //获取数据列表
      async getListLeft() {
        let data={
          taskId:this.taskInfo.taskId,
          humanLabelId:this.queryModel.humanLabelId,
          cp:1,
          ps:10000
          // humanLabelId:23
        };
        this.loadingLeft=true
        let result = await informationService.corpusCheck(data);
        if (result.message.code == 0) {
          this.tableDataLeft = result.data.list;
          this.loadingLeft=false
        }
      },
      async getListRight() {
        let data={
          taskId:this.taskInfo.taskId,
          humanLabelId:this.queryModel.robotLabelId,
          cp:1,
          ps:10000
          // humanLabelId:17
        };
        this.loadingRight=true
        let result = await informationService.corpusCheck(data);
        if (result.message.code == 0) {
          this.tableDataRight = result.data.list;
          this.loadingRight=false
        }
      },
    },
    mounted: function () {
    },
    created: function () {
      if (this.$route.query.humanLabelId) {
        this.queryModel.humanLabelId = this.$route.query.humanLabelId;
        this.leftTitle = this.$route.query.humanLabel;
        this.RightTitle = this.$route.query.robotLabel;
        this.queryModel.robotLabelId = this.$route.query.robotLabelId;
        this.taskInfo = JSON.parse(sessionStorage.getItem("taskInfo"));
        this.getListLeft();
        this.getListRight();
      }
      this.hei2=document.documentElement.clientHeight-150
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    background-color: #EFF3F6;
    box-sizing: border-box;
    min-height: 100%;
  }
  .goDT{
    text-align: left;cursor: pointer;color: rgb(64,155,258)
  }
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
