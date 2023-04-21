<template>
  <div>
    <el-form :model="form" label-width="120px" :inline="true">
      <el-form-item label="平台账号：">
        <el-input v-model="form" placeholder="请输入平台账号"></el-input>
      </el-form-item>
    </el-form>

    <el-divider></el-divider>
    <el-button @click="openDialog()" style="margin-bottom: 10px" type="primary" icon="el-icon-plus">添加</el-button>

    <el-table
      ref="multipleTable"
      style="width: 100%;"
      border
      :data="tableData"
      tooltip-effect="dark">
      <el-table-column
        label="时间">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="平台账号">
      </el-table-column>
      <el-table-column
        prop="address"
        width="300px"
        label="分配股票序列">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="log(scope.$index, tableData)"
            type="text"
            size="small">
            日志
          </el-button>
          <el-button
            @click.native.prevent="removeRow(scope.$index, tableData)"
            type="text"
            size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog style="width: 100%;"  :visible.sync="dialogTableVisible" :content="true">
      <template #title>添加人员股票权限</template>
      <el-row>
        <el-col :span="12">
          <span class="alert_p">选择人员账号：</span><br>
          <span class="alert_s">已在运营平台注册的账号</span><br>
          <el-select v-model="form" placeholder="请选择平台账号">
            <el-option label="所有状态" value="1"></el-option>
            <el-option label="信息已显示" value="2"></el-option>
            <el-option label="信息被隐藏" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span class="alert_p">分配账号：</span><br>
          <span class="alert_s">不填写默认设置所有股票</span>
          <div v-for="(item,index) in inputList">
            <el-input style="width: 200px;margin-bottom: 10px"  placeholder="可输入000001～000600" v-model="item.data"></el-input>
            <i v-if="index==0" style="margin-left: 10px;font-size: 20px" class="el-icon-circle-plus-outline" @click="addinput()"></i>
            <i v-else="index==0" style="margin-left: 10px;font-size: 20px" class="el-icon-remove-outline" @click="removeinput(index)"></i>
          </div>

        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="10" :offset="14">
          <el-button type="info">重置</el-button>
          <el-button type="primary">分配完成</el-button>
        </el-col>

      </el-row>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "setPermission",
        data(){
          return {
            form:'',
            dialogTableVisible:true,
            inputList:[
              {index:1,data:''}
            ],
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
          }
        },
      methods:{
        addinput(){
          this.inputList.push({
            index:this.inputList.length,
            data:''
          })
        },
        openDialog(){
          this.dialogTableVisible=true;
        },
        removeinput(index){
          this.inputList.splice(index,1);
        },
        removeRow(index,data){
          console.log(index)
          this.$confirm('确认【删除】人员权限设置？', '提示', {
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
      }
    }
</script>

<style scoped>
.alert_p{
  font-size: 16px;
  color: #202020;
  display: inline-block;
}
  .alert_s{
    color: #959595;
    font-size: 12px;
    display: inline-block;
    margin-bottom: 10px;
  }
</style>
