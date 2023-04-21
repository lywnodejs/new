<template>
  <!--新建策略页面和编辑策略页面-->
  <!--:to="{ path: '/tacticsManagement?index=tacticsManagement' }"-->

  <el-container>
    <!--面包屑-->
    <el-header style="background-color: #fff; padding: 0px;height: 45px">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item
          :to="{ path: '/skillhome', query: {
            skillData:JSON.stringify(skillData),robotName:robotName}}">
          我的技能
        </el-breadcrumb-item>
        <el-breadcrumb-item
          :to="{ path:'/tacticsManagement?index=tacticsmanagement',query: {
             skillData:JSON.stringify(skillData),robotName:robotName}}">
          技能管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{dialogTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <!--内容区-->
    <div class="contentView" style=" background-color: #fff;margin:20px">
      <el-header class="contentViewheader">
        {{dialogTitle}}
      </el-header>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-steps direction="vertical" :active="5" style="margin: 20px">
          <!--第一步-->
          <el-step>
            <div slot="title" style="color: #000;font-size: 15px">关联意图信息</div>
            <div slot="description" class="intention">
              <el-form-item label="意图选择:" prop="intentionObj.name">
                <el-select v-model="form.intentionObj" value-key="id" filterable placeholder="请选择意图"
                           @visible-change="intentionClick">
                  <el-option
                    v-for="item in intentionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  >
                  </el-option>
                </el-select>
                <el-button style="margin-left: 10px" type="text" @click="toIntentionManagement">意图管理</el-button>
              </el-form-item>
              <div style="height: 30px"></div>
            </div>
          </el-step>
          <!--第二步-->
          <el-step>
             <span slot="title" style="color: #000;;font-size: 15px">关联词槽
               <span style="margin-left: 32px">
                 <el-button type="small" @click="addWordSolt">添加词槽</el-button>
                 <el-button style="margin-left: 10px" type="text" @click="addNewWordSolt">新增词槽</el-button>
               </span>
             </span>
            <el-table class="tableList"
                      :data="wordSoltlistData"
                      style=""
                      slot="description"
                      :header-cell-style="headerStyle"
                      :cell-style="cellStyle"
            >
              <el-table-column width="120" label="词槽名称"  align="left">
                <template slot-scope="scope">
                  {{scope.row.userSlot.slotName}}
                </template>
              </el-table-column>
              <el-table-column width="100" label="词槽来源" align="center">
                <template slot-scope="scope">
                  {{scope.row.userSlot.slotType}}
                </template>
              </el-table-column>
              <el-table-column width="100" label="词槽必填" align="center">
                <template slot-scope="scope">
                  {{scope.row.mustFill==1?'必填':'非必填'}}
                </template>
              </el-table-column>
              <el-table-column width="100" label="词槽默认值" align="center">
                <template slot-scope="scope">
                   <span v-if="scope.row.userSlot.slotType==='时间'">{{scope.row.defaultValue.type}}</span>
                  <span  v-else>{{scope.row.defaultValue.rawValue}}</span>
                </template>
              </el-table-column>
              <el-table-column label="澄清话术" align="center" prop="clarifyUtterance">
                <template slot-scope="scope">
                  {{handleClarifyUtterance(scope.row.clarifyUtterance)}}
                </template>
              </el-table-column>
              <el-table-column width="90" label="澄清顺序" align="center" prop="clarifyOrder"></el-table-column>
              <el-table-column width="200" align="center" resizeable="false">
                <template slot-scope="scope">
                  <el-row type="flex" style="margin-left:10px">
                    <el-button type="text" :disabled="scope.$index==0" @click="upMove(scope.$index, scope.row)">上移
                    </el-button>
                    <el-button type="text" :disabled="scope.$index==wordSoltlistData.length-1"
                               @click="downMove(scope.$index, scope.row)">下移
                    </el-button>
                    <el-button class="tableEdit" type="text" @click="editWordSolt(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button class="tableDelete" type="text" @click="deleteWordSolt(scope.$index, scope.row)">删除
                    </el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-step>
          <!--第三步 关联规则-->
          <el-step>
            <div slot="title" style="color: #000;font-size: 15px">关联规则
              <el-button type="success" size="mini" @click="addRule">+&nbsp&nbsp添加规则</el-button>
            </div>
            <div slot="description" label-width="100px" class="intention">
              <div v-for="(item,index) in form.rules" :key="index">
                <div class="ruleClass">
                  <span class="rule" v-model="item.priority=parseInt(index+1)">规则{{parseInt(index+1)}}</span>
                  <div style="float: right;margin: 9px 9px 0 0">
                    <span style="cursor: pointer;user-select: none;" @click="showToggle($event)">收起</span>
                    <i class="el-icon-arrow-down"></i>
                    <el-button type="text" size="mini" :disabled="index===0"  @click="upMoveRules(index)">上移</el-button>
                    <el-button type="text" size="mini" :disabled="index===form.rules.length-1" @click="downMoveRules(index)">下移</el-button>
                    <el-button type="danger" size="mini" @click="deleteRule(index)">删除规则</el-button>
                  </div>
                  <div class="conditionClass">
                    <el-table
                      :data="item.ruleDetails" border style="width: 98%;margin: 20px auto">
                      <el-table-column width="130" align="left">
                        <template slot-scope="scope" slot="header">
                          <el-button type="success" size="mini" @click="addCondition(index)">+&nbsp&nbsp添加条件</el-button>
                        </template>
                        <template slot-scope="scope">
                          <el-select size="mini" v-model="scope.row.conditionOperation" placeholder="请选择">
                            <el-option
                              v-for="(ite,ind) in conditionOperationArr"
                              :key="ind"
                              :label="ite.name"
                              :value="ite.value">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="userSlot" label="选择词槽" width="150">
                        <template slot-scope="scope">
                          <el-select size="mini" value-key="id" v-model="scope.row.userSlot" placeholder="请选择"
                                     @change="ChooseSlot">
                            <el-option
                              v-for="(it,inx) in wordSoltlistData"
                              :key="inx"
                              :label="it.userSlot.slotName"
                              :value="it.userSlot">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="type" label="属性" width="">
                        <template slot-scope="scope">
                          <el-select size="mini" v-model="scope.row.conditionProperty" placeholder="请选择 "
                                     @visible-change="(val)=>conditionPropertyClick(val,scope.row.userSlot)"
                                     @change="conditionPropertyChange(scope.row,scope.$index,index)">
                            <el-option
                              v-for="(it,inx) in conditionPropertyArr"
                              :key="inx"
                              :label="it.name"
                              :value="it.value">
                            </el-option>
                          </el-select>
                          <el-input
                            v-if="scope.row.conditionProperty==='词槽属性'"
                            placeholder="请输入内容"
                            size="mini"
                            v-model="scope.row.paramsName">
                            <i style="cursor: pointer;" slot="prefix" @click="getTree(scope.row.userSlot.slotName,scope.$index,index,scope.row.paramsName)" class="el-input__icon el-icon-search"></i>
                          </el-input>

                          <!--                          <span v-for="x in scope.row.propertyInfo">{{x.indicatorName}}</span>-->
                          <el-tree v-if="scope.row.conditionProperty==='词槽属性'"
                                   :data="scope.row.TreeData"
                                   show-checkbox
                                   node-key="id"
                                   :ref="scope.$index"
                                   :default-checked-keys="scope.row.propertyInfoID"
                                   @check="((a,b)=>{TreeCheck(a,b,scope.$index,index)})"
                                   :props="defaultProps">
                          </el-tree>
                          <el-select size="mini" :key="scope.row.conditionProperty" v-model="scope.row.propertyOperation" placeholder="请选择操作比较符">
                            <el-option
                              v-for="(it,inx) in propertyOperation"
                              :key="inx"
                              :label="it.name"
                              :value="it.value">
                            </el-option>
                          </el-select>
                          <!--  选择值为词槽值 -->
                          <el-select filterable
                                     multiple
                                     remote
                                     :remote-method="(val)=>remoteSearchWord(val,scope.row,scope.$index,index)"
                                     v-if="scope.row.conditionProperty==='词槽值'"
                                     v-model="scope.row.conditionValue"
                                     :loading="loading"
                                     @change="(val)=>searchWordChange(val,scope.row,scope.$index,index)"
                                     size="mini"
                                     placeholder="输入关键字搜索"
                          >
                            <!--此处搜索多选时编辑赋值对象是有不显示文本的bug所以改成绑定值-->
                            <el-option
                              v-for="(it,inx) in scope.row.DictValue"
                              :key="it.rawValue"
                              :label="it.rawValue"
                              :value="it.rawValue">
                            </el-option>
                          </el-select>
                          <!--  选择值为词槽属性，且存在枚举值 -->
                          <el-select filterable
                                     multiple
                                     v-if="scope.row.propertyInfo.length>0 && scope.row.propertyInfo[0].enumType>0"
                                     v-model="scope.row.conditionValue"
                                     size="mini"
                                     value-key="data"
                                     placeholder="存在枚举值下拉框">
                            <el-option
                              v-for="(it,inx) in scope.row.DicttypeWord"
                              :key="inx"
                              :label="it.displayData"
                              :value="it">
                            </el-option>
                          </el-select>
                          <el-input v-if="(scope.row.propertyInfo.length==1 && !scope.row.propertyInfo[0].enumType) && scope.row.conditionProperty!=='词槽值' || scope.row.conditionProperty==='词槽数量'" style="width: 80px" size="mini"
                                    v-model="scope.row.conditionValue" ></el-input>
                          <span v-if="(scope.row.propertyInfo.length==1 && !scope.row.propertyInfo[0].enumType)">{{scope.row.propertyInfo[0].unit}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="date" label="操作" align="center" width="96">
                        <template slot-scope="scope">
                          <el-button type="danger" size="mini" @click="deleteCondition(index,scope.$index,scope.row)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-form-item label="回复答案:" :prop="'rules.' + index + '.action'"
                                  :rules="{required: true, message: '请选择答案', trigger: 'change'}">
                      <el-select v-model="item.action" value-key="id" filterable placeholder="请选择答案">
                        <el-option
                          v-for="(answerNameListitem,answerNameListindex) in answerNameList"
                          :key="answerNameListindex"
                          :label="answerNameListitem.answerName"
                          :value="answerNameListitem"
                        >
                        </el-option>
                      </el-select>
                      <el-button style="margin-left: 10px" type="text" @click="addNewAnswer">新增答案</el-button>

                    </el-form-item>
                    <el-form-item label="推荐问题:">
                      <div class="guideQuestion" v-for="(guideQuestionsItem,guideQuestionsIndex) in item.guideQuestions"
                           :key="guideQuestionsIndex">
                        <el-input v-model="item.guideQuestions[guideQuestionsIndex]" placeholder="请输入问题"
                                  style="width: 400px">
                          <div slot="append" @click="deleGuideQuestion(index,guideQuestionsIndex)">删除</div>
                        </el-input>
                      </div>
                      <i class="el-icon-circle-plus-outline" @click="addGuideQuestion(index)">
                        <span style="">&nbsp&nbsp添加推荐问题</span>
                      </i>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <el-button type="primary" style="margin-top: 30px" @click="onSubmit('form')">确定</el-button>
            </div>
          </el-step>
        </el-steps>
      </el-form>
    </div>
    <!--添加词槽弹窗-->
    <el-dialog :visible.sync="dialogFormVisible" @open="open()" @close="close()" custom-class="dialogClass"
               :close-on-click-modal="false" center>
      <div slot="title" style="text-align: left">{{wordSoltTitle}}</div>
      <el-form :model="wordSoltForm" :rules="rules" ref="wordSoltForm" label-width="100px" class="demo-form">
        <el-form-item label="词槽选择" prop="wordSlotChoice.slotName">
          <el-select v-model="wordSoltForm.wordSlotChoice" value-key="slotName" filterable  placeholder="请选择" @change="radioChange">
            <el-option
              v-for="item in wordSoltList"
              :key="item.slotName"
              :label="item.slotName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="词槽必填" required>
          <el-radio-group v-model="wordSoltForm.radio" @change="radioChange">
            <el-radio :label="1">必填</el-radio>
            <el-radio :label="0">非必填</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!showClarifyUtterance && wordSoltForm.wordSlotChoice.slotType!=='时间'" key="NoTime" label="默认值" prop="defaultValue.rawValue" >
          <el-select v-model="wordSoltForm.defaultValue" value-key="rawValue"
                     filterable
                     remote
                     :remote-method="remoteSearch"
                     :loading="loading"
                     placeholder="输入关键字搜索">
            <el-option
              v-for="item in defaultValueArr"
              :key="item.rawValue"
              :label="item.rawValue"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!showClarifyUtterance && wordSoltForm.wordSlotChoice.slotType==='时间'" key="time" label="默认值" prop="defaultValueTime" >
          <el-select v-if="wordSoltForm.wordSlotChoice.slotType==='时间'" v-model="wordSoltForm.defaultValueTime">
            <el-option
              v-for="item in defaultValueTimeArr"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!--<el-form-item v-if="!showClarifyUtterance" key="1" label="默认值" prop="defaultValue.rawValue" >-->
          <!--<el-select v-if="wordSoltForm.wordSlotChoice.slotType!=='时间'"-->
                     <!--v-model="wordSoltForm.defaultValue" value-key="rawValue"-->
                     <!--filterable-->
                     <!--remote-->
                     <!--:remote-method="remoteSearch"-->
                     <!--:loading="loading"-->
                     <!--placeholder="输入关键字搜索">-->
            <!--<el-option-->
              <!--v-for="item in defaultValueArr"-->
              <!--:key="item.rawValue"-->
              <!--:label="item.rawValue"-->
              <!--:value="item"-->
            <!--&gt;-->
            <!--</el-option>-->
          <!--</el-select>-->

          <!--<el-select v-if="wordSoltForm.wordSlotChoice.slotType==='时间'" v-model="defaultValueTime">-->
            <!--<el-option-->
              <!--v-for="item in defaultValueTimeArr"-->
              <!--:key="item"-->
              <!--:label="item"-->
              <!--:value="item"-->
            <!--&gt;-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="澄清话术" v-if="showClarifyUtterance" required>
          <div class="clarifyUtterance" v-for="(item,index) in wordSoltForm.clarifyUtterances" :key="index">
            <el-input v-model="wordSoltForm.clarifyUtterances[index]" placeholder="请输入澄清话术" @blur="blur()"
                      style="width: 400px">
              <div slot="append" @click="deleClarifyUtterance(index)">删除</div>
            </el-input>
          </div>
          <i class="el-icon-circle-plus-outline" @click="addClarifyUtterance">
            <span style="">&nbsp&nbsp添加话术</span>
          </i>
          <span class="warningStr" v-if="showWarningStr">请添加澄清话术</span>
        </el-form-item>
        <el-form-item label="澄清" v-if="showClarifyUtterance">
          <el-select v-model="wordSoltForm.clearDialogueValue" size="mini" class="clearDialogue">
            <el-option value="1"></el-option>
            <el-option value="2"></el-option>
            <el-option value="3"></el-option>
          </el-select>
          <span>轮后放弃澄清</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="onSubmitWordSolt('wordSoltForm')">确定</el-button>
          </span>
    </el-dialog>


    <wordSolt ref="wordSoltDiaLog"
              :dialogVisible="showWordSoltDialog"
              formTitle="新建词槽"
              @closeDialog="closeWordSoltDialog"
    ></wordSolt>

    <answerDialog ref="answer"
                  :dialogVisible="showAnswerDialog"
                  formTitle="新建答案"
                  @closeDialog="closeAnswerDialog"
                  @addNewAnswerSuccess='addNewAnswerSuccess'

    >

    </answerDialog>
  </el-container>


</template>

<script>
  import {stringForArray, arrayForString,formatDate} from '../../utils/commonUtil';
  import {robotConfigService, informationService,semanticApiService} from '../../service/index';
  import {SetCookie, getJoinCookie} from '../../utils/commonUtil';
  import $ from 'jquery'
  import wordSolt from '../../components/robotConfig/WordSoltDialog';
  import answerDialog from '../../components/robotConfig/AnswerDialog';

  export default {
    name: "AddTactics",
    components: {wordSolt, answerDialog},
    data() {
      return {
        defaultValueTimeArr:["最近时间"],
        defaultProps: {
          children: 'reportLevelTreeList',
          label: 'name',
        },
        defaultValueArr: [],//非必填字段数组
        propertyOperation: [
          {
            value: 'EQ',
            name: '等于'
          }, {
            value: 'IN',
            name: '包含'
          }, {
            value: 'NIN',
            name: '不包含'
          }, {
            value: 'NEQ',
            name: '不等于'
          }, {
            value: 'GT',
            name: '大于'
          }, {
            value: 'GTE',
            name: '大于等于'
          }, {
            value: 'LT',
            name: '小于'
          }, {
            value: 'LTE',
            name: '小于等于'
          }
        ],//  比较操作符
        showBorder: false,
        conditionPropertyArr: [
          {
            name:'词槽数量',
            value:'词槽数量'
          },{
            name:'词槽属性',
            value:'词槽属性'
          },{
            name:'词槽值',
            value:'词槽值'
          }
        ],
        conditionOperationArr: [
          {
            value: 'AND',
            name: '且'
          }, {
            value: 'OR',
            name: '或'
          }, {
            value: 'NOT',
            name: '非'
          }
        ],
        intentionList: [],//意图列表（谓语分类下的所有标签）
        labelCategoryList: [],//标签类别列表
        wordSoltlistData: [],//添加词槽table表格数据源
        answerNameList: [],//答案列表
        wordSoltList: [],//词槽列表,词槽选择数据源
        guideQuestions: [""],//引导的问题
        dialogFormVisible: false,
        showClarifyUtterance: true,
        showWarningStr: false,
        wordSoltData: {},//词槽数据最后添加到词槽table表格数据源中
        wordSoltTitle: '',
        editIndex: '',
        skillData: {},
        tacticsData: {},
        labelCategoryId: '',
        taskId: '',
        dialogTitle: '',
        robotName: '',
        userId: '',

        form: {//最终提交
          intentionObj: {},//意图对象 单选
          answerName: '',//答案名称 单选
          answer: {},//回复答案对象
          lastAction: '',//上文回复答案
          rules: [
            {
              guideQuestions: [],
              ruleDetails: [
                //需要默认展示无条件样式所以注释掉下面代码
                // {
                //   propertyInfo: [],
                //   TreeData: [],
                //   DicttypeWord: [],
                //   DictValue: [],
                //   paramsName:''
                // }
              ]
            }
          ],//规则
        },
        wordSoltForm: {//设置词槽
          wordSlotChoice: {},//词槽对象
          radio: 1,
          clarifyUtterances: [''],//澄清话术数组
          clearDialogueValue: "1",
          id: '',
          clarifyOrder: '',
          defaultValue:{},
          defaultValueTime:'',

        },
        rules: {
          "intentionObj.name": [
            {required: true, message: '请选择意图', trigger: 'change'}
          ],
          "answer.answerName": [
            {required: true, message: '请选择答案', trigger: 'change'}
          ],
          "wordSlotChoice.slotName": [
            {required: true, message: '请选择词槽', trigger: 'change'}
          ],
          "defaultValue.rawValue" : [
            {required: true, message: '请选择默认值', trigger: 'change'}
          ],
          defaultValueTime : [
            {required: true, message: '默认值', trigger: 'change'}
          ],

        },
        headerStyle: {
          backgroundColor: "#EFF3F6",
          padding: '0',
          height: "40px",
        },
        cellStyle: {
          padding: '0',
          height: '40px',
        },
        showWordSoltDialog: false,//弹新建词槽对话框
        showAnswerDialog: false,//弹新建答案对话框
        TreeSearchName:'',//搜索词槽属性所用输入框
        loading:false,//远程搜索loading
        //提交后台时需要用到这个数组 因为词槽值时远程搜索框绑定对象时,编辑的时候直接给搜索框赋值对象不显示文本,所以改成了绑定值但是
        //向后端提交数据时又需要对象的结构所以这个数组是选中框中的对象数组 提交时需要遍历替换掉搜索框绑定的那个数组
        copyConditionValue:[],
        //1.inputValueForWordNumber为当选择词槽数量时input输入框绑定的值
        //2.当切换词槽值和词槽数量时input绑定的值:scope.row.conditionValue的类型不一样，会存在类型报错,所以声明此变量
        inputValueForWordNumber:'',
        //当为词槽值时搜索框绑定的值,因为它也是绑定的scope.row.conditionValue,所以理由同上
        selectValueForSearchWordValue:[],
        searchValue:'',

      }
    },
    methods: {
      conditionPropertyClick(val,row){
        if (!val)
          return
        if (!row) {
          this.$message({
            showClose: true,
            message: '请选择词槽',
            type: 'error'
          });
          return
        }
        this.ChooseSlot(row)
      },
      ChooseSlot(validateCallback) {
        if (validateCallback.slotType === '实体') {
          this.conditionPropertyArr = [
            {
              name:'词槽数量',
              value:'词槽数量'
            },{
              name:'词槽属性',
              value:'词槽属性'
            },{
              name:'词槽值',
              value:'词槽值'
            }
          ]
        } else if (validateCallback.slotType === '属性') {
          this.conditionPropertyArr = [
            {
              name:'词槽数量',
              value:'词槽数量'
            },{
              name:'词槽值',
              value:'词槽值'
            }
          ]
        } else {
          this.conditionPropertyArr = []
        }
      },
      conditionPropertyChange(row, indexBaee, index) {
        if (!row.userSlot) {
          this.$message({
            showClose: true,
            message: '请选择词槽',
            type: 'error'
          });
          return false
        } else {
          if (row.conditionProperty === '词槽属性') {
            let params = row.userSlot.slotName;
            this.getTree(params, indexBaee, index)
          } else if (row.conditionProperty === '词槽值') {
            // row.conditionValue = this.selectValueForSearchWordValue
            // let params = row.userSlot.slotUk;
            // this.getSlot(params, indexBaee, index)

            if (!row.conditionValue) {
              row.conditionValue = []
            }

          }else if(row.conditionProperty === '词槽数量'){
            //此处赋值是解决 数据类型错误和来回切换的数据不对的问题
            // row.conditionValue = this.inputValueForWordNumber

          }
        }

      },
      TreeCheck(a, b, indexBase, index) {
        let arr = [a];
        this.form.rules[index].ruleDetails[indexBase].propertyInfo = arr;
            this.form.rules[index].ruleDetails[indexBase].paramsName = a.name;
        console.log(a);
        if (a.enumType) {
          let params = a.enumType;
          this.getDictValue(params, indexBase, index)
        }
      },
      async getTree(params,indexBase, index, paramsName) {
        let result = await informationService.getTree({
          level: params,
          name:paramsName
        });
        if (result.message.code === 0) {
          let that=this;
          // that.showToggle()
          that.$set(that.form.rules[index].ruleDetails[indexBase],'TreeData',result.data)
          // that.form.rules[index].ruleDetails[indexBase].TreeData=[];
          // that.form.rules[index].ruleDetails[indexBase].TreeData = result.data;
        }
      },
      async getDictValue(params, indexBase, index) {
        let result = await informationService.getDictValue({
          dictType: params
        });
        if (result.message.code == 0) {
          let tempArr=result.data;
          let arr=[]

          tempArr.forEach((item,index)=>{
            let obj={
              data:item.dictId,
              displayData:item.dictValue
            }
            arr.push(obj)
          })
          this.$set(this.form.rules[index].ruleDetails[indexBase],'DicttypeWord',arr)
          // this.form.rules[index].ruleDetails[indexBase].DicttypeWord = arr;
        }
      },
      //此方法废弃了-请求词槽值列表后改为远程搜索
      async getSlot(params, indexBase, index) {
        let result = await informationService.getDictByword({
          dictTypeId: params,
          cp: 1,
          ps: 100
        });

        if (result.message.code == 0) {
          let tempArr=result.data.list;
          let arr=[]
          tempArr.forEach((item,index)=>{
             let obj={
               data:item.dictId,
               displayData:item.dispName
             }
            arr.push(obj)
          })
          this.$set(this.form.rules[index].ruleDetails[indexBase],'DictValue',arr)
          // this.form.rules[index].ruleDetails[indexBase].DictValue = arr;

        }
      },

      //规则模块远程搜索词槽值
      remoteSearchWord(value,row, indexBase, index){
        if(value=='') return
        this.searchValue = value
        let params = row.userSlot.slotUk;
        this.getSearchWord(value,params, indexBase, index)
      },
      async getSearchWord(value,params,indexBase,index){
        this.loading = true
        let result =  await semanticApiService.getSearchWordValue({
          type: params,
          query : value,
          count : 20,
        });
        this.loading = false
        if (result.message.code == 0) {
          let tempArr = result.data;
          this.$set(this.form.rules[index].ruleDetails[indexBase], 'DictValue', tempArr)
        }
      },
      searchWordChange(value,row,indexBase,index){
        let selectitem = value[value.length-1]
        let dataArray = row.DictValue
        for (var i = 0; i < dataArray.length; i++) {
          if (dataArray[i].rawValue === selectitem) {
            this.copyConditionValue.push(dataArray[i]);
            //该数据源会存在重复的数据因为规则里条件可以有多个,不同条件里可以有相同的词槽值所以回重复添加,不过没关系，该数据源
            //只是用来保存最后提交时用到的对象数据 可以有重复最后提交时会遍历取出
            break;
          }
        }
        this.remoteSearchWord(this.searchValue,row,indexBase,index)

      },


      //展开收起
      showToggle(event) {
        let target = $(event.target);
        target.next().removeClass("el-icon-arrow-right");
        target.next().addClass("el-icon-arrow-down");
        if (!target.parents().parents().children(".conditionClass").is(":animated")) {
          if (target[0].innerHTML === "展开") {
            target.next().removeClass("el-icon-arrow-right");
            target.next().addClass("el-icon-arrow-down");
            target[0].innerHTML = '收起'
          } else {
            target[0].innerHTML = '展开';
            target.next().removeClass("el-icon-arrow-down");
            target.next().addClass("el-icon-arrow-right");
          }
          target.parents().parents().children(".conditionClass").toggle();
        }
      },
      //增加规则
      addRule() {
        this.form.rules.push({
          ruleDetails: [
            //添加规则时默认是如条件样式所以注释掉下面代码
            // {
            //   propertyInfo: [],
            //   TreeData: [],
            //   DicttypeWord: [],
            //   DictValue: [],
            //   paramsName:''
            // }
          ],
          guideQuestions: [],
        })
      },
      //删除规则
      deleteRule(index) {
        this.form.rules.splice(index, 1)
      },
      //添加条件
      addCondition(index) {
        this.form.rules[index].ruleDetails.push({ propertyInfo: [],
          TreeData: [],
          DicttypeWord: [],
          DictValue: []})
      },
      //添加条件
      deleteCondition(itemindex, index, row) {
        this.form.rules[itemindex].ruleDetails.splice(index, 1)
      },
      /**********************************网络请求相关的方法*******************************************/
      //获取意图列表(标注平台)分两步需要
      // 1.先获取标签类别列表
      // 2.找到名称为谓语分类的id在获取下面的所有标签就是所需要的意图列表
      async getlabelcategoryList() {
        let result = await informationService.querylabelcategory({taskId: this.taskId});
        if (result.message.code == 0) {
          this.labelCategoryList = result.data.list;
          for (let i = 0; i < this.labelCategoryList.length; i++) {
            if (this.labelCategoryList[i].name == '谓语分类') {
              this.labelCategoryId = this.labelCategoryList[i].id
              this.getLabelList()
            }

          }
        }
      },
      async getLabelList() {//获取谓语分类下的标签列表
        let result = await informationService.querylabel({
          taskId: this.taskId,
          labelTypeIds: this.labelCategoryId,
          ps: 10000
        });
        if (result.message.code == 0) {
          this.intentionList = result.data.list;
        }
      },
      //获取词槽列表用于添加词槽
      async getWordSlotList() {
        let result = await robotConfigService.getWoldSoltList({userId: this.userId, ps: 10000});
        if (result.message.code == 0) {
          var list = result.data.list;
          /*    console.log(this.wordSoltlistData);
              //类型转换成文本显示
              for (let listItemData in list) {
                if (list[listItemData].slotSource == 0) {
                  list[listItemData].slotSource = '实体词槽'
                } else if (list[listItemData].slotSource == 1) {
                  list[listItemData].slotSource = '词典词槽'
                }
              }*/
          this.wordSoltList = list;
        }

      },
      //获取答案列表用于添加上文回复答案和回复答案
      async getAnswerList() {
        let result = await robotConfigService.getAnswerList({userId: this.userId, ps: 10000});
        if (result.message.code == 0) {
          this.answerNameList = result.data.list;
        }
      },
      //新增策略(任务)
      async addTacticsRequest(params) {
        let result = await robotConfigService.addTactics(params);
        if (result.message.code == 0) {
          this.showListLoading = false;
          let target = this;
          setTimeout(function () {
            //回到策略列表页
            target.gotoPage()
          }, 1250);
          this.$message({
            showClose: true,
            message: '新建成功',
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
      //编辑策略(任务)
      async editTacticsRequest(params) {
        let result = await robotConfigService.editTactics(params);
        if (result.message.code == 0) {
          this.showListLoading = false;
          let target = this;
          setTimeout(function () {
            //回到策略列表页
            target.gotoPage()
          }, 1250);
          this.$message({
            showClose: true,
            message: '编辑成功',
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
      //删除词槽(走策略的-根据id为词槽Id idType来区分是删策略还是删策略里面的词槽)请求
      async deleTacticsRequest(index, wordSoltObject) {
        let result = await robotConfigService.deleTactics({id: wordSoltObject.id, idType: "policySlot"});
        if (result.message.code == 0) {
          let target = this;
          setTimeout(function () {
            target.wordSoltlistData.splice(index, 1)
            for (let index in target.wordSoltlistData) {
              let wordSoltObj = target.wordSoltlistData[index]
              wordSoltObj.clarifyOrder = parseInt(index) + 1
            }
          }, 1250);
          this.$message({
            showClose: true,
            message: '删除词槽成功',
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
      /**********************************交互相关的方法*******************************************/
      //选择意图
      intentionClick(value) {
        if (value){
          this.getlabelcategoryList();
        }
      },
      //点击增加词槽
      addWordSolt() {
        this.dialogFormVisible = true
        this.wordSoltTitle = '添加词槽'
        this.getWordSlotList()

      },
      //编辑词槽
      editWordSolt(index, wordSoltObject) {
        this.getWordSlotList()
        this.dialogFormVisible = true
        this.wordSoltTitle = '编辑词槽'
        this.editIndex = index
        this.wordSoltForm.wordSlotChoice = wordSoltObject.userSlot
        this.wordSoltForm.radio = wordSoltObject.mustFill
        this.showClarifyUtterance = wordSoltObject.mustFill == 1 ? true : false
        this.wordSoltForm.clarifyUtterances = arrayForString(wordSoltObject.clarifyUtterance, "^_^")
        this.wordSoltForm.id = wordSoltObject.id
        this.wordSoltForm.clarifyOrder = wordSoltObject.clarifyOrder
        this.wordSoltForm.clearDialogueValue = wordSoltObject.clarifyNumber

      },
      //删除词槽
      deleteWordSolt(index){
        let target = this;
        setTimeout(function () {
          target.wordSoltlistData.splice(index, 1)
          for (let index in target.wordSoltlistData) {
            let wordSoltObj = target.wordSoltlistData[index]
            wordSoltObj.clarifyOrder = parseInt(index) + 1
          }
        }, 1);
      },
      //增加引导问题输入框
      // this.form.rules[itemindex].ruleDetails.splice(index,1)
      addGuideQuestion(itemindex) {
        this.form.rules[itemindex].guideQuestions.push('')
      },
      //删除引导问题输入框
      deleGuideQuestion(itemindex, index) {
        this.form.rules[itemindex].guideQuestions.splice(index, 1)
      },
      //词槽必填单选回调
      radioChange() {
        //清空无用数据
        this.wordSoltForm.clarifyUtterances = ['']//引导语
        this.wordSoltForm.clearDialogueValue = "1"//澄清几轮

        this.wordSoltForm.radio == 1 ?
          this.showClarifyUtterance = true :
          this.showClarifyUtterance = false
        if(this.wordSoltForm.radio == 0){
          //默认值下拉列表为模糊搜索 后端提供了搜索接口 不用再直接获取下拉列表了通过输入字符来获取
          // this.getdefaultValueArr(this.wordSoltForm.wordSlotChoice.slotUk)
        }
      },
      //查询规则详情
      async getRulesByRulesId(RulesId) {
        let params={
          id:RulesId,
        };
        let result = await robotConfigService.getByRulesId(params);
        debugger
        if (result.message.code == 0) {
          // result.data = JSON.parse(JSON.stringify(result.data));
          this.form.intentionObj = result.data.labels
          this.wordSoltlistData = result.data.slots
          this.form.rules = result.data.rules;
          result.data.slots.forEach((a,b)=>{
            a.defaultValue=JSON.parse(a.defaultValue)
          });
          this.form.rules.forEach((item,index)=>{
            item.guideQuestions=arrayForString(item.guideQuestions,'^_^');
            if(Array.isArray(item.ruleDetails)){
              item.ruleDetails.forEach((ite,inde)=>{
                this.$set(ite, 'paramsName', '');//赋值字段
                console.log(ite.conditionValue.length);
                if(ite.conditionProperty!='词槽数量' && ite.conditionProperty!=''){
                  //暂定
                  ite.conditionValue=JSON.parse(ite.conditionValue);
                }
                if(ite.conditionProperty==='词槽属性'){
                  let params=ite.userSlot.slotName;
                  ite.propertyInfo=JSON.parse(ite.propertyInfo);
                  ite.propertyInfoID=[Number(ite.propertyInfo[0].id)];
                  ite.paramsName= ite.propertyInfo[0].name;
                  this.getTree(params,inde,index);
                  let params2 = ite.propertyInfo[0].enumType;
                  if(params2){
                    this.getDictValue(params2,inde,index)
                  }else {
                    ite.conditionValue=ite.conditionValue[0].data
                  }
                }
                if(ite.conditionProperty==='词槽值'){
                  //处理数据因为elementUI(框架bug) select的远程搜索 多选模式下如果v-model绑定的值是对象的话 有不显示文本的bug，所以改为绑定值
                  let array = [];
                  ite.conditionValue.forEach((it,ind)=>{
                    array.push(it.rawValue)
                    this.copyConditionValue.push(it)
                  })
                  ite.conditionValue = array
                  // this.selectValueForSearchWordValue = ite.conditionValue

                  this.$set(this.form.rules[index].ruleDetails[inde], 'conditionValue', ite.conditionValue)



                }
                if(ite.conditionProperty === '词槽数量'){

                  // this.inputValueForWordNumber = ite.conditionValue
                  this.$set(this.form.rules[index].ruleDetails[inde], 'conditionValue', ite.conditionValue)

                }

              })
            }else{
              //ruleDetails字段没有返回 需要自己设置上否则无法新增条件 会报错
              this.form.rules[index].ruleDetails=[]

            }


          });

          // this.form.lastAction = result.data.lastAction
          // this.form.answer = this.tacticsData.actionConfInfo
          // this.guideQuestions = arrayForString(this.tacticsData.guideQuestions, "^_^")
          // if (this.guideQuestions.length == 0) {
          //   this.guideQuestions = [""]
          // }
        }
      },
      //获取非必填下拉列表
      async getdefaultValueArr(dictTypeId) {
        let params={
          dictTypeId:dictTypeId,
          cp:1,
          ps:50,
          includeFields:['baseName','dictId','dictTypeIds','dispName','id','source',]
        };
        let result = await robotConfigService.getDictByword(params);
        if (result.message.code == 0) {
          this.defaultValueArr = result.data.list;
        }
      },
      //搜索非必填下默认值
      async remoteSearch(value){
        let parmas ={
          type : this.wordSoltForm.wordSlotChoice.slotUk,
          query : value,
          count : 20,
        };
        this.searchWordValue(parmas);
      },

      async searchWordValue (params){
        this.loading = true
        let result = await semanticApiService.getSearchWordValue(params);
        this.loading = false
        if (result.message.code == 0){
          this.defaultValueArr = result.data;
        }
      },


      //添加澄清话术输入框
      addClarifyUtterance() {
        this.wordSoltForm.clarifyUtterances.push('')
      },
      //删除澄清话术输入框
      deleClarifyUtterance(index) {
        this.wordSoltForm.clarifyUtterances.splice(index, 1)
      },
      //新建策略/任务确定回调
      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            let obj = {};
            // obj.preview ='test';
            obj.labels = this.form.intentionObj;
            obj.rules = this.form.rules;
            obj.slots = this.wordSoltlistData;
            debugger
            obj.rules.forEach((a, b) => {
              if(Array.isArray(a.ruleDetails)){
                a.ruleDetails.forEach((c,d)=>{
                  if(c.conditionProperty==='词槽属性' &&  !c.propertyInfo[0].enumType){
                    c.conditionValue=[{
                      data:c.conditionValue,
                      displayData:c.conditionValue
                    }]
                  }
                  if(c.conditionProperty==='词槽数量'){
                    c.conditionValue= c.conditionValue
                  }else  if(c.conditionProperty==='词槽值'){
                    let array = c.conditionValue;
                    for (let i = 0;i<array.length;i++) {
                      for(let j = 0;j<this.copyConditionValue.length;j++){
                        if (array[i] === this.copyConditionValue[j].rawValue) {
                          array[i] = this.copyConditionValue[j]
                        }
                      }
                    }
                    c.conditionValue = array
                  }else  {
                    c.conditionValue=JSON.stringify(c.conditionValue)
                  }

                });
              }else {
                //当没有条件时编辑时该字段后端没有返回,但是不加上该字段接口又报错目前暂时加上，后续会和接口联调
                a.ruleDetails = []
              }
              a.guideQuestions = stringForArray(a.guideQuestions,'^_^');
            });
            obj.skillId = this.skillData.id;
            obj.taskId = this.taskId
            if (this.dialogTitle == "新建规则") {
              this.addTacticsRequest(obj)
            } else if (this.dialogTitle == "编辑规则") {
              obj.id = this.tacticsData.id
              this.editTacticsRequest(obj)
            }

          } else {
            return false;
          }
        });
      },
      //新建任务和编辑任务成功后回到任务列表
      gotoPage() {
        this.$router.push({
          path: '/tacticsmanagement?index=tacticsmanagement', query: {
            index: 'tacticsmanagement',
            robotName: this.robotName,
            skillData: JSON.stringify(this.skillData)
          }
        });
      },
      changeDate(dateValue) {
        let end = new Date(dateValue).getTime();
        this.wordSoltData.startAt = end;
        this.wordSoltData.endAt = end;
      },
      //词槽弹窗确定回调
      onSubmitWordSolt(wordSoltForm) {
        let showSlotChoiceWarning = false
        if (!this.wordSoltForm.clarifyUtterances[0]) {
          this.showWarningStr = true
        } else {
          this.showWarningStr = false
        }
        this.$refs[wordSoltForm].validate((valid) => {
          if (valid) {
            showSlotChoiceWarning = false
            //处理词槽table表格数据
            let userSlot = this.wordSoltForm.wordSlotChoice
            this.wordSoltData.clarifyNumber = parseInt(this.wordSoltForm.clearDialogueValue);
            this.wordSoltData.taskId = this.taskId;
            this.wordSoltData.skillId = this.skillData.id;
            this.wordSoltData.clarifyUtterance = stringForArray(this.wordSoltForm.clarifyUtterances, "^_^");
            this.wordSoltData.userSlot = userSlot;
            this.wordSoltData.mustFill = this.wordSoltForm.radio;
            this.wordSoltData.id = this.wordSoltForm.id;
            let this_=this;
            if(this.wordSoltForm.wordSlotChoice.slotType==='时间'){
              let obj={
                type:"最新时间",
                // startAt:new Date(this_.defaultValueTime).getTime(),
                // endAt:new Date(this_.defaultValueTime).getTime()
              };
              this.wordSoltData.defaultValue = obj
            }else {
              this.wordSoltData.defaultValue = this.wordSoltForm.defaultValue;
            }
          } else {
            showSlotChoiceWarning = true;
            return false;
          }
        });
        if ((!this.showClarifyUtterance && !showSlotChoiceWarning) || (!this.showWarningStr && !showSlotChoiceWarning)) {
          this.dialogFormVisible = false;
          if (this.wordSoltTitle == '添加词槽') {
            this.wordSoltData.clarifyOrder = this.wordSoltlistData.length + 1;
            this.wordSoltlistData.push(this.wordSoltData)
          } else if (this.wordSoltTitle == '编辑词槽') {
            this.wordSoltData.clarifyOrder = this.wordSoltForm.clarifyOrder;
            this.wordSoltlistData.splice(this.editIndex, 1, this.wordSoltData)
          }
        }

      },

      //词槽列表澄清话术需要处理在显示
      handleClarifyUtterance(clarifyUtterance) {
        let array = []
        array = arrayForString(clarifyUtterance, "^_^")
        return stringForArray(array, ";")
      },

      //澄清话术输入框回调方法
      blur() {
        if (!this.wordSoltForm.clarifyUtterances[0]) {
          this.showWarningStr = true
        } else {
          this.showWarningStr = false
        }
      },
      //弹窗打开的回调
      open() {

      },
      //弹窗关闭的回调
      close() {
         //关闭是清空数据
        this.resetData()
        this.wordSoltForm.radio = 1 //默认必填
        this.showClarifyUtterance = true
        this.showWarningStr = false
        this.$refs['wordSoltForm'].resetFields()//目前加上这句话关闭词槽弹窗是会报错 但不加上这就话每次打开弹窗都会显示验证的提示语
      },
      //清空数据
      resetData() {
        this.wordSoltForm.wordSlotChoice = ''//词槽选择
        this.wordSoltForm.clarifyUtterances = ['']//引导语
        this.wordSoltForm.clearDialogueValue = "1"//澄清几轮
        this.wordSoltData = {}
      },
      indexFilter(index) {
        return index + 1;
      },
      //下移
      downMove(index, row) {
        row.clarifyOrder = parseInt(row.clarifyOrder) + 1
        let wordSoltData = this.wordSoltlistData[index + 1]
        wordSoltData.clarifyOrder = parseInt(wordSoltData.clarifyOrder) - 1
        this.wordSoltlistData = this.arrayMove(this.wordSoltlistData, index, index + 1)
      },
      //上移
      upMove(index, row) {
        row.clarifyOrder = parseInt(row.clarifyOrder) - 1
        let wordSoltData = this.wordSoltlistData[index - 1]
        wordSoltData.clarifyOrder = parseInt(wordSoltData.clarifyOrder) + 1
        this.wordSoltlistData = this.arrayMove(this.wordSoltlistData, index, index - 1)
      },
      upMoveRules(index){
        this.form.rules = this.arrayMove(this.form.rules, index, index - 1)
      },
      downMoveRules(index){
        this.form.rules = this.arrayMove(this.form.rules, index, index + 1)
      },
      //arrayMove
      arrayMove(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      },
      //新窗口打开意图管理
      toIntentionManagement() {
        let routeUrl = this.$router.resolve({
          path: "/mytask",
          query: {
            taskType: 'DIALOGUE',
          }
        });
        window.open(routeUrl.href, '_blank');
      },
      //新增词槽
      addNewWordSolt() {
        this.showWordSoltDialog = true
        this.$refs.wordSoltDiaLog.getEntitySolitTypeList()
      },
      //关闭词槽对话框
      closeWordSoltDialog() {
        this.showWordSoltDialog = false
      },
      //新增答案
      addNewAnswer() {
        this.$refs.answer.requestTemplateList()
        this.showAnswerDialog = true

      },
      //关闭答案对话框
      closeAnswerDialog() {
        this.showAnswerDialog = false

      },
      //新增答案成功
      addNewAnswerSuccess() {
        this.getAnswerList()
      },
    },//methods

    created: function () {
      this.userId = getJoinCookie('userId');
      if (this.$route.query.skillData) {
        this.skillData = JSON.parse(this.$route.query.skillData)
        this.taskId = this.skillData.task.id
        this.robotName = this.$route.query.robotName
        if (this.$route.query.tacticsData) {
          this.tacticsData = JSON.parse(this.$route.query.tacticsData)
        }
      }
      this.getAnswerList()
      this.getlabelcategoryList()
      // this.getTree();
      if ($.isEmptyObject(this.tacticsData)) {
        this.dialogTitle = '新建规则'
      } else {
        this.dialogTitle = '编辑规则'
      }
      if(this.$route.query.RulesId){
        this.getRulesByRulesId(this.$route.query.RulesId)
      }

      //监听浏览器的tab切换回来后更新意图列表
      /*    document.addEventListener('visibilitychange',function(){
            //浏览器切换事件
            if(document.visibilityState=='hidden') {
              //离开当前tab标签
            }else {
              //回到当前tab标签
              this.getlabelcategoryList()
            }
          });*/
    },

    filters: {
      timeFilter:function(value) {
        let date = new Date(value);
        return (date) ? formatDate(date) : '--';
      },
    }


  }
</script>

<style>

  .el-step__description {
    padding-right: 3%;
  }
</style>

<style scoped>
  .ruleClass {
    width: 100%;
    border: solid 1px #e8e8eb;
    margin-bottom: 20px;
    color: initial;
  }

  .conditionClass {
    width: 100%;
    /*display: none*/
    display: block
  }

  .conditionClass .el-table {
    border-right: none;
    border-bottom: none
  }

  .ruleClass span.rule {
    color: #409EFF;
    padding: 0 20px;
    border-right: solid 1px #e8e8eb;
    background: #f3f0f6;
    height: 100%;
    display: inline-block;
    font-weight: bold;
    font-size: 16px;
    line-height: 46px
  }

  .breadcrumb {
    background-color: #fff;
    height: 45px;
    padding-left: 30px;
    line-height: 45px;
    text-align: center;
  }

  .intention,
  .lastAction,
  .answerName {
    margin-top: 20px;

  }

  .tableList {
    margin-top: 20px;
    margin-bottom: 60px;
  }

  .tableDelete {
    color: red;
    opacity: 0.7;
  }

  .el-icon-circle-plus-outline {
    color: #000;
    font-size: 20px;
    display: block;
    margin-top: 10px
  }

  .el-icon-circle-plus-outline span {
    font-size: 10px;
    line-height: 20px;
    vertical-align: 3px
  }

  .guideQuestion,
  .clarifyUtterance {
    margin-bottom: 10px;
  }

  .warningStr {
    font-size: 10px;
    color: red;
    opacity: 0.6;
  }

  .clearDialogue {
    width: 70px;
  }

  .contentViewheader {
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    border-bottom: 1px solid #DFE2E5;
    background-color: #fff;
    color: #000;
    padding-top: 10px;
    font-weight: bold;
    padding-left: 20px;
  }


</style>
