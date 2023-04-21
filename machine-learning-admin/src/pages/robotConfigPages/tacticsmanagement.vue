<template>
    <!--策略/技能设置页-->

  <div>
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/skillhome', query: {
            skillData:JSON.stringify(skillData),
            robotName:robotName
            }}">我的技能</el-breadcrumb-item>
        <el-breadcrumb-item>技能管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row type="flex" justify="space-around" style="height: 70px">
      <el-col align="left">
        <span style="font-size: 18px;position: relative;top: 20px;left: 30px">{{skillRuleTitle}}</span>
        <el-button size="small" type="success" style="margin-left: 15px;position: relative;top: 20px;left:30px" @click="addTactics()">新建规则</el-button>
        <el-button  size="small" type="success" style="float: right;margin: 20px 30px" @click="updataTimeSort">
          时间排序<i class="el-icon-sort"></i></el-button>
      </el-col>
    </el-row>
    <!--问答技能的规则列表-->
<!--    <el-row v-if="skillData.skillType===1"  class="tableList">-->
<!--      <el-table :data="listData"  v-loading="showListLoading" :header-cell-style="headerStyle" @sort-change="sortChange">-->
<!--        <el-table-column  align="center" width="100" label="规则id" prop="id"></el-table-column>-->
<!--        <el-table-column  sortable="custom" width="150" label="用户意图" prop="labels.name" align="left"></el-table-column>-->
<!--        <el-table-column  label="回复答案" prop="actionConfInfo.answerName" align="center" ></el-table-column>-->
<!--        <el-table-column  width="140" label="操作" align="center"  resizeable="false">-->
<!--          <template slot-scope="scope">-->
<!--            <el-row type="flex"  style="margin-left: 15px">-->
<!--              <el-button class="elButtonEdit" type="primary" size="mini"  @click="editTactics(scope.$index, scope.row)">编辑</el-button>-->
<!--              <el-button  class="elButtonDele"type="primary" size="mini" style="background-color: red ; border-color: red" @click="deleteTactics(scope.$index, scope.row)">删除</el-button>-->
<!--            </el-row>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--    </el-row>-->

    <!--对话技能的规则列表-->
    <el-row  class="tableList" :class="!isNameSort?listSortClass:''">
      <el-table class="dialogTable" :data="listData"  v-loading="showListLoading" :header-cell-style="headerStyle" @sort-change="sortChange">
        <el-table-column align="left" width="100" label="规则id" prop="id"></el-table-column>
        <el-table-column sortable="custom"  width="" label="用户意图" prop="labels.name" align="left"></el-table-column>
<!--        <el-table-column  width="120" label="词槽" align="left">-->
<!--        <template slot-scope="scope">-->
<!--         <ul v-for="(soltName,index) of scope.row.slots" :key = "index">-->
<!--           <li>{{soltName.userSlot.slotName}}</li>-->
<!--         </ul>-->
<!--        </template>-->
<!--        </el-table-column>-->
        <el-table-column  width="" label="词槽及澄清顺序" align="center">
          <template slot-scope="scope">
            <ul v-for="(clarifyOrder,index) of scope.row.slots" :key = "index">
              <li>{{clarifyOrder.userSlot.slotName}} <span style="width: 10px;display: inline-block"></span> {{clarifyOrder.clarifyOrder}}</li>
            </ul>
          </template>
        </el-table-column>
<!--        sortable="custom"-->
        <el-table-column  width="150" label="操作时间" prop="updateAt" align="left" :formatter="format_Time"></el-table-column>
