<template>
  <div style="background: #f2f2f2;padding:10px;">

    <div style="padding: 10px;background: #fff;">
      <el-collapse>
        <el-collapse-item title="实体分类(点击展开或收起)" name="1">
          <div class="clearfix entityBox">
            <span v-for="item in allTypeList" :class="{eActive:entityActive == item.name}" @click="entityChangeStatus(item.name,item.id)">{{item.name}}</span>
          </div>
          <!-- <el-tag v-for="item in allTypeList" style="margin:0 15px 10px 0;cursor: pointer;">{{item.name}}</el-tag> -->
        </el-collapse-item>
      </el-collapse>
    </div>

    <div style="background: #fff; margin-top:10px;padding:10px;">
      <div style="margin-top: 20px">
        <el-radio-group v-model="typeCheckVal" size="medium" @change="statusChange">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="未审核" ></el-radio-button>
          <el-radio-button label="已审核"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="clearfix" style="height:30px;margin-top:20px;">
        <span class="fl" style="line-height:30px;font-size: 14px;">数据来源：</span>
        <el-checkbox-group class="fl" style="margin-top:6px;"
        @change="dataTypeChange"
          v-model="dataLy">
          <el-checkbox v-for="city in dataLyList" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="clearfix" style="height:30px;margin-top:20px;">
        <span class="fl" style="line-height:30px;font-size: 14px;">知识来源：</span>
        <el-checkbox-group class="fl" style="margin-top:6px;"
          @change="knowlegeTypeChange"
          v-model="knowlegLy">
          <el-checkbox v-for="item in knowledgeInit" :label="item" :key="item">{{item}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="margin-top:20px;">
        <el-input
          style="width: 300px;margin-right:10px;"
          placeholder="请输入要查找的同义词名称"
          prefix-icon="el-icon-search"
          size="small "
           @keyup.enter.native="getNerDateList"
          v-model="searchVal">
        </el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getNerDateList">搜索</el-button>
        <!-- <el-button type="primary" size="mini">导出</el-button> -->
      </div>

        <div style="margin-top:20px;">
          <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="typeName"
            label="实体类型">
          </el-table-column>
          <el-table-column
            prop="nerKb.extractName"
            label="实体名称">
          </el-table-column>
          <el-table-column
            min-width="200"
            label="实体词典相似词">
            <template slot-scope="scope">
              <div class="clearfix">
                <div v-for="item in scope.row.similarWords" class="fl" style="margin:0 15px 10px 0;cursor: pointer;" @click="similarWordsBtn(item,scope.row.nerKb)">{{item.name}}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="数据来源">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.nerKb.dataSource" size="mini">{{scope.row.nerKb.dataSource}}</el-tag>
                  <div v-show="scope.row.nerKb.publishAt">时间:{{scope.row.nerKb.publishAt}}</div>
                </div>
                <div style="cursor: pointer;" @click="dataInitBtn(scope.row.nerKb)">{{scope.row.nerKb.title}}</div>
              </template>
          </el-table-column>
          <el-table-column
            prop="nerKb.createAt"
            :formatter="formatTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            label="审核状态">
            <template slot-scope="scope">
              {{scope.row.nerKb.humanFlag=='0'?'未审核':'已审核'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="editBtn(scope.row)"
                >编辑</el-button>
              <el-button
                size="mini"
                @click="passBtn(scope.row)"
                >{{scope.row.nerKb.humanFlag == '0'? '通过' : '取消通过'}}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteListData(scope.row)"
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
  
    <!-- 编辑 -->
    <el-dialog class="entityKnowledgeBox" title="编辑知识" :visible.sync="dialogFormVisible" style="width: 100%;margin: auto;">
      <el-form>
        
        <!-- <el-form-item label="实体类型">
          <el-select v-model="editTypeVal" filterable placeholder="请选择" style="width:250px;" size="small">
            <el-option
              style="width:250px;" 
              v-for="item in allTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        
        <el-form-item label="实体名称">
          <el-input v-model="editTypeName" placeholder="请输入(2-10字)" size="small" style="width:250px;"></el-input>
        </el-form-item>
        
        <!-- <el-form-item label="同义词">
          <el-tag
            style="margin-right:10px;"
            v-for="tag in tags"
            :key="tag.name"
            closable
            @close='deleteTag(tag)'
            :type="tag.type">
            {{tag.name}}
          </el-tag>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveSureBtn" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 相似词绑定 -->
    <el-dialog class="entityKnowledgeBox" title="添加同义词" :visible.sync="similarWordsFlag" style="width: 100%;margin: auto;">
      <el-form>
        <el-form-item label="NER实体">
          <el-input v-model="similarEntityName" disabled size="small" style="width:250px;"></el-input>
        </el-form-item>
        <el-form-item label="实体词典">
          <el-input v-model="similarCdName" disabled size="small" style="width:250px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="similarWordsFlag = false" size="small">取 消</el-button>
        <el-button type="primary" @click="similarWordApiBtn" size="small">确 定</el-button>
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
    <!-- 数据来源弹出框 -->
    <el-dialog title="数据来源" :visible.sync="dataInitDialog" style="margin: auto;">
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

    </div>

  </div>
</template>

<script>
import { entityAddService } from "../config/serviceConfig";
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
      dataLy: [],
      knowlegLy: [],
      dataLyList: [],
      knowledgeInit: [],
      searchVal: '',
      tableData: [],
      allTypeList: [],
      typeCheckVal: '全部',
      dialogFormVisible: false,
      editTypeVal: '',
      editTypeName: '',
      tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ],
      ifDeleteFlag: false,
      dataInitDialog: false,
      dataInitTitle: '',
      pagesList: [],
      dataInitUrl:'',
      similarWordsFlag: false,
      similarEntityName: '',
      similarCdName: '',
      num:0,
      pagesVal: '',
      entityActive: '',
      dictTypeId: '',
    };
  },
  // filters: {
  //   formatDate(time) {
  //       var date = new Date(time);
  //       return formatDate(date, 'yyyy-MM-dd hh:mm');
  //   }
  // },
  mounted: function() {
    this.allEntityType();
    this.getSourceList(1);//数据来源
    this.getSourceList(2);//知识来源
    this.getNerDateList()
  },
  created() {
    this.showDate = true;
  },
  watch:{
    pagesVal(page) {
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
    formatTime(value, row) {
      let str = row.property;
      let arr = str.split('.')
      let date = new Date(value[arr[0]][arr[1]]);
      return (date && date != 'Invalid Date') ? formatDate(date) : '--';
    },
    setClassName({ row, index }) {
      // 通过自己的逻辑返回一个class或者空
      return row.expand ? "expand" : "";
    },
    //全部实体类型
    async allEntityType () {
      let result = await entityAddService.allEntityType();
      this.allTypeList = result.data || [];
    },
    //查询实体数据
    async getNerDateList() {
      let humanFlag = '';
      if (this.typeCheckVal === '未审核') {
        humanFlag = '0';
      } else if (this.typeCheckVal === '已审核') {
        humanFlag = '1';
      } else {
        humanFlag = '';
      }
      this.searchVal = $.trim(this.searchVal);
      let params = {
        humanFlag: humanFlag,//是否审核
        dataSources: this.dataLy,//数据来源
        kbSources: this.knowlegLy, //知识来源
        dictTypeId: this.dictTypeId,
        name: this.searchVal,
        cp: this.page.cp,
        ps: this.page.ps,
        deleteFlag: '0',
      }
      let result = await entityAddService.getNerDateList(params);
      this.page.total = result.data.totalCount || 0;
      this.tableData = []
      this.tableData = result.data.list || [];
      $('.el-table__body').parent().scrollTop(0);
    },
    //查询数据来源、知识来源
    async getSourceList(type) {
      let params = {}
      if (type ===1) { //数据来源
        params.sourceField = 'dataSource';
      } else {
        params.sourceField = 'kbSource';
      }
      let result = await entityAddService.getSourceList(params);
      if (type === 1) {
        this.dataLyList = result.data || [];
      } else {
        this.knowledgeInit = result.data || [];
      }
    },
    //编辑
    editBtn(row) {
      console.log(row)
      this.editApiData = row;
      //this.editTypeVal = row.dictType || '';//实体类型
      this.editTypeName = row.nerKb.extractName || '';//实体名称
      this.dialogFormVisible = true;
      //this.editTypeVal = row.nerKb.dictTypeId || '';//实体类型
    },
    //编辑-调用接口
    async saveSureBtn() {
      let obj = this.editApiData;
      //obj.nerKb.dictTypeId = this.editTypeVal || '';//实体类型
      obj.nerKb.extractName = this.editTypeName || '';//实体名称
      let params = obj.nerKb;
      let result = await entityAddService.getNerEditDateList(params);
      let res = JSON.parse(result);
      if (res.message.status === 200) {
          this.$message({
            message: '修改成功！',
            type: 'success',
          });
          this.dialogFormVisible = false;
          this.getNerDateList();
      }
    },
    //编辑中删除标签
    deleteTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    //改变页码
    pageChange(page) {
      this.page.cp = page;
      this.getNerDateList();
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
    //相似词绑定
    similarWordsBtn(row,item) {
      console.log(123)
      this.similarWordsFlag = true;
      this.similarCdName = row.name;//实体词典
      this.similarCdId = row.ids[0];
      this.similarEntityName = item.extractName;//ner名称
    },
    async similarWordApiBtn() {
      let params = {
        dictId: this.similarCdId,//词典id
        synonymName: this.similarEntityName,//实体名称
      }
      let result = await entityAddService.getNerXscBd(params);
      if (result.message.status === 200) {
          this.$message({
            message: '绑定成功！',
            type: 'success',
          });
          this.similarWordsFlag = false;
      }
    },
    //通过
    async passBtn(row) {
      let obj = row.nerKb;
      if(obj.humanFlag === '0') {
        obj.humanFlag = '1';
      } else {
        obj.humanFlag = '0';
      }
      let params = obj;
      let result = await entityAddService.getNerEditDateList(params);
      let res = JSON.parse(result)
      if (res.message.status === 200) {
          this.$message({
            message: '更改成功！',
            type: 'success',
          });
          this.getNerDateList();
      }
    },
    deleteListData(row) {
      this.deleteRow = row;
      this.ifDeleteFlag = true;
    },
    //删除列表中的数据
    async deleteBtnApi() {
      let obj = this.deleteRow.nerKb;
      obj.deleteFlag = '1';
      let params = obj;
      let result = await entityAddService.getNerEditDateList(params);
      let res = JSON.parse(result);
      if (res.message.status === 200) {
          this.$message({
            message: '删除成功！',
            type: 'success',
          });
          this.ifDeleteFlag = false;
          this.getNerDateList();
      }
    },
    entityChangeStatus(name,id) {
      let ids = id;
      if (this.entityActive === name) {
        this.entityActive = '';
        ids = '';
      } else {
        this.entityActive = name;
      }
      this.dictTypeId = ids;
      this.getNerDateList()
    },
    statusChange(e) {
      this.typeCheckVal = e;
      this.getNerDateList();
    },
    dataTypeChange(e) {
      this.typeCheckVal = e;
      this.getNerDateList();
    },
    knowlegeTypeChange(e) {
      this.typeCheckVal = e;
      this.getNerDateList();
    }
  },
  components: {
    relationSearch
  },
  filters: {}
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
</style>
