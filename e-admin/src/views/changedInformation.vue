<template>
  <div id="information">
    <el-row>
      <el-form :model="form" label-width="120px" :inline="true">
        <el-form-item label="股票代码/简称：">
          <el-input v-model="form" placeholder="请输入股票代码、简称"></el-input>
        </el-form-item>

        <el-form-item label="时间筛选：">
          <el-date-picker
            v-model="form"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="显示状态：">
          <el-select v-model="form" placeholder="请选择显示状态">
            <el-option label="所有状态" value="1"></el-option>
            <el-option label="信息已显示" value="2"></el-option>
            <el-option label="信息被隐藏" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="资讯标题：">
          <el-input v-model="form" placeholder="资讯标题"></el-input>
        </el-form-item>

        <el-form-item label="类型：">
          <el-select v-model="form" placeholder="请选择资讯分类">
            <el-option label="新闻" value="1"></el-option>
            <el-option label="公告" value="2"></el-option>
            <el-option label="研究报告" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="来源：">
          <el-input v-model="form" placeholder="请选择资讯来源"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">确定</el-button>
        </el-form-item>

      </el-form>
      <el-divider></el-divider>

      <el-table
        ref="multipleTable"
        style="width: 100%;"
        border
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          label="时间">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="股票代码/简称">
        </el-table-column>
        <el-table-column
          prop="address"
          width="300px"
          label="新闻标题">
        </el-table-column>
        <el-table-column
          prop="name"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="name"
          label="来源">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="hideRow(scope.$index, tableData)"
              type="text"
              size="small">
              隐藏
            </el-button>
            <el-button
              @click.native.prevent="log(scope.$index, tableData)"
              type="text"
              size="small">
              日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-col :span="9">
          <el-checkbox label="全选" class="checkUse" size="mini"></el-checkbox>
          <el-select v-model="form" placeholder="批量操作" size="mini">
            <el-option label="批量隐藏" value="1"></el-option>
            <el-option label="批量显示" value="2"></el-option>
          </el-select>
          <el-button type="primary" class="primaryBut" size="mini">确定</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="80">
          </el-pagination>
        </el-col>
      </div>
    </el-row>

    <el-dialog title="日志" :visible.sync="dialogTableVisible" :content="true">
      <el-table :data="tableData">
        <el-table-column property="date" label="操作日期" width="150"></el-table-column>
        <el-table-column property="name" label="操作人员" width="200"></el-table-column>
        <el-table-column property="address" label="结果"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'changedInformation',
    data () {
      return {
        form:'',
        pickerOptions: {
          shortcuts: [{
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            }
          }, {
            text: '今年至今',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        tableData: [
          {
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
          }
        ],
        gridData:this.tableData,
        dialogTableVisible:false,
      }
    },
    methods:{
      hideRow(index,data){
        console.log(index)
        this.$confirm('确认【隐藏】此条信息？隐藏后E智通个股相关资讯、小e个股资讯不展示此信息。', '提示', {
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
            message: '已取消'
          });
        });
      },
      log(index,data){
        this.dialogTableVisible = true
      }
    }
  }
</script>

<style scoped>
  #information .footer{
    margin-top: 20px;
    margin-left: 15px;
    margin-bottom: 80px;
  }
  #information .checkUse{
    margin-right: 20px;
  }
  #information .primaryBut{
    margin-left: 20px;
  }
</style>
