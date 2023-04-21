<template>

  <el-container>
    <el-header style="padding: 0px">
      <robotHeader></robotHeader>
    </el-header>
    <div class="container">
      <!--答案列表表-->
      <el-row>
        <el-row type="flex" justify="space-around" style="padding-bottom: 15px">
          <el-col align="left">
            <span style="font-size: 18px;position: relative;top: 3px;">答案配置</span>
            <el-button size="small" type="success" style="margin-left: 20px" @click="AddAnswer()">新建答案</el-button>
          </el-col>
        </el-row>
        <el-table :data="listData" stripe v-loading="showListLoading" style="width: 100% "
                  :header-cell-style="headerStyle">
          <el-table-column align="center" width="100" label="答案id" prop="id"></el-table-column>
          <el-table-column width="300" label="答案名称" prop="answerName" align="left"></el-table-column>
          <el-table-column width="200" label="类型" align="left" prop="answerType"></el-table-column>
          <el-table-column label="无数据处理" prop="noAnswerLanguage" align="left"></el-table-column>
          <el-table-column width="180" label="操作" align="center" resizeable="false">

            <template slot-scope="scope">
              <el-row type="flex" style="margin-left: 35px">
                <el-button class="elButtonEdit" type="primary" size="mini" @click="editAswer(scope.$index, scope.row)">
                  编辑
                </el-button>
                <el-button class="elButtonDele" type="danger" size="mini" @click="deleteAswer(scope.$index, scope.row)">
                  删除
                </el-button>
              </el-row>
            </template>

          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" class="zoom-pagi" style="padding-top: 30px;padding-bottom: 30px">
          <el-col type="flex" justify="center">
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
        </el-row>
      </el-row>

      <!--新建答案和编辑答案弹窗-->
      <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="close()" width="50%"
                 custom-class="dialogClass">
        <div slot="title">{{formTitle}}</div>
        <el-form :model="form" :rules="rules" ref="form" label-width="110px" class="demo-ruleForm">
          <el-form-item label="答案类型:" prop="radio">
            <el-select v-model="form.radio" placeholder="请选择答案类型" @change="changeAnswerType">
              <el-option
                v-for="item in answerTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="this.form.radio!==1" label="答案名称:" prop="answerName">
            <el-input v-model="form.answerName"  placeholder="请输入名称"></el-input>
          </el-form-item>

          <el-form-item v-else label="答案名称:" prop="templateAnswerName.reportName">
            <el-select style="margin-right: 10px" v-model="form.templateAnswerName" @change="anwserChange"
                       value-key="id" filterable placeholder="选择答案名称">
              <el-option
                v-for="item in templateAnswers"
                :key="item.id"
                :label="item.reportName"
                :value="item">
              </el-option>
            </el-select>
            <template v-if="form.templateAnswerName.reportName">
              <el-button type="text" @click="answerPreView(form.templateAnswerName)">答案预览</el-button>
              <el-button type="text" @click="toTemplatePlatform">配置新答案</el-button>
            </template>
          </el-form-item>
          <span v-if="repeat" style="color: red;font-size: 12px">该答案已被配置</span>
          <el-form-item label="无数据时话术" label-width="110px" prop="unusualMsg">
            <el-input type="textarea" v-model="form.unusualMsg" placeholder="请输入话术"></el-input>
          </el-form-item>
          <!--答案配置中心特有-->
          <template v-if="this.form.radio===1">
            <!--答案参数-->
            <el-form-item class="answerInfo" label="答案参数:">
              <answerParamsConfig :isInputOrSelect='false' :slotAttributeValues="slotAttributeValues"
                                  :answerParameList="templateAnswerParameList"></answerParamsConfig>
            </el-form-item>
            <el-form-item label="引导语">
              <el-input v-model="templateAnswer.guideLanguage" placeholder="请输入引导语"></el-input>
            </el-form-item>
          </template>
          <!--第三方跳转特有-->
          <template v-if="this.form.radio===4">
            <el-form-item label="跳转类型:" label-width="110px" required>
              <el-radio-group v-model="threePartyJump.jumpType" size="mini">
                <el-radio-button label="原生页面"></el-radio-button>
                <el-radio-button label="H5页面"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="答案地址:">
              <el-input v-model="threePartyJump.address" placeholder="请输入地址"></el-input>
            </el-form-item>
            <el-form-item label="功能页面:">
              <el-input v-model="threePartyJump.functionPage" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item class="loginclass" label="是否登录:">
              <el-checkbox v-model="threePartyJump.islogin">登录</el-checkbox>
            </el-form-item>
            <el-form-item label="跳转协议:">
              <el-input v-model="threePartyJump.jumpProtocol" placeholder="请输入协议"></el-input>
            </el-form-item>
            <!--答案参数-->
            <el-form-item class="answerInfo" label="答案参数:">
              <answerJumpParamsConfig :answerParameList="threeJumpAnswerParameList"></answerJumpParamsConfig>
            </el-form-item>
            <el-form-item label="引导语:">
              <el-input v-model="threePartyJump.guideLanguage" placeholder="请输入引导语"></el-input>
            </el-form-item>
          </template>
          <!--文本答案特有-->
          <template v-if="this.form.radio===2">
            <el-form-item label="答案内容:">
              <el-input type="textarea" v-model="textAnswer.textContent" placeholder="请输入答案"></el-input>
            </el-form-item>
            <el-form-item class="answeItem" label="虚拟人答案" >
              <el-checkbox v-model="textChecked"></el-checkbox>
              <el-button v-if="textChecked" type="text" style="margin-left: 20px" @click="isActionConfig = true">插入动作</el-button>
              <span v-if="!textChecked" style="font-size: 10px;color:darkgrey;margin-left: 10px">(配置虚拟人可选择此项)</span>
              <span v-if="textChecked" style="font-size: 10px;color:darkgrey">(可在对应的文本位置加入动作)</span>
              <el-input
                id='textInput'
                v-if="textChecked"
                class="answerClass"
                :rows="4"
                type="textarea"
                placeholder="请输入虚拟人答案"
                maxlength="5000"
                show-word-limit
                v-model="textAnswer.virtualHumanContent"
              ></el-input>
            </el-form-item>
            <el-form-item label="引导语:">
              <el-input v-model="textAnswer.guideLanguage" placeholder="请输入引导语"></el-input>
            </el-form-item>
          </template>
          <!--基础知识特有-->
          <el-form-item v-if="this.form.radio===3" label-width="120px" class="threshold" label="答案阈值设置:" required>
            <el-tooltip placement="top">
              <div slot="content">
                问答阈值设置说明---相似度原理<br/>1.一看相似,二看该词在文档里出现频次,<br/>&nbsp&nbsp&nbsp&nbsp如果频次很高就得分低,频次低得分高<br/>2.共有字符算法:问的问题和匹配语料的共有字符.
              </div>
              <span class="tipsDiv">?</span>
            </el-tooltip>
            <el-row>
              <el-input-number class="inputNum2" v-model="sliderValueRight" size="mini" @change="handleChange2" :min="0"
                               :max="100"></el-input-number>
              <!--此处的滑块用的是Ant Design Vue中的控件因为element无法满足 后来发现用计算属性可以控制故去掉了ant design组件库-->
              <!--<a-slider class="slider" v-model="sliderValue" range :step="1" :autoFocus="true" :defaultValue="[20, 50]" @change="onChange"/>-->
              <el-slider
                v-model="sliderValue"
                @input="onChange"
                range
                :show-tooltip="false"
                :max="100">
              </el-slider>
              <div style="line-height: 8px">
                <span style="color:#707070;font-size: 8px">0</span>
                <span style="display: inline-block;float: right;color:#707070;font-size: 8px">100</span>
              </div>
              <el-row>
                <el-input-number class="inputNum1" v-model="sliderValueleft" size="mini" @change="handleChange1"
                                 :min="0" :max="100"></el-input-number>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-radio-group v-model="matchingradio" size="mini" @change="matchingChange">
                  <el-radio-button label="低匹配率"></el-radio-button>
                  <el-radio-button label="中匹配率"></el-radio-button>
                  <el-radio-button label="高匹配率"></el-radio-button>
                </el-radio-group>
              </el-row>
              <el-row>
                <div style="line-height: 15px;font-size: 12px;color: #707070">{{thresholdMsg}}</div>
              </el-row>
              <el-row style="margin-top: 20px">
                <span>引导语:</span>
                <el-input style="width: 370px;height: 20px" v-if="matchingradio==='低匹配率'"
                          v-model="lowMatchingRate.guidanceMsg" placeholder="请输入引导语"></el-input>
                <el-input style="width: 370px" v-if="matchingradio==='中匹配率'" v-model="mediumMatchingRate.guidanceMsg"
                          placeholder="请输入引导语"></el-input>
                <el-input style="width: 370px" v-if="matchingradio==='高匹配率'" v-model="highMatchingRate.guidanceMsg"
                          placeholder="请输入引导语"></el-input>
              </el-row>
              <el-row style="margin-top: 20px">
                <span>推荐问题数量:</span>
                <el-select class="recommendSelect" style="width: 70px" v-if="matchingradio==='低匹配率'"
                           v-model="lowMatchingRate.recommendationNum">
                  <el-option
                    v-for="item in recommendOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-select class="recommendSelect" style="width: 70px" v-if="matchingradio==='中匹配率'"
                           v-model="mediumMatchingRate.recommendationNum">
                  <el-option
                    v-for="item in recommendOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-select class="recommendSelect" style="width: 70px" v-if="matchingradio==='高匹配率'"
                           v-model="highMatchingRate.recommendationNum">
                  <el-option
                    v-for="item in recommendOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-row>
              <el-row style="margin-top: 20px">
                <span v-if="matchingradio==='中匹配率'||matchingradio==='低匹配率'">虚拟人配置:</span>
                <template v-if="matchingradio==='低匹配率'">
                  <el-checkbox v-model="lowChecked"></el-checkbox>
                  <el-button v-if="lowChecked" type="text" style="margin-left: 20px" @click="isActionConfig = true">插入动作</el-button>
                  <span v-if="!lowChecked" style="font-size: 10px;color:darkgrey;margin-left: 10px">(配置虚拟人可选择此项)</span>
                  <span v-if="lowChecked" style="font-size: 10px;color:darkgrey">(可在对应的文本位置加入动作)</span>
                  <el-input
                    id='lowInput'
                    class="answerClass"
                    :rows="4"
                    type="textarea"
                    placeholder="请输入虚拟人答案,最多5000个字"
                    maxlength="5000"
                    show-word-limit
                    v-if="lowChecked"
                    v-model="lowMatchingRate.virtualHuman"
                  ></el-input>
                </template>

                <template v-if="matchingradio==='中匹配率'">
                  <el-checkbox v-model="mediumChecked"></el-checkbox>
                  <el-button v-if="mediumChecked" type="text" style="margin-left: 20px" @click="isActionConfig = true">插入动作</el-button>
                  <span v-if="!mediumChecked" style="font-size: 10px;color:darkgrey;margin-left: 10px">(配置虚拟人可选择此项)</span>
                  <span v-if="mediumChecked" style="font-size: 10px;color:darkgrey">(可在对应的文本位置加入动作)</span>
                  <el-input
                    id='mediumInput'
                    class="answerClass"
                    :rows="4"
                    type="textarea"
                    placeholder="请输入虚拟人答案,最多5000个字"
                    maxlength="5000"
                    show-word-limit
                    v-if="mediumChecked"
                    v-model="mediumMatchingRate.virtualHuman"
                  ></el-input>
                </template>
              </el-row>
            </el-row>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="checkAnswerList('form')">确定</el-button>
        </span>
        <el-dialog
          width="30%"
          :visible.sync="isActionConfig"
          custom-class="actionConfigClass"
          append-to-body>
          <div slot="title">虚拟人动作</div>
          <el-form>
            <el-form-item  label="添加动作:" label-width="20">
              <el-select clearable multiple v-model="virtualHumanActions" placeholder="请选择动作">
                <el-option
                  v-for="action in virtualHumanActionList"
                  :key="action"
                  :label="action"
                  :value="action">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="isActionConfig = false">取 消</el-button>
              <el-button type="primary" @click="validationAction">确定</el-button>
        </span>

        </el-dialog>
      </el-dialog>
    </div>
  </el-container>

