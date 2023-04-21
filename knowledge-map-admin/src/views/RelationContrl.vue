<template>
  <div>
    <el-row>
      <relation-search :showDateMessage="showDate" :options="options" :optionsRight="optionsRight" :entityLeft_fake="entityLeft" :entityRight_fake="entityRight" v-on:result-change="searchEntity"></relation-search>
      <el-row style="border:1px solid #e6e6e6;padding:20px" class="condition">
        <el-row>
          <el-row>
            <div style="margin-top: 20px;margin-bottom: 20px">
              <el-row>
                <el-col :span="12"><i class="fa fa-list"></i>&nbsp;&nbsp;&nbsp;<span>筛选列表</span></el-col>
                <el-col :span="12" align="right">
                  <el-button @click="tableToExcel()">导出</el-button>
                  <el-button disabled @click="toggleSelection([tableData3[1], tableData3[2]])">批量删除</el-button>
                  <el-button disabled @click="toggleSelection()">批量加入黑名单</el-button>
                </el-col>
              </el-row>

            </div>
            <el-table
              v-loading="tableLoading"
              ref="multipleTable"
              :data="searchData"
              border
              disabled
              fit
              tooltip-effect="dark"
              style="width: 100%"
              max-height="650"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <!--<el-table-column-->
                <!--prop="entityLeftType"-->
                <!--label="实体1"-->
              <!--&gt;-->
              <!--</el-table-column>-->
              <el-table-column label="左实体" width="150">
                <template slot-scope="scope">
                  <span>{{  scope.row.entityLeft }}</span>
                </template>
              </el-table-column>
              <el-table-column width="150" prop="entityRight" label="右实体"></el-table-column>
              <el-table-column prop="text" label="因果关系"></el-table-column>
              <el-table-column width="150" prop="createTime" label="创建时间" :formatter="formatTime"></el-table-column>
              <el-table-column fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                  <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="handleBlackListClick(scope.row)" type="text" size="small">加入黑名单</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--<el-pagination-->
              <!--@current-change="handleCurrentChange"-->
              <!--:current-page="currentPage4"-->
              <!--:page-size="100"-->
              <!--layout="total, prev, pager, next, jumper"-->
              <!--:total="400">-->
            <!--</el-pagination>-->
            <div v-if="showPage" class="el-pagination el-pagination--small"><button type="button" @click="perPage" class="btn-prev" v-bind:class="{ disabled: disAblePerPage }"><i class="el-icon el-icon-arrow-left"></i></button><ul class="el-pager"><li class="number active">{{currentPage}}</li></ul><button type="button" @click="nextPage" class="btn-next" v-bind:class="{ disabled: !hasNextPage }"><i class="el-icon el-icon-arrow-right"></i></button></div>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
    <!--编辑弹窗-->
    <el-dialog title="编辑实体&关系" :visible.sync="dialogFormVisible">

      <el-form :model="form">

        <el-form-item label="左实体类别" :label-width="formLabelWidth">
          <el-select v-model="form.entityLeftType" filterable  disabled>
            <el-option
              v-for="item in form.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="左实体名称" :label-width="formLabelWidth">
          <el-select
            disabled
            v-model="form.entityLeft"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in form.options4"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="右实体类别" :label-width="formLabelWidth">
          <el-select v-model="form.entityRightType" filterable  disabled>
            <el-option
              v-for="item in form.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="右实体名称" :label-width="formLabelWidth">
          <el-select
            disabled
            v-model="form.entityRight"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in form.options4"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="因果关系" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.textareaValue">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="添加黑名单"
      :visible.sync="blackListVisible"
      width="40%">
      <span>请选择加入黑名单的类别</span>
      <el-radio-group style="margin-top: 20px" v-model="radio2" @change="chooseEntity">
        <el-radio :label="1" :disabled="entitybool">左实体</el-radio>
        <el-radio :label="2" :disabled="entitybool">右实体</el-radio>
        <el-radio :label="3" >实体关系</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
    <el-button @click="blackListVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureAddBlack()">确 定</el-button>
  </span>
    </el-dialog>
  </div>



</template>

