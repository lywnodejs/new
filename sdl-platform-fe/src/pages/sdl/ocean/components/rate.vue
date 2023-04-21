<template>
  <div id="ocean-department-rate">
    <div class="block">
        <el-col class="statistic-box">
          <div class="box-header">
            <span class="color1 point">• </span>
            <span>公网域名加权覆盖率</span> &nbsp;<span @click="openDialog" class="domainCoverageDetail">查看详情</span>
          </div>
          <div class="box-content">
            <el-popover 
              placement="right-start" 
              trigger="hover"
              popper-class="statisticDetail"
              boundariesElement="viewport">
                <p class="highLightNum">活跃域名总数 : {{ domainCoverageRate.domain_total_count }}</p>
                <p>router活跃域名数 : {{ domainCoverageRate.domain_router_count}}</p>
                <p>麒麟公网服务域名数 : {{ domainCoverageRate.domain_kylin_count }}</p>
                <p>滴滴云WAF接入公司域名数 : {{ domainCoverageRate.domain_didiyun_waf_count }}</p>
                <p>soc关联到Git仓库域名数 : {{ domainCoverageRate.domain_soc_relate_git_count }}</p>
                <p>soc未关联到Git仓库域名数 : {{ domainCoverageRate.domain_not_relate_total_count }}</p>
                <hr>
                <p class="highLightNum">域名关联Git仓库总数 : {{ domainCoverageRate.git_total_count }}</p>
                <p>router关联Git仓库数 : {{ domainCoverageRate.git_router_relate_count }}</p>
                <p>麒麟公网服务关联Git仓库数 : {{ domainCoverageRate.git_kylin_relate_count }}</p>
                <p>通过Odin上线仓库数 : {{ domainCoverageRate.git_odin_deploy_tatal_count }}</p>
                <hr>
                <p class="highLightNum">覆盖Git仓库总数 : {{ domainCoverageRate.git_cover_total_count }}</p>
                <p>安全评估覆盖Git仓库数 : {{ domainCoverageRate.git_dorado_cover_total_count }}</p>
                <p>白盒检测覆盖Git仓库数 : {{ domainCoverageRate.git_otter_cover_total_count }}</p>
              <el-button class="color1 popover-btn" slot="reference">{{ decimalToPercent(domainCoverageRate.rate_of_coverage) }}</el-button>
            </el-popover>
          </div>
        </el-col>
        <el-col class="statistic-box" style="margin-left: 23px;">
          <div class="box-header">
            <span class="color2 point">• </span>
            <span>近7日Odin上线覆盖率</span>
          </div>
          <div class="box-content">
            <el-popover 
              placement="right" 
              trigger="hover"
              popper-class="statisticDetail">
                <p class="highLightNum">近7日Odin部署任务总数 : {{ odinDeployCoverageRate.last_week_all_odin_deploy_count }}</p>
                <p class="highLightNum">近7日白盒检测覆盖Odin部署任务数 : {{ odinDeployCoverageRate.last_week_otter_task_cover_odin_deploy_count }}</p>
              <el-button class="color2 popover-btn" slot="reference">{{ decimalToPercent(odinDeployCoverageRate.last_week_rate_of_coverage_of_odin_deploy) }}</el-button>
            </el-popover>
          </div>
        </el-col>
        <el-col class="statistic-box" style="margin-left: 23px;">
          <div class="box-header">
            <span class="color3 point">• </span>
            <span>上月漏洞检出率</span>
          </div>
          <div class="box-content">
            <el-popover 
              placement="left"
              trigger="hover"
              popper-class="statisticDetail">
                <p class="highLightNum">上月有效漏洞总数 : {{ vulDetectionRate.last_month_all_vuls_count }}</p>
                <p>上月SDL发现 (R1) 漏洞数 : {{ vulDetectionRate.last_month_r1_vuls_count }}</p>
                <p>上月线上发现 (R2) 漏洞数 : {{ vulDetectionRate.last_month_r2_vuls_count }}</p>
              <el-button class="color3 popover-btn" slot="reference">{{ decimalToPercent(vulDetectionRate.last_month_rate_of_detection_of_vul) }}</el-button>
            </el-popover>
          </div>
        </el-col>
        <el-col class="statistic-box" style="margin-left: 23px;"  v-show="flag">
          <!-- <span>{{ odinDeployCoverageRate }}</span> -->
          <div class="box-header">
            <span class="color4 point">• </span>
            <span>全年漏洞修复率</span>   <span class="chang-rate" @click="change">切换</span>
          </div>
          <div class="box-content">
            <!-- <span>{{ decimalToPercent(0.456789) }}</span> -->
            <!-- <span>{{ decimalToPercent(vulDetectionRate.last_month_rate_of_detection_of_vul) }}</span> -->
            <el-popover 
              placement="left"
              trigger="hover"
              popper-class="statisticDetail">
              <!-- <div class="statisticDetail"> -->
                <p class="highLightNum">漏洞总数 : {{ vulFixRate.total_vul_count }}</p>
                <p class="highLightNum">不修复漏洞总数 : {{ vulFixRate.vul_unfix_ex_octopus_offline_count }}</p>
                <p class="highLightNum">Web漏洞超期总数 : {{ vulFixRate.vul_web_expire_count }}</p>
                <p class="highLightNum">App漏洞超期总数 : {{ vulFixRate.vul_app_expire_count }}</p>
              <!-- </div> -->
              <el-button class="color4 popover-btn" slot="reference">{{ decimalToPercent(vulFixRate.year_rate_of_fixed_of_vul) }}</el-button>
            </el-popover>
          </div>
        </el-col>
        <el-col class="statistic-box" style="margin-left: 23px;" v-show="!flag">
          <!-- <span>{{ odinDeployCoverageRate }}</span> -->
          <div class="box-header">
            <span class="color4 point">• </span>
            <span>全年线上漏洞按时修复率</span>  <span class="chang-rate" @click="change">切换</span>
          </div>
          <div class="box-content">
            <el-popover 
              placement="left"
              trigger="hover"
              popper-class="statisticDetail">
              <!-- <div class="statisticDetail"> -->
                <p class="highLightNum">线上漏洞总数 : {{ vulR2OnTimeFixRate.total_vul_count }}</p>
                <p class="highLightNum">App漏洞按时修复总数 : {{ vulR2OnTimeFixRate.vul_app_on_time_fix_count }}</p>
                <p class="highLightNum">Web漏洞按时修复总数 : {{ vulR2OnTimeFixRate.vul_web_on_time_fix_count }}</p>
              <!-- </div> -->
              <el-button class="color4 popover-btn" slot="reference">{{ decimalToPercent(vulR2OnTimeFixRate.year_on_time_rate_of_fixed_of_r2_vul) }}</el-button>
            </el-popover>
          </div>
        </el-col>
      </div>
      <domain-coverage-detail-dialog ref="domainCoverage" :dialogVisible='dialogFormVisible' @projectDialog='getFormDialog' :deptId='deptId' ></domain-coverage-detail-dialog>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import domainCoverageDetailDialog from './domainCoverageDetailDialog'

  export default connect(() => {
    return {
      domainCoverageRate: 'ocean_department/domainCoverageRate',
      odinDeployCoverageRate: 'ocean_department/odinDeployCoverageRate',
      vulDetectionRate: 'ocean_department/vulDetectionRate'
    }
  }, {
    getDomainCoverageRate: 'ocean_department/getDepartmentDomainCoverageRate',
    getOdinDeployCoverageRate: 'ocean_department/getDepartmentOdinDeployCoverageRate',
    getVulDetectionRate: 'ocean_department/getDepartmentVulDetectionRate',
    departmentVulFixRate: 'ocean_department/departmentVulFixRate',
    departmentVulR2OnTimeFixRate: 'ocean_department/departmentVulR2OnTimeFixRate'
  })({
    data() {
      return {
        dialogFormVisible: false,
        dept_id: this.deptId,
        vulFixRate: {},
        vulR2OnTimeFixRate: {},
        flag: 0
      }
    },
    props: ['deptId'],
    created() {
        this.fetchData()
    },
    mounted() {
    },
    components: { domainCoverageDetailDialog },
    methods: {
      fetchData() {
          let queryParam = {dept_id: this.deptId}
          this.getDomainCoverageRate(queryParam).then(res => {
          })
          this.getOdinDeployCoverageRate(queryParam).then(res => {
          })
          this.getVulDetectionRate(queryParam).then(res => {
          })
          this.departmentVulFixRate(queryParam).then(res => {
            this.vulFixRate = res
          })
          this.departmentVulR2OnTimeFixRate(queryParam).then(res => {
            this.vulR2OnTimeFixRate = res
          })
          if (this.$refs.domainCoverage) {
            this.$refs.domainCoverage.fetchData(this.deptId)
          }
      },
      decimalToPercent(val) {
        let percent = Number(val * 100).toFixed(1)
        percent += '%'
        return percent
      },
      openDialog() {
        this.dialogFormVisible = true
      },
      getFormDialog(val) {
        this.dialogFormVisible = val
      },
      change() {
          this.flag = !this.flag
      }
    }
  })
</script>

<style lang="less">
#ocean-department-rate{
    .block {
      margin: 23px 11.5px 11.5px 11.5px;
      display: flex;
      .statistic-box {
        color: #333;
        height: 150px;
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
          padding: 3px 23px;
          text-align: center;
          font-size: 30px;
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
    .chang-rate{
        cursor: pointer;
        color: #fc9153;
    }
}
</style>