<!--        <el-table-column  label="回复答案" prop="actionConfInfo.answerName" align="center" ></el-table-column>-->
<!--        <el-table-column width="200" label="推荐问题" prop="guideQuestions" align="left" >-->
<!--        <template slot-scope="scope">-->
<!--          <ul v-for="(guideQuestion,index) of scope.row.guideQuestionsArray" :key = "index">-->
<!--            <li class="guideQuestion">{{guideQuestion}}</li>-->
<!--          </ul>-->
<!--        </template>-->
<!--        </el-table-column>-->
        <el-table-column  width="140" label="操作" align="center"  resizeable="false">
          <template slot-scope="scope">
            <el-row type="flex"  style="margin-left: 15px">
              <el-button class="elButtonEdit" type="primary" size="mini"  @click="editTactics(scope.$index, scope.row)">编辑</el-button>
              <el-button  class="elButtonDele"type="primary" size="mini" style="background-color: red ; border-color: red" @click="deleteTactics(scope.$index, scope.row)">删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="zoom-pagi" style="padding-top: 30px;padding-bottom: 30px">
      <el-col type="flex" justify="center">
        <el-pagination align="center"
                       :current-page.sync= "tacticsListParams.cp"
                       :total="totalCount"
                       class="pagination"
                       layout="total, prev, pager, next, jumper"
                       @current-change="pageChange"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!--新建和编辑问答类型的规则弹窗-->
    <el-dialog  custom-class="dialogClass" :visible.sync="dialogFormVisible" @close="close()" :close-on-click-modal="false" >
      <div slot="title">{{formTitle}}</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="demo-form">
        <el-form-item  label="意图选择:"   prop="label.name">
          <el-select v-model="form.label" value-key="name" filterable placeholder="请选择意图">
            <el-option
              v-for="item in intentionList"
              :key="item.name"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="上文回复答案:" >
          <el-select v-model="form.lastAction"  clearable filterable placeholder="请选择答案">
            <el-option
              v-for="item in answerNameList"
              :key="item.answerName"
              :label="item.answerName"
              :value="item.answerName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="回复答案:" prop="actionConfInfo.answerName" >
          <el-select v-model="form.actionConfInfo" value-key="answerName" filterable placeholder="请选择答案">
            <el-option
              v-for="item in answerNameList"
              :key="item.answerName"
              :label="item.answerName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit('form')">确定</el-button>
          </span>
    </el-dialog>

  </div>
</template>

