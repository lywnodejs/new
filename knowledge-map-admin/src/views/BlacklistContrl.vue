<template>
  <div>
    <el-row>
      <relation-search :showDateMessage="showDate" :options="options" :optionsRight="optionsRight" v-on:result-change="searchEntity"></relation-search>
      <el-row class="condition">
        <el-row>
          <el-row>
            <div style="margin-top: 20px;margin-bottom: 20px">
              <el-row>
                <el-col :span="3"><i class="fa fa-list"></i>&nbsp;&nbsp;&nbsp;<span>筛选列表</span></el-col>
                <el-col :span="9">
                  <el-radio-group v-model="entitySearch"  @change="chooseEntity">
                    <el-radio :label="1">实体关系</el-radio>
                    <el-radio :label="2">实体</el-radio>
                  </el-radio-group>
                </el-col>

                <el-col :span="12" align="right">
                  <!--<el-button @click="toggleSelection([tableData3[1], tableData3[2]])">批量删除</el-button>-->
                  <el-button disabled @click="toggleSelection()">移除黑名单</el-button>
                </el-col>
              </el-row>

            </div>
            <el-table
              v-loading="tableLoading"
              ref="multipleTable"
              :data="searchData"
              border
              fit
              tooltip-effect="dark"
              style="width: 100%"
              max-height="350"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>

              <!--<el-table-column-->
                <!--prop="name"-->
                <!--label="实体1名称"-->
              <!--&gt;-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
                <!--label="实体1名称"-->
              <!--&gt;-->
                <!--<template slot-scope="scope">-->
                  <!--<span v-for="item in scope.row.entityLeft" style="margin-right: 10px">{{ item }}</span>-->
                <!--</template>-->
              <!--</el-table-column>-->
              <el-table-column
                width="150"
                prop="leftEntity"
                label="左实体"
                >
              </el-table-column>

              <el-table-column
                width="150"
                prop="rightEntity"
                label="右实体"
              >
              </el-table-column>

              <el-table-column
                prop="knowledgeType"
                label="实体关系"
              >
              </el-table-column>

              <el-table-column
                prop="joinAt"
                :formatter="formatTime"
                width="150"
                label="加入黑名单时间"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">移除黑名单</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="showPage" class="el-pagination el-pagination--small"><button type="button" @click="perPage" class="btn-prev" v-bind:class="{ disabled: disAblePerPage }"><i class="el-icon el-icon-arrow-left"></i></button><ul class="el-pager"><li class="number active">{{currentPage}}</li></ul><button type="button" @click="nextPage" class="btn-next" v-bind:class="{ disabled: !hasNextPage }"><i class="el-icon el-icon-arrow-right"></i></button></div>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
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
        entitySearch:1,
        msg: 'Welcome to Your Vue.js App',
        multipleSelection: [],
        entityLeft:'',
        entityRight:'',
        searchData:[],//列表数据
        currentPage:1,
        pageSize:10,
        loading:false,
        tableLoading:false,
        tableRowObj:{},//列表操作对象
        showPage:false,
        hasNextPage:true,
        disAblePerPage:true,

        showDate:false,
        options:[
          {
            value: '',
            label: '全部'
          },
          {
            value: 'stock',
            label: '公司'
          }, {
            value: 'industryOrproduct',
            label: '行业&产品'
          }
        ],
        optionsRight: [
          {
            value: '',
            label: '全部'
          },
            {
          value: 'none',
          label: '无'
        }, {
          value: 'stock',
          label: '公司'
        }, {
          value: 'industryOrproduct',
          label: '行业&产品'
        }],


        dialogFormVisible: false,
        _entitySearch:'',
      }

    },
    methods: {
      chooseEntity(value){
          console.log(value);
          this.entitySearch=value;
        console.log(this.entitySearch);
          this.searchEntity(this.chooseObj,true);

      },
      formatTime(value,row){
        let date = new Date(value[row.property]);
        return date?formatDate(date):'';
      },
      formatType(value,row){
        let type =value[row.property];
        if(type=='INDUSTRY_PRODUCT'){
          return '行业&产品'
        }else if(type=='STOCK'){
          return '公司'
        }else{
            return '无'
        }
      },
      nextPage(){
        if(this.hasNextPage){
          this.disAblePerPage=false;
          this.currentPage++;
          this.searchEntity(this.chooseObj,true);
        }
      },
      perPage(){
        if(this.currentPage==1){
          return;
        }else{
          this.currentPage--;
          this.currentPage==1?this.disAblePerPage=true:this.disAblePerPage=false;
          this.searchEntity(this.chooseObj,true);
        }
      },
      async searchEntity(chooseObj,selfPage){
        this.searchData=[];
        this.chooseObj=chooseObj;
        if(!selfPage){
          this.currentPage=this.chooseObj.cp;
          this.currentPage==1?this.disAblePerPage=true:this.disAblePerPage=false;
        }
        if(this.entitySearch==1){
            this._entitySearch='Relation'
        }else if(this.entitySearch==2){
          this._entitySearch='Entity'
        }
        let params={
          entityLeft:chooseObj.entityLeft,
          entityRight:chooseObj.entityRight,
          knowledgeType:chooseObj.knowledgeType,
          cp:this.currentPage,
          ps:this.pageSize,
          blackType:this._entitySearch
        };
        if(chooseObj.minAt&&chooseObj.maxAt){
          Object.assign(params,{minAt:chooseObj.minAt},{maxAt:chooseObj.maxAt})
        }
        this.tableLoading=true;
        let res = await entityService.getBlackList(params);
        if(res.message.code==0){
          this.tableLoading=false;
          this.showPage=true;
          this.searchData=res.data.blacklist;
          this.hasNextPage=res.data.hasNextPage;
        }

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
      handleClick(row){
        this.$confirm('是否移除黑名单?', '移除提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.moveOutBlackListFun(row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      async moveOutBlackListFun(row){
        let res = await entityService.moveOutBlackList(row);
        res=JSON.parse(res);
        if(res.message.code==0){
          this.$message({
            type: 'success',
            message: '移除成功!'
          });
          this.searchEntity(this.chooseObj,true);
        }
      },

      handleBlackListClick(){
        this.$confirm('是否将该实体和其对应关系加入黑名单?', '加入黑名单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      editClick(rows){
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

    },
//    watch:{
//      question: function (newQuestion, oldQuestion) {
//        this.answer = 'Waiting for you to stop typing...'
//        this.getAnswer()
//      }
//    },
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
