<template>
    <div id="detail">
      <div class="el-main">
        <h4 class="myH4">详细信息</h4>
        <div class="basicContentDisplay">
          <div class="items">
            <span class="c1">任务ID：</span>
            <span class="c2">{{selfScanDetail.fatbird_task_id}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">Git地址：</span>
            <span class="c2">{{selfScanDetail.git_url}}</span>
          </div>
          <div class="items">
            <span class="c1">Git分支：</span>
            <span class="c2">{{selfScanDetail.git_branch}}</span>
          </div>

           <div class="rightItem">
            <span class="c1">Git相对路径：</span>
            <span class="c2">{{selfScanDetail.git_relative_path}}</span>
          </div>
          <div class="items">
            <span class="c1">jar包md5：</span>
            <span class="c2">{{selfScanDetail.jar_md5}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">jar包name：</span>
            <span class="c2">{{selfScanDetail.jar_name}}</span>
          </div>
          <div class="items">
            <span class="c1">压缩语言包：</span>
            <span class="c2">{{selfScanDetail.language}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">扫描规则ID：</span>
            <span class="c2">{{selfScanDetail.rule_id}}</span>
          </div>
          <div class="items">
            <span class="c1">开始扫描时间：</span>
            <span class="c2">{{selfScanDetail.scan_begin_time}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">结束扫描时间：</span>
            <span class="c2">{{selfScanDetail.scan_end_time}}</span>
          </div>
          <div class="items">
            <span class="c1">任务来源：</span>
            <span class="c2">{{selfScanDetail.source}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">任务状态：</span>
            <span class="c2">{{ fmtStatus(selfScanDetail.status) }}</span>
          </div>
      </div>
      <!-- 任务列表 -->
      <div class="task">
        <h4 class="myH4">扫描结果</h4>
        <el-table
          :data="selfScanResultList"
          v-loading>
          <el-table-column
            prop="df_code"
            label="问题代码"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="df_line"
            label="所在行号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="df_path"
            label="文件路径"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="found_time"
            label="发现时间"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="path_detail"
            label="调用路径"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="rule_id"
            label="规则ID"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sf_code"
            label="入口代码"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sf_line"
            label="入口文件行号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sf_path"
            label="入口文件路径"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
      </div>
    </div>
</template>
<script>
import {connect} from '@/lib'
import { STSTUS_OPTIONS } from '@/commons/otter'

export default connect(() => {
    return {
    }
  }, {
    getSelfScanDetail: 'otter/getSelfScanDetail',
    getSelfScanResultList: 'otter/getSelfScanResultList'
  })({
    data() {
      return {
        selfScanDetail: {},
        selfScanResultList: []
      }
    },
    created() {
      this.getSelfScanResultList({
        fatbird_task_id: this.$route.query.id
      }).then(response => {
        this.selfScanResultList = response
      })
      this.getSelfScanDetail({fatbird_task_id: this.$route.query.id}).then(response => {
        this.selfScanDetail = response
      })
    },
    methods: {

      // 格式化任务状态
      fmtStatus(value) {
        return STSTUS_OPTIONS[value] || value
      }

    }
})
</script>
<style lang="less">
  #detail {
        margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        // margin-top: -15px;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        .el-main {
          .task {
            margin-top: 30px;
          }
          .myH4{
            color: #333333;
            font-size: 14px;
            margin: 0;
            font-weight: normal;
            margin-bottom: 10px;
          }
            width: 100%;
            box-sizing: border-box;
            background: white;
            .displayFlex {
                display: flex;
            }
            .searchForm {
                .searchInput {
                width: 320px;
                }
            }
          .aLink{
            color: #FC9153;
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
        .basicContentDisplay {
          margin-top: 10px;
          padding-bottom: 10px;
          display: flex;
          flex-wrap: wrap;
          background: #ffff;
          box-sizing: border-box;
          border: 1px solid #e2e2e2;
          border-radius: 8px;
          font-size: 13px;
          .items {
            padding-top: 10px;
            flex: 1;
            flex-basis: 40%;
            justify-content: center;
            display: flex;
            // font-size: 15px;
            font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
            color: gray;
            .c1 {
                flex: 2;
                text-align: left;
                padding-left: 20px;
            }
            .c2 {
                flex: 5;
                color: black;
                font-family: PingFang-SC;
            }
          }
          .rightItem {
            padding-top: 10px;
            flex: 2;
            flex-basis: 60%;
            justify-content: center;
            display: flex;
            // font-size: 15px;
            font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
            color: gray;
            .c1 {
                flex: 2;
                text-align: left;
                padding-left: 20px;
            }
            .c2 {
                flex: 11;
                color: black;
                font-family: PingFang-SC;
            }
          }
        }
        .follower {
          margin-top: 30px;
          .followTag {
            // margin-top: -5px;
            .tag {
              border: none;
              color: #fc9153;
              background: white;
              font-size: 12px;
              span{
                font-weight: 400;
                cursor: pointer;
              }
            }
          }
          span {
            font-weight: bold;
          }
          .inputFollow {
            margin-top: 10px;
            width: 100%;
          }
          .follower-btn {
            height: 32px;
            width: 100px;
            text-align: center;
            padding: 5px;
            border: 1px solid #fc9153;
            background: #fc9153;
            border-radius: 4px;
            // font-weight: 100;
            color: white;
            cursor: pointer;
            margin-top: 15px;
            font-size: 12px;
          }
        }
        .linkClass{
          cursor: pointer;
          color: #FC9153;
        }
  }
  .vulEvalu-btn {
    background: #FC9153;
    border-radius: 4px;
    height: 36px;
    width: 90px;
    padding: 5px;
    border: none;
    // font-weight: 100;
    margin-right: 12px;
  }

</style>

