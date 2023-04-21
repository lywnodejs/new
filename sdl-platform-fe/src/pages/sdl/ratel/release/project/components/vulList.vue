<template>
  <div id="ratel-project-vul-list">
    <el-table
        :data="data"
        v-loading>
            <el-table-column
                label="ID"
                width="80"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.ratel_vulnerability_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="应用名称"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_release_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="应用标识"
                width="150"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_package_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="漏洞类型"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.mobile_rule_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="部门"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.dept_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="漏洞级别"
                width="80"
                align="center">
                <template slot-scope="scope">
                <span>{{ judgeVulLevel(scope.row.vul_level_id) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="漏洞状态"
                width="70"
                align="center">
                <template slot-scope="scope">
                <span>{{judgeStatus(scope.row.vul_status, 'vulStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="工单状态"
                width="70"
                align="center">
                <template slot-scope="scope">
                <span>{{judgeStatus(scope.row.anquan_vul_status, 'anquanVulStatus')}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="漏洞工单"
                width="80"
                align="center">
                <template slot-scope="scope">
                    <!-- <router-link style="color:#FC9153" :to="{ path : '/sdl/ratel/release/task/detail', query: {ratel_task_id: scope.row.ratel_task_id}}" target=_blank>
                    查看详情
                    </router-link> -->
                <span class="opera href" @click="openDialog(scope.row.anquan_vul_id, 'vul')">{{scope.row.anquan_vul_id}}</span>
                </template>
            </el-table-column>
        </el-table>

    <div align="right" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {connect} from '@/lib'
import * as CONSTANTS from '@/commons/ratel'
export default connect(() => {
    return {
    }
    }, {
        getListByProjectId: 'ratel_project/getListByProjectId'
    })({
    data() {
      return {
        value: '',
        data: [],
        queryParam: {
            ratel_project_id: parseInt(this.$route.query.ratel_project_id),
            page: 1,
            limit: 10
        },
        sdlAuditStatus: [{label: '未审计', value: 0}, {label: '漏洞', value: 2}, {label: '误报', value: 5}, {label: '忽略', value: 7}],
        num: 0,
        vulStatus: CONSTANTS.vulStatus,
        anquanVulStatus: CONSTANTS.anquanVulStatus
      }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.getListByProjectId(this.queryParam).then(res => {
                this.num = res.count
                this.data = res.vul_list
            })
        },
        openDialog(id, type) {
          if (type === 'vul') {
            let url = 'http://anquan.didichuxing.com/project/portals/pages/hole-detail.html?id=' + id
            window.open(url)
          } else {
            this.ratel_project_id = id
            this.dialogFormVisible = true
          }
        },
        getDialog(val) {
            this.dialogFormVisible = val
        },
        bounceUrl(id) {
          let url = '/sdl/ratel/release/project/detail?ratel_project_id=' + id
          window.open(url)
        },
        judgeVulLevel(id) {
            for (let i = 0; i < CONSTANTS.vulLevel.length; i++) {
                if (CONSTANTS.vulLevel[i].value === id) {
                    return CONSTANTS.vulLevel[i].label
                }
            }
        },
        judgeStatus(status, form) {
          for (let i = 0; i < this[form].length; i++) {
            if (status === this[form][i].value) {
              return this[form][i].label
            }
          }
        },
        handleSizeChange(val) {
            this.queryParam.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParam.page = val
            this.fetchData()
        }
    }
})
</script>
<style lang="less">
  #ratel-project-vul-list {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;
    box-sizing: border-box;
    .forward {
      padding-top: 10px;
      // margin-top: 30px;
      text-align: center;
      font-size: 20px;
    }
    .need {
      text-align: center;
      font-size: 15px;
      padding-top: 10px;
      margin-bottom: 20px;
    }
    .href{
      color: #FC9153;
    }
  }
</style>