<script>
  import {robotConfigService,informationService} from '../../service/index';
  import {stringForArray,arrayForString,arrayAddIndex} from '../../utils/commonUtil';
  import {SetCookie,getJoinCookie} from '../../utils/commonUtil';
  import {format_Date} from '../../utils/commonUtil';

  export default {
        name: "TacticsManagement",
        data(){
          return{
            listData:[],//策略列表数据源
            soltNameData:[],//词槽名称数据源
            clarifyOrderData:[],//澄清顺序数据源
            guideQuestions:[],//推荐问题数据源
            totalCount:1,
            robotName:'',
            skillRuleTitle:'',
            intentionList:[],//意图列表（谓语分类下的所有标签）
            labelCategoryList:[],//标签类别列表
            labelCategoryId:'',
            answerNameList:[],//答案列表(知识对类型的-基础知识)
            dialogFormVisible:false,
            //请求策略列表params
            tacticsListParams: {
              userId:'',
              taskId:'',//任务id 机器人id
              skillId:'',//技能id
              direction:['DESC'],//倒序 'DESC' 升序 'ASC'
              orderBy:['updateAt'],
              cp:1,
              ps:'10',
            },
            timeSort:true,//时间排序标识(升 false or 降 true)
            isNameSort:false,//是否点击列表的名称排序
            listSortClass:'listSortClass',
            skillData:{},
            headerStyle:{
              color: '#7F8FA4'
            },
            form:{
              label:{},//意图对象
              lastAction:'',//上文回复答案
              actionConfInfo:{},//回复答案对象
            },
            tacticsData:{},//策略规则对象用于编辑
            formTitle:'',
            rules: {
              "label.name": [
                {required: true, message: '请选择意图' }
              ],
              "actionConfInfo.answerName": [
                {required: true, message: '请选择答案'}
              ],
            },
          }
        },
        methods:{
          format_Time(value, row) {
            let date = new Date(value[row.property]);
            return (date && date != 'Invalid Date') ? format_Date(date) : '--';
          },
          /***************************接口请求相关的方法****************************************/
          //获取策略列表
          async getTacticsList(){
            this.showListLoading=true;
            let result = await robotConfigService.getTacticsList(this.tacticsListParams);
            if (result.message.code == 0) {
              this.showListLoading=false;
              this.listData = result.data.list;
              this.totalCount = result.data.totalCount;
              this.tacticsListParams.cp = result.data.currentPage;
              //处理推荐问题数据源(有字符串分解成数组用来展示)
              //解析出词槽名称数据源和澄清顺序数据源
              for (let i =0;i<this.listData.length;i++){
                    if (this.listData[i].guideQuestions) {
                      this.listData[i].guideQuestionsArray = this.handleGuideQuestion(this.listData[i].guideQuestions)
                    }
              }
            }

          },
          //删除策略请求
          async deleTacticsRequest(id){
            let result = await robotConfigService.deleTactics({ids:id});
            if (result.message.code == 0) {
              let target = this;
              setTimeout(function () {
                target.getTacticsList();
              }, 1250);
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
          //获取意图列表(标注平台)分两步需要
          // 1.先获取标签类别列表
          // 2.找到名称为谓语分类的id在获取下面的所有标签就是所需要的意图列表
          async getlabelcategoryList() {
            let result = await informationService.querylabelcategory({taskId: this.tacticsListParams.taskId});
            if (result.message.code == 0) {
              this.labelCategoryList = result.data.list;
              for (let i = 0;i<this.labelCategoryList.length;i++){
                if (this.labelCategoryList[i].name =='谓语分类'){
                  this.labelCategoryId = this.labelCategoryList[i].id
                  this.getLabelList()
                }

              }
            }
          },
          async getLabelList() {//获取谓语分类下的标签列表
            let result = await informationService.querylabel({taskId:this.tacticsListParams.taskId,labelTypeIds:this.labelCategoryId,ps:10000});
            if (result.message.code == 0) {
              this.intentionList = result.data.list;
            }
          },
          //获取答案列表用于添加上文回复答案和回复答案(这里之请求类型为基础知识的)
          async getAnswerList(){
            let result = await robotConfigService.getAnswerList({userId:this.tacticsListParams.userId,ps:10000,answerType:3});
            if (result.message.code == 0) {
              this.answerNameList  =  result.data.list;
            }
          },

          //新增策略(任务)
          async addTacticsRequest(params){
            let result = await robotConfigService.addTactics(params);
            if(result.message.code==0){
              this.showListLoading=false;
              this.dialogFormVisible = false
              let target = this;
              setTimeout(function () {
                target.getTacticsList()
              },1250);
              this.$message({
                showClose: true,
                message: '新建成功',
                type: 'success'
              });
            }else {
              this.$message({
                showClose: true,
                message: result.message.message,
                type: 'error'
              });
            }
          },
          //编辑策略(任务)
          async editTacticsRequest(params){
            let result = await robotConfigService.editTactics(params);
            this.dialogFormVisible = false
            if(result.message.code==0){
              this.showListLoading=false;
              let target = this;
              setTimeout(function () {
                target.getTacticsList()
              },1250);
              this.$message({
                showClose: true,
                message: '编辑成功',
                type: 'success'
              });
            }else {
              this.$message({
                showClose: true,
                message: result.message.message,
                type: 'error'
              });
            }
          },
          /***************************交互相关的方法****************************************/

          //新建策略
          addTactics(){
            // if (this.skillData.skillType===0) {
              //对话类型
              this.$router.push({path: '/addtactics',query: {
                  index:'tacticsmanagement',
                  title:this.skillData.skillName,
                  id : this.skillData.id,
                  robotName:this.robotName,
                  skillData:JSON.stringify(this.skillData)
                }});
            // }else if(this.skillData.skillType===1){
            //   //问答类型
            //   this.dialogFormVisible = true
            //   this.formTitle = '新建规则'
            //   this.getAnswerList()
            //   this.getlabelcategoryList()
            // }
          },
          //编辑策略
          editTactics(index,row){
            // if (this.skillData.skillType===0) {
              //对话类型
              this.$router.push({path: '/addtactics',query: {
                   RulesId:row.id,
                  index:'tacticsmanagement',
                  title:this.skillData.skillName,
                  id : this.skillData.id,
                  robotName:this.robotName,
                  skillData:JSON.stringify(this.skillData), //技能对象
                  tacticsData:JSON.stringify(row)   //策略对象
                }});
            // }else if(this.skillData.skillType===1){
            //   //问答类型
            //   this.dialogFormVisible = true
            //   this.formTitle = '编辑规则'
            //   this.tacticsData = row
            //   this.form.label = this.tacticsData.label
            //   this.form.lastAction = this.tacticsData.lastAction
            //   this.form.actionConfInfo = this.tacticsData.actionConfInfo
            //   this.getAnswerList()
            //   this.getlabelcategoryList()
            // }
          },
          //删除策略
          deleteTactics(index,row){
            var text = '确认删除该规则吗?'
            this.$confirm(text, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //点击确定
              this.deleTacticsRequest(row.id);
            }).catch(() => {
              //点击取消
            });

          },
          //点击确定(问答类型新建和编辑规则)
          onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                let tactics=[];//最终提交的策略
                let obj ={};
                obj.lastAction = this.form.lastAction
                obj.actionConfInfo = this.form.actionConfInfo
                obj.preview ='test'
                obj.label = this.form.label
                obj.skillId = this.skillData.id
                obj.taskId =  this.skillData.task.id
                // if (this.showWordSoltWarningStr == false){
                if(this.formTitle == "新建规则" ){
                  tactics.push(obj)
                  this.addTacticsRequest(tactics)
                }else if(this.formTitle == "编辑规则") {
                  obj.id = this.tacticsData.id
                  tactics.push(obj)
                  this.editTacticsRequest(tactics)
                }

              } else {
                return false;
              }
            });
          },
          //意图名称排序方法
          sortChange(sortObj){
           if(sortObj.prop==='label.name'){
              this.isNameSort = true
             //按名称排序
             this.tacticsListParams.orderBy = ['label.name']

             if(sortObj.order==='ascending'){
               //升序
               this.tacticsListParams.direction = ['ASC']
             }else if(sortObj.order==='descending'){
               //降序
               this.tacticsListParams.direction = ['DESC']

             }else {
               this.tacticsListParams.orderBy = ['updateAt']
               this.tacticsListParams.direction = ['ASC']
             }
             this.getTacticsList()

           }
          },
          //时间排序方法
          updataTimeSort(){
            this.sortChange({order:null})
            this.isNameSort = false
            this.timeSort = !this.timeSort
            this.tacticsListParams.orderBy = ['updateAt']
            if(this.timeSort){
              //倒序
              this.tacticsListParams.direction = ['DESC']
            }else {
              //升序
              this.tacticsListParams.direction = ['ASC']
            }
            this.getTacticsList()

          },
          //点击分页
          pageChange(page) {
            this.tacticsListParams.cp = page;
            this.getTacticsList();
          },
          //处理引导问题字段
          handleGuideQuestion(guideQuestion){
            let array = arrayForString(guideQuestion,"^_^")
            return arrayAddIndex(array)
          },
          //弹窗关闭的回调
          close(){
            //关闭是清空数据
            this.form.lastAction = ''
            this.form.label = {}
            this.form.actionConfInfo = {}
            this.$refs['form'].resetFields()

          },


        },//methods

        created: function () {
          this.tacticsListParams.userId=getJoinCookie('userId');

          if(this.$route.query.skillData){
            this.skillData  = JSON.parse(this.$route.query.skillData)
            this.tacticsListParams.skillId = this.skillData.id
            this.tacticsListParams.taskId = this.skillData.task.id
            this.robotName = this.$route.query.robotName
            if(this.skillData.skillType===0){
              this.skillRuleTitle='问答规则管理'
            }else {
              this.skillRuleTitle='问答规则管理'
            }
          }
          this.getTacticsList()
        },
        mounted:function () {
        },

    }
</script>

<style scoped>
  .breadcrumb{
    background-color: #fff;
    height: 45px;
    padding-left: 20px;
    line-height: 45px;
    text-align: center;
  }
  .tableList{
    margin-left: 20px;
    margin-right: 20px;
  }
 .dialogTable ul,
 .dialogTable li{
    list-style:none;
    margin:0px;
    padding:0px;
  }
  .guideQuestion{
    display: inline-block;
    white-space: nowrap;
    width: 180px;
    overflow: hidden;
    text-overflow:ellipsis;

  }
  .elButtonEdit,
  .elButtonDele
  {
    padding: 4px 8px;


  }
  .elButtonDele{
    background-color: red;
    border: none;
  }
  .listSortClass >>> .el-table .ascending .sort-caret.ascending {
    border-bottom-color:#C0C4CC;

  }
  .listSortClass >>>.el-table .descending .sort-caret.descending {
    border-top-color: #C0C4CC;
  }


</style>