</template>

<script>
  import {robotConfigService, nodeService, informationService} from '../../service/index';
  import robotHeader from '../../components/robotConfig/RobotConfigHeader';
  import {
    SetCookie,
    getJoinCookie,
    getCurrentTemplateAnswerHost,
    getTemplatePlatformHost
  } from '../../utils/commonUtil';
  import answerParamsConfig from '../../components/robotConfig/AnswerParamsConfig';
  import answerJumpParamsConfig from '../../components/robotConfig/AnswerJumpParamsConfig';


  export default {
      name: "AnswerConfig",
      components: {
        robotHeader,
        answerParamsConfig,
        answerJumpParamsConfig
      },
      computed:{
        //element双滑块采用计算属性实现了外面值改变滑块位置
        sliderValue:{
          get:function () {
            let array = [];
            array.splice(0,1,this.sliderValueleft)
            array.splice(1,1,this.sliderValueRight)
            return array
          },

          set:function () {
          }
        }
      },
      data(){
        return{
          repeat:false,
          listData: [],
          answerNameList:[],//下拉列表的数据源来源于小e答案列表或者数据中心答案列表
          slotAttributeValues:[],//模板答案参数配置中属性值列表
          templateAnswerParameList:[],//模板答案参数配置列表
          threeJumpAnswerParameList:[],//第三方配置参数配置列表
          showListLoading: false,
          //请求答案列表参数
          queryModel: {
            userId:'',
            cp:1,
            ps:10,
          },
          totalCount: 1,
          dialogFormVisible:false,
          formTitle:'',
          formLabelWidth:'100',
          form:{
            // radio:0,//类型选择
            radio:'',//类型选择
            answerName:'',//名称
            unusualMsg:'',//无答案话术
            otherAnswerName:'',
            id:'',
            answerContentJson:{},
            templateAnswerName:{},//模板答案对象
          },
          //第三方跳转配置
          threePartyJump:{
            jumpType:'原生页面',
            address:'',//答案地址
            guideLanguage:'',
            functionPage:'',//功能页面
            jumpProtocol:'',//跳转协议
            islogin:false,//是否登录
          },
          templateAnswers:[],//模板答案
          //模板答案私有特有
          templateAnswer:{
            guideLanguage:'',
          },
          //文本答案特有
          textAnswer:{
            textContent:'',
            guideLanguage:'',
            virtualHumanContent:'',//虚拟人配置
          },
          rules: {
            'templateAnswerName.reportName':[
              {required: true, message: '请选择答案名称', trigger: 'change'}
              ],
            answerName: [
              {required: true, message: '请输入名称', trigger: 'change'}
            ],
            unusualMsg: [
              {required: true, message: '请输入话术', trigger: 'change'}
            ],
            radio:[{required: true, message: '请选择答案类型', trigger: 'change'}
            ],
          },
          answerTypes:[{
            value: 0,
            label: '原有小e答案'
          }, {
            value: 1,
            label: '答案配置中心'
          }, {
            value: 2,
            label: '文本答案'
          }, {
            value: 3,
            label: '基础知识'
          }, {
            value: 4,
            label: '页面跳转'
          }],
          headerStyle:{
            color: '#7F8FA4'
          },
          sliderValueleft:20,
          sliderValueRight:50,
          oldsliderValue:[20,50],
          matchingradio:'低匹配率',
          recommendValue:1,
          recommendOptions:[0,1,2,3,4,5],
          isShowThreshold:false,//只有基础知识显示设置阈值
          thresholdMsg:'最高相似度在0-20',
          lowMatchingRate:{//低匹配率对象
            threshold:'',//阈值
            guidanceMsg:'',
            recommendationNum:1,//推荐问题数量
            virtualHuman:'' //虚拟人配置
          },
          mediumMatchingRate:{//中匹配率
            threshold:'',//阈值
            guidanceMsg:'',
            recommendationNum:1,//推荐问题数量
            virtualHuman:'' //虚拟人配置

          },
          highMatchingRate:{//高匹配率
            threshold:'',//阈值
            guidanceMsg:'',
            recommendationNum:1,//推荐问题数量
            virtualHuman:'' //虚拟人配置

          },
          templateListModel:{
            userName:'',
            published:'1',//已发布的报告模板
            ps:1000,
          },
          textChecked:false,
          lowChecked:false,
          mediumChecked:false,
          isActionConfig:false,
          virtualHumanActions:[],//选中的虚拟人动作
          virtualHumanActionList:['站立','点头','左手指','右招手'],//动作列表
      }
    },
    methods: {
      /***********关于接口请求的方法************/
      //获取答案列表请求
      async getAnswerList() {
        this.showListLoading = true;
        let result = await robotConfigService.getAnswerList(this.queryModel);
        if (result.message.code == 0) {
          this.showListLoading = false;
          var list = result.data.list;
          //类型转换成文本显示
          for (let listItemData in list) {
            if (list[listItemData].answerType === 0) {
              list[listItemData].answerType = '原有小e答案'
            } else if (list[listItemData].answerType === 1) {
              list[listItemData].answerType = '答案配置中心'
            } else if (list[listItemData].answerType === 2) {
              list[listItemData].answerType = '文本答案'
            } else if (list[listItemData].answerType === 3) {
              list[listItemData].answerType = '基础知识'
            } else if (list[listItemData].answerType === 4) {
              list[listItemData].answerType = '页面跳转'
            }
          }
          this.listData = list;
          this.totalCount = result.data.totalCount;
          this.queryModel.cp = result.data.currentPage;
        }

      },
      //新增答案提交请求
      async addAnswerRequest(params) {
        this.showListLoading = true;
        let result = await robotConfigService.addAnswer([params]);
        this.dialogFormVisible = false
        if (result.message.code == 0) {
          this.showListLoading = false;
          let target = this;
          setTimeout(function () {
            target.getAnswerList();
          }, 1250);
          this.$message({
            showClose: true,
            message: '创建成功',
            type: 'success'
          });
        } else {
          this.showListLoading = false;
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },

      //数据中台答案更新
      async anwserChange(value) {
        let result = await nodeService.getModeParams({"ids": value.id});
        this.templateAnswerParameList = result;
      },
      //编辑答案请求
      async editAnswerRequest(parmas) {
        let result = await robotConfigService.editAnswer([parmas]);
        this.dialogFormVisible = false
        if (result.message.code === 0) {
          this.showListLoading = false;
          let target = this;
          setTimeout(function () {
            target.getAnswerList();
            target.form.id='';
            debugger

          }, 1250);
          this.$message({
            showClose: true,
            message: '编辑成功',
            type: 'success'
          });

        } else {
          this.showListLoading = false;
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }

      },
      //删除答案请求
      async deleteAnswerRequest(id) {
        this.showListLoading = true;
        let result = await robotConfigService.deleAnswer({actionId: id});
        if (result.message.code == 0) {
          this.showListLoading = false;
          let target = this;
          setTimeout(function () {
            target.getAnswerList();
          }, 1250);
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
        } else {
          this.showListLoading = false;
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      //请求模板答案列表
      async requestTemplateList() {
        // let result  = await robotConfigService.getTemplateAnswerList(this.templateListModel);
        let result = await nodeService.getNodeTemplateAnswerList(this.templateListModel);
        if (result.message.code == 0) {
          this.templateAnswers = result.data.list;
        }

      },
      //请求词槽实体属性标签列表(用于答案配置中心的答案参数设置中的属性值一项)
      async requestEntityAttributeList() {
        let result = await robotConfigService.getSoltEntityAttribute({userId: this.queryModel.userId});
        if (result.message.code == 0) {
          this.slotAttributeValues = result.data;
        }

      },

      /**********交互方法***************/
      indexFilter(index) {
        return index + 10 * (this.queryModel.cp - 1) + 1;
      },
      //新增答案
      AddAnswer() {
        this.requestTemplateList()
        this.requestEntityAttributeList()
        this.dialogFormVisible = true;
        this.formTitle = '新建答案'
      },
      //编辑答案
      editAswer(index, row) {
        this.requestTemplateList()
        this.requestEntityAttributeList()
        this.dialogFormVisible = true;
        this.formTitle = '编辑答案'
        this.form.answerName = row.answerName//名称
        this.form.guidanceMsg = row.answerGuideLanguage//引导语
        this.form.unusualMsg = row.noAnswerLanguage//无答案话术
        this.form.id = row.id
        var type
        if (row.answerContentJson) {
          this.form.answerContentJson = JSON.parse(row.answerContentJson)
        }
        if (row.answerType === '原有小e答案') {
          type = 0;
        } else if (row.answerType === '答案配置中心') {
          type = 1;
          this.form.templateAnswerName = this.form.answerContentJson.reportConfig
          this.templateAnswer.guideLanguage = this.form.answerContentJson.guideLanguage
          let id = this.form.answerContentJson.reportConfig.id;
          this.anwserChange({id: id});
          // for(let key in this.form.answerContentJson.reportParams){
          //   this.templateAnswerParameList.push({name:key,value:this.form.answerContentJson.reportParams[key]})
          // }

        } else if (row.answerType === '文本答案') {

          type = 2;
          this.textAnswer.textContent = this.form.answerContentJson.textContent
          this.textAnswer.guideLanguage = this.form.answerContentJson.guideLanguage
          this.textAnswer.virtualHumanContent = this.form.answerContentJson.virtualHumanContent
          if(this.textAnswer.virtualHumanContent){
            this.textChecked = true
          }
        } else if (row.answerType === '基础知识') {
          type = 3;
          this.sliderValueleft = this.form.answerContentJson.mixScore
          this.sliderValueRight = this.form.answerContentJson.maxScore
          this.highMatchingRate.recommendationNum = this.form.answerContentJson.highRecommendNum
          this.highMatchingRate.guidanceMsg = this.form.answerContentJson.highGuideLanguage
          this.mediumMatchingRate.recommendationNum = this.form.answerContentJson.middleRecommendNum
          this.mediumMatchingRate.guidanceMsg = this.form.answerContentJson.middleGuideLanguage
          this.mediumMatchingRate.virtualHuman = this.form.answerContentJson.virtualHumanMiddleContent
          this.lowMatchingRate.recommendationNum = this.form.answerContentJson.lowRecommendNum
          this.lowMatchingRate.guidanceMsg = this.form.answerContentJson.lowGuideLanguage
          this.lowMatchingRate.virtualHuman = this.form.answerContentJson.virtualHumanLowContent
          if(this.lowMatchingRate.virtualHuman){
            this.lowChecked = true
          }
          if(this.mediumMatchingRate.virtualHuman){
            this.mediumChecked = true
          }


        } else if (row.answerType === '页面跳转') {

          type = 4;
          this.threePartyJump.jumpType = this.form.answerContentJson.linkType
          this.threePartyJump.address = this.form.answerContentJson.url
          this.threePartyJump.jumpProtocol = this.form.answerContentJson.linkProtocol
          this.threePartyJump.functionPage = this.form.answerContentJson.functionPageName
          this.threePartyJump.islogin = this.form.answerContentJson.needLogin === 'yes' ? true : false
          this.threePartyJump.guideLanguage = this.form.answerContentJson.guideLanguage
          for (let key in this.form.answerContentJson.linkParams) {
            this.threeJumpAnswerParameList.push({name: key, value: this.form.answerContentJson.linkParams[key]})
          }
        }

        this.form.radio = type//类型选择
      },

      //删除答案
      deleteAswer(index, row) {
        var text = '确认删除该答案吗?删除后该答案关联的策略技能也将同步删除!'
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //点击确定
          this.deleteAnswerRequest(row.id);
        }).catch(() => {
          //点击取消
        });
      },
      //获取答案列表请求
      async checkAnswerList(form) {
        let params = {
          answerType: this.form.radio,
          userId: this.queryModel.userId,
          id : this.form.id
        };
        if(this.form.radio!==1){
             params.answerName=this.form.answerName
        }else {
          params.answerName=this.form.templateAnswerName.reportName
        }
        let result = await informationService.checkAnswerList(params);
        if (result.message.code === 0) {
          this.repeat = false;
          this.onSubmit(form)
        } else {
          this.repeat = true;
          this.$message({
            showClose: true,
            message: result.message.message,
            type: 'error'
          });
        }
      },
      //点击新建和编辑答案提交后台方法
      onSubmit(formName) {
        let aray = this.templateAnswerParameList;
         this.$refs[formName].validate((valid) => {
            if (valid) {
              var params = {};
              params.answerName = this.form.answerName
              params.answerType = this.form.radio
              params.noAnswerLanguage = this.form.unusualMsg
              params.userId = this.queryModel.userId
              if (this.form.radio === 3) {
                //基础知识
                this.form.answerContentJson.mixScore = this.sliderValueleft
                this.form.answerContentJson.maxScore = this.sliderValueRight
                this.form.answerContentJson.highRecommendNum = this.highMatchingRate.recommendationNum
                this.form.answerContentJson.highGuideLanguage = this.highMatchingRate.guidanceMsg
                this.form.answerContentJson.virtualHumanHighContent = ''//没有高匹配的虚拟人设置
                this.form.answerContentJson.middleRecommendNum = this.mediumMatchingRate.recommendationNum
                this.form.answerContentJson.middleGuideLanguage = this.mediumMatchingRate.guidanceMsg
                this.form.answerContentJson.virtualHumanMiddleContent =this.mediumMatchingRate.virtualHuman
                this.form.answerContentJson.lowRecommendNum = this.lowMatchingRate.recommendationNum
                this.form.answerContentJson.lowGuideLanguage = this.lowMatchingRate.guidanceMsg
                this.form.answerContentJson.virtualHumanLowContent = this.lowMatchingRate.virtualHuman
                let waringstr = ''
                if (this.highMatchingRate.guidanceMsg.length === 0) {
                  waringstr = '请配置高匹配率引导语'
                } else if (this.mediumMatchingRate.guidanceMsg.length === 0) {
                  waringstr = '请配置中匹配率引导语'
                } else if (this.lowMatchingRate.guidanceMsg.length === 0) {
                  waringstr = '请配置低匹配率引导语'
                }
                if (waringstr.length > 0) {
                  this.$message({
                    showClose: true,
                    message: waringstr,
                    type: 'error'
                  });
                  return;
                }
              } else if (this.form.radio === 2) {
                //文本答案
                this.form.answerContentJson.textContent = this.textAnswer.textContent
                this.form.answerContentJson.guideLanguage = this.textAnswer.guideLanguage
                this.form.answerContentJson.virtualHumanContent =this.textAnswer.virtualHumanContent
              } else if (this.form.radio === 1) {
                //模板配置平台
                params.answerName = this.form.templateAnswerName.reportName
                this.form.answerContentJson.reportConfig = this.form.templateAnswerName
                this.form.answerContentJson.guideLanguage = this.templateAnswer.guideLanguage
                let templateParameObj = {}
                for (let index in this.templateAnswerParameList) {
                  let keys = this.templateAnswerParameList[index].key
                  templateParameObj[keys] = this.templateAnswerParameList[index].entities;
                }
                this.form.answerContentJson.reportParams = templateParameObj
              } else if (this.form.radio === 4) {
                //第三方跳转
                this.form.answerContentJson.linkType = this.threePartyJump.jumpType
                this.form.answerContentJson.url = this.threePartyJump.address
                this.form.answerContentJson.linkProtocol = this.threePartyJump.jumpProtocol
                this.form.answerContentJson.functionPageName = this.threePartyJump.functionPage
                this.form.answerContentJson.needLogin = this.threePartyJump.islogin ? 'yes' : 'no'
                this.form.answerContentJson.guideLanguage = this.threePartyJump.guideLanguage

                let threePartyJumpObj = {}
                for (let index in this.threeJumpAnswerParameList) {
                  let keys = this.threeJumpAnswerParameList[index].name
                  threePartyJumpObj[keys] = this.threeJumpAnswerParameList[index].value
                }
                this.form.answerContentJson.linkParams = threePartyJumpObj
              } else {
                this.form.answerContentJson = {}

              }
              params.answerContentJson = JSON.stringify(this.form.answerContentJson)

              if (this.formTitle === '新建答案') {
                this.addAnswerRequest(params);
              } else if (this.formTitle === '编辑答案') {
                params.id = this.form.id
                this.editAnswerRequest(params);
              }

            } else {
              return false;
            }
          });

      },

      //选择答案类型的回调
      changeAnswerType(type) {
        // this.resetData()//切换清空form
        this.$refs['form'].clearValidate()
        if (this.form.answerContentJson) {
          this.form.answerContentJson = {}
        }
      },
      //滑块滑动回调
      onChange(value) {
        //取出之前数组的值
        let oldone = this.oldsliderValue[0]
        let oldtwo = this.oldsliderValue[1]
        let newone = value[0]
        let newtwo = value[1]
        let isleft = true
        let isright = true
        if (oldone === newone) {
          isleft = false
        } else if (oldtwo == newtwo) {
          isright = false
        }
        this.oldsliderValue = value
        this.sliderValueleft = newone;
        this.sliderValueRight = newtwo;

        this.getThresholdMsg(this.matchingradio);
        if (isleft) {
          let moveLeft = value[0].toString() + '%'
          $(".inputNum1").css("left", moveLeft)
        } else if (isright && value[1] < 80) {
          let moveRight = value[1].toString() + '%'
          $(".inputNum2").css("left", moveRight)
        }
      },
      //数值设定回调
      handleChange1(value) {
        let moveLeft = value.toString() + '%'
        $(".inputNum1").css("left", moveLeft)

        // this.sliderValue.splice(0,1,parseInt(value));
        this.getThresholdMsg(this.matchingradio);
      },
      handleChange2(value) {
        if (value < 80) {
          let moveRight = value.toString() + '%'
          $(".inputNum2").css("left", moveRight)
        }
        // this.sliderValue.splice(1,1,parseInt(value));
        this.getThresholdMsg(this.matchingradio);
      },
      //低中高匹配切换
      matchingChange(label) {
        this.getThresholdMsg(label)
      },
      getThresholdMsg(label) {
        let matchingValue = ''
        if (label === '低匹配率') {
          matchingValue = 0 + '-' + this.sliderValueleft
          this.thresholdMsg = '最高相似度在' + matchingValue
        } else if (label === '中匹配率') {
          matchingValue = this.sliderValueleft + '-' + this.sliderValueRight
          this.thresholdMsg = '最高相似度在' + matchingValue + '返回多个相似问题'
        } else if (label === '高匹配率') {
          matchingValue = this.sliderValueRight + '-' + 100
          this.thresholdMsg = '最高相似度在' + matchingValue + '返回最相似问题的对应答案'
        }
      },
      //模板答案预览
      answerPreView(templateData) {
        let newPageUrl = getCurrentTemplateAnswerHost();
        let newPage = newPageUrl + '/report/template?id=' + templateData.id
        window.open(newPage, '_blank');
      },
      //跳转到模板配置平台
      toTemplatePlatform() {
        let templatePlatUrl = getTemplatePlatformHost();
        let token = {}
        token.userName = getJoinCookie('userName')
        token.ps = getJoinCookie('passWord')
        let singleUrl = window.encodeURIComponent(JSON.stringify(token))
        singleUrl = window.btoa(singleUrl)
        // let decryStr = window.atob(singleUrl); // 解码
        // decryStr=  window.decodeURIComponent(decryStr);
        let newPageUrl = templatePlatUrl + '?token=' + singleUrl
        window.open(newPageUrl, '_blank');
      },
      //确认动作
      validationAction(){
       this.isActionConfig = false;
       //拼接虚拟人答案
       let actionStr = ''
        if(this.virtualHumanActions.length>0){
          for(let index in this.virtualHumanActions){
            //动作要用<action>动作</action> 拼接
            // let leftTag = '&lt;'+'action'+ '&gt;'
            // let rightTag = '&lt;/'+'action'+ '&gt;'
            let leftTag = '<action>'
            let rightTag = '</action>'
            let actionItem = leftTag + this.virtualHumanActions[index] + rightTag
            actionStr =  actionStr +  actionItem
          }
        }

        if(this.form.radio===2){
         //文本答案类型
          this.textAnswer.virtualHumanContent = this.insertInputTxt('textInput',actionStr)

        }else if(this.form.radio===3&&this.matchingradio==='低匹配率'){
          //基础答案类型
          this.lowMatchingRate.virtualHuman = this.insertInputTxt('lowInput',actionStr)

        }else if(this.form.radio===3&&this.matchingradio==='中匹配率'){
          this.mediumMatchingRate.virtualHuman = this.insertInputTxt('mediumInput',actionStr)

        }
        this.virtualHumanActions = []

      },


      insertInputTxt(id, actionStr){
        var elInput = document.getElementById(id);
        var startPos = elInput.selectionStart;
        var endPos = elInput.selectionEnd;
        if (startPos === undefined || endPos === undefined) return
        var txt = elInput.value;
        var result = txt.substring(0, startPos) + actionStr + txt.substring(endPos)
        elInput.value = result;
        elInput.focus();
        elInput.selectionStart = startPos + actionStr.length;
        elInput.selectionEnd = startPos + actionStr.length;
        return result;
      },



      //点击分页
      pageChange(page) {
        this.queryModel.cp = page;
        this.getAnswerList();
      },
      //弹窗关闭的回调
      close() {
        //关闭是清空数据
        this.resetData()
        this.form.radio = '';
        // this.from.id='';
      },
      //清空数据
      resetData() {
        this.$refs['form'].resetFields()
        this.form.answerName = ''//名称
        this.form.guidanceMsg = ''//引导语
        this.form.unusualMsg = ''//无答案话术
        this.form.otherAnswerName = ''
        this.sliderValueRight = 50
        this.sliderValueleft = 20
        this.lowMatchingRate.guidanceMsg = ''
        this.mediumMatchingRate.guidanceMsg = ''
        this.highMatchingRate.guidanceMsg = ''
        this.lowMatchingRate.recommendationNum = 1
        this.mediumMatchingRate.recommendationNum = 1
        this.highMatchingRate.recommendationNum = 1
        this.matchingradio = '低匹配率'
        this.textAnswer.textContent = ''
        this.textAnswer.guideLanguage = ''
        this.templateAnswerParameList = [],//模板答案参数配置列表
        this.threeJumpAnswerParameList = []
        this.templateAnswer.guideLanguage = ''
        this.threePartyJump.jumpType = '原生页面'
        this.threePartyJump.address = ''
        this.threePartyJump.jumpProtocol = ''
        this.threePartyJump.functionPage = ''
        this.threePartyJump.islogin = false
        this.threePartyJump.guideLanguage = ''
        this.form.templateAnswerName = {}
        this.form.answerContentJson = {}
        this.textAnswer.virtualHumanContent = ''
        this.lowMatchingRate.virtualHuman = ''
        this.mediumMatchingRate.virtualHuman = ''
        this.textChecked = false
        this.mediumChecked = false
        this.lowChecked = false

      }
      ,
      checkName() {
        let a = this.form.answerName
        console.log(a);
      },
    },//methods
    created: function () {
      this.queryModel.userId = getJoinCookie('userId');
      this.templateListModel.userName = getJoinCookie('userId');
      this.getAnswerList();
    },
    mounted() {

    }

  }


</script>
<style>
  .el-input-number--mini {
    width: 100px !important;
    line-height: 26px !important;
  }
</style>

<style scoped>
  .container {
    width: 100%;
    padding-top: 27px;
    padding-left: 30px;
    padding-right: 30px;
    box-sizing: border-box;
  }

  .elButtonEdit,
  .elButtonDele {
    padding: 4px 8px;

  }

  .elButtonDele {
    background-color: red;
    border: none;
  }

  .inputNum1 {
    position: relative;
    left: 20%;
    top: -5px;
  }

  .inputNum2 {
    position: absolute;
    left: 50%;
    top: -35px;
  }

  .slider {
    margin: 0px 0px 0px 0px;
  }

  .tipsDiv {
    padding: 0px 5px;
    border-radius: 10px;
    font-size: 9px;
    border: #707070 1px solid;
    margin-left: -7px;
  }

  .recommendSelect >>> .el-input__inner {
    height: 30px;
  }

  .answerInfo >>> .el-table td, .el-table th {
    padding: 0px;
  }

  .answerInfo >>> .el-input__inner {
    border: none;
  }

  .loginclass >>> .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #409EFF !important;
    border-color: #409EFF !important;
  }

</style>
