<!--首页&策略列表页-->
<template>
  <div class="container">
    <el-row>
      <el-row type="flex" style="height: 60px;line-height: 60px;background-color: #FFFFFF;">
        <el-col align="left" style="padding-left: 30px;padding-top: 20px">
          <el-breadcrumb separator="/" >
            <el-breadcrumb-item :to="{ path: 'labelcategory?index=labelcategory' }">标签类别管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{FromName}}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>

      <el-card class="box-card" style="margin: 20px; min-height: 100%" shadow="never">
        <div slot="header" style="height: 30px">
          <!--<span>谓语分类</span>-->
          <el-button size="mini" type="success" @click="AddLabel()">新建标签</el-button>
          <el-input size="mini" style="float: right;width: 200px" v-model="searchStr" placeholder="请输入内容" @keyup.enter.native="searchLabelFun">
            <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="searchLabelFun"> </i>
          </el-input>
        </div>
        <el-row v-if="listData.length=='0'" type="flex" justify="center" style="margin-top: 100px">
          <p>您还没有任何标签</p>
        </el-row>
        <el-row v-if="listData.length=='0'" type="flex" justify="center" style="margin-bottom: 140px">
          <el-button size="small" type="success" @click="AddLabel()">马上新建标签 ></el-button>
        </el-row>
        <!--标签列表-->

        <el-tag
          v-for="item in listData"
          :key="item.name"
          @close="deleteEvent(item)"
          @click="editLabel(item)"
          closable>
          {{item.name}}
        </el-tag>

        <!--<div class="labelListWrap">-->
          <!--<div v-for="(item,index) in listData" :key="index" class="editdomwrap"><b class="editdom" @click="editLabel(item)">{{item.name}}</b><em-->
            <!--@click="deleteEvent(item)">x</em>-->
          <!--</div>-->
          <!--<div class="editdomwrap">-->
            <!--&lt;!&ndash;<b class="editdom">hehehhe</b><em>x</em>&ndash;&gt;-->
          <!--</div>-->
        <!--</div>-->

      </el-card>

      <!--<el-row type="flex" justify="center" class="zoom-pagi">-->
        <!--<el-col type="flex" justify="center">-->
          <!--<el-pagination align="center"-->
                         <!--:current-page.sync="queryModel.cp"-->
                         <!--:page-size="queryModel.ps"-->
                         <!--:total="totalCount"-->
                         <!--class="pagination"-->
                         <!--layout="total, prev, pager, next, jumper"-->
                         <!--@current-change="pageChange"-->
          <!--&gt;-->
          <!--</el-pagination>-->
        <!--</el-col>-->
      <!--</el-row>-->
    </el-row>
    <el-dialog title="新建标签" :visible.sync="dialogVisible" width="30%" >
      <el-form :model="form">
        <el-form-item label="标签名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入内容" autocomplete="off"></el-input>
          <i style="color: #ff0000;font-style: normal">* 不建议使用特殊字符，以英文逗号区分间隔</i>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="saveForm()">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog title="编辑标签" :visible.sync="EditdialogVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="标签名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入内容" autocomplete="off"></el-input>
          <i style="color: #ff0000;font-style: normal">* 不建议使用特殊字符，以英文逗号区分间隔</i>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
           <el-button @click="EditdialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="saveForm()">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>
