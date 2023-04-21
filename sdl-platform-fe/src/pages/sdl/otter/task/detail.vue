<template>
    <div id="taskDetail">
      <div class="el-main">
        <h4 class="myH4">详细信息</h4>
        <div class="basicContentDisplay">
          <div class="items">
            <span class="c1">任务编号：</span>
            <span class="c2">
              <router-link class="aLink" :to="{ path : '/sdl/otter/task/detail', query: {otter_task_id: $route.query.otter_task_id}}" target=_blank>
                {{$route.query.otter_task_id}}
              </router-link>
            </span>
          </div>
          <div class="rightItem">
            <span class="c1">Git 路径：</span>
            <span class="c2">{{otterTask.otter_project.git_url}}</span>
          </div>
          <div class="items">
              <span class="c1">所属项目编号：</span>
            <span class="c2">
              <router-link style="color:#FC9153" :to="{ path : '/sdl/otter/project/detail', query: {otter_project_id: otterTask.otter_task.otter_project_id}}" target=_blank>
                {{otterTask.otter_task.otter_project_id}}
              </router-link>
            </span>
            
          </div>
          
           <div class="rightItem">
            <span class="c1">代码分支：</span>
            <span class="c2">{{otterTask.otter_project.git_branch}}</span>
          </div>
          <div class="items">
              <span class="c1">项目名称：</span>
            <span class="c2">{{otterTask.otter_task.project_name}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">相对路径：</span>
            <span class="c2">{{otterTask.otter_project.git_relative_path}}</span>
          </div>
          
          <div class="items">
            <span class="c1">任务来源：</span>
            <span class="c2">{{judgeSourse(otterTask.otter_task.source)}}</span>
          </div>
          <div class="rightItem">
              <span class="c1">Git 版本：</span>
             <span class="c2">{{otterTask.otter_task.git_version}}</span>
          </div>
          <div class="items">
               <span class="c1">任务创建时间：</span>
            <span class="c2">{{otterTask.otter_task.task_create_time}}</span>
            
          </div>
          <div class="rightItem">
            <span class="c1">语言：</span>
            <span class="c2">{{otterTask.otter_task.language}}</span>
          </div>
          <div class="items">
              <span class="c1">任务结束时间：</span>
            <span class="c2">{{otterTask.otter_task.task_end_time}}</span>
            
          </div>
          <div class="rightItem">
            <span class="c1">代码行数：</span>
            <span class="c2">{{otterTask.otter_task.code_lines}}</span>
          </div>
          <div class="items">
             <span class="c1">扫描开始时间：</span>
            <span class="c2">{{otterTask.otter_task.scan_begin_time}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">Odin部署ID：</span>
            <span class="c2">
              <span class='aLink' @click="odinUrl(otterTask.otter_project.last_odin_deploy_id)">{{otterTask.otter_project.last_odin_deploy_id}}</span>
            </span>
          </div>
          <div class="items">
             <span class="c1">扫描结束时间：</span>
            <span class="c2">{{otterTask.otter_task.scan_end_time}}</span>
          </div>
          <div class="rightItem">
              <span class="c1">上线人：</span>
            <span class="c2">{{otterTask.otter_task.rd_zh}}</span>
          </div>
          <div class="items">
               <span class="c1">所属部门：</span>
            <span class="c2">{{otterTask.otter_task.dept_name}}</span>
           
          </div>
          <div class="rightItem">
              <span class="c1">状态：</span>
            <span class="c2"><el-tag :type='judgeStatus(otterTask.otter_task.status)' :class="otterTask.otter_task.status==0||otterTask.otter_task.status==1?'blue':''">{{otterTask.otter_task.status_info}}</el-tag></span>
          </div>
      </div>
      <!-- 任务列表 -->
      <app-permission>
          <el-select v-model="tempStatus" class="overall-input" @change="changeSelectTemp()">
                      <el-option label="未审计" value='0'></el-option>
                      <el-option label="漏洞" value='2'></el-option>
                      <el-option label="误报" value='5'></el-option>
          </el-select>
        </app-permission>
      <div class="task">
        
        <h4 class="myH4">检测结果</h4>
        
        <el-table
          :data="otterTaskList"
          v-loading>
          <el-table-column
            prop="otter_result_id"
            label="结果ID"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            label="漏洞级别"
            align="center"
            width="100">
            <template slot-scope="scope"><span>{{choseVulLevel(scope.row.vul_level_id)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="漏洞类型"
            align="center"
            min-width="100">
            <template slot-scope="scope"><span>{{scope.row.vul_type_id}}</span>
            </template>
          </el-table-column>
          <app-permission>
            <el-table-column
              label="检测规则名称"
              min-width="150"
              align="center">
              <template slot-scope="scope"><span>{{scope.row.white_rule_name}}</span>
              </template>
            </el-table-column>
          </app-permission>
          
          <app-permission>
            <el-table-column
              label="Checkmarx 地址"
              min-width="90"
              align="center">
              <template slot-scope="scope"> 
                <span class="checkmarx" @click="bounceSDLurl(scope.row.checkmarx_pathid,scope.row.checkmarx_projectid,scope.row.checkmarx_scanid)">查看详情&nbsp;<i style='color:green'>({{scope.row.checkmarx_pathid}})</i></span> 
              </template>
            </el-table-column>
              <el-table-column
                label="来源文件[行号]"
                align="center"
                min-width="120">
                <template slot-scope="scope">
                    <span class="backgroundColor" @click="openDialog(scope.row.path_detail)">{{handlePath(scope.row.sf_path)}}</span>
                    <span class="backgroundLineColor">{{handlePath(scope.row.sf_line)}}</span>
                </template>
              </el-table-column>
          </app-permission>
          <app-permission>
            <span></span>
            <el-table-column
                label="目标文件[行号]"
                align="center"
                min-width="130">
                <template slot-scope="scope"> 
                    <span class="backgroundColor" @click="openDialog(scope.row.path_detail)">{{handlePath(scope.row.df_path)}}</span>
                    <span class="backgroundLineColor">{{handlePath(scope.row.df_line)}}</span>
                </template>
              </el-table-column>
          </app-permission>
          <app-permission>
            <el-table-column
              align="center"
              label="RD审计状态"
              width="130">
              <template slot-scope="scope"> 
                <el-tooltip v-if="scope.row.rd_process_status==2" :content="scope.row.rd_mark_fp_reason" placement="top" effect="light">
                  <span>{{'误报'}}</span>
                </el-tooltip>
                <span v-else>{{scope.row.rd_process_status==0?'未审计':'漏洞'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="SDL审计状态"
              align="center"
              width="110">
              <template slot-scope="scope"><span>{{sdlStatus(scope.row.sdl_audit_status)}}</span>
              </template>
            </el-table-column>
          </app-permission>
          <app-permission>
            <el-table-column
              align="center"
              label="SDL操作"
              width="120">
              <template slot-scope="scope">
                  <el-select
                        :disabled="otterTask.otter_task.status!=3&&otterTask.otter_task.status!=2"
                        @change="sdlMark(scope.row.sdl_audit_status, scope.row.otter_result_id)"
                        v-model="scope.row.sdl_audit_status"
                        placeholder="请选择任务来源" >
                      <el-option :disabled="true" label="未审计" value='0'></el-option>
                      <el-option label="漏洞" value='2'></el-option>
                      <el-option label="误报" value='5'></el-option>
                  </el-select>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="RD操作"
              width="120">
              <template slot-scope="scope">
                  <el-select :disabled="otterTask.otter_task.status!=3&&otterTask.otter_task.status!=2" @change="changeSelect(scope.row.rd_process_status, scope.row.otter_result_id, scope.row.rd_mark_fp_reason)" v-model="scope.row.rd_process_status" placeholder="请选择任务来源" >
                      <el-option :disabled="true" label="未审计" value='0'></el-option>
                      <el-option label="漏洞" value='1'></el-option>
                      <el-option label="误报" value='2'></el-option>
                  </el-select>
              </template>
            </el-table-column>
          </app-permission>
        </el-table>
        <div align="right" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChangeTask"
            @current-change="handleCurrentChangeTask"
            :current-page="taskQueryParam.page"
            :page-sizes="[10,20,30, 50, 100, 200, 500, 1000]"
            :page-size="taskQueryParam.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="taskNum">
          </el-pagination>
        </div>
      </div>
      <app-permission>
        <el-button :disabled='disable' @click="commit()" v-show="otterTask.otter_task.status==3" type="button" class='vulknowledge-button'>
          <span>提交审计结果</span>
        </el-button>
      </app-permission>
      <app-permission>
        <button @click="claimTaskRD()" v-show="otterTask.otter_task.status==2" type="button" class='vulknowledge-button'>
          <span>认领</span>
        </button>
      </app-permission>
      
      </div>
      <el-dialog title="代码详情" :visible.sync="dialogFormVisible" width="874px">
          <div class="collapse">
              <el-collapse v-model="activeName">
                <el-collapse-item v-for="(item, index) in dialogList" :key="index+1" 
                                  :name="index">
                      <template slot="title">
                        <span>{{item.fileName}}  (</span>
                        <span class="fontRed" style="color:red">line</span>:
                        <span class="fontGreen" style="color:green">{{item.line}}</span>,
                        <span class="fontRed" style="color:red">column</span>:
                        <span class="fontGreen" style="color:green">{{item.Column}}</span>)
                      </template>
                    <div v-highlight>
                        <pre class="codePre">
                            <code class="codeCss" @click="bounceUrl(item)" v-html="item.code"></code>
                        </pre>
                    </div>
                </el-collapse-item>
            </el-collapse>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="blackEvalu-button" @click="dialogFormVisible = false">确定</el-button>
          </div>
      </el-dialog>
      <el-dialog title="误报原因" :visible.sync="loudongVisible"
        :close-on-click-modal='false' :show-close='false' width="454px">
          <el-form :inline="true"   label-width="120px" label-position="left">
            <el-col>
              <el-form-item label="" >
                <el-input class="inputWidth" v-model="rdQueryParam.rd_mark_fp_reason" placeholder="请输入原因" clearable type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          
          <div slot="footer" class="dialog-footer">
            <el-button class="detail-button" @click="cancel">取消</el-button>
            <el-button class="detail-btn" @click="rdMark">确定</el-button>
          </div>
      </el-dialog>
    </div>
    
</template>
<script>
import {connect} from '@/lib'
import * as CONSTANTS from '@/commons/otter'

  export default connect(() => {
    return {
    }
  }, {
    getListByTaskId: 'otter/getListByTaskId',
    getOtterTaskDetail: 'otter/getOtterTaskDetail',
    resultRdMark: 'otter/resultRdMark',
    resultSDLMark: 'otter/resultSDLMark',
    getPreInfo: 'dolphin_knowledgeBase/getPreInfo',
    commitResult: 'otter/commitResult',
    claimTask: 'otter/claimTask'
  })({
    data() {
        return {
            otterTaskId: parseInt(this.$route.query.otter_task_id),
            activeName: [0, 1, 2, 3],
            dialogFormVisible: false,
            loudongVisible: false,
            otterTask: {},
            otterTaskList: [],
            vulTypeList: [],
            taskNum: 0,
            dialogList: [],
            taskQueryParam: {
                page: 1,
                limit: 20,
                otter_task_id: 0
            },
            rdQueryParam: {
              otter_result_id: 0,
              rd_process_status: 0,
              rd_mark_fp_reason: ''
            },
            tempStatus: '0',
            disable: false
        }
    },
    created() {

      this.otterTaskId = parseInt(this.$route.query.otter_task_id)
      this.getPreInfo().then(response => {
        const data = response.vul_type
        this.vulTypeList = data
        this.fetchData()
      })
    },
    methods: {
      fetchData() {
        this.taskQueryParam.otter_task_id = this.otterTaskId
        this.getListByTaskId(this.taskQueryParam).then(response => {
          this.otterTaskList = response.otter_result_list
          for (let i = 0; i < this.otterTaskList.length; i++) {
            this.otterTaskList[i].rd_process_status = '' + this.otterTaskList[i].rd_process_status
            this.otterTaskList[i].sdl_audit_status = '' + this.otterTaskList[i].sdl_audit_status
            this.otterTaskList[i].vul_type_id = this.getVulType(this.otterTaskList[i].vul_type_id)
          }
          this.taskNum = response.count
        })
        this.getOtterTaskDetail({otter_task_id: this.otterTaskId}).then(res => {
          this.otterTask = res
        })
      },
      openDialog(code) {
        this.dialogFormVisible = true
        let obj = JSON.parse(code)
        this.activeName = []
        for (let i = 0; i < obj.length; i++) {
            let keywords = obj[i].name
            obj[i].code = obj[i].code.replace(/^\s*|\s*$/g, '')
            obj[i].code = obj[i].code.replace(new RegExp(`(${keywords})`, 'g'), `<span style='background: yellow'>$1</span>`)
            this.activeName.push(i)
        }
        this.dialogList = obj
      },
      getVulType(myId) {
            for (let i = 0; i < this.vulTypeList.length; i++) {
              let name = this.vulTypeList[i].label
              for (let j = 0; j < this.vulTypeList[i].children.length; j++) {
                if (this.vulTypeList[i].children[j].value == myId) {
                  return `${name}/${this.vulTypeList[i].children[j].label}`
                }
              }
            }
      },
      commit() {
        let params = {otter_task_id: this.otterTaskId}
        this.disable = true
        this.commitResult(params).then(res => {
          if (res.errno == 0) {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              })
            }
            this.disable = false
            this.fetchData()
        })
      },
      claimTaskRD() {
        let params = {otter_task_id: this.otterTaskId}
        this.claimTask(params).then(res => {
          this.fetchData()
        })
      },
      odinUrl(id) {
        let url = `http://deploy.odin.intra.xiaojukeji.com/static/#/job/status/?jobId=${id}`
        window.open(url)
      },
      changeSelect(name, id, reason) {
         this.rdQueryParam = {
          otter_result_id: id,
          rd_process_status: parseInt(name),
          rd_mark_fp_reason: reason
        }
        if (name == 1) {
          this.resultRdMark(this.rdQueryParam).then(res => {
            if (res.errno == 0) {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              })
            }
            this.fetchData()
          })
        }
        if (name == 2) {
          this.loudongVisible = true
        }
      },
      rdMark() {
        this.loudongVisible = false
        this.resultRdMark(this.rdQueryParam).then(res => {
          if (res.errno == 0) {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              })
          }
          this.fetchData()
        })
      },
      sdlMark(name, id) {
        let queryParam = {
          otter_result_id: id,
          sdl_audit_status: parseInt(name)
        }
        this.resultSDLMark(queryParam).then(res => {
          if (res.errno == 0) {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              })
          }
          this.fetchData()
        })
      },
      changeSelectTemp() {
        this.otterTaskList.forEach(item => {
          let queryParam = {
            otter_result_id: item.otter_result_id,
            sdl_audit_status: parseInt(this.tempStatus)
          }
          this.resultSDLMark(queryParam).then(res => {
            if (res.errno == 0) {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success'
                })
            }
          })
        })
        this.fetchData()
      },
      cancel() {
        this.loudongVisible = false
        this.fetchData()
      },
      bounceUrl(item) {
          let gitUrl = this.otterTask.otter_project.git_url ? this.otterTask.otter_project.git_url : ''
          let arr = gitUrl.split(':')
          arr = arr[1].split('.')
          let url = `https://git.xiaojukeji.com/${arr[0]}/blob/${this.otterTask.otter_project.git_branch}/${item.fileName}#L${item.line}`
          window.open(url)
      },
      bounceSDLurl(pathid, projectid, scanid) {
        let url = `http://172.24.5.220/CxWebClient/ViewerMain.aspx?scanid=${scanid}&projectid=${projectid}&pathid=${pathid}`
        window.open(url)
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
      sdlStatus(id) {
          for (let i = 0; i < CONSTANTS.SDLAuditStatus.length; i++) {
              if (CONSTANTS.SDLAuditStatus[i].value == id) {
                  return CONSTANTS.SDLAuditStatus[i].label
              }
          }
      },
      choseVulLevel(id) {
        for (let i = 0; i < CONSTANTS.vulLevel.length; i++) {
              if (CONSTANTS.vulLevel[i].value == id) {
                  return CONSTANTS.vulLevel[i].label
              }
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
      judgeSourse(id) {
          if (id == 0) {
              return 'Odin部署'
          }
          if (id == 1) {
              return '安全评估'
          }
      },
      handlePath(name) {
        if (typeof (name) == 'number') {
            return `[${name}]`
        }
        let arr = name.split('/')
        return `${arr[arr.length - 1]}`
      },
        handleSizeChangeTask(val) {
          this.taskQueryParam.limit = val
          this.fetchData()
        },
        handleCurrentChangeTask(val) {
          this.taskQueryParam.page = val
          this.fetchData()
        }
    }
})
</script>
<style lang="less">
  #taskDetail {
        margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        // margin-top: -15px;
        font-size: 13px;
        -webkit-font-smoothing: antialiased;
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
                width: 320px;
                }
            }
          .myH4{
            color: #333333;
            font-size: 14px;
            margin: 0;
            font-weight: normal;
            margin-bottom: 10px;
          }
          .aLink{
            color: #FC9153;
            cursor: pointer;
          }
          .el-tag{
              position: relative;
              top: -2px;
            height: 25px;
            line-height: 23px;
          }
          .blue{
            background-color: rgba(64,158,255,.1);
            color: #409eff;
            border: 1px solid rgba(64,158,255,.2);
          }
        }
        .inputWidth {
          width: 400px;
        }
        .el-tooltip__popper.is-light{
          width: 400px;
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
                flex: 3;
                text-align: left;
                padding-left: 20px;
            }
            .c2 {
                flex: 13;
                color: black;
                font-family: PingFang-SC;
            }
          }
        }
        .task {
            margin-top: 30px;
            width: 100%;
            .backgroundColor{
                color: rgb(179, 9, 9);
                cursor: pointer;
            }
            .backgroundLineColor{
                color: green;
            }
            .checkmarx{
              cursor: pointer;
              color: #FC9153;
            }
        }
        .collapse{
            padding: 0 20px;
            .el-collapse-item__content{
                padding-bottom: 10px;
                padding-top: 5px;
            }
            .codePre {
                margin-top: -36px;
                margin-bottom: -45px;
            }
            .codeCss:hover {
                cursor: pointer;
                text-decoration: underline;
            }
            .fontRed{
              color: red;
            }
            .fontGreen{
              color: green;
            }
        }
        .detail-btn {
          background: #FC9153;
          border-radius: 4px;
          height: 36px;
          width: 90px;
          padding: 5px;
          border: none;
          // font-weight: 100;
          margin-right: 12px;
          color: white;
        }
        .detail-button {
          height: 36px;
          width: 90px;
        }
        .vulknowledge-button {
          background: #FC9153;
          border-radius: 4px;
          width: 100px;
          font-size: 12px;
          padding: 0px;
          height: 32px;
          border: 1px solid #FC9153;
          color: white;
          cursor: pointer;
          // font-weight: 100; 
          line-height: 32px;
          span {
            font-family: Avenir, Helvetica, Arial, sans-serif;
            // font-weight: 100;
          }
        }
        .is-disabled {
          color: #fff;
          background-color: #c8c9cc;
          border-color: #c8c9cc;
        }
        .overall-input {
          float:right;
          margin-right:10px;
          margin-top: 20px;
          width: 100px;
        }
  }
  

</style>

