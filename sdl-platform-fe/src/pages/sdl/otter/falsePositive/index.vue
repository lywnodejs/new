<template>
    <div id="fpList">
    <div class="el-main">
      <el-form class="searchForm" label-position="left" :inline='true'>
        <div class="displayFlex">
          <el-form-item label="项目ID:" prop="name" label-width="80px">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入项目ID"
                      v-model="queryParam.keywords.otter_project_id"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="Checkmarx规则ID:" prop="name" label-width="120px" style="margin-left: 30px;">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入Checkmarx规则ID"
                      v-model="queryParam.keywords.checkmarx_rule_id"
                      auto-complete="off">
            </el-input>
          </el-form-item>
        </div>
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='fpSearch-button' @click="fetchData()"><span>搜&nbsp;&nbsp;索</span>
              </button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="cutLine"></div>

      <!-- 展示数据 -->
      <el-table
        :data="FpList"
        v-loading>
        <el-table-column
            prop="otter_fp_id"
            label="ID"
            width="70"
            align="center">
          </el-table-column>
          <el-table-column
            prop="similarity_id"
            label="相似度ID"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
          prop="otter_project_id"
          label="项目ID"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
            prop="checkmarx_rule_id"
            label="Checkmarx规则ID"
            width="140"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sf_path"
            label="来源文件 [行号]"
            min-width="130"
            align="center">
            <template slot-scope="scope">
                {{handlePath(scope.row.sf_path, scope.row.sf_line)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sf_path"
            label="目标文件 [行号]"
            min-width="150"
            align="center">
            <template slot-scope="scope">
                {{handlePath(scope.row.df_path, scope.row.df_line)}}
            </template>
          </el-table-column>
          
        
        
        <el-table-column
          align="center"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <!-- <router-link style="color:#FC9153" :to="" target=_blank> -->
              <span  style="color:#FC9153">删除</span>
            <!-- </router-link> -->
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
    

    </div>
</template>
<script>
import {connect} from '@/lib'
import * as CONSTANTS from '@/commons/otter'

  export default connect(() => {
    return {
      FpList: 'otter/fpList',
      num: 'otter/fpListLength'
    }
  }, {
    getFpList: 'otter/getFpList'
  })({
    data() {
        return {
            createTime: [],
            detectionTime: [],
            taskStatus: CONSTANTS.status,
            queryParam: {
                page: 1,
                limit: 20,
                keywords: {
                    otter_project_id: '',
                    checkmarx_rule_id: ''
                }
            }
        }
    },
    components: {},
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {

        this.getFpList(this.queryParam).then(response => {
          console.log(this.FpList)
        })
      },
      gitHandle(url, name) {
        let arr = url.split(':')
        if (name == 'url') {
          return arr[1]
        }
        if (name == 'link') {
          let myUrl = 'https://git.xiaojukeji.com/' + arr[1]
          window.open(myUrl)
        }
      },
      judgeStatus(status) {
        if (status >= 5) {
          return 'info'
        }
        if (status == 4) {
          return 'success'
        }
        if (status == 3) {
          return 'warning'
        }
        if (status == 2) {
          return 'danger'
        }
        if (status == 0 || status == 1) {
          return ''
        }
      },
      handleSdlEngineer(sdlDngineer) {
        if (!sdlDngineer) {
          sdlDngineer = '未指定'
        } else {
          for (let i = 0; i < CONSTANTS.engineer.length; i++) {
            if (sdlDngineer == CONSTANTS.engineer[i].value) {
              sdlDngineer = CONSTANTS.engineer[i].label
            }
          }
        }
        return sdlDngineer
      },
      bounceDing(sdlDngineer) {
        let url = 'dingtalk://dingtalkclient/action/sendmsg?dingtalk_id='
        for (let i = 0; i < CONSTANTS.engineer.length; i++) {
          if (sdlDngineer == CONSTANTS.engineer[i].value) {
            url = url + CONSTANTS.engineer[i].phone
          }
        }
        return url
      },
      handlePath(name, id) {
          let arr = name.split('/')
          return `${arr[arr.length - 1]}   [${id}]`
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
  #fpList {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -15px;
    box-sizing: border-box;
    .el-main {
      width: 100%;
      box-sizing: border-box;
      background: white;
      .displayFlex {
        display: flex;
      }
      .searchForm {
        .searchInput {
          width: 230px;
        }
      }
      .el-tag{
        height: 25px;
        line-height: 25px;
      }
      .blue{
        background-color: rgba(64,158,255,.1);
        color: #409eff;
        border: 1px solid rgba(64,158,255,.2);
      }
    }
    .engineerName {
      line-height: 20px;
    }

    .engineerLogo {
      position: relative;
      top: 2px;
    }
    .fpSearch-button {
      background: #FC9153;
      border-radius: 4px;
      width: 95px;
      height: 32px;
      border: none;
      color: white;
      margin-top: 5px;
      margin-left: 80px;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
      cursor: pointer;
      span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
      }
    }
    .cutLine {
      // border: 1px solid
      margin-top: 5px;
      margin-bottom: 17px;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.10);
      // background: rgba(0, 0, 0, 0.10);
      // border-radius: 4px;
    }
  }

 




</style>

