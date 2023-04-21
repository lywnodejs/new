<template>
  <div style="background: #f2f2f2;padding:10px;">
    <div class="clearfix" style="height: 40px;background: #fff;padding:0 10px;margin-bottom:10px;">
      <span class="fl" style="line-height:40px;font-size:15px;">对象知识</span>
      <el-button type="primary" size="mini" class="fr" style="margin-left:20px;margin-top:6px;" @click="addBtn">添加</el-button>
      <el-button type="primary" size="mini" class="fr" style="margin-top: 6px;" @click="batchBtn">批量添加</el-button>
    </div>

    <div style="background: #fff; margin-top:10px;padding:10px;">
      <div>
        <el-radio-group v-model="typeCheckVal" size="medium" @change="statusChange">
          <el-radio-button label="全部" ></el-radio-button>
          <el-radio-button label="已审核"></el-radio-button>
          <el-radio-button label="待审核"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="clearfix" style="margin-top:20px;">
          <span class="fl" style="line-height:30px;font-size: 14px;">知识点类型：</span>
          <el-select class="fl" v-model="knowledgeLxVal" size="small" placeholder="请选择" @change="knowledgeZsdChange">
            <el-option
              v-for="item in knowledgeLxList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <span class="fl" style="line-height:30px;font-size: 14px;margin-left:10px;">实体类型：</span>
          <el-select class="fl" v-model="knowledgeTypeVal" filterable placeholder="请输入或选择" size="small" @change="knowledStgeChange">
            <el-option
              v-for="item in allTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span class="fl" style="line-height:30px;font-size: 14px;margin:0 10px;">日期区间</span>
          <div class="block fl">
            <el-date-picker
             @change="knowledgeRqChange"
              size="small"
              v-model="dateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
      </div>
      <div class="" style="margin-top:20px;">
          <span class="" style="line-height:30px;font-size: 14px;margin-left:10px;">数据来源：</span>
          <el-select v-model="dataLyVal" class="" size="small" placeholder="请选择" @change="dataTypeChange">
            <el-option
              v-for="item in dataLyList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <span class="" style="line-height:30px;font-size: 14px;margin-left:10px;">知识来源：</span>
          <el-select v-model="knowledgeLyVal" class="" size="small" placeholder="请选择" @change="knowledgeZslyChange">
            <el-option
              v-for="item in knowledgeInit"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
      </div>
      <div style="margin-top:20px;margin-bottom:20px;">
        <el-input
          style="width: 300px;margin-right:10px;"
          placeholder="请输入要查找的实体名称"
          prefix-icon="el-icon-search"
          size="small "
           @keyup.enter.native="searchBtn"
          v-model="searchVal">
        </el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchBtn">搜索</el-button>
      </div>

      <!-- <div class="clearfix" style="height: 40px;background: #fff;margin-bottom:10px;">
        <span class="fl" style="line-height:40px;font-size:15px;">数据列表</span>
        <el-button type="primary" size="mini" class="fr" style="margin-left:20px;margin-top:6px;">批量删除</el-button>
        <el-button type="primary" size="mini" class="fr" style="margin-left:20px;margin-top:6px;">批量通过</el-button>
      </div> -->

        <div>
          <el-table
          :data="tableData"
          border
          style="width: 100%">
          <!-- <el-table-column
            type="selection"
            width="55">
          </el-table-column> -->
          <el-table-column
            prop="entityLeftName"
            label="实体名称"
            width="100">
          </el-table-column>
          <el-table-column
            prop="knowledge.knowledgeType"
            label="知识点类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="entityLeftTypeName"
            label="实体类型"
            width="100">
          </el-table-column>
          <el-table-column
            min-width='180'
            label="知识点">
            <template slot-scope="scope">
              <div style="width:100%;height:100px;overflow-y:scroll;cursor:pointer;" @click="knowlegePointerBtn(scope.row.knowledge)">
                <div v-if="getObjDataType(scope.row.knowledge.text || '')">
                  {{
                    (scope.row.knowledge.text || '')}}
                </div>
                <div v-else>
                  {{scope.row.knowledge.text || ''}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="数据来源">
            <template slot-scope="scope">
              <div>
                <el-tag v-if="scope.row.dataSource != ''" size="mini">{{scope.row.knowledge.dataSource}}</el-tag>
              </div>
              <div style="cursor: pointer;" @click="dataInitBtn(scope.row.knowledge)">{{scope.row.knowledge.title}}</div>
            </template>
          </el-table-column>
            <el-table-column label="发布时间" width="80">
              <template slot-scope="scope">
                {{ scope.row.knowledge.publishAt | timeDateFormatChange}}
              </template>
            </el-table-column>
          <el-table-column label="审核状态" width="80">
            <template slot-scope="scope">
              {{scope.row.knowledge.humanFlag==='0'?'未审核':'已审核'}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="editBtnApi(scope.row)"
                >编辑</el-button>
              <el-button
                size="mini"
                @click="ifTongGuo(scope.row)"
                >{{scope.row.knowledge.humanFlag==='0'?'通过':'取消通过'}}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteBtnApi(scope.row)"
                >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination align="center"
                      :current-page.sync="page.cp"
                      :page-size="page.ps"
                      class="pagination"
                      layout="total, prev, pager, next, jumper"
                      :total="page.total"
                      @current-change="pageChange">
        </el-pagination>
      </div>

    </div>

    <!-- 添加弹出框 -->
    <el-dialog title="添加" class="widthChange" :visible.sync="adddMoreListFlag" style="width:100%;margin: auto;">
      <el-form style="width: 450px;">
        <el-form-item label="实体名称" :label-width="labelWidth">
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
              :label="item.disName+'-'+item.type"
              :value="item.dictId+','+item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="实体类型" :label-width="labelWidth">
          <el-select class="fl" v-model="knowledgeTypeValAdd" filterable placeholder="请输入或选择" size="small" style="width:250px;">
            <el-option
              v-for="item in allTypeListAdd"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="知识点类型" :label-width="labelWidth">
          <el-select class="fl" v-model="knowledgeLxValAdd" size="small" placeholder="请选择" style="width:250px;">
            <el-option
              v-for="item in knowledgeLxListAddSelf"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="券商" :label-width="labelWidth">
          <el-input v-model="editTypeCs" placeholder="请输入" size="small" style="width:250px;"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" :label-width="labelWidth">
          <el-date-picker
            size="small"
            style="width:250px;"
            v-model="dataTimeAddFb"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="知识点" :label-width="labelWidth">
          <el-input v-model="editTypeZsd" type="textarea" :rows="2" placeholder="请输入" size="small" style="width:250px;"></el-input>
        </el-form-item>
        <el-form-item label="数据源" :label-width="labelWidth">
          <el-select v-model="dataLyValAdd" class="" size="small" placeholder="请选择" style="width:250px;">
            <el-option
              v-for="item in dataLyListSelf"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" :label-width="labelWidth">
          <el-input size="small" v-model="evidenceTitle" placeholder="请输入标题" style="width:250px;"></el-input>
        </el-form-item>
        <el-form-item label="链接" :label-width="labelWidth">
          <el-input size="small" v-model="evidenceUrl" placeholder="请输入链接" style="width:250px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddMoreListFlag = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="sureAddBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 数据来源弹出框 -->
    <el-dialog title="资讯名称" :visible.sync="dataInitDialog" style="margin: auto;">
      <div>
        <div class="dataInitTitle">{{dataInitTitle}}</div>
        <div style="margin-top: 20px">
          <el-form>
            <el-form-item label="切换页码：" v-if="pagesList.length>1">
              <el-radio-group v-model="pagesVal" size="medium">
                <el-radio-button v-for="item in pagesList" :label="item">{{item}}</el-radio-button>
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
    <!-- 知识点弹出框 -->
    <el-dialog title="相关知识点" :visible.sync="knowlegePointerDialog" style="margin: auto;">
      <div style="margin-bottom:10px;">券商：{{qsZsdName}}</div>
      <div class="clearfix" style="margin:10px 0;" v-for="item,index in knowTextList">
        <div v-show="item">
          <div>发展趋势：</div>
          <div>{{item.text}}</div>
          <el-button size="small" class="fr" style="margin-top:10px;" @click="zsdAdoptBtn(item,index)">采纳</el-button>
        </div>
      </div>
      <div v-show="!knowTextList.length>0" style="text-align:center;">
        暂无内容
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="knowlegePointerDialog = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="knowlegePointerDialog = false">确 定</el-button>
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
        <el-button type="primary" @click="deleteLIstData">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑弹出框 -->
    <el-dialog title="编辑" class="widthChange" :visible.sync="editMoreListFlag" style="width:100%;margin: auto;">
      <el-form>
        <el-form-item label="实体名称" :label-width="labelWidth">
          <el-select
             style="width: 250px;"
              size="small"
            v-model="editDate.entityLeftId"
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
              :label="item.disName+'-'+item.type"
              :value="item.dictId+','+item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="知识点类型" :label-width="labelWidth">
          <el-select class="fl" v-model="editDate.knowledgeType" size="small" placeholder="请选择" style="width:250px;">
            <el-option
              v-for="item in knowledgeLxListAdd"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="券商" :label-width="labelWidth">
          <el-input v-model="editDate.organization" placeholder="请输入" size="small" style="width:250px;"></el-input>
        </el-form-item>
        <el-form-item label="知识点" :label-width="labelWidth">
          <el-input v-model="editDate.text" type="textarea" :rows="2" placeholder="请输入" size="small" style="width:250px;"></el-input>
        </el-form-item>
        <el-form-item label="数据源" :label-width="labelWidth">
          <el-select v-model="editDate.dataSource" class="" size="small" placeholder="请选择" style="width:250px;">
            <el-option
              v-for="item in dataLyList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" :label-width="labelWidth">
          <el-input size="small" v-model="editDate.title" placeholder="请输入标题" style="width:250px;"></el-input>
        </el-form-item>
        <el-form-item label="链接" :label-width="labelWidth">
          <el-input size="small" v-model="editDate.textUrl" placeholder="请输入链接" style="width:250px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editMoreListFlag = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="editSureAddBtn">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 批量操作 -->
    <el-dialog title="批量导入" :visible.sync="batchDialogFlag" style="width: 100%;margin: auto;">
      <div>导入说明：</div>
      <div style="line-height:30px;margin-bottom:20px;">导入文件为EXCEL格式，请按照模板进行信息填写，<span style="color:#f00">红色</span>表头为必填项，
      其他请参考模板格式，<a style="color:blue;text-decoration:none" href="https://rxhui-knowledge.oss-cn-beijing.aliyuncs.com/DataTemplate.zip">点击下载模板</a></div>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/entityWay/knowledge/object/fileupload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="onloadSuccess"
        :on-error="onloadError"
        :file-list="fileList"
        :limit='1'
        :data="uploadData"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入</el-button>
      </el-upload>
      <!-- <div style="margin-top:20px;text-align:center;">
        <img src=".././assets/u163.png" alt="">
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchDialogFlag = false" size="small">取 消</el-button>
        <!-- <el-button type="primary" @click="saveSureBtn" size="small">确 定</el-button> -->
      </div>
    </el-dialog>
    <!-- 导入成功 -->
    <el-dialog title="批量导入" :visible.sync="successDialogFlag" style="width: 100%;margin: auto;">
      <div style="text-align:center;">
        <div style="line-height:30px;margin-bottom:20px;">共{{onloadSuccessData.totalNum}}条数据，导入成功{{onloadSuccessData.successNum}}条，失败{{onloadSuccessData.failNum}}条</div>
        <a :href="onloadSuccessData.fileInfo.httpFilePath" style="display:block;margin-bottom: 20px;">{{onloadSuccessData.fileInfo.originName}}</a>
        <el-button type="primary" @click="keepOnload" size="small">继续导入</el-button>
        <el-button @click="successDialogFlag = false" size="small">取 消</el-button>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSureBtn" size="small">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { entityAddService,spriteKeyService  } from "../config/serviceConfig";
import { formatDate } from "../../utils/commonUtil";
import relationSearch from "../components/RelationSearch";
import $ from 'jquery'
export default {
  name: "HelloWorld",
  data() {
    return {
      page: {
        cp: 1,
        ps: 10,
        total: 0,
      },
      labelWidth: '90px',
      knowledgeTypeVal: '',
      dataLyList: [],
      knowledgeInit: [],
      adddMoreListFlag: false,
      knowledgeType: [],
      searchVal: '',
      dateValue: '',
      dataLyVal:'',
      knowledgeLyVal: '',
      typeCheckVal: '全部',
      knowledgeLxList: [],
      knowledgeLxVal: '',
      knowledgeTypes: [],
      knowledgeTypesVal: '',
      tableData: [],
      editTypeName: '',
      editTypeCs:'',
      editTypeZsd: '',
      checkDataLy: '研报',
      checkDataInit: '',
      allTypeList: [],
      dataInitDialog: false,
      dataInitTitle: '',
      dataInitUrl: '',
      isStockSearching: false,
      stockTable: [],
      entityNameVal: '',
      evidenceTitle: '',
      editDataLyVal: '',
      evidenceUrl: '',
      dataLyValAdd: '',
      knowlegePointerDialog: false,
      dataTimeAddFb: '',
      pagesList:[],
      pagesVal: '',
      evidenceRow: '',
      num: 0,
      knowTextList: [],
      qsZsdName: '',
      knowledgeTypeValAdd: '',
      knowledgeLxValAdd: '',
      knowledgeLxListAdd: [],
      allTypeListAdd: [],
      ifDeleteFlag: false,
      editMoreListFlag: false,
      editDate: {
        entityLeftId: '',//实体名称
        knowledgeType: '',//知识点类型
        organization: '',//券商
        text: '',//知识点
        dataSource: '',//数据源
        title: '',//标题
        textUrl: '',//链接
      },
      editLeftId: [],
      knowledgeLxListAddSelf: [],
      dataLyListSelf: ['研报','年报','季报','晨报'],
      addApiFlag: 0,
      batchDialogFlag: false,
      fileList: [],
      uploadData: {},
      successDialogFlag: false,
      onloadSuccessData: {
        fileInfo: {httpFilePath: ''}
      }
    };
  },
  mounted: function() {
    this.allEntityType();
    this.getSourceList();//数据来源
    this.searchBtn();
  },
  watch:{
    pagesVal(page) {
      if (this.num>0) {
        let n = Math.round(Math.random()*100);
        this.dataInitUrl = this.evidenceRow.textUrl+'?='+n+'#page='+page;
        var frame = document.getElementById('iframe1');
        frame.src = this.dataInitUrl;
      }
      this.num++
    },
    'editDate.entityLeftId':{
      handler: function(e) {
        if (e.indexOf(',') !== -1) {
          let arr = e.split(',');
          this.editLeftId = arr;
        }
      }
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    onloadSuccess(mes){
      this.batchDialogFlag = false;
      this.successDialogFlag = true;
      this.onloadSuccessData = mes.data;
      this.fileList = []

    },
    onloadError(mes){
      this.$message({
        message: '上传失败！',
        type: 'error',
      });
    },
    keepOnload() {
      this.batchDialogFlag = true;
      this.successDialogFlag = false;
    },
    batchBtn() {
      this.batchDialogFlag = true;
    },
    getObjDataType(data) {
      console.log(data)
      if (data.indexOf('{') == -1) {
        return false
      } else {
        return true;
      }
    },
    getObjData(obj) {
      return JSON.parse(obj).text || ''
    },
    //全部实体类型
    async allEntityType () {
      var result = await entityAddService.allEntityType();
      this.allTypeListAdd = result.data || [];
      this.allTypeList = result.data || [];
      this.allTypeList.unshift({name: '全部',id: ''});
    },
    setClassName({ row, index }) {
      // 通过自己的逻辑返回一个class或者空
      return row.expand ? "expand" : "";
    },
    //查询数据来源、知识来源
    async getSourceList(type) {
      let params = {
        fields: ['knowledgeType','dataSource','kbSource']
      }

      let result = await entityAddService.getAllSourceList(params);
      if (result.message.status === 200) {
        let data = result.data || {};
        this.knowledgeLxList = data.knowledgeType||[];//知识点类型
        this.knowledgeLxListAddSelf = data.knowledgeType||[];//知识点类型-添加框
        this.knowledgeLxListAdd = data.knowledgeType||[];//知识点类型-编辑框
        this.dataLyList = data.dataSource||[];//数据来源
        this.knowledgeInit = data.kbSource||[];//知识来源
        this.knowledgeLxList.unshift('全部');
        this.dataLyList.unshift('全部');

        this.knowledgeLxVal = this.knowledgeLxList[0];
        this.dataLyVal = this.knowledgeLxList[0];
        this.knowledgeLyVal = this.knowledgeLxList[0];
      }
    },
    //搜索接口
    async searchBtn() {
      let timeArr = this.dateValue || [];
      //审核标志
      let humanFlag = '',
          knowledgeType = this.knowledgeLxVal,
          entityLeftTypeId = this.knowledgeTypeVal,
          dataSources = this.dataLyVal,
          kbSources = this.knowledgeLyVal;
      if (this.typeCheckVal === '已审核') {
        humanFlag = '1';
      } else if (this.typeCheckVal === '待审核') {
        humanFlag = '0';
      }
      if (this.knowledgeLxVal == '全部') {
        knowledgeType = '';
      }
      if (this.knowledgeTypeVal == '全部') {
        entityLeftTypeId = '';
      }
      if (this.dataLyVal == '全部') {
        dataSources = '';
      }
      if (this.knowledgeLyVal == '全部') {
        kbSources = '';
      }
      this.searchVal = $.trim(this.searchVal);
      let params={
        knowledgeType: knowledgeType,//知识点类型
        entityLeftTypeId: entityLeftTypeId,//实体类型id
        dataSources: dataSources,//数据来源
        kbSources: kbSources,//知识来源
        startAt: timeArr.length !=0 ?new Date(timeArr[0]).getTime(): '',//开始时间
        endAt: timeArr.length !=0 ?new Date(timeArr[1]).getTime(): '',//结束时间
        entityLeftName: this.searchVal,//搜索内容
        humanFlag: humanFlag,//审核标志
        cp: this.page.cp,
        ps: this.page.ps,
        deleteFlag: '0',
      }
      let res = await entityAddService.getObjSearchList(params);
      //过滤掉已经删除的数据
      let removeData = res.data.list || [];
      // for (let i = 0; i< removeData.length; i++) {
      //   if (removeData[i].knowledge.deleteFlag === '1') {
      //     removeData.splice(i,1);
      //     i--;
      //   }
      // }
      this.page.total = res.data.totalCount || 0;
      this.tableData = removeData || [];
      $('.el-table__body').parent().scrollTop(0);
    },
    //添加
    addBtn() {
      this.adddMoreListFlag = true;
      this.entityNameVal = '';
      this.editTypeCs = '';
      this.editTypeZsd = '';
      this.dataLyValAdd = '';
      this.evidenceTitle = '';
      this.evidenceTitle = '';
      this.evidenceUrl = '';
      this.knowledgeTypeValAdd = null;
      this.knowledgeLxValAdd = '';
      this.dataTimeAddFb = '';

      $('.widthChange .el-dialog').css('width','450px')
    },
    //添加-调用添加接口
    async sureAddBtn() {
      let knowledgeType = this.knowledgeLxValAdd;
      let nArr = [];
      if (!this.entityNameVal) {
        this.$message({
          message: '实体名称不能为空！',
          type: 'warning',
        });
        return;
      } else {
        nArr = this.entityNameVal.split(',');
      }

      if (this.knowledgeLxValAdd == '全部') {
        knowledgeType = ''
      }
      if(!knowledgeType) {
        this.$message({
          message: '请选择知识点类型！',
          type: 'warning',
        });
        return;
      }
      let publishAt = new Date().getTime(this.dataTimeAddFb) || '';
      let params = {
        entityLeftId:nArr[0],//实体名称
        knowledgeType: knowledgeType,//知识点类型
        entityLeftTypeId: nArr[1],//实体类型id
        organization: this.editTypeCs,//券商
        text: this.editTypeZsd,//知识点
        dataSource: this.dataLyValAdd,//数据源
        title: this.evidenceTitle,//标题
        textUrl: this.evidenceUrl,//链接
        kbType: '0',
        publishAt: publishAt,
      }
      console.log(params)
      this.addApiFlag ++
      if (this.addApiFlag > 1){
        return;
      }
      let res = await entityAddService.getAddObjList(params);
      if (res.message.status === 200) {
        this.$message({
          message: '添加成功！',
          type: 'success',
          onClose: ()=>{
            this.addApiFlag = 0;
          }
        });

        this.adddMoreListFlag = false;
        this.searchBtn();
      }
    },
    //是否通过
    async ifTongGuo(row) {
      let params = row.knowledge;
      if (params.humanFlag === '0') {
        params.humanFlag = '1';
      } else if (params.humanFlag === '1') {
        params.humanFlag = '0';
      }
      let res = await entityAddService.getAddObjList(params);
      if (res.message.status === 200) {
        this.$message({
          message: '修改成功！',
          type: 'success',
        });
        // setTimeout(() => {
        //   this.searchBtn();
        // }, 1000);
      }
    },
    deleteBtnApi(row) {
      this.deleteRow = row;
      this.ifDeleteFlag = true;
    },
    //删除
    async deleteLIstData() {
      let row = this.deleteRow;
      let params = row.knowledge;
      if (params.deleteFlag === '0') {
        params.deleteFlag = '1';
      } else if (params.deleteFlag === '1') {
        params.deleteFlag = '0';
      }
      let res = await entityAddService.getAddObjList(params);
      if (res.message.status === 200) {
        this.$message({
          message: '删除成功！',
          type: 'success',
        });
        this.ifDeleteFlag = false;
        this.searchBtn();
      }
    },
    //数据来源弹出框
    dataInitBtn(row) {
      console.log(row)
      this.evidenceRow = row;
      this.dataInitDialog = true;
      this.dataInitTitle = row.title;
      let page = row.pages && row.pages.length>0 && row.pages[0] || 1;
      this.pagesList = row.pages || [];
      this.dataInitUrl = row.textUrl + '#page='+ page;
    },
    pageChange(page) {
      this.page.cp = page;
      this.searchBtn();
    },
    //搜索实体名称
    async searchEntityName(value) {
      // console.log(value)
      if (value) {
        let params = {
          //type: '11',
          query: value,
          count: 6
        }
        let result = await spriteKeyService.getEntityNameList(params);
        // console.log(result)
        this.isStockSearching = false;
        if (result && result.data) {
          this.stockTable = result.data;
        } else {
          this.stockTable = [];
        }
      } else {
        this.stockTable = [];
      }
    },
    //知识点弹出框
    async knowlegePointerBtn(row) {
      this.zsdDataValTwo = row;
      this.knowlegePointerDialog = true;
      this.qsZsdName = row.organization;
      let params = {
        knowledgeId: row.id || ''
        //knowledgeId: 'f8ff2c335291cc4da2e90b5aa8b24c46'
      }
      let res = await entityAddService.getAddObjZsdData(params);
      if (res.message.status === 200) {
        let data = res.data || {};
        this.knowTextList = data.textCandidate || [];
        this.zsdDataVal = data || {};
      }
    },
    //采纳
    async zsdAdoptBtn(text,index) {
      let obj = this.zsdDataVal || {}
      obj.textCandidate = [{
        isKnowledge: true,
        text: text
      }];
      let params = {
        knowledgeCandidate: obj
      }
      let obj1 = this.zsdDataValTwo;
      obj1.text = text;
      obj1.humanFlag = '1';
      let params1 = obj1;
      let res = await entityAddService.getObjAdoptData(params);
      let result = await entityAddService.getAddObjList(params1);
      if (result.message.status === 200) {
        this.$message({
          message: '修改成功！',
          type: 'success',
        });
        this.knowlegePointerDialog = false;
        setTimeout(()=>{
          this.searchBtn();
        },500)
      }
    },
    //编辑
    async editBtnApi(row) {
      console.log(row)
      let typeName = ''
      if (row.entityLeftTypeName) {
        typeName = '-'+row.entityLeftTypeName
      }
      this.editRow = row.knowledge;
      this.editDate.entityLeftId = row.entityLeftName + typeName;//实体名称
      this.editDate.knowledgeType = row.knowledge.knowledgeType;//知识点类型
      this.editDate.organization = row.knowledge.organization;//券商
      this.editDate.text = row.knowledge.text;//知识点
      this.editDate.dataSource = row.knowledge.dataSource;//数据源
      this.editDate.title = row.knowledge.title;//标题
      this.editDate.textUrl = row.knowledge.textUrl;//链接
      this.editMoreListFlag = true;

      $('.widthChange .el-dialog').css('width','450px')
    },
    //编辑调用接口
    async editSureAddBtn(row) {
      let obj = this.editRow;
      if (this.editLeftId.length >0) {
        obj.entityLeftId = this.editLeftId[0];//实体名称
        obj.entityLeftTypeId = this.editLeftId[1];//实体类型id
      }
      obj.knowledgeType = this.editDate.knowledgeType;//知识点类型
      obj.organization = this.editDate.organization;//券商
      obj.text = this.editDate.text;//知识点
      obj.dataSource = this.editDate.dataSource;//数据源
      obj.title = this.editDate.title;//标题
      obj.textUrl = this.editDate.textUrl;//链接
      let params = obj;
      let res = await entityAddService.getAddObjList(params);
      if (res.message.status === 200) {
        this.$message({
          message: '修改成功！',
          type: 'success',
        });
        this.editMoreListFlag = false;
        this.searchBtn();
      }
    },
    statusChange(e) {//状态
      this.typeCheckVal = e;
      this.searchBtn();
    },
    knowledgeZsdChange(e) {//知识点类型
      this.knowledgeLxVal = e;
      this.searchBtn();
    },
    knowledStgeChange(e) {//实体类型
      this.knowledgeTypeVal = e;
      this.searchBtn();
    },
    knowledgeRqChange(e) {//日期
      this.dateValue = e;
      this.searchBtn();
    },
    dataTypeChange(e) {//数据来源
      this.dataLyVal = e;
      this.searchBtn();
    },
    knowledgeZslyChange(e) {//知识来源
      this.knowledgeLyVal = e;
      this.searchBtn();
    }
  },
};
</script>

<style scoped>
.el-table{
  width:99.9%!important;
}
.clearfix:after {
	content:"";
	display:block;
	height:0;
	clear:both;
	visibility:hidden;
}
.clearfix { clear: both; }
.fl{float: left}
.fr{float: right;}
.dataInitTitle{
  text-align:center;
  line-height: 35px;
  font-size: 16px;
  font-weight: bold;
}
.el-dialog{
  width: 450px!important;
  background: #f00;
}
</style>
