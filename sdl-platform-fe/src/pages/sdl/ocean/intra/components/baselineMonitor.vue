<template>
  <div id="ocean-baseline-monitor">
    <div class="block">
        <el-col class="statistic-box" style="margin-left: 23px;">
          <div class="box-header">
            
            <span>基线指标-异常监控</span>&nbsp;&nbsp;&nbsp;&nbsp;
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
            <el-col :span="24">
                <monitor-by-time :time='time'></monitor-by-time>
            </el-col>
          </el-row>
        </el-col>
      </div>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import monitorByTime from './monitorByTime'

  export default connect(() => {
    return {
    }
  }, {
    baselineMonitor: 'ocean_baseline/baselineMonitor'
  })({
    data() {
      return {
        time: ['', ''],
        start_day: '',
        end_day: '',
        monitorInfo: {}
      }
    },
    created() {
        this.getCurrentTime()
        this.changeTime(this.time)
    },
    mounted() {
    },
    components: {monitorByTime},
    methods: {
      fetchData() {
          let param = {
            start_day: this.time[0],
            end_day: this.time[1]
          }
          this.baselineMonitor(param).then(res => {

              // console.log(res)
              this.monitorInfo = res
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
      }
    }
  })
</script>

<style lang="less">
#ocean-baseline-monitor{
    margin-top:11.5px;
     margin-right: 23px;
    .block {
    //   margin: 23px 11.5px 11.5px 11.5px;
      display: flex;
      .statistic-box {
        color: #333;
        background-color: white;
        .box-header {
          padding: 15px 23px;
          font-size: 12.5px;
          font-style: normal;
        }
        .point {
          font-weight: bold;
        }
        .color1 {
          color: #73A6F7;
        }
        .color2 {
          color: #98e23e;
        }
        .color3 {
          color: #FF7B41;
        }
        .color4 {
          color: #E6A23C;
        }
        .box-content {
          margin-top: 10px;
          margin-bottom: 20px;
          .item{
            //   text-align: center;
              padding-left: 10px;
              margin: 0 auto;
              .content{
                  margin-left: 40px;
                  line-height: 25px;
              }
              .content-header{
                  line-height: 30px;
                  text-align: center;
              }
              .box-card{

              }
          }
          .popover-btn{
            border: none;
            font-size: 45px;
          }
          .el-button:hover {
            background: none;
          }
          .el-button:focus {
            background: none;
          }
        }
      }
    }
    .domainCoverageDetail{
      color: #73A6F7;
      cursor: pointer;
    }
    .el-form-item__label{
        color: white;
        width: 60px;
    }
    .nps-xslx-btn{
      position: relative;
      margin-left: 80px;
      height: 32px;
      line-height: 10px;
      margin-top: 1px;
      color: #FF7B41;
      border-color: #FF7B41;
    }
}
</style>

