<template>
    <!--数据统计-->
  <el-container>
    <el-header style="padding: 0px">
      <robotHeader></robotHeader>
    </el-header>
    <div class="container">
      <el-row style="margin-bottom: 30px">
        <el-row type="flex" justify="space-around" style="padding-bottom: 15px">
          <el-col align="left">
            <span style="font-size: 18px;position: relative;top: -2px;margin-right: 20px">机器人整体统计</span>
            <el-date-picker
              style="height: 37px;margin-top: 5px"
              v-model="dateValue"
              value-format="timestamp"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button size="small" type="success" style="margin-left: 20px;position: relative;top: -4px;" @click="queryStatistics">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="background: white" class="tabClass">
          <el-tabs v-model="activeTabName" type="card" @tab-click="tabHandleClick">
            <el-tab-pane label="全部" name="全部"></el-tab-pane>
            <el-tab-pane
              v-for="(item, index) in robotList"
              :key="item.name"
              :label="item.name"
              :name="item.name"
            >
            </el-tab-pane>
            <el-row class="tabsContent" >
             <el-row v-loading="loading">
               <el-row >
                 <el-row class="indexTitle">
                   <span>关键指标</span>
                 </el-row>
                 <el-row class="keyIndicators">
                   <el-col :span="8">
                     <div class="keyIndicatorsItem">
                       <div class="indicatorsTitle">提问用户总数</div>
                       <div class="indicatorsValue">{{robotStatisticData.userNumber}}
                         <span style="font-size: 14px;font-weight: normal;margin-left: -5px;color: #909399">
                         人
                       </span>
                       </div>
                     </div>
                   </el-col>
                   <el-col :span="8">
                     <div class="keyIndicatorsItemCenter">
                       <div class="indicatorsTitle">问题总数</div>
                       <div class="indicatorsValue">{{robotStatisticData.totalNumber}}</div>
                     </div>
                   </el-col>
                   <el-col :span="8">
                     <div class="keyIndicatorsItem">
                       <div class="indicatorsTitle">无法回复问题</div>
                       <div class="indicatorsValue">{{robotStatisticData.noAnswerNumber}}</div>
                     </div>
                   </el-col>
                 </el-row>
               </el-row>

               <el-row >
                 <el-row class="indexTitle">
                   <span>回复质量数据</span>
                 </el-row>
                 <el-row class="keyIndicators">
                   <el-col :span="8">
                     <div class="keyIndicatorsItem">
                       <div class="indicatorsTitle">回复问题总数</div>
                       <div class="indicatorsValue">{{robotStatisticData.feedbackNumber}}
                         <!--<span style="font-size: 14px;font-weight: normal;margin-left: -5px;color: #909399">-->
                         <!--人-->
                       <!--</span>-->
                       </div>
                     </div>
                   </el-col>
                   <el-col :span="8">
                     <div class="keyIndicatorsItemCenter">
                       <div class="indicatorsTitle">获"赞"总数</div>
                       <div class="indicatorsValue">{{robotStatisticData.feedbackGoodNumber}}</div>
                     </div>
                   </el-col>
                   <el-col :span="8">
                     <div class="keyIndicatorsItem">
                       <div class="indicatorsTitle">获"踩"总数</div>
                       <div class="indicatorsValue">{{robotStatisticData.feedbackBadNumber}}</div>
                     </div>
                   </el-col>
                 </el-row>
               </el-row>

             </el-row>

              <div class="rxh_tab" style="border-left: #409EFF 5px solid">
                <a @click="answerStatistics" :class="qaIndexIsSeclect?selectQaClass:noSelectQaClass">答案选择</a>
                <a @click="questonStatistics"  :class="qaIndexIsSeclect?noSelectQaClass:selectQaClass">问题选择</a>
              </div>
              <el-row class="qaTab" v-loading="tabLoading">
                <el-table  :data="listData"   :header-cell-style="headerStyle">
                  <el-table-column  label="答案类别" :prop="qaIndexIsSeclect?'robotActionName':'robotPredicateLabel'" align="left"   ></el-table-column>
                  <el-table-column  sortable  label="出现次数" prop="totalNumber" align="center"></el-table-column>
                  <el-table-column  sortable  label="点击操作" prop="fixNumber" align="center" ></el-table-column>
                  <el-table-column  sortable  label="手动操作(文字或语音输入)" prop="freeNumber" align="center" ></el-table-column>
                </el-table>
              </el-row>
            </el-row>
          </el-tabs>
        </el-row>


      </el-row>
    </div>
  </el-container>
