<template>
  <div id="designResult" style="margin-top: 35px;">
    <div class="designResultHeader">
      <!-- <h3>设计安全评估结果</h3> -->
      <div class="designResultTitle">设计安全评估结果</div>
      <app-permission>
        <el-button type="primary" icon="el-icon-edit" size="mini" class="designResultFunc-btn"
                    @click="editable=!editable">编辑</el-button>
      </app-permission>
      <app-permission>
        <el-button type="warning" class="el-icon-circle-plus-outline designResultFunc-btn" size="mini"
                    @click="openCreateDesignResultDialog">&nbsp;添加/更新</el-button>
      </app-permission>
    </div>
    <!-- 设计安全评估评估结果列表 -->
    <el-table
      :data="tableData"
      show-header
      empty-text="暂未发现安全威胁"
      style="margin-top:15px; width: 100%">
      <el-table-column
        prop="function_module"
        align="center"
        width="140"
        label="功能模块">
      </el-table-column>
      <el-table-column
        prop="attack_surface"
        align="center"
        width="110"
        label="攻击面">
      </el-table-column>
      <el-table-column
        align="center"
        width="120"
        label="攻击者">
        <template slot-scope="scope">
          <span v-html="scope.row.attacker"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="threat"
        align="center"
        label="威胁名称">
      </el-table-column>
      <el-table-column
        prop="requirement"
        align="center"
        label="安全要求">
      </el-table-column>
      <el-table-column
        align="center"
        class="solution"
        label="解决方案">
        <template slot-scope="scope">
          <el-button type="text" size="mini" v-for="item in scope.row.solution" :key="item.url">
            <router-link style="color:#FC9153" :to="item.url" target="_blank" v-html="item.name">
              <br/>
            </router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="editable"
        width="70"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button class="deleteDesignResult" type="text" size="mini"
                     @click="dialogVisible = true;design_eva_result_id = scope.row.id">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 发布评估结果并进入下一阶段 -->
    <app-permission>
      <div style="margin-top: 20px">
        <el-button class="designResult-btn" type="warning" round @click="publishDesignResult">发布评估结果</el-button>
        <el-button v-if="currentStatus>=4" class="designResult-btn" type="warning" round @click="confirmDesignResult">
          确认结果
        </el-button>
      </div>
      <div style="margin-top: 20px">
        <el-button v-if="currentStatus==4" class="designResult-btn" type="warning" round @click="confirmDesignResult">
          确认结果
        </el-button>
      </div>
    </app-permission>
    <!-- 删除设计安全评估结果的提示-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定删除该项评估结果？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDesignResult">确 定</el-button>
        <!--  -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import dialog from '@/utils/dialog'
  import ThreatDialog from '@/pages/sdl/dorado/steps/dialogs/threatDialog'
  import DesignResultDialog from '@/pages/sdl/dorado/steps/dialogs/designResultDialog'
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'

  export default {
    name: 'design-result',
    components: {ThreatDialog, DesignResultDialog},
    data() {
      return {
        tableData: [],
        sdl_project_id: null,
        dialogVisible: false,
        dialogFormVisible: false,
        design_eva_result_id: null,
        editable: false,
        function_modules: [],
        security_domains: [],
        sense_datas: [],
        designResult: {
          function_module: '',
          security_domain: '',
          sense_data: '',
          description: ''
        },
        threatData: [],
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1
      }
    },
    props: ['currentStatus'],
    inject: ['getWorkFlow'],
    created() {
      this.sdl_project_id = this.$route.query['projectId']
      this.fetchData()
    },
    methods: {
      fetchData() {
        let postJson = {
          sdl_project_id: this.sdl_project_id
        }
        ajax.post(API.fecthDesignResult, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg

          if (errno === 0) {
            if (response.data) {
              let data = response.data.design_result

              for (let i = 0; i < data.length; i++) {
                let arr = data[i].solution.split('****')

                let attacker = data[i].attacker.split(',')
                let str = ''
                for (let j = 0; j < attacker.length; j++) {
                  str += attacker[j] + '<br>'
                }
                data[i].attacker = str
                let temp = []
                for (let j = 0; j < arr.length; j++) {
                  let info = arr[j].split('||')
                  if (info[0] == 'V') {
                    temp.push({name: info[2], url: '/sdl/dolphin/vulnerability/knowledgeDetail?knowledgeId=' + info[1]})
                  } else {
                    temp.push({name: info[2], url: '/sdl/dolphin/solution/solutionDetail?solutionId=' + info[1]})
                  }
                }
                data[i].solution = temp
              }
              this.tableData = data
            } else {
              this.editable = true
            }
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
      },
      confirmDesignResult() {
        let postJson = {
          sdl_project_id: this.sdl_project_id
        }
        ajax.post(API.confirmDesignResult, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '保存设计安全评估信息',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.getWorkFlow()
        })
        this.editable = false
      },
      publishDesignResult() {
        let postJson = {
          sdl_project_id: this.sdl_project_id
        }
        ajax.post(API.publishDesignResult, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '确认安全评估信息结果',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.getWorkFlow()
        })
        this.editable = false
      },
      deleteDesignResult() {
        let postJson = {
          sdl_project_id: this.sdl_project_id,
          design_eva_result_id: this.design_eva_result_id
        }
        ajax.post(API.deleteDesignResult, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '删除威胁',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '删除威胁',
              message: errmsg,
              type: 'error'
            })
          }
          this.fetchData()
        })
        this.dialogVisible = false

      },
      openCreateDesignResultDialog() {
        dialog({
          title: '添加/更新评估结果',

          //    当前弹窗的标题
          width: '720px',

          //    当前弹窗的宽度
          component: DesignResultDialog,

          //    当前弹窗内的自组件
          data: {
            sdl_project_id: this.sdl_project_id
          },
          close: () => {

            //  关闭后触发
            this.fetchData()
          },
          confirm: (result) => {

            //    显式$emit('confirm')时触发
            console.log('弹窗已关闭，弹窗的结果：', result)
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
#designResult {
  -webkit-font-smoothing: antialiased;
  .designResultTitle {
    color: #333333;
    font-size: 14px;
    line-height: 28px;
    display: inline-block;
  }
  .designResult-btn {
    margin-right: 10px;
    height: 32px;
    width: 100px;
    padding: 5px;
    font-size: 12px;
    border: none;
    background: #fc9153;
    border-radius: 4px;
    // font-weight: 100;
    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  }
  .designResultFunc-btn {
    background: white;
    border-radius: 4px;
    float: right;
    margin-left: 15px;
    border: 1px solid #fc9153;
    height: 28px;
    width: 96px;
    padding: 0px;
    color: #fc9153;
    // position: relative;
    // bottom: 20px;
  }
  .designResultFunc-btn:hover {
    background: #fff7f2;
  }
  .deleteDesignResult {
    border: none;
    width: 30px;
    font-size: 10px;
    background: none;
  }
  .cell {
    text-align: center;
    button {
      display: block !important;
      margin: 0 auto;
      span {
        a {
          word-wrap: break-word;
          word-break: break-all;
          white-space: normal;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
