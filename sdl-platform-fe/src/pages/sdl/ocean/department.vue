<template>
  <div id="ocean-department" >
      <el-container class="container">
        <el-header style="height: 50px;">
            <el-form class="searchForm" label-position="left"  :inline='true'>
                <el-form-item v-if="deptList.length>0"  label="业务线" label-width="60px" class="items" style=" color:white;">
                <el-select
                  v-model="dept_id"
                  filterable
                  clearable
                  placeholder="请选择一级部门">
                    <el-option
                    v-for="item in deptList"
                    :key="item.dept_id"
                    :label="item.dept_name"
                    :value="item.dept_id">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="统计周期" label-width="73px" class="items" style="margin-left: 30px; color:white;">
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
                </el-form-item>
                <el-form-item align="center">
                    <button type="button" class='ocean-btn' @click="searchDept"><span>查&nbsp;询</span></button>
                </el-form-item>
            </el-form>
        </el-header>
      </el-container>
      <rate ref='rate' class="rate-box" :deptId='dept_id'></rate>
      <div class="display"></div>
      <el-row  >
        <el-col :span="12"><statistics ref='statistics' :deptId='dept_id'></statistics></el-col>
        <el-col :span="12"><proportion ref='proportion' :deptId='dept_id'></proportion></el-col>
      </el-row>
      
      <div class="cutLine"></div>
      <vulnerability-list ref='vulnerabilityList' :deptId='dept_id' :time='time'></vulnerability-list>
      <evaluation-project-list ref='evaluationProjectList' :deptId='dept_id'  :time='time'></evaluation-project-list>
      <otter-task-list class="otterTaskList" ref='otterTaskList'  :deptId='dept_id'  :time='time'></otter-task-list>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import rate from './components/rate'
  import statistics from './components/statistics'
  import proportion from './components/proportion'
  import vulnerabilityList from './components/vulnerabilityList'
  import evaluationProjectList from './components/evaluationProjectList'
  import otterTaskList from './components/otterTaskList'

  export default connect(() => {
    return {
    }
  }, {
    getDeptList: 'ocean_department/getDeptList'
  })({
    data() {
      return {
          deptList: [],
          time: ['2019-08-01', '2019-09-01'],
          dept_id: 102678,
          tableData: [],
          start_date: '',
          end_date: ''
      }
    },
    components: {rate, statistics, proportion, vulnerabilityList, evaluationProjectList, otterTaskList},
    created() {
        this.getDeptList().then(data => {
            this.deptList = data.dept_list
        })
        this.getCurrentTime()
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
          this.$refs.rate.fetchData()
          this.$refs.statistics.fetchData()
          this.$refs.proportion.fetchData()
          this.$refs.vulnerabilityList.fetchData()
          this.$refs.evaluationProjectList.fetchData()
          this.$refs.otterTaskList.fetchData()
      },
      searchDept() {
          this.fetchData()
      },
      changeTime(time) {
        this.start_date = time[0]
        this.end_date = time[1]
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
#ocean-department{
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

