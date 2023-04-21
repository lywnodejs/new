<template>

  <el-container>
    <el-header style="padding: 0px">
      <robotHeader></robotHeader>
    </el-header>
    <div class="myRobot" v-loading="loading">
      <!--新增机器人-->
      <el-col :span="8" class=" elrow" >
        <el-card  :body-style="{ padding: '0px'}" class="box-card" >
          <div @click="addRobot">
            + 新增机器人
          </div>

        </el-card>
      </el-col>
      <!--机器人列表-->
      <el-col :span="8" class="elrow" v-for="(item,index) of listData" :key = "index">
        <robotView
          v-bind:itemData="item"
          @editRobot="editRobot($event)"
          @deleteRobot = "deleteRobot($event)"
          @robotSet = "robotSet($event)"
          @takeEffectTest ="takeEffectTest($event)"
          @takeEffectProduction ="takeEffectProduction($event)"
          @homequestion ="homequestion($event)"
          @toSkill="toSkill($event)">
        </robotView>
      </el-col>
      <!--分页选择器-->
      <el-col type="flex" justify="center" style="padding-bottom: 30px">
        <el-pagination align="center"
                       :current-page.sync= "robotListModel.cp"
                       :page-size="robotListModel.ps"
                       :total="totalCount"
                       class="pagination"
                       layout="total, prev, pager, next, jumper"
                       @current-change="pageChange"
        >
        </el-pagination>
      </el-col>
      <!--新建机器人和编辑机器人弹窗-->
      <el-dialog  :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="close()" custom-class="dialogClass" >
        <div slot="title">{{formTitle}}</div>
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="名称:" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="描述:" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" autocomplete="off" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item v-if="showCopyRobot" label="复制已有机器人:" :label-width="formLabelWidth">
            <el-select v-if="!showEdit" clearable v-model="form.copyRobotId" placeholder="请选择机器人" @change="selectRobot">
              <el-option
                v-for="item in listData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span v-if="showEdit">{{copyRobotName}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog custom-class="loadingDialog" :close-on-click-modal="false" :visible.sync="loadingDialogFormVisible"   width="40%">
      <el-row style="width: 100%;height: 126px" type="flex" justify="center">
        <el-col class="loadingClass" style="width: 126px;height: 126px;font-size: 50px"
                 v-loading="testingloading"
                 element-loading-spinner="el-icon-loading"
        >
          <!--<el-progress type="circle"  :percentage="progressValue"></el-progress>-->
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <span>{{loadingmessage}}</span>
      </el-row>
    </el-dialog>
    <el-dialog  custom-class="customDialog" :close-on-click-modal="false" :visible.sync="testRobotDialogFormVisible"  width="70%"  >
      <div >
        <div style="text-align: center">
          <img class="robotImage"  style="width: 48px; height: 48px; border-radius:50%;" :src="url"/>
          <span style="display: block;line-height: 20px;font-size: 12px;color:#7F8FA4">机器人ID: {{robotId}}</span>

        </div>
        <iframe  :src="testUrl" height="500" width="100%"></iframe>
      </div>
    </el-dialog>
    <robotSeting ref="robotSeting" :dialogVisible="createrobotSeting" :robotData="robotData" @closeDialog="closeRobotSetingDialog"></robotSeting>
  </el-container>

</template>

