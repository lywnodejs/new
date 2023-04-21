<template>
  <!-- 创建设计安全评估结果的dialog-->
  <div class="designResultDialog">
    <el-form v-model="designResult" label-width="80px" label-position="left">
      <div class="displayFlex">
        <el-form-item label="功能模块">
          <el-select
            clearable
            allow-create
            filterable
            @change="getDesignResultByFunctionModule"
            v-model="designResult.function_module"
            placeholder="请选择功能模块名称">
            <el-option
              v-for="item in function_modules"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安全域" style="margin-left: 30px;">
          <el-select
            v-model="designResult.security_domain"
            placeholder="请选择安全域">
            <el-option
              v-for="item in security_domains"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="displayFlex">
        <el-form-item label="敏感数据">
          <el-select
            v-model="designResult.sense_data"
            placeholder="请选择是否包含敏感数据">
            <el-option
              v-for="item in sense_datas"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" style="margin-left: 30px;">
          <el-input
            v-model="designResult.description"
            auto-complete="off"
            placeholder="备注">
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <div style="margin-top: 20px;">
      <span>威胁列表</span>
      <el-button
        type="warning"
        class="el-icon-circle-plus-outline addButton"
        @click="openCreateTreatDialog(value.sdl_project_id)"
        size="mini">&nbsp;添加威胁
      </el-button>
    </div>
    <el-table
      :data="checkNodes"
      max-height="600px">
      <el-table-column
        prop="attack_surface"
        width="130"
        align="center"
        label="攻击面">
      </el-table-column>
      <el-table-column
        prop="attacker"
        align="center"
        width="300"
        label="攻击者">
      </el-table-column>
      <el-table-column
        prop="threat"
        label="威胁名称"
        align="center">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="deleteItem(scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer" align="right">
      <el-button class="designDialog-button" @click="close" style="border-radius: 4px;">取消编辑</el-button>
      <el-button class="designDialog-btn" @click="submitDesignInfo(value.sdl_project_id)" type="warning" round>确认提交
      </el-button>
    </div>
  </div>
</template>

