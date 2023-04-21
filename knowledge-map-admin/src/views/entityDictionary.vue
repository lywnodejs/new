<template >
  <div style="background: #f2f2f2;padding:10px;">
    <div class="clearfix" style="height: 40px;background: #fff;padding:0 10px;margin-bottom:10px;">
      <span class="fl" style="line-height:40px;font-size:15px;">词典知识</span>
      <el-button type="primary" size="mini" class="fr" style="margin-left:20px;margin-top:6px;" @click="addBtn">添加</el-button>
      <el-button type="primary" size="mini" class="fr" style="margin-top: 6px;" @click="batchBtn">批量添加</el-button>
    </div>

    <div style="padding: 10px;background: #fff;">
      <el-collapse>
        <el-collapse-item title="实体分类(点击展开或收起)" name="1">
          <div class="clearfix entityBox">
            <span v-for="item in allTypeList" :key="item" :class="{eActive:entityActive == item.name}" @click="entityChangeStatus(item.name,item.id)">{{item.name}}</span>
          </div>
          <!-- <el-tag v-for="item in allTypeList" style="margin:0 15px 10px 0;cursor: pointer;">{{item.name}}</el-tag> -->
        </el-collapse-item>
      </el-collapse>
    </div>

    <div style="background: #fff; margin-top:10px;padding:10px;">

      <div style="margin-top:20px;position:relative;">
        <!-- <el-input
          style="width: 300px;margin-right:10px;"
          placeholder="请输入要查找的同义词名称"
          prefix-icon="el-icon-search"
          size="small"
           @keyup.native="searchBtn"
          v-model="searchVal">
        </el-input> -->
        <input class="se_input"  @keyup="searchBtn" placeholder="请输入要查找的同义词名称" v-model="searchVal" type="text">
        <div class="searchJlBox" v-show="watchSearchList.length !== 0">
          <div v-for="item in watchSearchList" class="searchJlBoxChild" @click="searchValClick(item)">{{item.disName}}</div>
        </div>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchBtnChange">搜索</el-button>
        <!-- <el-button type="primary" size="mini">导出</el-button> -->
      </div>

        <div style="margin-top:20px;">
          <el-table
          ref="mainTable"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="dictTypeName"
            label="实体类型">
          </el-table-column>
          <el-table-column
            prop="dict.baseName"
            label="基词">
          </el-table-column>
          <el-table-column
            prop="dict.dispName"
            label="实体名称（展示词）">
          </el-table-column>
          <el-table-column
            label="同义词">
            <template slot-scope="scope">
              <el-tag
                style="margin:5px;"
                :key="tag.name"
                v-for="tag in scope.row.dict.humanSynonyms"
                closable
                :disable-transitions="false"
                @close="handleClose(tag,scope.row.dict)">
                {{tag.name}}
              </el-tag>
              <el-tag
                style="margin:5px;"
                v-for="tag in scope.row.dict.synonyms"
                :key="tag"
                :disable-transitions="false">
                {{tag.name}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="editBtn(scope.row.dict)"
                >编辑</el-button>
              <el-button
                v-show="scope.row.dict.source !== '1'"
                size="mini"
                type="danger"
                @click="deleteBtn(scope.row.dict)"
                >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination align="center"
                   :current-page.sync="page.cp"
                   :page-size="page.ps"
                   class="pagination"
                   layout="total, prev, pager, next, jumper"
                   :total="page.total"
                   @current-change="pageChange">
    </el-pagination>


    </div>
    <!-- 添加 -->
    <el-dialog title="新增/编辑知识" :visible.sync="dialogFormVisible" style="width: 100%;margin: auto;">
      <el-form>

        <el-form-item label="实体类型" :label-width="labelWidth">
          <el-select v-model="editTypeVal" filterable placeholder="请选择" style="width:250px;" size="small">
            <el-option
              style="width:250px;"
              v-for="item in allTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="实体名称" :label-width="labelWidth">
          <el-input v-model="editTypeName" placeholder="请输入(2-10字)" size="small" style="width:250px;"></el-input>
        </el-form-item>

        <el-form-item label="同义词" :label-width="labelWidth">
          <el-input v-model="editTypeNameWrite" placeholder="请输入同义词" size="small" style="width:250px;" @keyup.enter.native="editTypeNameWriteWay"></el-input>
          <el-button type="primary" @click="editTypeNameWriteWay" size="small">添加</el-button>
        </el-form-item>

        <el-form-item label="同义词 " :label-width="labelWidth">
          <el-tag closable v-for="item in editTypeNameWriteArr" :key="item" style="margin-right:10px;" @close="handleTycClose(item)">{{item}}</el-tag>

          <el-tag v-for="item in editDontTypeNameWriteArr" :key="item" style="margin-right:10px;">{{item}}</el-tag>
          <!-- <el-input type="textarea" :rows="3" v-model="editTypeTyc" placeholder="请输入同义词，多个以逗号隔开" size="small" style="width:250px;"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveSureBtn" size="small">确 定</el-button>
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
        action="/entityWay/dict/fileupload"
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
</template>

<script>
import { entityAddService,spriteKeyService } from "../config/serviceConfig";
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
      allTypeList: [],
      dialogFormVisible: false,
      editTypeVal: '',
      editTypeName: '',
      editTypeTyc: '',
      checkedCities1: ['研报', '年报'],
      cities: ['研报', '年报', '季报', '晨报'],
      knowledgeInit: [],
      searchVal: '',
      tableData: [],
      gobelType: '',
      ifDeleteFlag: false,
      entityActive: '',
      dictTypeId: '',
      editTypeNameWrite: '',
      editTypeNameWriteArr: [],
      editDontTypeNameWriteArr: [],
      synonymsArr: [],
      addApiFlag: 0,
      watchSearchList: [],
      initNumber: 0,
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
    this.getListData();
  },
  watch: {
    searchVal(val) {
      if (val === ''){
        this.watchSearchList = [];
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
    searchBtnChange() {
      this.getListData();
      this.watchSearchList = [];
    },
    async searchValClick(item) {
      this.searchVal = item.baseName;
      this.watchSearchList = []


      let params = {
        name: this.searchVal,
        typeId: this.dictTypeId,
        cp: this.page.cp,
        ps: this.page.ps,
      }
      let result = await entityAddService.getDictList(params);
      let res = JSON.parse(result)
      this.page.total = res.data.totalCount || 0;
      this.tableData =[];
      this.tableData = res.data.list || [];

      $('.el-table__body').parent().scrollTop(0);
    },
    //全部实体类型
    async allEntityType () {
      let result = await entityAddService.allEntityType();
      this.allTypeList = result.data || [];
    },
    //添加按钮
    addBtn() {
      this.dialogFormVisible = true;
      this.dictId = '';
      this.rowId = '';
      this.gobelType = '';
      //this.editTypeVal = '';
      this.editTypeName = '';
      this.editTypeTyc = '';
      this.editTypeNameWriteArr = [];
      this.editDontTypeNameWriteArr = [];
    },
    //编辑
    editBtn (row) {
      this.editTypeNameWriteArr = [];
      this.editTypeNameWrite = '';
      this.editRow = row;
      this.dialogFormVisible = true;
      if (row.dictTypeIds && row.dictTypeIds.length>0) {
        this.editTypeVal = Number(row.dictTypeIds.join(','))
      }
      this.editTypeName = row.dispName || '';
      this.synonymsArr = row.synonyms || [];
      let arr = row.humanSynonyms;
      let arrDot = row.synonyms || [];
      let arrDot1 = [];
      let arr1 = [];
      for (let i = 0; i<arr.length; i++) {
        arr1.push(arr[i].name)
      }
      for (let j = 0; j<arrDot.length; j++) {
        arrDot1.push(arrDot[j].name)
      }
      this.editTypeNameWriteArr = arr1;
      this.editDontTypeNameWriteArr = arrDot1;
      //此项的实体类型
      this.gobelType = row.type;
      this.dictId = row.dictId || '';
      this.rowId = row.id || '';
      this.source = row.source ||'';
      this.baseName = row.baseName;
    },
    //添加-调用添加接口
    async saveSureBtn() {
      if (!this.editTypeVal) {
       this.$message({
          message: '实体类型不能为空！',
          type: 'warning',
        });
        return;
      }
      if (!this.editTypeName){
        this.$message({
          message: '实体名称不能为空！',
          type: 'warning',
        });
        return;
      }
      let idTypeStr = '';
      for (let i = 0; i<this.allTypeList.length; i++) {
        if (this.allTypeList[i].id === this.editTypeVal) {
          idTypeStr = this.allTypeList[i].type;
        }
      }
      let params ={
        dictTypeIds: [this.editTypeVal], //类型id
        //baseName: this.editTypeName,//实体名称
        dispName: this.editTypeName,//实体名称
        humanSynonyms: [], //同义词
        type: idTypeStr,//与实体类型同步
        synonyms: this.synonymsArr,
      }
      //组装同义词
      let t = this.editTypeNameWriteArr || [];
      let arr = [];
      let ra = [];
      let time = new Date().getTime();
      for (let i = 0; i<t.length; i++) {
        arr.push({
                  "isBlack": false,
                  "name": t[i],
                  "updateAt": time
                })
        ra.push({
                  "isBlack": false,
                  "name": t[i],
                  "updateAt": time
                })
      }
      params.humanSynonyms = arr;
      if (!this.rowId) {//添加
        if (ra.length !== 0){
          params.synonyms = [ra[0]];
          params.synonyms[0].name = this.editTypeName;
        } else {
          params.synonyms = [];
        }
        params.source = '2';
        params.baseName = this.editTypeName;
      } else { //编辑
        params.dictId = this.dictId;
        params.id = this.rowId;
        params.source = this.source;
        params.baseName = this.baseName;
      }
      //params.synonyms[0].name = this.editTypeName;
      this.addApiFlag ++
      if (this.addApiFlag > 1){
        return;
      }
      console.log(123)
      console.log(this.addApiFlag)
      let result = await entityAddService.getCdEditData(params);
      if (result.message.status === 200) {
          this.$message({
            message: '添加成功！',
            type: 'success',
            onClose: ()=>{
              this.addApiFlag = 0;
            }
          });
          this.dialogFormVisible = false;
          this.getListData();
      }
    },
    //列表渲染
    async getListData(param) {
      this.searchVal = $.trim(this.searchVal)
      let params = {
        name: this.searchVal,
        typeId: this.dictTypeId,
        cp: this.page.cp,
        ps: this.page.ps,
      }
      let result = await entityAddService.getDictList(params);
      let res = JSON.parse(result)
      this.page.total = res.data.totalCount || 0;
      this.tableData =[];
      this.tableData = res.data.list || [];

      $('.el-table__body').parent().scrollTop(0);
    },
    //搜索按钮
    async searchBtn(e) {
      if (!this.searchVal &&  e.key !== 'Backspace') {
        return;
      }
      if (!this.searchVal && e.key === 'Backspace') {
        this.watchSearchList = [];
        this.getListData()
        return;
      }
      let params = {
        //type: '11',
        query: this.searchVal,
        count: 6
      }
      let result = await spriteKeyService.getEntityNameListNew(params);
      this.watchSearchList = [];
      this.watchSearchList = result.data ;
      if (e.keyCode == 13) {
        this.watchSearchList = [];
        this.getListData()
      }
    },
    //列表中的tag删除
    async handleClose(tag,row) {
      let tagList = row.humanSynonyms || [];
      for (let i = 0; i<tagList.length; i++) {
        if (tag.name === tagList[i].name) {
          tagList.splice(i,1);
        }
      }
      row.humanSynonyms = tagList;
      //row = JSON.stringify(row)

      let params = row;
      let result = await entityAddService.getCdEditData(params);
      if (result.message.status === 200) {
          this.$message({
            message: '删除成功！',
            type: 'success',
          });
          this.getListData();
      }
    },
    //改变页码
    pageChange(page) {
      this.page.cp = page;
      this.getListData();
      console.log($('.el-table__body tbody').scrollTop())
    },
    //
    deleteBtn(row) {
      this.deleteRow = row;
      this.ifDeleteFlag = true;
    },
    async deleteBtnApi() {
      let params = {
        ids: [this.deleteRow.id]
      }
      let result = await entityAddService.getDeleteCdEditData(params);
      let res = JSON.parse(result);
      if (res.message.status === 200) {
          this.$message({
            message: '删除成功！',
            type: 'success',
          });
          this.getListData();
          this.ifDeleteFlag = false;
      }
    },
    entityChangeStatus(name,id) {
      this.editTypeVal = id;
      let ids = id;
      if (this.entityActive === name) {
        this.entityActive = '';
        ids = '';
      } else {
        this.entityActive = name;
      }
      this.dictTypeId = ids;
      this.getListData()
    },
    async editTypeNameWriteWay(e) {
      if (this.editTypeNameWrite) {
        let val = this.editTypeNameWrite;
        let res = null;
        if (val.indexOf(',') !== -1) {
          let arr = val.split(',');
          this.editTypeNameWriteArr = arr.concat(this.editTypeNameWriteArr);
        } else {
          let ifCfFlag = '';
          for(let i=0; i<this.allTypeList.length; i++) {
            if (this.editTypeVal === this.allTypeList[i].id) {
              ifCfFlag = this.allTypeList[i].duplicate;
              break;
            }
          }

          if (ifCfFlag === '0') {
            this.editTypeNameWriteArr.unshift(val);
            return;
          }
          let params = {
            name: this.editTypeNameWrite,
            cp: 1,
            ps: 1
          }
          let result = await entityAddService.getDictList(params);
          let res = JSON.parse(result)
          let list = res.data.list || [];
          if (list.length > 0) {
            this.$message({
              message: '当前同义词已存在！',
              type: 'warning',
            });
            return;
          } else {
            this.editTypeNameWriteArr.unshift(val)
          }

        }
        this.editTypeNameWrite = '';
      }
    },
    handleTycClose(tag) {
      this.editTypeNameWriteArr.splice(this.editTypeNameWriteArr.indexOf(tag), 1);
    },
  },
};
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.el-pagination {
  padding-top: 10px;
  text-align: center;
}
.el-pagination button.disabled {
  color: #c0c4cc;
  background-color: #fff;
  cursor: not-allowed;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
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
.entityBox span{
  float: left;
  line-height: 25px;
  margin: 5px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
}
.entityBox .eActive{
  background: #409EFF;
  color: #fff;
}
.searchJlBox{
  width:298px;position: absolute;z-index:999999999;border: 1px solid #ccc;left: 0;
    top: 31px;
}
.searchJlBoxChild{
  line-height:30px;background:#fff;padding-left:5px;cursor:pointer;
}
.searchJlBoxChild:hover{
  background: #ccc;
}
.se_input{
    width: 288px;
    height: 28px;
    border-radius: 4px;
    padding-left: 10px;
    background: none;
    outline: none;
    border: 1px solid #ccc;
}
</style>