<script>
  import appHeader from '../../components/AppHeader';
  import {informationService} from '../../service/index';
  import {getJoinCookie} from '../../utils/commonUtil';
  import $ from 'jquery'
  import {mapActions, mapState} from 'vuex';

  export default {
    name: 'mytask',
    data() {
      return {
        FromName:'',
        EditdialogVisible:false,
        searchStr:'',
        taskInfo:'',
        labelArr: [],
        formLabelWidth: '80px',
        form: {},
        dialogVisible: false,
        searchLabel: '',
        restaurants: [],
        state: '',
        listData: [
          {
            topAt: '1'
          }
        ],
        showListLoading: false,
        queryModel: {
          taskId: '',
          cp: 1,
          ps: 10000
        },
        canClick: true,
        totalCount: 0,
        labelId:''
      }
    },
    components: {
      appHeader
    },
    methods: {
      editLabel(row){
        this.EditdialogVisible=true;
        this.labelId=row.id;
        this.form = JSON.parse(JSON.stringify(row));
      },
      async saveForm() {
        let data = [];
        let str = ',';
        if (this.form.name.indexOf(str) > 0) {
          let nameArr = this.form.name.split(',');
          let keyV = true;
          for (let i = 0; i < nameArr.length; i++) {
            if (nameArr[i] == "") {
              keyV = false;
              break;
            } else {
              let obj = {
                name: nameArr[i],
                taskId: this.queryModel.taskId,
                labelType:{
                  id:this.$route.query.id
                },
              };
              data.push(obj)
            }
          }
          if (!keyV) {
            this.$message({
              showClose: true,
              message: '请输入正确的标签名字',
              type: 'success'
            });
            return;
          }
        } else {
          data=[{
            name: this.form.name,
            taskId: this.queryModel.taskId,
            labelType:{
              id:this.$route.query.id
            },
            id:this.labelId,
          }]
        }

        let result = await informationService.savelabel(data);
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.getList();
            target.dialogVisible = false;
            target.EditdialogVisible=false;
            target.form.name = '';
            this.labelId=''
          }, 1200);
          target.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          });
        } else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      goPage(page) {
        this.$router.push({path: page});
      },
      indexFilter(index) {
        return index + 10 * (this.queryModel.cp - 1) + 1;
      },
      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList();
      },
      //新建标签
      AddLabel() {
        this.labelId='';
        this.dialogVisible = true
      },
      searchLabelFun(){
        this.queryModel.name=this.searchStr;
        this.getList()
      },
      //获取数据列表
      async getList() {
        this.queryModel.labelTypeIds=this.$route.query.id
        let result = await informationService.querylabel(this.queryModel);
        debugger
        if (result.message.code == 0) {
          this.listData = result.data.list;
          this.totalCount = result.data.totalCount;
          this.queryModel.cp = result.data.currentPage;
        }
      },
      deleteEvent(index) {
        let appTarget =process.env.PROJ_NAME;
        let message = '确定删除该标签么？'
        if (appTarget === 'dialogue'){
          message = '确定删除该标签么？删除后将删除相对应的对话或问答规则!'
        }
        this.$confirm(message, '提示', {type: 'warning'}).then(() => {
          this.confirmDelete(index.id)
        }).catch(() => {
        });
      },
      async confirmDelete(id) {
        let result = await informationService.deletelabel({ids: id});
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.getList();
          }, 1250)
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
        } else {
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      edit(labelId) {
         this.labelId=labelId.id
      }
    },
    mounted: function () {

    },
    watch: {},
    created: function () {
      this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
      this.queryModel.taskId=this.taskInfo.taskId;
      if (this.$route.query.name) {
         this.FromName=this.$route.query.name
      }
      this.getList()

    }
  }
</script>
<style scoped>
  .el-tag {
    margin-right: 10px;
    margin-top: 10px;
    padding: 0 10px;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    color: #354052;
  }


  .labelListWrap {
    width: 100%;
    /*border: solid 1px rgb(228,231,237);*/
  }

  .editdom {
    border: solid 1px rgb(228, 231, 237);
    display: inline-block;
    box-sizing: border-box;
    padding: 8px 20px;
  }

  .editdomwrap:hover em {
    display: block;
  }

  .editdomwrap {
    position: relative;
    display: inline-block;
    margin-right: 10px;
    margin-top: 10px;
  }

  .editdomwrap em {
    font-style: normal;
    display: none;
    width: 16px;
    cursor: pointer;
    height: 16px;
    position: absolute;
    background: rgb(64, 158, 255);
    text-align: center;
    line-height: 16px;
    color: #fff;
    top: 0;
    right: 0;
  }

  .container {
    width: 100%;
    background-color: #EFF3F6;
    box-sizing: border-box;
    min-height: 100%;
  }

  .el-button + .el-button {
    margin-left: 0;
    margin-top: 5px;
  }
</style>
