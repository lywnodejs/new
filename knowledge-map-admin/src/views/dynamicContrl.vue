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
                  <el-button  size="small" @click="toggleSelection()">批量审阅</el-button>
                </el-col>
              </el-row>

            </div>
            <el-table :data="searchData" :span-method="cellMerge" border style="width: 100%; margin-top: 20px">
              <el-table-column prop="indexId" label="indexId" width="180"></el-table-column>
              <el-table-column prop="entityLeft"  width="80" label="左实体"></el-table-column>
              <el-table-column prop="entityRight"  width="100" label="右实体"></el-table-column>
              <el-table-column prop="text" label="因果关系"> </el-table-column>
              <el-table-column width="150" prop="createTime" label="创建时间" :formatter="formatTime"></el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                  <el-button @click="handleBlackListClick(scope.row)" type="text" size="small">加入黑名单</el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" fixed="right" algin="center" label="确认" width="200">
                <template slot-scope="scope">
                  <el-button @click="checkSure(scope.row)" type="button" size="small">确认</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="showPage" class="el-pagination el-pagination--small"><button type="button" @click="perPage" class="btn-prev" v-bind:class="{ disabled: disAblePerPage }"><i class="el-icon el-icon-arrow-left"></i></button><ul class="el-pager"><li class="number active">{{currentPage}}</li></ul><button type="button" @click="nextPage" class="btn-next" v-bind:class="{ disabled: !hasNextPage }"><i class="el-icon el-icon-arrow-right"></i></button></div>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
    <el-dialog
      title="添加黑名单"
      :visible.sync="blackListVisible" align="center"
      width="40%">
      <p>请选择加入黑名单的类别</p>
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
              value: 'industryOrproduct',
              label: '行业&产品'
            },
            {
              value: 'stock',
              label: '公司'
            }
          ],
          optionsValueLeft:'',
          optionsRight: [
            {
              value: 'stock',
              label: '公司'
            },{
            value: 'none',
            label: '无'
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
          spanArr:[],
        }

      },
      methods: {
        getSpanArr(data) {
          for (var i = 0; i < data.length; i++) {
            if (i === 0) {
              this.spanArr.push(1);
              this.pos = 0
            } else {
              // 判断当前元素与上一个元素是否相同
              if (data[i].indexId === data[i - 1].indexId) {
                this.spanArr[this.pos] += 1;
                this.spanArr.push(0);
              } else {
                this.spanArr.push(1);
                this.pos = i;
              }
            }
          }
        },
        cellMerge({ row, column, rowIndex, columnIndex }) {
          if (columnIndex === 6) {
            const _row = this.spanArr[rowIndex];
            const _col = _row > 0 ? 1 : 0;
            return {
              rowspan: _row,
              colspan: _col
            }
          }
        },
        chooseEntity(value){
            console.log(value);
        },
        formatTime(value, row) {
          let date = new Date(value[row.property]);
          return (date && date != 'Invalid Date') ? formatDate(date) : '--';
        },
        nextPage(){
          if(this.hasNextPage){
            this.disAblePerPage=false;
            this.currentPage++;
            this.tableLoading=true;
            this.spanArr=[];
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
            this.spanArr=[];
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
          if(this.chooseObj.knowledgeType != 'INDUSTRY_STOCK_RELATION'){
            this.$message({
              type: 'warning',
              message: '动态实体关系维护只支持行业个股关系查询'
            })
            return;
          }
            this.tableLoading=true;
            let res = await entityService.getKnowledgeList(chooseObj);
            if(res.message.code==0){
              this.tableLoading=false;
              this.showPage=true;
              this.searchData=res.data.knowledgeList;
              console.log(this.spanArr);
              this.getSpanArr(this.searchData);
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
        async checkSure(){
          let params={
            text:this.form.textareaValue,
            indexId:this.tableRowObj.indexId
          };
          let res = await entityService.editSingleRealtion(params);
          res = JSON.parse(res);
          if(res.message.code==0&&res.data==true){
            this.$message({
              type: 'success',
              message: '审阅成功!'
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

      },
      mounted: function(){
      },
      created(){
        this.showDate=true;
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