</template>

<script>
  import {robotConfigService} from '../../service/index';
  import robotHeader from '../../components/robotConfig/RobotConfigHeader';
  import {SetCookie,getJoinCookie,getCurrentTemplateAnswerHost,getTemplatePlatformHost} from '../../utils/commonUtil';
    export default {
        name: "datastatistics",
        components: {
          robotHeader,
        },
        data(){
          return{
            // dateValue:[new Date().getTime() - 3600 * 1000 * 24,new Date().getTime()],//日期默认为一天（现在到昨天的这个时刻）
            dateValue:[new Date(new Date().toLocaleDateString()).getTime(),new Date(new Date().toLocaleDateString()).getTime()+(3600 * 1000 * 24)],//都从时间的0点
            activeTabName:'全部',//默认选择全部
            robotList:[],
            //答疑标签切换
            qaIndexIsSeclect:true,
            selectQaClass:'selectQaClass',
            noSelectQaClass:'noSelectQaClass',
            listData:[],//答案统计和问题统计的list
            headerStyle:{
              color: '#7F8FA4',
              padding: '0',
              height:"50px",

            },
            robotListModel:{
              userId:'',
              taskType:'DIALOGUE',
              orderBy:'createAt',
              cp:1,
              ps:1000,
            },
            //关键指标和回复数量问题请求model
            robotStatisticModel:{
                robotUserId:'',
                robotId:'',
                startAt:new Date().getTime() - 3600 * 1000 * 24,
                endAt:new Date().getTime(),
            },
            robotStatisticData:{},
            loading:true,
            tabLoading:true,
            //答案问题
            qaStatisticModel:{
              robotUserId:'',
              robotId:'',
              startAt:new Date().getTime() - 3600 * 1000 * 24,
              endAt:new Date().getTime(),
              groupBy:'robotActionId'//分组统计：问题-robotPredicateLabelId,答案-robotActionId

            },

          }
        },
        methods:{
          /******************************接口相关的请求************************************/
          //获取机器人列表请求
          async getRobotList() {
            this.loading = true
            let result = await robotConfigService.getRobotList(this.robotListModel);
            this.loading = false
            if (result.message.code == 0) {
              this.robotList = result.data.list;
            }
          },
          //获取关键指标和回复数量问题的统计
          async getRobotStatisticRequest(){
            this.loading = true
            let result = await robotConfigService.getRobotStatistic(this.robotStatisticModel);
            this.loading = false
            if (result.message.code == 0) {
                this.robotStatisticData = result.data
            }
            //请求下方 答案选择 问题选择统计
            this.getQAStatisticRequest()
          },
          //获取下方答案和问题的统计数据
          async getQAStatisticRequest(){
            this.tabLoading = true
            let result = await robotConfigService.getStatisticsQA(this.qaStatisticModel);
            this.tabLoading = false
            if (result.message.code == 0) {
              this.listData = result.data
              /*在数组的第一位添加对象数据*/
              if(this.qaStatisticModel.groupBy==='robotActionId'){
                //答案统计
                this.listData.unshift({
                  robotActionName:'所有答案',
                  totalNumber:this.robotStatisticData.totalNumber,
                  fixNumber:this.robotStatisticData.fixNumber,
                  freeNumber:this.robotStatisticData.freeNumber
                })

              }else if(this.qaStatisticModel.groupBy==='robotPredicateLabelId'){
                //问题统计
                this.listData.unshift({
                  robotPredicateLabel:'所有问题',
                  totalNumber:this.robotStatisticData.totalNumber,
                  fixNumber:this.robotStatisticData.fixNumber,
                  freeNumber:this.robotStatisticData.freeNumber
                })
              }

            }
          },

          //查询
          queryStatistics(){
            debugger
            this.robotStatisticModel.startAt = this.dateValue[0]
            this.robotStatisticModel.endAt = this.dateValue[1]
            this.qaStatisticModel.startAt = this.dateValue[0]
            this.qaStatisticModel.endAt = this.dateValue[1]
            this.getRobotStatisticRequest()
            // this.getQAStatisticRequest()
          },
          //
          tabHandleClick(tab){
            if(tab.name === '全部'){
              this.robotStatisticModel.robotId =''
              this.qaStatisticModel.robotId =''

            }else {
              let index = tab.index-1 //因为要减去 全部这个tab
              let robot = this.robotList[index]
              this.robotStatisticModel.robotId =robot.id
              this.qaStatisticModel.robotId =robot.id

            }
            this.getRobotStatisticRequest()
            // this.getQAStatisticRequest()

          },
          //答案统计
          answerStatistics(){
            this.qaIndexIsSeclect=true
            this.qaStatisticModel.groupBy = 'robotActionId'
            this.getQAStatisticRequest()


          },
          //问题统计
          questonStatistics(){
            this.qaIndexIsSeclect=false
            this.qaStatisticModel.groupBy = 'robotPredicateLabelId'
            this.getQAStatisticRequest()

          },
          //排序方法
        //   sortChange(sortObj){
        //     if(sortObj.prop==='label.name'){
        //       // //按名称排序
        //       // this.tacticsListParams.orderBy = ['label.name']
        //       //
        //       // if(sortObj.order==='ascending'){
        //       //   //升序
        //       //   this.tacticsListParams.direction = ['ASC']
        //       // }else if(sortObj.order==='descending'){
        //       //   //降序
        //       //   this.tacticsListParams.direction = ['DESC']
        //       //
        //       // }else {
        //       //   this.tacticsListParams.orderBy = ['updateAt']
        //       //   this.tacticsListParams.direction = ['ASC']
        //       // }
        //       // this.getTacticsList()
        //
        //     }
        //   },
        },
        created:function(){
          this.robotListModel.userId=getJoinCookie('userId');
          this.robotStatisticModel.robotUserId = getJoinCookie('userId');
          this.qaStatisticModel.robotUserId = getJoinCookie('userId');
        },
        mounted:function () {
          //请求机器人列表
          this.getRobotList()
          //请求上方数据请求接口
          this.getRobotStatisticRequest()
        },



    }
