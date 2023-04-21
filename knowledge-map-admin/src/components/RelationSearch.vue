<template>
  <div>
    <el-row class="condition">
    <!--  <el-row style="text-align: right; font-size: 12px;height:40px;padding-bottom: 20px" type="flex" align='middle'  v-if="!showDateMessage">
        <el-col :span="24" align="right">
          <div>批量上传实体关系 <el-button size="small" type="primary"  @click="addMoreData">上传</el-button></div>
        </el-col>
      </el-row>-->
      <el-row style="text-align: left; font-size: 12px;background-color:#20a0ff;height:40px;color:white" type="flex" align='middle'>
        <div style="padding:20px">
          <i class="el-icon-search" style="margin-right: 6px"></i>
          <span>实体&关系筛选</span>
        </div>
      </el-row>
      <el-form ref="form" :model="form" label-width="80px" >
        <el-row class="searchPanel" :gutter="20" style="font-size:12px" type="flex" align="middle">
            <el-col :span="12" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"  >
              <el-row style="text-align:center;padding-bottom:10px">
                <el-row type="flex" justify="end">
                  <el-col></el-col>
                  <el-col>左实体</el-col>
                  <el-col></el-col>
                  <el-col>右实体</el-col>
                </el-row>
              </el-row>
              <el-row type="flex" align="middle">
                <el-col :span="4" class="pannel-bottom">
                  <el-row>
                    <el-col>选择实体</el-col>
                    <el-col>实体名称</el-col>
                  </el-row>
                </el-col>
                <el-col :span="8" class="pannel-bottom">
                  <el-col :span="24">
                    <div>
                      <el-select v-model="entityLeftType" filterable @change="leftTypeChange">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div>
                      <el-autocomplete
                        clearable
                        popper-class="my-autocomplete"
                        v-model="entityLeft"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"
                        @select="handleSelect">
                        <template slot-scope="{ item }">
                          <div class="name">{{ item.label }}</div>
                          <span v-if="entityLeftType=='stock'" class="addr">{{ item.code }}</span>
                        </template>
                      </el-autocomplete>
                    </div>
                  </el-col>
                </el-col>
                <el-col :span="4" class="pannel-bottom">
                  <el-row type="flex" justify="center">
                    <i class="fa fa-2x fa-chain"></i>
                  </el-row>
                </el-col>
                <el-col :span="8" class="pannel-bottom">
                  <el-col :span="24">
                    <div>
                      <el-select v-model="entityRightType" filterable @change="rightTypeChange">
                        <el-option
                          v-for="item in optionsRight"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div>
                      <el-autocomplete
                        popper-class="my-autocomplete"
                        v-model="entityRight"
                        :fetch-suggestions="querySearchRight"
                        placeholder="请输入内容"
                        @select="handleSelectRight">
                        <template slot-scope="{ item }">
                          <div class="name">{{ item.label }}</div>
                          <span v-if="entityRightType=='stock'" class="addr">{{ item.code }}</span>
                        </template>
                      </el-autocomplete>
                    </div>
                  </el-col>
                </el-col>
              </el-row>
            </el-col>
            <!--右半部分-->
            <el-col :span="12" style="text-align: center">
              <el-row type="flex" justify="end">
                <el-col></el-col>
                <el-col></el-col>
                <el-col>
                  &nbsp;
                </el-col>
                <el-col>
                  &nbsp;
                </el-col>
              </el-row>
              <el-row type="flex" align="middle" class="pannel-bottom">
                <el-col :span="6">
                  实体关系：
                </el-col>
                <el-col :span="10">
                  <el-autocomplete
                    class="inline-input"
                    v-model="knowledgeType_label"
                    :fetch-suggestions="querySearchRelation"
                    placeholder="请输入内容"
                    @select="handleSelectRelation"
                  ></el-autocomplete>
                </el-col>
                <el-col :span="4">
                  <el-button type="success" @click="up" >搜索</el-button>
                </el-col>
                <el-col :span="4" v-if="!showDateMessage">
                  <el-button type="success" @click="add" >添加</el-button>
                </el-col>
              </el-row>
              <el-row type="flex" align="middle" class="pannel-bottom" v-if="showDateMessage">
                <el-col :span="6">
                  时间区间：
                </el-col>
                <el-col :span="16">
                  <el-date-picker style="width:100%"
                                  v-model="value7"
                                  type="daterange"
                                  align="left"
                                  unlink-panels
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  :picker-options="pickerOptions2">
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-col>

        </el-row>
      </el-form>
    </el-row>
    <!--添加实体&&实体关系弹窗-->
    <el-dialog title="添加实体&实体关系" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="左实体：" :label-width="formLabelWidth">
          <span>{{this.entityLeftType == 'stock'? '公司':'行业&产品'}}</span>--<span >{{this.entityLeft}}</span>
        </el-form-item>
        <el-form-item v-if="this.knowledgeType=='INDUSTRY_STOCK_RELATION'" label="左实体原始值：" :label-width="formLabelWidth">
          <el-input placeholder="请输入内容" v-model="entityLeftOri"></el-input>
        </el-form-item>
        <el-form-item label="右实体：" :label-width="formLabelWidth" v-if="this.entityRightType!='none'">
          <span>{{this.entityRightType_}}</span>--<span>{{this.entityRight}}</span>
        </el-form-item>
        <el-form-item v-if="this.knowledgeType=='INDUSTRY_STOCK_RELATION'" label="右实体原始值：" :label-width="formLabelWidth">
          <el-input placeholder="请输入内容" v-model="entityRightOri"></el-input>
        </el-form-item>
        <el-form-item label="实体关系：" :label-width="formLabelWidth">
          <span>{{this.knowledgeType_label}}</span>
        </el-form-item>
        <el-form-item label="因果关系：" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="textareaValue">
          </el-input>
        </el-form-item>
      </el-form>
      <i style="font-size: 11px;font-style: normal;color: red;">*实体关系为行业个股关系时，因果关系为必填项</i>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="Sure">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量导入预览弹窗-->
    <el-dialog title="批量添加" :visible.sync="dialogAddVisible">
      <el-form ref="AddForm" :model="AddForm" label-width="80px" >
      <el-form-item  v-if="!showDateMessage">
        <template>
          <el-row>
            <el-col :span="24" align="right">
              <el-upload
                style="float: right"
                action="/ajax/knowledge/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <el-button size="small" type="primary"  >上传   <i class="el-icon-upload"></i></el-button>
              </el-upload>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      </el-form>
      <el-table :data="AddlistData" border v-loading="showListLoading"  height="340" style="width: 100%;" :row-class-name="tableRowClassName">
        <el-table-column align="center" width="50" label="序号"  type="index" :index="indexFilter"></el-table-column>
        <el-table-column label="左实体" width="100">
          <template slot-scope="scope">
            <span v-html="scope.row.entityLeft"></span>
          </template>
        </el-table-column>
        <el-table-column width="100" prop="entityRight" label="右实体"></el-table-column>
        <el-table-column width="100" prop="knowledgeType" label="实体关系" ></el-table-column>
        <el-table-column label="因果关系" prop="text"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="SureUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {compareDate,formatDate} from '../../utils/commonUtil';
  import { searchService,entityService } from '../config/serviceConfig'
  export default {
    props:['showDateMessage','options','optionsRight','entityLeft_fake','entityRight_fake'],
    name: 'HelloWorld',
    data () {
      return {
        errorData:true,
        AddForm:{},
        queryModel: {
          cp: 1,
          ps: 10,
        },
        version_pro:true,
        entityLeftOri:'',//左实体原始值
        entityRightOri:'',//右实体原始值
        showListLoading:false,
        AddlistData:[],//批量添加列表数据
        dialogAddVisible:false,//批量添加列表弹窗
        entityRightType_:'',
        dialogFormVisible:false,
        formLabelWidth: '120px',
        entityLeft:this.entityLeft_fake,//左实体
        entityRight:this.entityRight_fake,//右实体
        relationsMessage:[],
        currentPage:1,
        textareaValue:'',
        pageSize:10,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        multipleSelection:[],
        knowledgeType:'',
        knowledgeType_label:'',
        showDate:true,
        entityLeftType: '',
        entityRightType:'',
        value9: [],
        list: [],
        loading: false,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value6: '',
        value7: '',
        entityLeftCode:'',
        entityRightCode:'',
        restaurants:
        [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
      { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
      { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
      { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
    ]
      }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (row.knowledgeType=='INDUSTRY_STOCK_RELATION' && row.text=='null') {
          this.errorData=false;
          return 'warning-row';
        }
        if (row.entityLeft=='null' || row.entityLeft=='' || row.knowledgeType=='') {
          this.errorData=false;
          return 'warning-row';
        }
        return '';
      },
      up(){
          let chooseObj={
            entityLeft:this.entityLeftCode,
            entityRight:this.entityRightCode,
            entityLeftType:this.entityLeftType,
            entityRightType:this.entityRightType,
            knowledgeType:this.knowledgeType,
            cp:this.currentPage,
            ps:this.pageSize
          };
          if(this.entityRightCode==''){
            chooseObj.entityRight=this.entityRight;
          }
          if(this.entityRightType=='stock' && this.entityRightCode=='' ) {
            if (isNaN(this.entityRight)) {
              this.$message({
                type: 'warning',
                message: '实体选择公司时，请不要输入文字名称'
              });
              return
            }
          }
          if(this.entityLeftCode==''){
            chooseObj.entityLeft=this.entityLeft;
          }
        if(this.entityLeftType=='stock' && this.entityLeftCode=='' ) {
          if (isNaN(this.entityLeft)) {
            this.$message({
              type: 'warning',
              message: '实体选择公司时，请不要输入文字名称'
            });
            return
          }
        }
          if(this.value7){
            let minAt={minAt:new Date(this.value7[0]).getTime()};
            let maxAt={maxAt:new Date(this.value7[1]).getTime()};
            console.log(minAt)
            Object.assign(chooseObj, minAt,maxAt );
          }
          if(compareDate(chooseObj.minAt,chooseObj.maxAt)){
            chooseObj.maxAt=chooseObj.minAt+24*60*60*1000;
          }
          this.$emit('result-change',chooseObj)
      },
      add(){
        if(this.entityRightType=='stock'){
          this.entityRightType_='公司'
        }else if(this.entityRightType=='industryOrproduct'){
          this.entityRightType_='行业&产品'
        }else {
          this.entityRightType_='无'
        }
        if(this.entityLeftType=="stock" && this.entityLeftCode==''){
          this.$message({
            type: 'warning',
            message: '左实体为公司，请选择实体名称'
          });
          return;
        }
        if(this.entityLeft==""){
          this.$message({
            type: 'warning',
            message: '请输入左实体名称'
          });
          return;
        }
        if(this.entityRightType=="stock" && this.entityRightCode==''){
          this.$message({
            type: 'warning',
            message: '右实体为公司，请选择实体名称'
          });
          return;
        }
        if(this.entityRightType != "none" && this.entityRight==""){
          this.$message({
            type: 'warning',
            message: '请输入右实体名称'
          });
          return;
        }

        if(this.knowledgeType==''){
          this.$message({
            type: 'warning',
            message: '请选择一个实体关系'
          });
          return;
        }
        this.dialogFormVisible=true;
      },

      async Sure(){
        let params=[{
          cp:this.currentPage,
          ps:this.pageSize,
          entityLeft:this.entityLeftCode,
          entityRight:this.entityRightCode,
          knowledgeType:this.knowledgeType,
          knowledgeTypeName:this.knowledgeType_label,
          text:this.textareaValue,
          docID:'custom'
        }];
        if(this.knowledgeType=='INDUSTRY_STOCK_RELATION'){
          params=[{
            cp:this.currentPage,
            ps:this.pageSize,
            entityLeft:this.entityLeftCode,
            entityRight:this.entityRightCode,
            knowledgeType:this.knowledgeType,
            knowledgeTypeName:this.knowledgeType_label,
            text:this.textareaValue,
            docID:'custom',
            entityLeftOri:this.entityLeftOri,
            entityRightOri:this.entityRightOri
          }]
        }
        let searchData={
          cp:this.currentPage,
          ps:this.pageSize,
          entityLeft:this.entityLeftCode,
          entityRight:this.entityRightCode,
          knowledgeType:this.knowledgeType,
          text:this.textareaValue,
          docID:'custom'
        };
        if(this.entityLeftCode==''){
          params[0].entityLeft=this.entityLeft;
          searchData.entityLeft=this.entityLeft
        }
        if(this.entityRightCode==''){
          params[0].entityRight=this.entityRight;
          searchData.entityRight=this.entityRight
        }

        if(this.knowledgeType=='INDUSTRY_STOCK_RELATION' && this.textareaValue==''){
            this.$message({
              type: 'warning',
              message: '实体关系为行业个股关系时，因果关系为必填项'
            });
            return;
        }
        if(this.knowledgeType=='INDUSTRY_STOCK_RELATION' && this.entityLeftOri==''){
          this.$message({
            type: 'warning',
            message: '实体关系为行业个股关系时，原始值必填'
          });
          return;
        }
        if(this.knowledgeType=='INDUSTRY_STOCK_RELATION' && this.entityRightOri==''){
          this.$message({
            type: 'warning',
            message: '实体关系为行业个股关系时，原始值必填'
          });
          return;
        }
        debugger
        let res = await entityService.addKnowledgeType(params);
        if(res.message.code==0 && res.data==true){
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          this.textareaValue="";
          this.dialogFormVisible = false;
          this.$emit('result-change',searchData)
        }
      },
      leftTypeChange(value){
        this.knowledgeType_label='';
        this.getRealtionData()
      },
      rightTypeChange(value){
        this.knowledgeType_label='';
        this.getRealtionData()
      },
      //获取实体关系
      async getRealtionData(){
        if(this.entityLeftType=='' || this.entityRightType==''){
           return
        }
        this.relationsMessage=[];
        this.knowledgeType='';
        let params={
          entityLeftType:this.entityLeftType,
          entityRightType:this.entityRightType,
        };
        let res = await entityService.getRealtion(params);
        // debugger
        this.relationsMessage=res.data;

      },

      //键盘精灵
      async querySearch(queryString, cb) {
        if(!queryString) return;
        let params={
          query:queryString,
          size:this.size
        };
        let res;
        if(this.entityLeftType=='stock'){
          res = await searchService.promptStock(params)
        }else if(this.entityLeftType=='industryOrproduct'){
          res = await searchService.promptIndustryOrproduct(params)
          res.data = res.data.map(item => {
            return {code:item,label:item};
          })
        }
        // 调用 callback 返回建议列表的数据
        let restaurants=res.data;
        let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(results);


      },
      async querySearchRight(queryString, cb) {
        if(!queryString) return;
        let params={
          query:queryString,
          size:this.size
        };
        console.log(this.entityRightType)
        let res;
        if(this.entityRightType=='stock'){
          res = await searchService.promptStock(params)
        }else if(this.entityRightType=='industryOrproduct'){
          res = await searchService.promptIndustryOrproduct(params)
          res.data = res.data.map(item => {
            return {code:item,label:item};
          })
        }else{
            return {}
        }
        // 调用 callback 返回建议列表的数据
        let restaurants=res.data;
        let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(results);


      },
      //股票键盘精灵

      createStateFilter(queryString) {
        return (state) => {
          return (state.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0||state.code.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

//      选中键盘精灵提供的内容
      handleSelect(item) {
        this.entityLeft=item.label;
        this.entityLeftCode=item.code;
      },
      handleSelectRight(item) {
        this.entityRight=item.label;
        this.entityRightCode=item.code;
      },
      handleSelectRelation(item){
          console.log(item);
          this.knowledgeType=item.type;
          this.knowledgeType_label=item.name;
      },
      querySearchRelation(queryString, cb) {
        var restaurants =this.relationsMessage;
        restaurants.forEach(function(value,index){
            value['value']=value.name;
        })
        var results = queryString ? restaurants.filter(this.createRelationFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createRelationFilter(queryString) {
        return (state) => {
            console.log(state);
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options4 = [];
        }
      },
    // 批量上传开始
      async SureUpload(){
        let data = [];
        this.multipleSelection.forEach(item =>{
          let datas={};
          datas.cp=this.currentPage;
          datas. ps=this.pageSize;
          datas.entityLeft=item.entityLeft;
          datas.entityLeftType="";
          datas. entityRight=item.entityRight;
          datas. entityRightType="";
          datas.knowledgeType=item.knowledgeType[0];
          datas.text=item.text;
          datas.docID='custom';
          data.push(datas);
        });
        if(!this.errorData){
          this.$message({
            type: 'success',
            message: '存在错误数据，请修正后重新上传!'
          });
          return
        }
        let res = await entityService.addKnowledgeType(data);
        if(res.message.code==0 && res.data==true){
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          this.dialogAddVisible = false;
        }
      },
      addMoreData(){
         this.dialogAddVisible=true;
      },
      indexFilter(index){
        return index + 10*(this.queryModel.cp-1) + 1;
      },
      pageChange(page) {
        this.queryModel.cp = page;
        this.searchEntity();
      },
      formatTime(value, row) {
        let date = new Date(value[row.property]);
        return (date && date != 'Invalid Date') ? formatDate(date) : '--';
      },
      handleAvatarSuccess(res, file) {
        debugger
        if(res.message.code == 0){
          this.AddlistData = res.data;
          this.multipleSelection=res.data;
        }else{
          this.$message({
            showClose: true,
            message: res.message.message,
            type: 'error'
          });
        }

      },
      beforeAvatarUpload(file) {
        const isXls = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isXls) {
          this.$message.error('上传文件只能是 xls xlsx 格式!');
        }
        return isXls;
      },
    //批量上传结束


    },
    watch: {
      entityLeft: function (newValue, oldValue) {
        newValue==''?this.entityLeftCode = '':'';

      },
      entityRight: function (newValue, oldValue) {
        newValue==''?this.entityRightCode = '':'';
      },
      knowledgeType_label: function (newValue, oldValue) {
        newValue==''?this.knowledgeType = '':'';
      },
      entityLeft_fake: function (newValue, oldValue) {
        this.entityLeft = newValue;
        this.entityLeftCode = newValue
      },
      entityRight_fake: function (newValue, oldValue) {
        this.entityRight = newValue;
          this.entityRightCode = newValue
      },
    },
    computed: {

    },
    mounted: function(){
      if(this.entityLeftType&&this.entityRightType){
        this.getRealtionData();
      }else{
          this.up() //直接搜索全部黑名单
      }
    },
    created(){
        this.entityLeftType=this.options[0].value;
        this.entityRightType=this.optionsRight[0].value;
    },
    components: {
//      appHeader
    },
    filters: {
      redFunction(index,row){
        debugger
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-table .warning-row {
    color: red;
  }
</style>
<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .el-main {
    border:1px solid #B3C0D1;
  }
  .el-container{
    margin-right:40px;
    margin-top:40px;
  }
  .searchPanel{
    margin:20px 0;
  }
  .el-header{
    color:white;
    font-size:14px !important;
  }
  .pannel-bottom .el-col{
    height:50px;
    padding-left:10px;
    line-height:50px;
  }
  .demo-form-inline
  {
    padding:20px;
  }

  .my-autocomplete li {
    line-height: normal;
    padding: 7px;
  }
  .my-autocomplete .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .my-autocomplete .addr {
    font-size: 12px;
    color: #b4b4b4;
  }

  .my-autocomplete .highlighted .addr {
    color: #ddd;
  }


</style>
