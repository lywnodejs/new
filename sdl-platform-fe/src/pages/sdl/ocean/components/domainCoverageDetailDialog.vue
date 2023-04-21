<template>
       <el-dialog id="domain-coverage-detail-dialog"
                title="公网域名加权覆盖详情"
               :visible.sync="dialogFormVisible"
                width="970px">
      <el-table 
        :data="objectKeys" :default-expand-all='defaultExpand' ref='table'
        :row-style="tableRowStyle" @header-click="headerClick" 
        style="width: 100%">
        <el-table-column type="expand" :label="label" width="51">
          <template slot-scope="props"  v-show="domainCoverage[props.row].is_relate_git">
            <!-- <el-container>
                <el-main><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.git}}</span></el-main>
                <el-main>Main</el-main>
            </el-container> -->
            <el-table class="expandTable"
                :header-cell-style="tableHeaderColor"
                :row-style="tableRowStyle"
                :data="domainCoverage[props.row].relate_git_list">
                <el-table-column label="空白" width="50">
                </el-table-column>
                <el-table-column label="Git地址" width="500">
                    <template slot-scope="scope">
                        <span>{{scope.row.git}}</span>
                        <el-tooltip class="item" effect="dark" content="gitlab" placement="top">
                          <span class="gitlab-img" @click="gitlabBounce(scope.row.git)"><i class="iconfont icon-gitlab"></i></span>
                        </el-tooltip>
                        
                        <!-- <img class="gitlab-img" @click="gitlabBounce(scope.row.git)" src="../../../../assets/gitlab.jpeg" alt=""> -->
                        <el-tooltip class="item" effect="dark" content="线上接口" placement="top">
                          <span class="anquan-url" @click="anquanBounce(scope.row.git)"><i class="iconfont icon-search__a"></i></span>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>
                <el-table-column label="信息">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status[0]" class="odin">Odin上线</el-tag>
                    <el-tag v-if="scope.row.status[1]" class="kylin">白盒覆盖</el-tag>
                    <el-tag v-if="scope.row.status[2]" class="sdl">安全评估覆盖</el-tag>
                  </template>
                </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
        label="域名">
            <template slot-scope="scope">
            <span>{{scope.row}}</span>
            </template>
        </el-table-column>
        <el-table-column
        label="关联Git仓库" prop="relate_git_list"
            sortable
            width="120">
            <template slot-scope="scope">
            <span>{{ handleGit(domainCoverage[scope.row].is_relate_git) }}</span>
  
            </template>
        </el-table-column>
        <el-table-column
        label="服务树">
            <template slot-scope="scope">
                <span class="ellipsis">{{domainCoverage[scope.row].cmdb_domain_detail.tree_node}}</span>
            </template>
        </el-table-column>
        <el-table-column
        label="备注">
            <template slot-scope="scope">
                <span class="ellipsis">{{domainCoverage[scope.row].cmdb_domain_detail.remark}}</span>
            </template>
        </el-table-column>
    </el-table>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    domainCoverageDetail: 'ocean_department/domainCoverageDetail'
})({
  props: ['dialogVisible', 'deptId'],
  data() {
    return {
        dialogFormVisible: false,
        dept_id: this.deptId,
        domainCoverage: {},
        objectKeys: [],
        label: '开/合',
        defaultExpand: false
    }
  },
  created() {
      this.fetchData(this.deptId)
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.dialogFormVisible = val
    },
    dialogFormVisible(val) {
        this.$emit('projectDialog', this.dialogFormVisible)
    },
    deptId(val) {

        // this.fetchData(val)
    }
  },
  methods: {
      fetchData(val) {

          this.domainCoverageDetail({dept_id: val}).then(res => {
              this.domainCoverage = res
              this.objectKeys = Object.keys(this.domainCoverage)
          })

          // this.domainCoverage = {'ad-doctor.xiaojukeji.com': {
          //   is_relate_git: 1,
          //   relate_git_list: [{git: 'git@git.xiaojukeji.com:comercial/ad-doctor.git', status: [true, true, false]}, {git: 'git@git.xiaojukeji.com:SDL/golang-engine.git', status: [true, true, false]}],
          //   cmdb_domain_detail: {
          //     create_time: '2018-11-23 15:07:05',
          //     creator: 'jiahui',
          //     dept_id: 101903,
          //     dept_name: '业务平台技术',
          //     dept_t1_id: 101903,
          //     dept_t1_name: '业务平台技术',
          //     dns: '',
          //     domain_fullname: 'ad-doctor.xiaojukeji.com',
          //     domain_id: 8023,
          //     expire_time: '2019-11-23 15:07:05',
          //     git_url: '',
          //     id: 3164,
          //     is_del: 0,
          //     is_didiyun: 0,
          //     is_kylin: 0,
          //     is_router: 1,
          //     op: 'sjsunjun,lupei,jianjunhe,yuansong,zewang,xiaojunjiang,huoshengkun,longzongyi,jiahui,lishuaigibran',
          //     rd: 'jiangzhaoyang,gujiecheng,yangshuo,wangkeke,huoshengkun',
          //     rd_leader: 'yangshuo,penglingpeng,jasonguo,zhengfeng',
          //     remark: '新业务',
          //     sync_time: '2020-01-13 11:12:39',
          //     t1_name: '平台技术部',
          //     t2_name: '业务平台',
          //     tree_node: 'com.didi.biz.gs.growth.commercial',
          //     update_time: '2020-01-13 00:01:10'
          //   }
          // }}
          // this.objectKeys = Object.keys(this.domainCoverage)
      },
      gitlabBounce(git) {
        let url = 'http://git.xiaojukeji.com/' + git.split(':')[1]
        window.open(url)
      },
      anquanBounce(git) {
        let url = `http://soc.didichuxing.com/manage/asset/url/list?page=1&size=10&gitUrl=${git}&orderBy=createTime&order=descending`

        // let url = `http://anquan.didichuxing.com/project/portals/pages/hole-list.html#?orderBy=postTime&order=desc&holeSource2=&holeEffectInfo=${git}&type=&holeState=&page=1&size=10`
        window.open(url)
      },
      handleGit(val) {
          if (val) {
              return '是'
          }
          return '否'
      },
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
            return 'display:none;border-bottom: 1px solid #e2e2e2;'
        }
      },
      tableRowStyle({ row, rowIndex }) {
        return 'border-bottom:1px solid #e2e2e2; '
      },
      headerClick(column, event) {
        if (column.type === 'expand') {
          this.toogleExpand()
        }
      },
      toogleExpand(row) {
        let $table = this.$refs.table
        this.objectKeys.forEach(element => {
          $table.toggleRowExpansion(element)
        });
      }
  }
})
</script>
<style lang="less">
#domain-coverage-detail-dialog{
    .title{
        font-weight: bold;
        margin-bottom: 15px;
    }
  .button {
    padding: 0;
    float: right;
  }
  .ellipsis{
      white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .gitlab-img {
    font-size: 9px;
    cursor: pointer;
    position: relative;
    top: 3px;
    left: 3px;
    color: #FC9153;
  }
  .anquan-url{
    font-size: 9px;
    cursor: pointer;
    position: relative;
    top: 4px;
    left: 5px;
    color: #FC9153;
  }
  .octopus-diaolog-button {
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    line-height: 10px;
    font-size: 13px;
  }

  .octopus-diaolog-btn {
    float: right;
    background: #FC9153;
    border-radius: 4px;
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    line-height: 10px;
    font-size: 13px;
    border: none;
  }
  .octopus-diaolog-btn.search-btn {
    margin-left: 15px;
    width: 95px;
  }
  .el-table_4_column_26 {
    .cell{
      color: #FC9153;
      cursor: pointer;
    }
  }
//   .el-table__expand-icon > .el-icon {
//     position: absolute;
//     left: 50%;
//     top: 0;
//     margin-left: -5px;
//     margin-top: -15px;
//   }
  .el-icon-arrow-right{
      color: #FC9153;
  }
  .el-table th.is-leaf, .el-table td {
    // border-bottom: 1px solid #e2e2e2;
    border-bottom: none;
  }
  .expandTable{
      border: none;
  }
  .odin{
        background-color: rgba(103, 194, 58, 0.1);
        color: #67c23a;
        display: inline-block;
        padding: 0 10px;
        -webkit-font-smoothing: antialiased;
        height: 26px;
        line-height: 23px;
        font-size: 12px;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid rgba(103, 194, 58, 0.2);
        white-space: nowrap;
    }
    .kylin {
        background-color: rgba(250, 137, 25, 0.1);
        display: inline-block;
        padding: 0 10px;
        -webkit-font-smoothing: antialiased;
        height: 26px;
        line-height: 23px;
        font-size: 12px;
        color: #fc9153;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid rgba(250, 137, 25, 0.2);
        white-space: nowrap;
    }
    .sdl {
        background-color: #ecf5ff;
        display: inline-block;
        height: 26px;
        padding: 0 10px;
        line-height: 23px;
        font-size: 12px;
        color: #409eff;
        border: 1px solid #d9ecff;
        border-radius: 4px;
        box-sizing: border-box;
        white-space: nowrap;
    }
}
</style>