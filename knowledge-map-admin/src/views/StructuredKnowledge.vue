<template>
  <div style="background:#f2f2f2;padding:10px;">
    <div class="clearfix" style="height: 40px;background: #fff;padding:0 10px;margin-bottom:10px;">
      <span class="fl" style="line-height:40px;font-size:15px;">结构化知识</span>
      <el-button type="primary" size="mini" class="fr" style="margin-left:20px;margin-top:6px;" @click="addFlagBtn">添加</el-button>
    </div>
    <div style="background:#fff;padding:10px;">
      <el-row>
          <el-radio-group v-model="typeCheckVal" size="medium" @change="statusChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="true">已审核</el-radio-button>
            <el-radio-button label="false">待审核</el-radio-button>
          </el-radio-group>
      </el-row>
      <div style="height: 10px"></div>
      <el-form label-position="left" :inline="true" :model="queryModel" :rules="rules" ref="ruleForm"
              class="demo-ruleForm structure">
        <el-row>
          <el-col :span="24">
            <el-form-item label="知识点类型" prop="knowledgeType" >
              <el-select size="small" filterable v-model="queryModel.knowledgeType" placeholder="请选择知识点类型" @change="knowledgeZsdChange">
                <el-option v-for="(item,index) in knowledgeTypeArr" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据来源" prop="evidenceType">
              <el-select size="small" v-model="queryModel.evidenceType" placeholder="请选择数据来源" @change="dataInitChange">
                <el-option v-for="(item,index) in evidenceTypeArr" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="知识来源" prop="region2">
              <el-select size="small" v-model="queryModel.knowledgeSourceVal" placeholder="请选择知识点来源类型" @change="knowledgeZsdLyChange">
                <el-option v-for="(item,index) in knowledgeSourceTypeArr" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="实体类型" prop="entityType">
              <el-select v-model="editTypeVal" filterable placeholder="请选择" style="width:250px;" size="small" @change="knowledgeStChange">
              <el-option
                style="width:250px;"
                v-for="item in allTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="日期区间" prop="timeField" >
              <el-date-picker size="small"
                              @change="dateValChange"
                              v-model="queryModel.timeField"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="" prop="name">
              <el-input size="small"
                        style="width: 300px"
                        placeholder="请输入要查询的实体关键词"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="submitForm('ruleForm')"
                        v-model="queryModel.name">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="submitForm('ruleForm')">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <span>列表数据</span>
          <!-- <span style="float: right">
                <el-button size="small">批量删除</el-button>
                <el-button size="small">批量通过</el-button>
          </span> -->
        </el-col>
      </el-row>
      <!--数据列表-->
      <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="实体名称" width="120" prop="entityDisplayName"></el-table-column>
        <el-table-column prop="entityTypeName" label="实体类型" width="100"></el-table-column>
        <el-table-column min-width="300px"  v-for="(item, index) in tableData[0]&&tableData[0].knowledge" :label='item.name' :key='index'>
          <template slot-scope="scope">

            <div v-if="typeof(scope.row.knowledge[index].value) == 'object'">
              <el-table v-if="scope.row.knowledge[index].value.length" border :data="scope.row.knowledge[index].value"  max-height="200">
                <el-table-column show-overflow-tooltip v-for="(item,index) in getCul(scope.row.knowledge[index].value[0])" :label="item" :prop="item"></el-table-column>
              </el-table>
            </div>
            <div v-else>
              {{scope.row.knowledge[index].value}}
            </div>

          </template>
        </el-table-column>
        <el-table-column label="数据来源" width="150" :formatter="formatTime">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.evidenceType != ''" size="mini">{{scope.row.evidenceType}}</el-tag>
            </div>
            <div style="cursor: pointer;" @click="dataInitBtn(scope.row)">{{scope.row.evidenceTitle}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="evidencePublishDate" label="发布时间" width="150" :formatter="formatTime"></el-table-column>
        <el-table-column label="审核状态" width="120">
          <template slot-scope="scope">
            {{scope.row.isPassed?'已通过':'未通过'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button @click="editListBtn(scope.row)" type="button" size="mini">编辑</el-button>
            <el-button @click="deleteBtn(scope.row)" type="button" size="mini">删除</el-button>
            <el-button @click="examnieBtn(scope.row)" type="button" size="mini">{{scope.row.isPassed?'取消通过':'通过'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination align="center"
                    :current-page.sync="queryModel.cp"
                    :page-size="queryModel.ps"
                    class="pagination"
                    layout="total, prev, pager, next, jumper"
                    :total="totalCount"
                    @current-change="pageChange">
      </el-pagination>
      <!--<el-table border :data="arr">
        <el-table-column v-for="(item,index) in arrc" :label="item" :prop="item"></el-table-column>
      </el-table>-->

      <!-- Form -->
      <el-dialog title="添加" class="widthChange" :visible.sync="dialogFormVisible" style="margin: auto;">
        <el-form>
          <el-form-item label="知识点类型" :label-width="addWidth">
            <el-select v-model="typeVal" placeholder="请选择" @change="getTabelData" style="width: 250px;" size="small">
              <el-option
                v-for="item in knowledgeTypeArr"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实体名称" :label-width="addWidth">
            <el-select
              style="width: 250px;"
                size="small"
              v-model="entityNameVal"
              filterable
              clearable
              remote
              default-first-option
              value-key="key"
              loading-text="查询中..."
              no-match-text="无匹配"
              no-data-text="无"
              :loading="isStockSearching"
              placeholder="请输入"
              :reserve-keyword="false"
              :remote-method="searchEntityName"
            >
              <el-option
                v-for="item in stockTable"
                :key="item.key"
                :label="item.disName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实体类型"  :label-width="addWidth">
            <el-select v-model="addTypeVal" filterable placeholder="请选择" style="width:250px;" size="small">
              <el-option
                style="width:250px;"
                v-for="item in allTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
            <div v-if="!ifString">
              <!-- 多个列表 -->
              <div class="addSingelClass" v-show="doubelArr.length>0" v-for="item,index in doubelArr">
                <div>{{item.name}}</div>
                <div v-for="item,twoIndex in item.value">
                  <el-form-item v-for="childArr,cIndex in item" :label="childArr.name" :label-width="addWidth">
                    <el-input v-model="childArr.text" @input="changeDoubelInputVal(childArr.text,index,twoIndex,cIndex)" placeholder="请输入" size="small" style="width:250px;"></el-input>
                  </el-form-item>
                </div>
                <div class="dialog-footer" style="width:130px;margin: auto;">
                  <el-button type="primary" size="small" @click="addDoubelBtn(index)">添加</el-button>
                  <el-button type="danger" size="small" @click="removeDoubelBtn(index)">删除</el-button>
                </div>
              </div>

              <!-- 单个列表 -->
              <div class="addSingelClass" v-show="singelArr.length>0" v-for="item,index in singelArr">

                <el-form-item v-for="childArr,cIndex in item" :label="childArr.name" :label-width="addWidth">
                  <el-input v-model="childArr.text" @input="changeInputVal(childArr.text,index,cIndex)" placeholder="请输入" size="small" style="width:250px;"></el-input>
                </el-form-item>
              </div>

              <div class="dialog-footer" style="width:130px;margin: auto;">
                <el-button v-show="singelArr.length>0 && !ifString" type="primary" size="small" @click="addDtListBtn">添加</el-button>
                <el-button v-show="singelArr.length>0 && !ifString" type="danger" size="small" @click="removeDtListBtn">删除</el-button>
              </div>
            </div>

            <div class="addSingelClass" v-if="ifString">
              <el-form-item v-for="item,index in addDtArrList" :label="item.name" :label-width="addWidth">
                <el-input v-model="item.text" placeholder="请输入" size="small" style="width:250px;"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="数据源" :label-width="addWidth">
              <el-select size="small" v-model="editDataLy" placeholder="请选择数据来源" style="width:250px;">
                <el-option v-for="(item,index) in evidenceTypeAddArr" :label="item" :value="item" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题" :label-width="addWidth">
              <el-input size="small" v-model="evidenceTitle" placeholder="请输入标题" style="width:250px;"></el-input>
            </el-form-item>
            <el-form-item label="内容" :label-width="addWidth">
              <el-input
                style="width: 250px;font-size:12px;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="editDataLyVal">
              </el-input>
            </el-form-item>
            <el-form-item label="链接" :label-width="addWidth">
              <el-input size="small" v-model="evidenceUrl" placeholder="请输入链接" style="width:250px;"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="sureAddBtn">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑多条数据 -->
      <el-dialog title="编辑" class="widthChange" :visible.sync="editDialogMoreFlag" style="margin: auto;">
        <el-form>
          <div v-for="(item,index) in editDtArrList">
            <el-form-item v-for="itemChild,indexChild in item" :label="itemChild.name" :label-width="addWidth">
              <el-input v-model="itemChild.value" placeholder="请输入" size="small" style="width:250px;"></el-input>
            </el-form-item>
          </div>
        </el-form>

        <!-- 多个列表 -->
        <div v-if="editDoubelArr.length>0" v-for="items,index in editDoubelArr">
          <div>{{items.name}}</div>
          <div v-for="itemt in items.value">
            <el-form>
              <el-form-item v-for="item,index in itemt" :label="item.name" :label-width="addWidth">
                <el-input v-model="item.value" placeholder="请输入" size="small" style="width:250px;"></el-input>
              </el-form-item>
            </el-form>
          </div>

        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogMoreFlag = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="editSingelDataWay">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 数据来源弹出框 -->
      <el-dialog title="数据来源" :visible.sync="dataInitDialog" style="margin: auto;">
        <div>
          <div class="dataInitTitle">{{dataInitTitle}}</div>
          <div style="margin-top: 20px">
            <el-form>
              <el-form-item label="切换页码：" v-if="evidence_page_numberArr.length>1">
                <el-radio-group v-model="evidence_page_numberVal" size="medium">
                  <el-radio-button v-for="item in evidence_page_numberArr" :label="item" @click="changeEvidencePage(item)">{{item}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <iframe id="iframe1" :src="dataInitUrl" style="width:100%;height:500px;"></iframe>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dataInitDialog = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="dataInitDialog = false">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 删除提示 -->
      <el-dialog
        title="提示"
        :visible.sync="ifDeleteFlag"
        width="30%">
        <span>是否确定删除？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ifDeleteFlag = false">取 消</el-button>
          <el-button type="primary" @click="deleteBtnApi">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {structrudService,entityAddService,spriteKeyService} from '../config/serviceConfig'
  import {formatDate} from '../../utils/commonUtil';
  import $ from 'jquery'

  export default {
    name: "StructuredKnowledge",
    data() {
      return {
        test: '123',
        queryModel: {
          knowledgeType: '',
          evidenceType: '',
          knowledgeSourceVal: '',//知识来源
          evidenceTypeVal: '', //数据来源
          cp: 1,
          ps: 10,
        },
        totalCount: 0,
        entityNameVal: '',
        stockTable: [],
        isStockSearching: false,
        dataInitDialog: false,
        typeVal: '',
        entityName: '',
        editDq: '',
        editXbl: '',
        edit25Xbl: '',
        editNf: '',
        loading: false,
        options4: [],
        addDtArrList: [],
        typeValList: [
          {
            value: '公司董事会股东会议案投票事件',
            label: '公司董事会股东会议案投票事件'
          }
        ],
        typeNameVal: '',
        typeNameList: [
        ],
        columnArr: [],
        addWidth: '90px',
        knowledgeTypeArr: [],
        tableData: [
          {
            knowledge:[]
          }
        ],
        rules: {
          knowledgeType: [
            {required: true, message: '请选择知识点类型', trigger: 'change'}
          ]
        },
        dialogFormVisible: false,
        addForm: {
          editTypeName: ''
        },
        knowledgeArr: [],
        //弹框-多数据
        editDialogMoreFlag: false,
        editDtArrList: [],
        ifExamnieFlag: '通过',
        ifDeleteFlag: false,
        editTypeVal: '',//实体类型
        allTypeList: [],
        typeCheckVal: '',
        editDataLy: '',
        editDataLyVal: '',
        addTypeVal: '',
        tableAddData: [],
        dataInitTitle: '',
        dataInitUrl: '',
        knowledgeSourceTypeArr: [],
        evidenceTypeArr:[],
        singelArr: [],
        ifString: false,
        doubelArr: [],
        doubelEditArr: [],
        editDoubelArr: [],
        evidenceUrl: '',
        evidenceTitle: '',
        evidenceTypeAddArr: [],
        evidence_page_numberArr: [],
        evidence_page_numberVal: '',
        num:0,
        addApiFlag: 0,
      }
    },
    mounted() {
      this.allEntityType();
      this.getSourceEntityData();
    },
    watch:{
      evidence_page_numberVal(page) {
        if (this.num>0) {
          let n = Math.round(Math.random()*100);
          this.dataInitUrl = this.evidenceRow.evidenceUrl+'?='+n+'#page='+page;
          var frame = document.getElementById('iframe1');
          frame.src = this.dataInitUrl;
        }
        this.num++
      }
    },
    methods: {
      //全部实体类型
      async allEntityType () {
        let result = await entityAddService.allEntityType();
        this.allTypeList = result.data || [];
        this.allTypeList.unshift({name: '全部',value: ''})
      },
      //获取数据来源，知识来源，知识点类型
      async getSourceEntityData () {
        let params = {
          groupTypeList: 'knowledgeType,evidenceType,knowledgeSourceType',
        }
        let result = await structrudService.getSourceEntityData(params);
        if (result.message.status === 200) {
          let data = result.data || {}
          this.knowledgeTypeArr = data.knowledgeType || [];//知识点类型
          if (this.knowledgeTypeArr.length > 0) {
            this.queryModel.knowledgeType = this.knowledgeTypeArr[0]
          }
          this.evidenceTypeArr = data.evidenceType || [];//数据来源
          this.evidenceTypeAddArr = data.evidenceType || [];//数据来源
          this.knowledgeSourceTypeArr =  data.knowledgeSourceType || [];//知识来源
          this.knowledgeSourceTypeArr.unshift('全部');
          this.evidenceTypeArr.unshift('全部');
          this.getList(this.queryModel);
        }
      },
      selectBlur(e) {
        this.entityName = e.target.value
      },
      getCul(arr){
        let culArr=[];
        for(let i in arr){
          culArr.push(i)
        }
        return culArr
      },
      //分页变化
      pageChange(page) {
        this.queryModel.cp = page;
        this.getList(this.queryModel)
      },
      formatTime(value, row) {
        let date = new Date(value[row.property]);
        return date ? formatDate(date) : '';
      },
      submitForm() {
        let timeArr = this.queryModel.timeField || [];
        let entityType = '';//实体类型
        let evidenceType = '';//数据来源
        let knowledgeSourceType = '';//知识来源
        if (this.editTypeVal === '全部') {
          entityType = '';
        } else {
          entityType = this.editTypeVal;
        }
        if (this.queryModel.evidenceType === '全部') {
          evidenceType = '';
        } else {
          evidenceType = this.queryModel.evidenceType;
        }
        if (this.queryModel.knowledgeSourceVal === '全部') {
          knowledgeSourceType = '';
        } else {
          knowledgeSourceType = this.queryModel.knowledgeSourceVal;
        }
        this.queryModel.name= $.trim(this.queryModel.name);
        let params = {
          isPassed: this.typeCheckVal,//审核状态
          knowledgeType: this.queryModel.knowledgeType,//知识点类型
          entityType: entityType,//实体类型
          startAt: timeArr.length !=0 ?new Date(timeArr[0]).getTime(): '',//开始时间
          endAt: timeArr.length !=0 ?new Date(timeArr[1]).getTime(): '',//结束时间
          timeField: 'evidencePublishDate',//时间类型
          evidenceType: evidenceType,//数据来源
          knowledgeSourceType: knowledgeSourceType,//知识点来源
          entityId:this.queryModel.name,//实体名称
        }
        this.getList(params)
      },
      handleSelectionChange() {

      },
      //获取列表
      async getList(params) {
        let res = await structrudService.getList(params);
        if (res.message.code === 0) {

          if (res.data.list.length > 0) {
            //过滤掉已经删除的数据
            let removeData = res.data.list || [];
            for (let i = 0; i< removeData.length; i++) {
              if (!removeData[i].isValid) {
                removeData.splice(i,1);
                i--;
              }
            }
            this.tableData = removeData;
            this.totalCount = res.data.totalCount || 0;
            //console.log(this.tableData)
            this.gobelName = res.data.list[0].knowledge[0] && res.data.list[0].knowledge[0].name || '';
            this.columnArr = [];
            res.data.list[0].knowledge.forEach((item, index) => {
              this.columnArr.push(item.name)
            })
          } else {
            this.tableData = [];
          }

        }
      },
      removeSingelData() {

      },
      //添加
      async addFlagBtn() {
        this.dialogFormVisible = true;
        this.typeVal = '';
        this.typeNameVal = '';
        this.addTypeVal = '';
        this.entityNameVal = '';
        this.editDataLy = '';
        this.editDataLyVal = '';
        this.doubelArr = [];
        this.singelArr = [];
        this.addDtArrList = [];
        this.evidenceTitle = '';
        this.evidenceText = '';
        this.evidenceUrl = '';
        $('.widthChange .el-dialog').css('width','450px')
      },
      //添加-//确定添加数据
      async sureAddBtn() {
        //添加单个表格时的数据校验
        let arr = this.singelArr|| [];
        let knowledge = [];
        if (arr.length > 0) {
          let flag = false;
          if (flag) {
            return;
          }
          for (let i = 0; i<arr.length; i++) {
            for (let j = 0; j<arr[i].length; j++) {
              if (!arr[i][j].text) {
                this.$message({
                  message: arr[i][j].name + '为必填项！',
                  type: 'warning'
                });
                flag = true;
                return;
              } else {
                flag = false;
              }
            }
          }

          if (flag) {
            return;
          }
          let res = [];
          //console.log(arr)
          for (let k =0; k<arr.length; k++) {
            let obj = {};
            for (let a = 0; a<arr[k].length; a++) {
              obj[arr[k][a].name] = arr[k][a].text
            }
            res.push(obj)
          }
          knowledge = [{
            evidence_page_number: [],
            name: this.singeTabelName,
            value: res,
          }]
          //console.log(knowledge)
        } else if (this.doubelArr.length > 0) {//添加多个表格数据
          let douArr = this.doubelArr;
          let flag = false;
          //console.log(douArr)
          douArr.map(item=>{
            if (flag) {
              return;
            }
            let a = item.value;
            for (let i = 0; i<a.length; i++) {
              for (let j = 0; j<a[i].length; j++) {
                if (!a[i][j].text){
                  //console.log(a[i][j])
                  this.$message({
                    message: a[i][j].name+'为必填项！',
                    type: 'warning'
                  });
                  flag = true;
                  return;
                } else {
                  flag = false;
                }
              }
            }
          });
          if (!flag) {
            douArr.map(item=>{
              let val = item.value;
              let iArr = [];
              for (let a = 0; a<val.length; a++ ) {
                let obj = {};
                for (let b = 0; b<val[a].length; b++) {
                  obj[val[a][b].name] = val[a][b].value;
                }
                iArr.push(obj)
              }
              knowledge.push({
                evidence_page_number: [],
                name: item.name,
                value: iArr,
              })
            })
            //console.log(knowledge)
          }
        } else if (this.addDtArrList.length > 0) {
          let strArr = this.addDtArrList;
          let res = [];
          let obj = {};
          for (let i =0; i<strArr.length; i++) {
            knowledge.push({
              evidence_page_number: [],
              name: strArr[i].name,
              value: strArr[i].text
            })
          }
        }
        let params = {
          knowledgeType: this.typeVal,//知识点类型
          entityType: this.addTypeVal,//实体类型
          entityId: this.entityNameVal.baseName || '',//实体名称
          evidenceType: this.editDataLy, //数据源类型
          evidenceText: this.editDataLyVal,//数据源内容
          evidenceTitle: this.evidenceTitle,//数据源标题
          evidenceUrl: this.evidenceUrl,//数据源链接
          knowledge: knowledge,
        }
        //console.log(params)
        this.addApiFlag ++
        if (this.addApiFlag > 1){
          return;
        }
        let res = await structrudService.addMore([params]);
        if (res.message.status === 200) {
          this.$message({
            message: '添加成功！',
            type: 'success',
            onClose: ()=>{
              this.addApiFlag = 0;
            }
          });

          this.dialogFormVisible = false;
          this.getList(this.queryModel);
        }
      },
      //添加时，调用接口获取动态表头
      async getTabelData() {
        this.singelArr = []; //清空单个列表数据
        this.doubelArr = []; //清空单个列表数据
        let params = {
          knowledgeType: this.typeVal,
          entityId: this.typeNameVal
        }
        let res = await structrudService.getList(params);
        this.ifString = false;

        //过滤掉已经删除的数据
        let removeData = res.data.list || [];
        for (let i = 0; i< removeData.length; i++) {
          if (!removeData[i].isValid) {
            removeData.splice(i,1);
            i--;
          }
        }
        let tarArr = [],
            resArr = [],
            apiName = '';
        if (removeData.length) {
          tarArr = removeData[0] && removeData[0].knowledge[0].value[0] || {};
          let knowledge = removeData[0] && removeData[0].knowledge || [];
          if (typeof(tarArr) === 'object') {
            // this.singelArr = []; //清空单个列表数据
            // this.doubelArr = []; //清空单个列表数据
            this.addDtArrList = [];
            if (knowledge.length > 1) { //多个列表
              let doubelArr = [];
              knowledge.map(item => {
                let resArr = []
                let arr = this.objToArr(item.value[0]);
                let doubelAddArr = this.objToArr(item.value[0]);
                doubelArr.push({
                  name: item.name,
                  value: [arr],
                  addValue: doubelAddArr
                });
              })
              this.doubelArr = doubelArr;
            } else { //单个列表
              let singelObj = knowledge[0].value[0];
              this.singeTabelName = knowledge[0].name;

              let singelArr = this.objToArr(singelObj);
              this.singelArrAdd= this.objToArr(singelObj);
              this.singelArr.push(singelArr);
            }

            this.ifString = false;
          } else {
            let strArr = removeData[0].knowledge || [];
            for (let i = 0; i<strArr.length; i++) {
              resArr.push({
                name: strArr[i].name,
                value: '',
                tableName: strArr[0].name,
              })
            }
            this.addDtArrList = resArr;
            //console.log(this.addDtArrList)
            this.ifString = true;
          }
        }
      },
      objToArr(obj) {
        let resArr = [];
        for (let key in obj) {
          resArr.push({
            name: key,
            value: '',
          })
        }
        return resArr;
      },
      //添加-多个列表中添加数据
      addDoubelBtn(index) {
        this.doubelArr[index].value.push(this.doubelArr[index].addValue)
      },
      //添加-多个列表中删除数据
      removeDoubelBtn(index) {
        if(this.doubelArr[index].value.length > 1) {
          this.doubelArr[index].value.pop();
        }
      },
      // //添加时，改变多个表格的值
      changeDoubelInputVal(val,one,two,three) {
        this.doubelArr[one].value[two][three].value = val;
      },
      // //添加时，改变单个表格的值
      changeInputVal(val,one,two) {
        this.singelArr[one][two].value = val;
      },
      //添加-//单个列表，添加多条数据
      async addDtListBtn() {
        //console.log(this.singelArrAdd)
        this.singelArr.push(this.singelArrAdd);
      },
      //添加-//单个列表，删除多条数据
      removeDtListBtn() {
        if (this.singelArr.length > 1) {
          this.singelArr.pop();
        }
      },
      //编辑
      async editListBtn(row) {
        $('.widthChange .el-dialog').css('width','450px')
        //console.log(row)
        this.rowId = row.id;
        this.editDialogMoreFlag = true;
        let knowledge = row.knowledge || [];
        let ifString = false;
        let lastA = [];
        let s = [];
        this.editDoubelArr = [];
        this.editDtArrList = []
        if (typeof(knowledge[0].value) === 'object') {
          this.ifString = false;
          if (knowledge.length > 1) {//多个表格
            let last = []
            knowledge.map(item=>{
              let arrRes = []
              let arr = item.value;
              for (let i = 0; i<arr.length; i++) {
                let inArr = [];
                for (let key in arr[i]) {
                  inArr.push({
                    name: key,
                    value: arr[i][key]
                  })
                }
                arrRes.push(inArr)
              }
              last.push({
                name: item.name,
                value: arrRes
              })
            })
            //console.log(last)
            this.editDoubelArr = last;
          } else { //单个表格
            lastA = this.commonAddEdit(knowledge);
          }
        } else {
          this.ifString = true;
          for (let i = 0; i<knowledge.length; i++) {
            s.push({
              name: knowledge[i].name,
              value: knowledge[i].value,
            })
          }
          lastA.push(s)
        }
        this.editDtArrList = lastA;
      },
      commonAddEdit(knowledge) {
        let lastA = [];
        knowledge.map((item)=>{
          let arr = item.value || [];
          for (let i = 0; i<arr.length; i++) {
            let sinArr = [];
            for (let key in arr[i]) {
              sinArr.push({
                name: key,
                value: arr[i][key]
              })
            }
            lastA.push(sinArr)
          }
        })
        return lastA;
      },
      //编辑-//封装传给接口的数据
      // changeSingelInputVal(val,pi,ci) {
      //   if (val) {
      //     this.editDtArrList[pi][ci].value = val;
      //   }
      // },
      //调用编辑接口
      async editSingelDataWay() {
        let knowledge = []
        if (!this.ifString) {
          if (this.editDoubelArr.length > 0) {//多个表格
            //console.log(this.editDoubelArr)
            let arrg = this.editDoubelArr;
            arrg.map(item=>{
              let arr = item.value;
              let res = [];
              for (let i = 0; i<arr.length; i++) {
                let obj = {};
                for (let j = 0; j<arr[i].length; j++) {
                  for (let key in arr[i][j]) {
                    obj[arr[i][j].name] = arr[i][j].value;
                  }
                }
                res.push(obj);
              }
              knowledge.push({
                evidence_page_number: [],
                name: item.name,
                value: res
              })
            })
            //console.log(knowledge)

          } else {
            let lastArr = this.returnFormListData(this.editDtArrList);
            knowledge = {
              name:this.gobelName,
              value: lastArr,
              evidence_page_number: []
            }
          }
        }else {
          //console.log(this.editDtArrList)
          let strA = this.editDtArrList[0];
          knowledge = []
          for (let i = 0; i<strA.length; i++) {
            knowledge.push({
              evidence_page_number: [],
              name: strA[i].name,
              value: strA[i].value
            })
          }
        }
        let params = {
          id: this.rowId,
          isPassed: false,
          knowledge: knowledge
        }
        let res = await structrudService.editMore(params);
        if (res.message.status === 200) {
          this.$message({
            message: '修改成功！',
            type: 'success',
          });
          this.editDialogMoreFlag = false;
          this.getList(this.queryModel)
        }
      },
      //审核
      async examnieBtn(row) {
        let passFlag = false;
        if(row.isPassed) {
          passFlag = false;
        } else {
          passFlag = true;
        }
        let params = {
          isPassed: passFlag,
          knowledgeIdList: [row.id]
        }
        let res = await structrudService.examineWay(params);
        if (res.message.status === 200) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.getList(this.queryModel);
        }
      },
      //删除
      async deleteBtn(row) {
        this.deleteId = row.id;
        this.ifDeleteFlag = true;
      },
      //删除-调用删除接口
      async deleteBtnApi() {
        let params = {
          isValid: false,
          knowledgeIdList: [this.deleteId]
        }
        let res = await structrudService.deleteApiWay(params);
        if (res.message.status === 200) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.ifDeleteFlag = false;
          this.getList(this.queryModel);
        }
      },
      returnResArrData(arr) {
        let res = [];
        arr.map(item=>{
          let resArr = [];
          for (let key in item.value[0]) {
            resArr.push({
              name: key,
              value: '',
            })
          }
          res.push({
            name: item.name,
            value: resArr
          })
        })

        return res;
      },
      //将接口中的数据封装为数组结构
      returnFormListData(a) {
        let lastArr = [],
            rArr = [];
        for (let i = 0; i<a.length; i++) {
          let obj = {};
          for(let j =0; j<a[i].length; j++) {
            obj[a[i][j].name] = a[i][j].value
          }
          lastArr.push(obj);
        }
        return lastArr;
      },
      //数据来源弹出框
      dataInitBtn(row) {
        this.dataInitDialog = true;
        //console.log(row)
        this.evidenceRow = row;
        this.dataInitTitle = row.evidenceTitle; //标题
        this.evidence_page_numberArr = row.knowledge[0].evidence_page_number || [];
        this.evidence_page_numberVal = this.evidence_page_numberArr[0];
        this.dataInitUrl = row.evidenceUrl + '#page='+ this.evidence_page_numberVal;
        $('.el-dialog').css('width','50%');
      },
      //搜索实体名称
      async searchEntityName(value) {
        // console.log(value)
        if (value) {
          let params = {
            type: '11',
            query: value,
            count: 6
          }
          let result = await spriteKeyService.getEntityNameList(params);
          // console.log(result)
          this.isStockSearching = false;
          if (result && result.data.list) {
            this.stockTable = result.data.list;
          } else {
            this.stockTable = [];
          }
        } else {
          this.stockTable = [];
        }
      },
      statusChange(e) {//状态
        this.typeCheckVal = e;
        this.submitForm();
      },
      knowledgeZsdChange(e) {//知识点类型
        this.queryModel.knowledgeType = e;
        this.submitForm();
      },
      dataInitChange(e) {//数据来源
        this.queryModel.evidenceType = e;
        this.submitForm();
      },
      knowledgeZsdLyChange(e) {//知识来源
        this.queryModel.knowledgeSourceVal = e;
        this.submitForm();
      },
      knowledgeStChange(e) {//实体类型
        this.editTypeVal = e;
        this.submitForm();
      },
      dateValChange(e) {//日期
        this.queryModel.timeField = e;
        this.submitForm();
      }
    },
    created() {

    },
    components: {},
    filters: {}
  }
</script>

<style scoped>
  .title {
    position: relative;
    padding-left: 10px
  }

  .title:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 5px;
    background: #f3a64b;
    left: 0;
    top: 0;
  }
  .el-table {
    width: 99.9% !important;
  }
  .dataInitTitle{
    text-align:center;
    line-height: 35px;
    font-size: 16px;
    font-weight: bold;
  }
  .addSingelClass{
    background:#ccc;
  }

  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .clearfix {
    zoom: 1;
  }
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }

  /*.structure .el-form-item{margin-bottom: 5px;}*/
</style>
