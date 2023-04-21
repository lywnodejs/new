<template>
  <div id="information">
    <el-row>
      <el-form :model="form" label-width="120px" :inline="true">
        <el-form-item label="股票代码/简称：">
          <Keyboardsprite @getstock="getstock"></Keyboardsprite>
        </el-form-item>

        <el-form-item label="时间筛选：">
          <el-date-picker
            v-model="time"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>


        <el-form-item label="风险提示查询：">
          <el-input v-model="form.content" placeholder="请输入风险提示内容"></el-input>
        </el-form-item>

        <el-form-item label="类型：">
          <el-select v-model="form.type" placeholder="请选择风险分类">
            <el-option v-for="(item,index) in lxList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search()">确定</el-button>
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
        tooltip-effect="dark">
        <el-table-column
          label="时间">
          <template slot-scope="scope">{{ scope.row.tradeDt | formattingTime }}</template>
        </el-table-column>
        <el-table-column
          prop="stockCode"
          label="股票代码/简称">
        </el-table-column>
        <el-table-column
          prop="indicatorValue"
          label="风险提示">
        </el-table-column>
        <el-table-column
          label="类型">
          <template slot-scope="scope">{{ scope.row.indicator}}</template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-col :span="12" :offset="10">
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
  </div>
</template>

<script>
  import Keyboardsprite from '@/components/KeyboardSprite'
  export default {
    name: 'riskInformationList',
    data () {
      return {
        form:{
          cp:1,
          ps:10,
          stockCode:'',
          content:'',
          type:''
        },
        time:[],
        sendData:{
          cp:1,
          ps:10,
        },
        total:0,
        lxList:['主营收入','主营收入增长率大幅大于净利润增长率','低存货周转率和高毛利多年持续并存','其他应收偏高','其他流动资产激增','净利润','净现比（除房地产、三大行业）','净现金流','大额整数','存贷双高（除三大行业）','应收帐款占比异常','应收票据造假','应收账款激增','总资产周转率（技术服务类/制造、流通、综合行业）','收现比（除房地产、三大行业）','毛利率','毛利率异常','现金负债比异常','经营、投资、筹资风险组合','规避退市','资产减值损失和商誉（除三大行业）','资产负债率异常（房地产）','资产负债率异常（除房地产）','非经常性损益','高管变化'],
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
        var params = this.sendData;
        this.$http.get('/riskInfo/financialRisk/list',{params}).then(function (result) {
          this.loading=false;
          if(result && result.data.list.length!==0){
            this.tableData = result.data.list;
            this.total = result.data.totalCount;
          }else{
            this.tableData = result.data.list;
            this.total = result.data.totalCount;
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
      search(){
        this.sendData = this.form;
        if(this.time.length>=2){
          this.sendData.start = new Date(this.time[0]).getTime();
          this.sendData.end = new Date(this.time[1]).getTime();
        }
        this.getData();
      },
      getstock(val){
        this.form.stockCode=val.code;
      },
      handleCurrentChange(val){
        this.sendData.cp = val;
        this.getData();
      },
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
