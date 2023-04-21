<!--首页&策略列表页-->
<template>
  <div class="container">
    <el-row>
      <el-card class="box-card titlebold" style="margin: 20px; min-height: 100%" shadow="never">
        <div slot="header">
          <span style="font-size: 18px;font-weight: bold">标签类别管理</span>
          <el-button size="mini" type="success" @click="AddLabel()" style="margin-left: 20px">新建标签类别</el-button>
        </div>
        <el-row v-if="listData.length=='0'" type="flex" justify="center" style="margin-top: 100px">
          <p>您还没有任何标签</p>
        </el-row>
        <el-row v-if="listData.length=='0'" type="flex" justify="center" style="margin-bottom: 140px">
          <el-button size="small" type="success" @click="AddLabel()">马上新建标签 ></el-button>
        </el-row>
        <!--标签类型列表-->
        <el-table
          :data="listData"
          stripe
          v-loading="showListLoading"
          style="width: 100%">
          <el-table-column type="index" :index="indexFilter" align="center" width="100" label="序号"></el-table-column>
          <el-table-column width="" label="id" prop="id"></el-table-column>
          <el-table-column width="" label="名称" prop="name">
            <template slot-scope="scope">
              <el-row type="flex">
                <el-button type="text" size="small" style="font-size: 14px" @click="goPage('/labelmanage?index=labelcategory',scope.row)">
                  {{scope.row.name}}
                </el-button>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column width="" label="标注类型" prop="taggingType" :formatter="taggingType"></el-table-column>
          <el-table-column width="100" label="操作" resizeable="false">
            <template slot-scope="scope">
              <el-row type="flex">
                <el-button type="danger" size="mini" @click="deleteEvent(scope.row)">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <el-col type="flex" justify="center" style="background-color: #FFF; padding: 20px 0">
          <el-pagination align="center"
                         :current-page.sync="queryModel.cp"
                         :page-size="queryModel.ps"
                         :total="totalCount"
                         class="pagination"
                         layout="total, prev, pager, next, jumper"
                         @current-change="pageChange"
          >
          </el-pagination>
        </el-col>
      </el-card>
    </el-row>
    <el-dialog title="新建标签分类" :visible.sync="dialogVisible" width="30%" >
      <el-form :model="form">
        <el-form-item label="分类名称：" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入内容" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标注类型：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.taggingType">
            <el-radio  v-for="(item,index) in modelTypeArr" :key="index" :label="item.taggingType">{{item.taggingTypeDisp}}</el-radio>
          </el-radio-group>
<!--          <el-radio v-model="form.taggingType" label="LABEL_1">单标签</el-radio>-->
<!--          <el-radio v-model="form.taggingType" label="LABEL_N">多标签</el-radio>-->
<!--          <el-radio v-model="form.taggingType" label="NER">ner</el-radio>-->
<!--          <el-radio v-model="form.taggingType" label="NER_LABEL_1">目标级单标签分类</el-radio>-->
          <!--<el-radio v-model="form.taggingType" label="RELATION">关系</el-radio>-->
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
           <el-button @click="dialogVisible = false">取 消</el-button>
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
    name: 'labelcategory',
    data() {
      return {
        modelTypeArr:[],
        EditdialogVisible:false,
        searchStr:'',
        taskInfo:'',
        labelArr: [],
        formLabelWidth: '',
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
          ps: 30
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
      taggingType(value, row) {
        let text = value.taggingType;
        if(text==="LABEL_1"){
          return  '单标签'
        }else if(text==="LABEL_N"){
          return  '多标签'
        }else if(text==="NER"){
          return  'ner'
        }else if(text==="RELATION"){
          return  '关系'
        }else if(text==="NER_LABEL_1"){
          return  '目标级单标签分类'
        }
      },
      async saveForm() {
        let data = [];
        let obj = {
          name: this.form.name,
          taggingType: this.form.taggingType,
          taskId: this.queryModel.taskId
        };
        data.push(obj)

        let result = await informationService.savelabelcategory(data);
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
      goPage(page,row) {
        this.$router.push({path: page,
          query: {
            name: row.name,
            taggingType:row.taggingType,
            id:row.id,
          }});
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
        let result = await informationService.querylabelcategory(this.queryModel);

        if (result.message.code == 0) {
          this.listData = result.data.list;
          this.totalCount = result.data.totalCount;
          this.queryModel.cp = result.data.currentPage;
        }
      },
      deleteEvent(index) {
        let appTarget =process.env.PROJ_NAME;
        let message = '确定删除该标签类别么？'
        if (appTarget === 'dialogue'){
          message = '确定删除该标签类别么？删除后将删除相对应的对话或问答规则!'
        }

        this.$confirm(message, '提示', {type: 'warning'}).then(() => {
          this.confirmDelete(index.id)
        }).catch(() => {
        });
      },
      async confirmDelete(id) {
        let result = await informationService.deletelabelcategory({ids: id});
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
      },
      //model/type/group?cp=1&distictField=taggingType&ps=100&showDisp=true
      //模型类型分组接口调用- 获取可以建立的标签类型
      async getModelTypeChooseItem() {
        let params = {
          cp: 1,
          ps: 100,
          distictField: 'taggingType',
          showDisp: true
        };
        let result = await informationService.getModelTypeGroup(params);
        if (result.message.code === 0) {
          this.modelTypeArr = result.data.list;

        }
      }
    },
    mounted: function () {

    },
    watch: {},
    created: function () {


      this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
      this.queryModel.taskId=this.taskInfo.taskId;
      this.getList();
      this.getModelTypeChooseItem();
    }
  }
</script>
<style scoped>
  .el-tag {
    margin-left: 10px;
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
