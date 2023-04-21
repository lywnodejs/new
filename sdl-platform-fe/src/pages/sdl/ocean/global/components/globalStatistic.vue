<template>
  <div id="global-statistic">
    <div class="block">
        <el-col class="statistic-box">
          <!-- <span>{{ domainCoverageRate }}</span> -->
          <div class="box-header">
            <span class="color1 point">• </span>
            <span>公网域名加权覆盖率</span>
          </div>
          <div class="box-content">
            <!-- <span>{{ decimalToPercent(0.123456) }}</span> -->
            <!-- <span>{{ decimalToPercent(domainCoverageRate) }}</span> -->
            <el-popover 
              placement="right-start" 
              trigger="hover"
              popper-class="statisticDetail"
              boundariesElement="viewport">
              <!-- <div class="statisticDetail"> -->
                <!-- <p>域名总覆盖数 : {{ domainCoverageRate.domain_total_count }}</p>
                <p>git总数 : {{ domainCoverageRate.git_total_count }}</p> -->
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
              <!-- </div> -->
              <el-button class="color1 popover-btn" slot="reference">{{ decimalToPercent(domainCoverageRate.rate_of_coverage) }}</el-button>
            </el-popover>
          </div>
        </el-col>
        <el-col class="statistic-box" style="margin-left: 23px;">
          <!-- <span>{{ odinDeployCoverageRate }}</span> -->
          <div class="box-header">
            <span class="color2 point">• </span>
            <span>近7日Odin上线覆盖率</span>
          </div>
          <div class="box-content">
            <!-- <span>{{ decimalToPercent(0.456789) }}</span> -->
            <!-- <span>{{ decimalToPercent(odinDeployCoverageRate) }}</span> -->
            <el-popover 
              placement="right" 
              trigger="hover"
              popper-class="statisticDetail">
              <!-- <div class="statisticDetail"> -->
                <p class="highLightNum">近7日Odin部署任务总数 : {{ odinDeployCoverageRate.last_week_all_odin_deploy_count }}</p>
                <p class="highLightNum">近7日白盒检测覆盖Odin部署任务数 : {{ odinDeployCoverageRate.last_week_otter_task_cover_odin_deploy_count }}</p>
              <!-- </div> -->
              <el-button class="color2 popover-btn" slot="reference">{{ decimalToPercent(odinDeployCoverageRate.last_week_rate_of_coverage_of_odin_deploy) }}</el-button>
            </el-popover>
          </div>
        </el-col>
        <el-col class="statistic-box" style="margin-left: 23px;">
          <!-- <span>{{ odinDeployCoverageRate }}</span> -->
          <div class="box-header">
            <span class="color3 point">• </span>
            <span>上月漏洞检出率</span>
          </div>
          <div class="box-content">
            <!-- <span>{{ decimalToPercent(0.456789) }}</span> -->
            <!-- <span>{{ decimalToPercent(vulDetectionRate.last_month_rate_of_detection_of_vul) }}</span> -->
            <el-popover 
              placement="left"
              trigger="hover"
              popper-class="statisticDetail">
              <!-- <div class="statisticDetail"> -->
                <p class="highLightNum">上月有效漏洞总数 : {{ vulDetectionRate.last_month_all_vuls_count }}</p>
                <p>上月SDL发现 (R1) 漏洞数 : {{ vulDetectionRate.last_month_r1_vuls_count }}</p>
                <p>上月线上发现 (R2) 漏洞数 : {{ vulDetectionRate.last_month_r2_vuls_count }}</p>
              <!-- </div> -->
              <el-button class="color3 popover-btn" slot="reference">{{ decimalToPercent(vulDetectionRate.last_month_rate_of_detection_of_vul) }}</el-button>
            </el-popover>
          </div>
        </el-col>
        <el-col class="statistic-box" style="margin-left: 23px;" v-show="flag">
          <!-- <span>{{ odinDeployCoverageRate }}</span> -->
          <div class="box-header">
            <span class="color4 point">• </span>
            <span>全年漏洞修复率</span>  <span class="chang-rate" @click="change">切换</span>
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
  </div>
</template>
<script>
  import {connect} from '@/lib'

  export default connect(() => {
    return {
      domainCoverageRate: 'ocean_global/domainCoverageRate',
      odinDeployCoverageRate: 'ocean_global/odinDeployCoverageRate',
      vulDetectionRate: 'ocean_global/vulDetectionRate'
    }
  }, {
      getDomainCoverageRate: 'ocean_global/getDomainCoverageRate',
      getOdinDeployCoverageRate: 'ocean_global/getOdinDeployCoverageRate',
      getVulDetectionRate: 'ocean_global/getVulDetectionRate',
      globalVulFixRate: 'ocean_global/globalVulFixRate',
      globalVulR2OnTimeFixRate: 'ocean_global/globalVulR2OnTimeFixRate'
  })({
    data() {
      return {
        availableMonths: [],
        vulFixRate: {},
        vulR2OnTimeFixRate: {},
        flag: 0
      }
    },
    created() {
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.getOdinDeployCoverageRate().then(res => {
        })
        this.getDomainCoverageRate().then(res => {
        })
        this.getVulDetectionRate().then(res => {
        })
        this.globalVulFixRate().then(res => {
          this.vulFixRate = res
        })
        this.globalVulR2OnTimeFixRate().then(res => {
            this.vulR2OnTimeFixRate = res
        })
      },
      decimalToPercent(val) {
        let percent = Number(val * 100).toFixed(1)
        percent += '%'
        return percent
      },
      change() {
          this.flag = !this.flag
      }
    }
  })
</script>
<style lang="less">
#global-statistic {
    .block {
      margin: 23px 11.5px 11.5px 11.5px;
      // background: #fff;
      // padding: 23px;
      display: flex;
      .statistic-box {
        color: #333;
        // border: 1px solid #E4E4E4;
        height: 150px;
        background-color: white;
        // box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        .box-header {
          padding: 15px 23px;
          font-size: 12.5px;
          font-style: normal;
          // border-bottom: 1px solid #E4E4E4;
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
          // margin-left: 40%;
          text-align: center;
          font-size: 30px;
          .popover-btn{
            border: none;
            // color:  #7CE0C3;
            font-size: 45px;
            // font-weight: bold;
          }
          // .el-button:hover {
          //   background-color: none;
          // }
          // .el-button:focus {
          //   background-color: none;
          // }
          .el-button:hover {
            background: none;
          }
          .el-button:focus {
            background: none;
          }
        }
      }
    }
    .el-col {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .el-row {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .chang-rate{
        cursor: pointer;
        color: #fc9153;
    }
}
</style>