<script>
  import robotView from "../../components/robotConfig/RobotView"
  import {robotConfigService} from '../../service/index';
  import robotHeader from '../../components/robotConfig/RobotConfigHeader';
  import {SetCookie,getJoinCookie,getCurrentPreViewHost} from '../../utils/commonUtil';
  import robotSeting from '../../components/robotConfig/RobotSetting';


  export default {
        name: "myRobot",

      data() {
        return {
          listData:[],
          loading:false,
          userName:'',
          robotName:'',
          robotId:'',
          robotData:'',
          url: require('../../assets/images/robotLogo.png'),
          loadingDialogFormVisible:false,
          testingloading:false,
          testUrl:'',
          loadingmessage:'',
          //获取机器人列表的params
          robotListModel:{
            userId:'',
            taskType:'DIALOGUE',
            orderBy:'createAt',
            cp:1,
            ps:8,

          },
          //获取某个机器人的信息
          robotInfoModel:{
            userId:'',
            taskType:'DIALOGUE',
            ids:'',

          },
          totalCount:1,
          //新增机器人请求params
          addRobotModel:{
            userId:'',
            name:"",
            taskDesc:"",
            taskType:"DIALOGUE",
            copyTaskId:"",

          },
          //编辑机器人请求parmas
          editRobotModel: {
            userId:'',
            name:"",
            taskDesc:"",
            taskType:"DIALOGUE",
            copyTaskId:"",
            id:'',
          },
          //弹窗中的值
          form: {
            name: '',
            desc: '',
            copyRobotId:'',
          },
          dialogFormVisible: false,
          testRobotDialogFormVisible:false,
          formLabelWidth: '120px',
          formTitle:'',
          showEdit:false,
          copyRobotName:'',
          showCopyRobot:true,
          isTestingTakesEffect:true,//是点击的测试生效还是发布生产
          rules: {
            name: [
              {required: true, message: '请输入名称', trigger: 'blur'}
            ],
          },
          createrobotSeting:false
        }
      },
      components:{
        robotView,
        robotHeader,
        robotSeting
      },
      methods:{

       /************************请求接口方法*******************************/

        //获取机器人列表请求
        async getRobotList() {
          this.loading = true
          let result = await robotConfigService.getRobotList(this.robotListModel);
          this.loading = false
         if (result.message.code == 0) {
            this.listData = result.data.list;
            this.totalCount = result.data.totalCount;
            this.robotListModel.cp = result.data.currentPage;
          }
        },
        //删除机器人请求
        async deleRobotRequest(robotId) {
          this.loading = true
          let result = await robotConfigService.deleRobot({ids:robotId});
          this.loading = false
          if (result.message.code == 0) {
            let target = this;
            setTimeout(function () {
              target.getRobotList();
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
        //新增机器人请求
        async addRobotRequest(){
          let result = await robotConfigService.addRobot(this.addRobotModel);
          this.loadingDialogFormVisible = false
          this.testingloading = false
          if (result.message.code == 0) {
            let target = this;
            setTimeout(function () {
              target.getRobotList();
            },1250);
            this.$message({
              showClose: true,
              message: '创建成功',
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
        //编辑机器人请求
        async editRobotRequest(){
          let result = await robotConfigService.editRobot(this.editRobotModel);
          this.loadingDialogFormVisible = false
          this.testingloading = false
          if (result.message.code == 0) {
            let target = this;
            setTimeout(function () {
              target.getRobotList();
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
        //请求该机器人复制的机器人名称
        async getRobotInfo() {
          let result = await robotConfigService.getRobotList(this.robotInfoModel);
          if (result.message.code == 0) {
            let copyRobotList = []
            copyRobotList = result.data.list
            if (copyRobotList.length>0){
              this.copyRobotName = result.data.list[0].name
              this.showCopyRobot = true
            } else {
              this.showCopyRobot = false

            }
          }
        },
        //立即生效(刷缓存接口)
        async robotCacheRequest(params) {
          this.testingloading = true
          let result = await robotConfigService.dialogueCache(params);
          this.loadingDialogFormVisible = false
          if (result.message.code == 0) {
            let target = this;
              if (target.isTestingTakesEffect) {
                setTimeout(function () {
                let host = getCurrentPreViewHost()
                target.confUserName = getJoinCookie('userName')
                target.testUrl = host + '?appKey='+target.confUserName+'&robotId='+target.robotId+'&preview=test'
                target.testRobotDialogFormVisible = true
                this.testingloading = false
                }, 1000);
              }
            if (!target.isTestingTakesEffect) {
              this.testingloading = false
              this.$message({
                 showClose: true,
                 message: '已生效',
                 type: 'success'
               });
            }
          } else {
            this.testingloading = false
            this.$message({
              showClose: true,
              message:'请求超时',
              type: 'error'
            });
          }
        },
        /************************交互方法*******************************/

       //新增产品
        addRobot(){
          this.dialogFormVisible=true
          this.formTitle = '新增机器人'
          this.form.name = ''
          this.form.desc = ''
          this.form.copyRobotId = ''
          this.showEdit = false
          this.showCopyRobot = true

        },
        //编辑产品
        editRobot:function(robotData){
          //弹出编辑弹窗
          this.dialogFormVisible=true
          this.formTitle = '编辑机器人'
          this.form.name = robotData.name
          this.form.desc = robotData.taskDesc
          this.form.copyRobotId = robotData.copyTaskId
          this.editRobotModel.id = robotData.id
          this.showEdit = true
          this.robotInfoModel.ids = robotData.copyTaskId
          this.getRobotInfo()
        },
        //机器人配置logo 昵称等
        robotSet(robotData){
          this.createrobotSeting = true
          this.robotData = robotData
          this.$refs.robotSeting.setDialogVisibleWithBool( this.createrobotSeting)
          this.$refs.robotSeting.getRobotConfigInfo(this.robotData.id)

        },
        closeRobotSetingDialog(){
          this.createrobotSeting = false

        },
        //新增和编辑的提交
        submit(form){

          this.$refs[form].validate((valid) => {
            if (valid) {
              this.dialogFormVisible = false
              if(this.formTitle =='新增机器人'){
                this.addRobotModel.name = this.form.name
                this.addRobotModel.taskDesc = this.form.desc
                this.addRobotModel.copyTaskId = this.form.copyRobotId
                if (this.addRobotModel.copyTaskId) {
                  this.loadingDialogFormVisible = true //loading 显示
                  this.loadingmessage = '正在复制机器人,请耐心等待.....'
                  this.testingloading = true
                }
                this.addRobotRequest();
              }else if(this.formTitle =='编辑机器人'){
                this.editRobotModel.name =this.form.name
                this.editRobotModel.taskDesc = this.form.desc
                this.editRobotModel.copyTaskId = this.form.copyRobotId
                if (this.editRobotModel.copyTaskId) {
                  this.loadingDialogFormVisible = true //loading 显示
                  this.loadingmessage = '正在复制机器人,请耐心等待.....'
                  this.testingloading = true
                }
                this.editRobotRequest();
              }

            } else {
              return false;
            }
          });



        },
        //删除产品
        deleteRobot:function(robotData){
          var text = '机器人删除后不可恢复,所有与其相关的信息都将删除.你确定要删除'+robotData.name+'吗?'
          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
             //点击确定
            this.deleRobotRequest(robotData.id);
          }).catch(() => {
             //点击取消
          });

        },
        //跳转到技能列表页
        toSkill(robotData){
          this.$router.push({path: '/skillhome',
            query: {
              robotName:robotData.name,
              robotId:robotData.id,
            }
          });
        },
        //跳转首页问题
        homequestion(robotData){
          this.$router.push({path: '/homequestioncategory'});
        },
        //生效测试
        takeEffectTest(robotData){
          this.isTestingTakesEffect = true
          this.loadingDialogFormVisible = true //loading 显示
          this.loadingmessage = '正在发布测试,请耐心等待.....'
          let params = {}
          params.confUserId = this.robotListModel.userId
          params.preview = 'test'
          params.robotId = robotData.id
          this.robotName = robotData.name
          this.robotId = robotData.id
          this.robotCacheRequest(params)
        },
        //发布线上
        takeEffectProduction(robotData){
          this.isTestingTakesEffect = false
          this.loadingDialogFormVisible = true //loading 显示
          this.loadingmessage = '正在发布生产,请耐心等待.....'
          let params = {}
          params.confUserId = this.robotListModel.userId
          params.preview = 'production'
          params.robotId = robotData.id
          this.robotCacheRequest(params)
        },
        //选择复制机器人的回调
        selectRobot(copyRobotId){
        },
        //点击分页
        pageChange(page) {
          this.robotListModel.cp = page;
          this.getRobotList();
        },
        //弹窗关闭的回调
        close(){
          //关闭是清空数据
          this.$refs['form'].resetFields()

        },
      },//methods

      created: function () {
        this.robotListModel.userId=getJoinCookie('userId');
        this.robotInfoModel.userId=getJoinCookie('userId');
        this.addRobotModel.userId=getJoinCookie('userId');
        this.editRobotModel.userId=getJoinCookie('userId');
        this.userName=getJoinCookie('userName');
        this.getRobotList();
      },
    //组件内守卫
      // beforeRouteEnter(to, from, next){
      //     let userId = getJoinCookie('userId')
      //     if (!userId) {
      //       next({path:'/login',query:{taskType:'dialogue'}})
      //     }else {
      //       next()
      //     }
      //
      // },

    }
</script>

<style scoped>

  .myRobot {
    /*background: red;*/
    padding-left: 100px;
    padding-right: 100px;
    margin-top: 30px;
    height: 100%;
  }

  .elrow{
    padding-right:10px;
    padding-left: 10px;
    padding-bottom:30px;
  }
  .box-card{
    height: 200px;
    border:1px dashed #D9D9D9;
    text-align: center;
    line-height: 200px;
    font-size: 18px;
    color: #8C8C8C;
  }
  iframe{
    border-width: 0px;
  }
  .loadingClass >>> .el-loading-spinner{
    margin-top: -40px;
  }

</style>

