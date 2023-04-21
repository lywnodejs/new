<template>
  <div id="information">
      <el-row>
        <el-form :model="form" label-width="120px" :inline="true">
          <el-form-item label="股票代码/简称：">
            <Keyboardsprite @getstock="getstock"></Keyboardsprite>
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
          v-loading="loading"
          style="width: 100%;"
          border
          :show-overflow-tooltip="true"
          :data="tableData"
          tooltip-effect="dark"
          @select-all="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            label="时间">
            <template slot-scope="scope">{{ scope.row.updateAt | timeDateChange }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="股票代码/简称">
          </el-table-column>
          <el-table-column
            prop="title"
            width="300px"
            label="新闻标题">
          </el-table-column>
          <el-table-column
            label="类型">
            <template slot-scope="scope">{{ scope.row.dataTypes | formattingClass }}</template>
          </el-table-column>
          <el-table-column
            prop="mediaFrom"
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
            <el-checkbox label="全选" class="checkUse" size="mini" :value="allSele" v-model="allSele" @change="allSeleFun()"></el-checkbox>
            <el-select v-model="form" placeholder="批量操作" size="mini">
              <el-option label="批量隐藏" value="1"></el-option>
              <el-option label="批量显示" value="2"></el-option>
            </el-select>
            <el-button type="primary" class="primaryBut" size="mini">确定</el-button>
          </el-col>
          <el-col :span="12">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="form.cp"
              :page-size="form.ps"
              layout="total, prev, pager, next, jumper"
              :total="total">
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
  import Keyboardsprite from '@/components/KeyboardSprite'
    export default {
      name: 'information',
      data () {
        return {
          form:{
            cp:1,
            ps:10,
          },
          sendData:{
            cp:1,
            ps:10,
          },
          total:0,
          loading:true,
          allSele:false,
          pickerOptions: {
            shortcuts: [{
                text: '一周内',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(new Date().getDate() - 7);
                  picker.$emit('pick', [start, end]);
                }
              },{
              text: '本月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setDate(1);
                picker.$emit('pick', [start, end]);
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
          tableData: [],
          gridData:this.tableData,
          dialogTableVisible:false,
        }
      },
      created(){
        this.getData()
      },
      components:{
        Keyboardsprite
      },
      methods:{
        getData(){
          this.loading = true;
          this.$http.post('/signal/bigSearch/postSearch',this.sendData).then(function (result) {
            this.loading=false;
            if(result && result.data.data.list.length!==0){
              this.tableData = result.data.data.list;
              this.total = result.data.data.totalCount;
            }else{
              this.$message({
                type: 'info',
                message: '无数据'
              });
            }
          }).catch(function (err) {
            this.loading=false;
            this.$message({
              type: 'info',
              message: '服务器出现错误，请稍后再试'
            });
          })
        },
        getstock(val){
          console.log(val);
        },
        allSeleFun(){
            this.$refs.multipleTable.toggleAllSelection();
        },
        handleSelectionChange(selection){
          console.log(selection);
          if(selection.length!==0){
            this.allSele=true;
          }else{
            this.allSele=false;
          }
        },
        handleCurrentChange(val){
          this.sendData.cp = val;
          this.getData();
        },
        hideRow(index,data){
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