</script>

<style scoped>
  .container {
    width: 100%;
    padding-top: 27px;
    padding-left: 30px;
    padding-right: 30px;
    box-sizing: border-box;
  }
  .indexTitle{
    /*background: #3a8ee6;*/
    margin: 20px;
    padding-left: 10px;
    border-left:5px solid #409EFF;
    font-size: 14px;
    font-weight: bold;
  }

  .tabsContent{
    border-left:1px solid #E4E7ED;
    border-bottom:1px solid #E4E7ED;
    border-right:1px solid #E4E7ED ;

  }
  .tabClass >>> .el-tabs__item {
    padding: 0 20px;
    height: 50px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 50px;
    display: inline-block;
    list-style: none;
    font-size: 15px;
    font-weight: 500;
    color: #303133;
    position: relative;
  }
  .tabClass >>> .el-tabs__item.is-active {
    color: #409EFF;
  }
  .tabClass >>> .el-tabs__item:hover {
    color: #409EFF;
    cursor: pointer;
  }
  .tabClass >>> .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0px;
  }
  .keyIndicators{
    margin: 0 20px 20px 20px;
    border:1px solid #E4E7ED;
    border-radius: 10px;
  }
  .keyIndicatorsItem{
    height: 150px;
  }
  .keyIndicatorsItemCenter{
    border-left:1px solid #E4E7ED;
    border-right:1px solid #E4E7ED ;
    height: 150px;
  }
  .indicatorsTitle{
    padding-top: 50px;
    text-align: center;
    color: #909399;
  }
  .indicatorsValue{
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }
  /* 答案 问题统计切换 */
  .rxh_tab{
    display:-moz-flex;
    display:-webkit-flex;
    display:flex;
    align-items: center;
    /*justify-content: flex-end;*/
    text-align: right;
    margin-bottom: 12px;
    margin-top: 20px;
    margin-left: 20px;
    height: 23px;
  }

  .selectQaClass{
    color: #409EFF;
    font-weight: bold;
  }
  .noSelectQaClass{
    color: black;
  }
  .rxh_tab a{ padding: 0 6px; margin-left: 10px; line-height: 30px\9; height: 30px\9; display: inline-block\9;}
  .rxh_tab a:hover{ color: #409EFF;}
  .qaTab{
    margin:20px;
    background: #5daf34;
  }

</style>
