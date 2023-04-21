<template>
  <div>
    <el-row>
      <el-row style="border:1px solid #e6e6e6;padding:20px" class="condition">
        <el-row>
          <el-row>
            <div style="margin-top: 20px;margin-bottom: 20px">
              <el-row>
                <el-col :span="12">&nbsp;&nbsp;<span>热点维护</span></el-col>
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
              max-height="580">
              <el-table-column label="排名序号" type="index" :index="indexFilter" width="100" align="center"></el-table-column>
              <el-table-column label="热点名称" width="150" prop="hotName"></el-table-column>
              <el-table-column prop="introduction" label="热点简介"></el-table-column>
              <el-table-column fixed="right" label="操作" width="80" align="center">
                <template slot-scope="scope">
                  <el-button @click="editClick(scope.row)" type="primary" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination align="center"
                           :current-page.sync="queryModel.page"
                           :page-size="queryModel.size"
                           class="pagination"
                           layout="total, prev, pager, next, jumper"
                           @current-change="pageChange">
            </el-pagination>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
    <!--编辑弹窗-->
    <el-dialog title="热点简介" :visible.sync="dialogFormVisible" width="80%">
      <el-form :model="form">
        <el-form-item label="热点简介" >
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="form.introduction">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {maintainHotServeice} from '../config/serviceConfig'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        queryModel: {
          cp: 1,
          ps: 10,
        },
        tableLoading: false,
        searchData: [],//列表数据
        disAblePerPage: true,
        hasNextPage: true,
        msg: 'Welcome to Your Vue.js App',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          hotName:'',
          introduction: '',
        },
        blackListVisible: false,
      }
    },
    methods: {
      indexFilter(index){
        return index + 10*(this.queryModel.page-1) + 1;
      },
      pageChange(page) {
        this.queryModel.cp = page;
        this.searchEntity();
      },
      async searchEntity() {
        this.tableLoading = true;
        let result = await maintainHotServeice.getHotList(this.queryModel);
        if (result.message.code == 0) {
          this.searchData = result.data;
          this.tableLoading = false;
        }

      },
      async editSure() {
        let data={
          hotName:this.form.hotName,
          intro:this.form.introduction
        };
        data = this.$qs.stringify(data);
        let res = await maintainHotServeice.updateHot(data);
        res = JSON.parse(res);
        if (res.message.code == 0 ) {
          let target = this;
          setTimeout(function () {
            target.searchEntity();
          },1250);
          this.$message({
            type: 'success',
            message: '编辑完成!'
          });
          this.dialogFormVisible = false;
        }
      },
      editClick(row) {
        this.dialogFormVisible = true;
        this.form = JSON.parse(JSON.stringify(row));
      },

    },
    mounted: function () {
    },
    created() {
      this.searchEntity();
    },
    components: {},
    filters: {}
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

  .el-pagination {
    padding-top: 10px;
    text-align: center;
  }

  .el-pagination button.disabled {
    color: #c0c4cc;
    background-color: #fff;
    cursor: not-allowed;
  }


</style>