<script>
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'
  import dialog from '@/utils/dialog'
  import ThreatDialog from '@/pages/sdl/dorado/steps/dialogs/threatDialog'
  import bus from '@/routes/eventBus'

  export default {
    name: 'design-result-dialog',
    components: {ThreatDialog},
    props: {
      value: null
    },
    data() {
      return {
        sdlProjectId: null,
        checkNodes: [],
        design_eva_result_id: null,
        function_modules: [],
        security_domains: [
          {value: '滴滴生产网', label: '滴滴生产网'},
          {value: '滴滴测试网', label: '滴滴测试网'},
          {value: '滴滴公有云', label: '滴滴公有云'},
          {value: 'IT机房', label: 'IT机房'},
          {value: '第三方公有云', label: '第三方公有云'},
          {value: '政府生产网', label: '政府生产网'},
          {value: '合作伙伴生产网', label: '合作伙伴生产网'},
          {value: '互联网', label: '互联网'}
        ],
        sense_datas: [{
          value: '是', label: '是'
        }, {
          value: '否', label: '否'
        }],
        designResult: {
          function_module: '',
          security_domain: '',
          sense_data: '',
          description: ''
        },
        threatData: this.receiveData(),
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1
      }
    },
    created() {
      this.getDistinctFunctionModule()
    },
    methods: {
      getDistinctFunctionModule() {
        let postJson = {
          sdl_project_id: this.value.sdl_project_id
        }
        ajax.post(API.getDistinctFunctionModule, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.function_modules = response.data
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })

      },
      getDesignResultByFunctionModule(val) {
        let postJson = {
          function_module: val,
          sdl_project_id: this.value.sdl_project_id
        }
        ajax.post(API.getDesignResultByFunctionModule, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.designResult = []
            this.designResult = response.data.designResult
            this.checkNodes = response.data.threatData
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })

      },
      close() {
        this.$emit('close')
      },
      receiveData() {
        bus.$on('checkNodes', data => {
          this.threatData = data
          let temp = []
          this.checkNodes = []

          // console.log(data)
          for (let i = 0; i < data.length; i++) {
            let obj = {
              attack_surface: '',
              attacker: [],
              threat: []
            }
            obj.attack_surface = data[i].name
            for (let j = 0; j < data[i].children.length; j++) {
              if (data[i].children[j].name == '攻击者' && data[i].children[j].name != 'undefind') {
                obj.attacker.push(data[i].children[j].children[0].name)
              } else {
                if (data[i].children[j].children[0]) {
                  obj.threat.push(data[i].children[j].children[0].name)
                }
              }
            }
            temp.push(obj)

            // console.log(temp)
          }
          for (let i = 0; i < temp.length; i++) {
            let obj = {
              attack_surface: temp[i].attack_surface,
              attacker: temp[i].attacker.join(','),
              threat: ''
            }
            if (temp[i].threat.length != 0) {
              for (let j = 0; j < temp[i].threat.length; j++) {
                let obj = this.objDeepCopy(obj)
                obj.attack_surface = temp[i].attack_surface
                obj.attacker = temp[i].attacker.join(',')
                obj.threat = temp[i].threat[j]
                this.checkNodes.push(obj)
              }
            } else {
              this.checkNodes.push(obj)
            }
          }

          // console.log(this.checkNodes)
        })
      },
      openCreateTreatDialog(sdlProjectId) {
        dialog({
          title: '添加威胁',

          //  当前弹窗的标题
          width: '500px',

          // 当前弹窗的宽度
          component: ThreatDialog,

          //    当前弹窗内的自组件
          data: {
            threat: this.checkNodes
          },
          close: () => {
          },
          confirm: (result) => {

            //  显式$emit('confirm')时触发
            alert(result)
            console.log('弹窗已关闭，弹窗的结果：', result)
          }
        })
      },
      submitDesignInfo() {
        if (this.designResult.function_module != '') {
          let postJson = {
            sdl_project_id: this.value.sdl_project_id,
            threatData: this.checkNodes,
            designResult: this.designResult
          }
          ajax.post(API.submitDesignResult, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.$notify({
                title: '成功',
                message: errmsg,
                type: 'success'
              })
              this.tableData = response.data
              this.fetchData()
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        } else {
          this.$notify({
            title: '失败',
            message: '功能模块不能为空',
            type: 'error'
          })
        }
        this.close()
      },
      deleteItem(context) {
        for (let i = 0; i < this.checkNodes.length; i++) {
          if (context.attack_surface == this.checkNodes[i].attack_surface && context.threat == this.checkNodes[i].threat) {
            this.checkNodes.splice(i, 1)
          }
        }
      },
      objDeepCopy(source) {
        let sourceCopy = source instanceof Array ? [] : {}
        for (let item in source) {
          if (Object.prototype.hasOwnProperty.call(source, item)) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item]
          }
        }
        return sourceCopy;
      }
    }
  }
</script>

<style scoped lang='less'>
  .designResultDialog {
    -webkit-font-smoothing: antialiased;
  }
  .displayFlex {
    display: flex;
  }
  .designResultDialog {
    padding-bottom: 10px;
  }
  .el-input {
    width: 230px;
  }
  .el-select {
    width: 230px;
  }
  .dialog-footer {
    height: 36px;
  }
  .el-table {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .designDialog-button {
    height: 32px;
    width: 100px;
    padding: 0;
    font-size: 13px;
    margin-right: 5px;
  }

  .designDialog-btn {
    height: 32px;
    width: 100px;
    margin-bottom: 0;
    background: #fc9153;
    border-radius: 4px;
    margin-top: 14px;
    padding: 0px;
    border: none;
    font-size: 13px;
    // font-weight: 100;
  }
  .addButton {
    background: white;
    color: #fc9153;
    border-radius: 4px;
    float: right;
    // margin-right: 10px;
    border: 1px solid #fc9153;
  }
  .addButton:hover {
    background: #fff7f2;
  }
</style>
