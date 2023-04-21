<template>
  <div id="ocean-baseline" >
      <baseline-by-time></baseline-by-time>
      <baseline-by-id></baseline-by-id>
      <!-- <rate ref='rate' class="rate-box" :deptId='dept_id'></rate> -->
      <baseline-monitor></baseline-monitor>
      <nps-evaluate></nps-evaluate>
      <div class="cutLine"></div>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import baselineByTime from './components/baselineByTime'
  import baselineById from './components/baselineByID'
  import npsEvaluate from './components/npsEvaluate'
  import baselineMonitor from './components/baselineMonitor'

  export default connect(() => {
    return {
    }
  }, {
    baselineNewCTR: 'ocean_baseline/baselineNewCTR'
  })({
    data() {
      return {
          deptList: [],
          sdl_project_id: null,
          time: ['2019-02-05', '2019-02-28'],
          dept_id: 102678,
          tableData: [],
          start_day: '',
          end_day: ''
      }
    },
    components: {baselineByTime, baselineById, npsEvaluate, baselineMonitor},
    created() {
        this.getCurrentTime()
        this.fetchData()
    },
    mounted() {
    },
    methods: {
      fetchData() {
        this.changeTime(this.time)

        // let param = {
        //     CTR_data: {
        //         sdl_project_id: 3109,
        //         baseline_no: '1.1.1-b',
        //         username: 'liukaiwen'
        //     },
        //     function_name: 'baseline_normalize'
        // }
        // this.baselineNewCTR(param).then(res => {
        //     console.log(res)
        // })
      },
      searchDept() {
          this.fetchData()
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
#ocean-baseline{
    margin: 23px 0;
    .container{
        width: 100%;
        background: #596385;
        height: 50px;
        
        .items{
            margin-top: 9px;
            margin-left: 5px;
            color: white !important;
        }
    }
    .ocean-btn {
      background: #FC9153;
      border-radius: 4px;
      width: 95px;
      height: 32px;
      border: none;
      color: white;
      margin-top: 9px;
      margin-left: 50px;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
      cursor: pointer;
      span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
      }
    }
    .rate-box{
      width: auto;
      box-sizing: border-box;
      // background: white;
      margin: 11.5px;
    }
    .statistics-box{
      width: auto;
      box-sizing: border-box;
      // background: white;
      margin: 23px;
    }
    .el-col {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .el-row {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .el-form-item__label{
        color: white;
        width: 60px;
    }
    .otterTaskList{
      margin-bottom: 23px;
    }
}
.el-popover.statisticDetail{
  padding: 15px 15px;
  min-width: 250px;
  line-height: 20px;
  font-size: 12.5px;
  // background-color: rgba(230,230,230,0.7);
  background-color: rgba(50,50,50,0.8);
  color: #fff;
  border-radius: 4px;
  border: none;
  p {
    opacity: 0.7
  }
  .highLightNum {
    opacity: 1;
    color: white;
  }
  .popper__arrow {
    border: none;
  }
  .popper__arrow:after{
    border-right-color: rgba(50,50,50,0.7);
    border-left-color: rgba(50,50,50,0.7);
  }
}
</style>

