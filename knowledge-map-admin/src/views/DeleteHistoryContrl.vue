<template>
  <div>
    <el-row>
      <relation-search :relationsMessage="relations" :showDateMessage="showDate"></relation-search>
      <el-row class="condition">
        <el-row>
          <el-row>
            <div style="margin-top: 20px;margin-bottom: 20px">
              <el-row>
                <el-col :span="12"><i class="fa fa-list"></i>&nbsp;&nbsp;&nbsp;<span>筛选列表</span></el-col>
                <el-col :span="12" align="right">
                  <!--<el-button @click="toggleSelection([tableData3[1], tableData3[2]])">批量删除</el-button>-->
                  <el-button @click="toggleSelection()">恢复关系</el-button>
                </el-col>
              </el-row>

            </div>
            <el-table
              ref="multipleTable"
              :data="tableData3"
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
              <el-table-column
                fixed
                label="实体1"
              >
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="实体1名称"
              >
              </el-table-column>
              <el-table-column
                prop="address"
                label="实体2"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="address"
                label="实体2名称"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="address"
                label="因果关系"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                  <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="handleBlackListClick(scope.row)" type="text" size="small">加入黑名单</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
    <!--编辑弹窗-->
    <el-dialog title="编辑实体&关系" :visible.sync="dialogFormVisible">

      <el-form :model="form">

        <el-form-item label="实体1类别" :label-width="formLabelWidth">
          <el-select v-model="form.value8" filterable>
            <el-option
              v-for="item in form.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实体2名称" :label-width="formLabelWidth">
          <el-select
            v-model="form.value9"
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
        <el-form-item label="实体1类别" :label-width="formLabelWidth">
          <el-select v-model="form.value8" filterable>
            <el-option
              v-for="item in form.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实体2类别" :label-width="formLabelWidth">
          <el-select
            v-model="form.value9"
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
            v-model="textarea">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>



</template>

<script>
  import relationSearch from '../components/RelationSearch'
  export default {
    name: 'HelloWorld',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: [],
        relations:[{
          value: 'gongsi',
          label: '公司1'
        }, {
          value: 'hangye',
          label: '行业2'
        }, {
          value: 'chanpin',
          label: '产品3'
        }],
        showDate:false,


        dialogFormVisible: false,
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
        loading:'',
        formLabelWidth: '120px',
        form: {
          options4:[],
          value8:'',
          options:[]
        },
        textarea:'',
      }

    },
    methods: {
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
      handleClick(){
        this.$confirm('是否删除该对应关系?', '删除提醒', {
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
    mounted: function(){
    },
    created(){
      var _self=this;
      this.showDate=true;
      setTimeout(function(){
        _self.relations=[{
          value: 'gongsi',
          label: '公司12'
        }, {
          value: 'hangye',
          label: '行业22'
        }, {
          value: 'chanpin',
          label: '产品32'
        }];
      },2000);
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
</style>
