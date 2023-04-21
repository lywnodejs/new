<template>
    <div id="cachalot-git">
        <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Git仓库：">
              <el-input class="searchInput"
                        v-model="queryParam.keywords.git_url"
                        placeholder="请输入Git仓库"
                        clearable
                        auto-complete="off">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="sdk类型：">
              <el-select
                v-model="queryParam.keywords.sdk"
                placeholder="请选择sdk类型"
              >
                <el-option value="java">java</el-option>
                <el-option value="java">php</el-option>
                <el-option value="java">go</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='cachalot-btn' @click="fetchData"><span>搜&nbsp;索</span></button>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>


    <div class="cutLine"></div>

    <el-table
      :data="tableData"
      v-loading>
      <el-table-column
        prop="id"
        label="ID"
        sortable
        align="center"
        width="60">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Git地址"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.git_url}}</span>
          <el-tooltip content="查看数据库字段" placement="top" effect="light" :hide-after="2000">
            <span class="dorado-sensitive" @click='sensitiveDetail(scope.row)'>c3/c4</span>
          </el-tooltip>
          <el-tooltip content="查看引用SDK列表" placement="top" effect="light" :hide-after="2000">
            <span class="dorado-sensitive" @click='getSDKList(scope.row)'>sdk</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="成员"
        sortable
        align="center"
        width="175">
        <template slot-scope="scope">
          <div>{{judgeMember(scope.row.members)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="来源"
        sortable
        align="center"
        width="75">
        <template slot-scope="scope">
            <!-- 1代表评估，2代表白盒 -->
          <div>{{scope.row.source === 1 ? '评估': '白盒'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        sortable
        align="center"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.create_time.split(' ')[0]}}<br>{{scope.row.create_time.split(' ')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="同步时间"
        sortable
        align="center"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.sync_time.split(' ')[0]}}<br>{{scope.row.sync_time.split(' ')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        sortable
        align="center"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.update_time.split(' ')[0]}}<br>{{scope.row.update_time.split(' ')[1]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div align="right" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page"
        :page-sizes="[10,20,30,50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
    </div>
    <sensitive-detail-dialog :dialogVisible='sensitiveDialog' :scopeRow='scopeRow' @getVisible='getDialogVisible'></sensitive-detail-dialog>
    </div>
</template>
<script>
import { connect } from '@/lib'
import sensitiveDetailDialog from './sensitiveDetailDialog'

export default connect(() => {
  return {
  }
}, {
  getGitDomain: 'cachalot_domain/getGitDomain',
  getGitSdkInfo: 'cachalot_domain/getGitSdkInfo',
  getGitSensitive: 'cachalot_domain/getGitSensitive'
})({
    data() {
        return {
            tableData: [],
            queryParam: {
                page: 1,
                limit: 20,
                keywords: {
                    git_url: '',
                    sdk: ''
                }
            },
            updateDomain: {
                domain_fullname: '',
                dept_id: null,
                is_offsite: '0',
                is_outsource: '0'
            },
            num: 0,
            dialogFormVisible: false,
            dialogVisible: false,
            scopeRow: null,
            sensitiveDialog: false
        }
    },
    components: {sensitiveDetailDialog},
    mounted() {
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            let postJson = this.queryParam
            this.getGitDomain(postJson).then(res => {
                this.num = res.count
                this.tableData = res.data;
                this.judgeDatalevel(this.tableData)
            })
        },
        sensitiveDetail(val) {
          this.scopeRow = val
          this.sensitiveDialog = true
        },
        getSDKList(data) {
          let param = {
            git_url: data.git_url
          }
          this.getGitSdkInfo(param).then(res => {
            let _ele = null;
            const h = this.$createElement;
            if (res && res.data) {
              _ele = h('p', null, [
                h('p', null, `GitUrl：${res.data.git_url}`),
                h('p', null, `Git分支：${res.data.git_branch.join('，')}`),
                h('p', null, `语言：${res.data.file_type}`),
                h('p', null, `方法：${res.data.function.join('，')}`),
                h('p', {style: 'word-break:break-all'}, `路径：${res.data.file_path.join('，')}`)
              ])
            } else {
              _ele = h('p', null, [
                h('p', null, `暂无数据`)
              ])
            }
            this.$msgbox({
              title: 'SDK信息',
              message: _ele,
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(action => {
              });
          })
        },
        getDialogVisible(val) {
          this.sensitiveDialog = val
        },
        judgeMember(member) {
            let arr = []
            let members = JSON.parse(`[${member}]`)
            members = members[0]
            if (!members) return
            for (let i = 0; i < members.length; i++) {
                let keys = Object.keys(members[i])
                console.log('members: ' + keys)
                keys.forEach(item => {
                    arr.push(members[i][item])
                })
            }
            return arr.join(',')
        },
        async judgeDatalevel(data) {
          console.log('data: ' + data)
          data.forEach(item => {
            this.$set(item, 'dataMaxLevel', '')
            this.$set(item, 'sdkInfo', '')
          })
        },
        bounceDchat(name) {
            let url = 'dchat://im/start_conversation?name=' + name
            window.open(url, '_self')
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
#cachalot-git {
      .cachalot-btn {
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
    .searchInput {
        width: 240px;
    }
    .table-expand {
        padding: 10px 20px;
        .add-icon {
            color: #fc9153;
            font-size: 18px;
            cursor: pointer;
            position: relative;
            margin-top: 2px;
        }
    }
    .updateInput {
        width: 280px;
    }
    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 95%;
        word-wrap: break-word;
        span {
        display: inline-block;
        width: 100%;
        font-size: 12.5px;
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
    .kylinCutLine {
      // border: 1px solid
      margin-top: 5px;
      margin-bottom: 5px;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.10);
      // background: rgba(0, 0, 0, 0.10);
      // border-radius: 4px;
    }
    // .el-form-item__label{
    //     width: 60px !important;
    // }
    .kylinTitle{
        color: #fc9153;
    }
    .didiyunTitle{
        color: #409eff;
    }
    .diaolog-button {
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        font-size: 13px;
    }
    .dorado-sensitive{
      cursor: pointer;
      font-size: 13px;
      position: relative;
      //top: 3px;
      color: #FC9153;
    }
    .diaolog-btn {
        background: #FC9153;
        border-radius: 4px;
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        font-size: 13px;
        border: none;
    }
    .myWidth{
        color: #666666;
        width: 130px;
    }
    .myWidth1{
        margin-left: 25px;
        color: #666666;
        width:130px;
    }
    .myWidth2{
        margin-left: 25px;
        color: #666666;
        width:130px;
    }
    .router{
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
    .didiyun {
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
    .out-system{
        color: #f56c6c;
        background: #fef0f0;
        display: inline-block;
        height: 20px;
        padding: 0 5px;
        line-height: 17px;
        font-size: 12px;
        border: 1px solid #fbc4c4;
        border-radius: 4px;
        box-sizing: border-box;
        white-space: nowrap;
        width: 36px !important;
    }
}
</style>

