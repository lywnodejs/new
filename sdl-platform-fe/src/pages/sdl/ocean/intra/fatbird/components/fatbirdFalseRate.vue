<template>
  <div id="ocean-intra-fatbird-falserate">
    <div class="block">
        <el-col class="statistic-box">
          <div class="box-header">
            
            <span>白盒误报率</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-date-picker
                  @change="changeTime(time)"
                    v-model="time"
                    type="daterange"
                    align="right"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <el-row>
            <el-table class="elTable"
            :default-sort = "{prop: 'index', order: 'descending'}"
            :data="tableData"
            v-loading>
            <el-table-column
                label="误报率"
                prop="index"
                sortable
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.index}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="分子/分母"
                prop="numerator"
                sortable
                align="center">
                <template slot-scope="scope">
                <span>{{`${scope.row.numerator}/${scope.row.denominator}`}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                label="分母"
                sortable
                prop="denominator"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.denominator}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                label="规则ID"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.rule_id}}</span>
                </template>
            </el-table-column>
            </el-table>
            <div align="right" style="margin-top: 10px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[10,20,30,50]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="num">
                </el-pagination>
            </div>
        </el-row>
        </el-col>
        
    </div>
  </div>
</template>
<script>
  import {connect} from '@/lib'

  export default connect(() => {
    return {
    }
  }, {
    ruleFalseIndex: 'ocean_fatbird/ruleFalseIndex'
  })({
    data() {
      return {
        time: ['', ''],
        start_day: '',
        end_day: '',
        num: 0,
        page: 1,
        limit: 20,
        tempData: [],
        tableData: []
      }
    },
    created() {
        this.getCurrentTime()
        this.changeTime(this.time)
        this.fetchData()
    },
    mounted() {
    },
    components: {},
    methods: {
      fetchData() {
        let param = {
            start_day: this.start_day,
            end_day: this.end_day
        }
        this.ruleFalseIndex(param).then(res => {
            this.num = res.count
            this.tempData = res.rule_false_index
            this.handlePage(this.limit, this.page)
        })
      },
      decimalToPercent(val) {
        let percent = Number(val * 100).toFixed(1)
        percent += '%'
        return percent
      },
      handleTime(time) {
          if (!time) {
              return '暂无数据'
          }
          let arr = time.split(' ')
          let arr1 = arr[1].split(':')
          let str = arr[0] + ' 天 ' + arr1[0] + ' 时 ' + arr1[1] + ' 分 ' + arr1[2] + ' 秒 '
          return str
      },
      changeTime(time) {
        this.start_day = time[0]
        this.end_day = time[1]
        this.fetchData()
      },
      getCurrentTime() {
        let nowdate = new Date();
        let y = nowdate.getFullYear();
        let m = nowdate.getMonth() + 1;
        let d = nowdate.getDate();
        if (m < 10) {
          m = '0' + m
        }
        if (d < 10) {
          d = '0' + d
        }
        this.time[1] = y + '-' + m + '-' + d;
        nowdate.setMonth(nowdate.getMonth() - 1);
        y = nowdate.getFullYear();
        m = nowdate.getMonth() + 1;
        d = nowdate.getDate();
        if (m < 10) {
          m = '0' + m
        }
        if (d < 10) {
          d = '0' + d
        }
        this.time[0] = y + '-' + m + '-' + d;
      },
      handleSizeChange(val) {
        this.limit = val
        this.handlePage(this.limit, this.page)
      },
      handleCurrentChange(val) {
        this.page = val
        this.handlePage(this.limit, this.page)
      },
      handlePage(limit, page) {
          this.tableData = this.tempData.slice(limit * (page - 1), limit * page)
      }
    }
  })
</script>

<style lang="less">
#ocean-intra-fatbird-falserate{
    // margin-top:11.5px;
    margin-top:11.5px;
     margin-right: 11.5px;
    .block {
      margin: 23px 11.5px 11.5px 23px;
      display: flex;
      .statistic-box {
        color: #333;
        background-color: white;
        .box-header {
          padding: 15px 23px;
          font-size: 12.5px;
          font-style: normal;
        }
      }
    }
    .el-row{
        padding: 20px;
    }
    .el-form-item__label{
        color: white;
        width: 60px;
    }
}
</style>