<script>
  import { entityService } from '../config/serviceConfig'
  import {formatDate} from '../../utils/commonUtil';
  import relationSearch from '../components/RelationSearch'
  export default {
      name: 'HelloWorld',
      data () {
        return {
          radio2: 1,
          currentPage:1,
          pageSize:10,
          loading:true,
          tableLoading:false,
          tableRowObj:{},//列表操作对象
          showPage:false,
          options:[
            {
              value: 'stock',
              label: '公司'
            }, {
              value: 'industryOrproduct',
              label: '行业&产品'
            }
          ],
          optionsValueLeft:'',
          optionsRight: [{
            value: 'none',
            label: '无'
          }, {
            value: 'stock',
            label: '公司'
          }, {
            value: 'industryOrproduct',
            label: '行业&产品'
          }],
          searchData:[],//列表数据
          disAblePerPage:true,
          hasNextPage:true,
          msg: 'Welcome to Your Vue.js App',
          multipleSelection: [],
          showDate:false,

          dialogFormVisible: false,
          formLabelWidth: '120px',
          entityLeft:'',
          entityRight:'',
          form: {
            options4:[],
            entityLeft:'',
            entityLeftType:'',
            entityRight:'',
            entityRightType:'',
            textareaValue:'',
            options:[]
          },
          textarea:'',
          blackListVisible:false,
          blackRow:{},//加入黑名单的对象
          _row:{},//实体对象拷贝
          entitybool:true,
        }

      },
      methods: {
        chooseEntity(value){
            console.log(value);
        },
        formatTime(value, row) {
          let date = new Date(value[row.property]);
          return (date && date != 'Invalid Date') ? formatDate(date) : '--';
//        return date;
        },
        nextPage(){
          if(this.hasNextPage){
            this.disAblePerPage=false;
            this.currentPage++;
            this.tableLoading=true;
            this.searchEntity(this.chooseObj,true);
          }
        },
        perPage(){
          if(this.currentPage==1){
            return;
          }else{
            this.currentPage--;
            this.currentPage==1?this.disAblePerPage=true:this.disAblePerPage=false;
            this.tableLoading=true;
            this.searchEntity(this.chooseObj,true);
          }
        },
        async searchEntity(chooseObj,selfPage){
            this.chooseObj=chooseObj;
            if(!selfPage){
              this.currentPage=this.chooseObj.cp;
              this.currentPage==1?this.disAblePerPage=true:this.disAblePerPage=false;
            }
            Object.assign(this.chooseObj, {cp:this.currentPage}, {ps:this.pageSize});
            if(this.chooseObj.knowledgeType==''){
              this.$message({
                type: 'warning',
                message: '请选择实体关系'
              })
              return;
            }
            this.tableLoading=true;
            // debugger
            let res = await entityService.getKnowledgeTypeList(chooseObj);
            if(res.message.code==0){
              this.tableLoading=false;
              this.showPage=true;
              this.searchData=res.data.knowledgeList;
              this.hasNextPage=res.data.hasNextPage;
            }

        },

        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          }else {
            this.$refs.multipleTable.clearSelection();
          }
        },
        async editSure(){
          let params={
            text:this.form.textareaValue,
            indexId:this.tableRowObj.indexId
          }
          let res = await entityService.editSingleRealtion(params);
          res = JSON.parse(res);
          if(res.message.code==0&&res.data==true){
            this.$message({
              type: 'success',
              message: '编辑完成!'
            });
            this.dialogFormVisible = false;
            this.searchEntity(this.chooseObj,true);
          }
        },
        async sureAddBlack(){
            if(this.radio2==''){
                return;
            }
            this.blackListVisible=false;
            this.addBlackList(this.blackRow,this.radio2);

        },

        //删除单个实体
        handleClick(row){

          this.$confirm('是否删除该对应关系?', '删除提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          this.deleteEntity(row);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        },
        //删除单个实体
        async deleteEntity(row){
            console.log(row);
         this.chooseObj.entityLeft=row.entityLeft;
          this.entityLeft=row.entityLeft;
          var indexLeft=row.entityRight.indexOf('(');
          var indexRight=row.entityRight.indexOf(')');
          var indexLeft2=row.entityLeft.indexOf('(');
          var indexRight2=row.entityLeft.indexOf(')');
          if(indexLeft==-1&&indexRight==-1){
            this.chooseObj.entityRight=row.entityRight;
            this.entityRight=row.entityRight;
          }else{
            this.chooseObj.entityRight= row.entityRight.slice(indexLeft+1,indexRight);
            this.entityRight=this.chooseObj.entityRight;
          }
          if(indexLeft2==-1&&indexRight2==-1){
            this.chooseObj.entityLeft=row.entityLeft;
            this.entityLeft=row.entityLeft;
          }else{
            this.chooseObj.entityLeft= row.entityLeft.slice(indexLeft2+1,indexRight2);
            this.entityLeft=this.chooseObj.entityLeft;
          }
          let params={
            entityRight:this.chooseObj.entityRight,
            indexId:row.indexId
          }
          let res = await entityService.deleteSingleRealtion(params);
          res = JSON.parse(res);
          if(res.message.code==0&&res.data==true){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
//            setTimeout(() => {
//              this.searchEntity(this.chooseObj,true);
//            }, 1100);
            this.searchEntity(this.chooseObj,true);

          }

        },

        //加入黑名单
        async addBlackList(row,radio){
            this._row={...row}
          var indexLeft=this._row.entityRight.indexOf('(');
          var indexRight=this._row.entityRight.indexOf(')');
          var indexLeft2=this._row.entityLeft.indexOf('(');
          var indexRight2=this._row.entityLeft.indexOf(')');
          (indexLeft==-1&&indexRight==-1)?'': this._row.entityRight= this._row.entityRight.slice(indexLeft+1,indexRight);
          (indexLeft2==-1&&indexRight2==-1)?'': this._row.entityLeft= this._row.entityLeft.slice(indexLeft2+1,indexRight2);
          if(radio==''){
              return;
          }else if(radio==1){
            this._row.entityRight='';
            this._row.knowledgeType=['INDUSTRY_ENTITY'];
          }else if(radio==2){
            this._row.entityLeft=this._row.entityRight;
            this._row.entityRight='';
            this._row.knowledgeType=['INDUSTRY_ENTITY']
          }
          let params = this._row;
          console.log(params);
          let res= await entityService.addSingleBlackList(params);
          if(res.message.code==0&&res.data==true){
            this.$message({
              type: 'success',
              message: '加入黑名单成功!'
            });
            this.searchEntity(this.chooseObj,true);
          }
        },

        handleBlackListClick(row){
           this.radio2=1;
          this.blackRow={};
          this.blackListVisible=true;
          this.blackRow=row;
          if(row.entityRight == ''){
                this.entitybool=true;
                this.radio2=3;
           }else {
                this.entitybool=false
           }

          console.log(row)
//          this.$confirm('是否将该实体和其对应关系加入黑名单?', '加入黑名单', {
//            confirmButtonText: '确定',
//            cancelButtonText: '取消',
//            type: 'warning'
//          }).then(() => {
//              this.addBlackList(row)
//          }).catch(() => {
//            this.$message({
//              type: 'info',
//              message: '已取消加入黑名单'
//            })
//          })
        },

        editClick(row){
          this.tableRowObj=row;
          this.form.entityLeft=row.entityLeft;
          var indexLeft=row.entityRight.indexOf('(');
          var indexRight=row.entityRight.indexOf(')');
          if(indexLeft==-1&&indexRight==-1){
            this.form.entityRight=row.entityRight;
          }else{
            this.form.entityRight= row.entityRight.slice(indexLeft+1,indexRight);
          }

          this.chooseObj.entityLeftType=='stock'?this.form.entityLeftType='公司':this.form.entityLeftType='行业&产品';
          this.chooseObj.entityRightType=='stock'?this.form.entityRightType='公司':this.form.entityRightType='行业&产品';
          this.form.textareaValue=row.text;
          this.dialogFormVisible=true;
        },
        remoteMethod(query) {
          if (query !== '') {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.form.options4 = this.list.filter(item => {
                return item.label.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
              });
            }, 200);
          } else {
            this.form.options4 = [];
          }
        },
        tableToExcel() {
          let jsonData = [];
          this.searchData.forEach(item => {
            let datas = {};
            datas.entityLeft = item.entityLeft;
            datas.entityRight = item.entityRight;
            datas.text = item.text;
            datas.createTime = formatDate(item.createTime);
            jsonData.push(datas);
          });
          //列标题
          //列标题，逗号隔开，每一个逗号就是隔开一个单元格
          let str = `左实体,右实体,因果关系,创建时间\n`;
          //增加\t为了不让表格显示科学计数法或者其他格式
          for (let i = 0; i < jsonData.length; i++) {
            for (let item in jsonData[i]) {
              str += `${jsonData[i][item] + '\t'},`;
            }
            str += '\n';
          }
          //encodeURIComponent解决中文乱码
          let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
          //通过创建a标签实现
          let link = document.createElement("a");
          link.href = uri;
          //对下载的文件命名
          link.download = "实体关系维护.csv";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      },
      mounted: function(){
      },
      created(){
      },
      components: {
        relationSearch
      },
      filters: {

      }
  }
</script>

<style scoped>
  h1, h2 {
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
  .el-pagination{
    padding-top:10px;
    text-align:center;
  }
  .el-pagination button.disabled {
    color: #c0c4cc;
    background-color: #fff;
    cursor: not-allowed;
  }




</style>
