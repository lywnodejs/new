<template>
  <div class="initiative-task-edit">
    <h3 class="app-margin--bottom">基本信息</h3>
    <el-form :model="taskForm" :rules="taskRules" class='form' label-position="left" label-width="120px" ref="taskForm">
      <el-form-item label="扫描目标" prop="taskType">
        <el-input
          type="textarea"
          :rows="3"
          v-model="taskForm.taskType"
          placeholder="填写域名或者IP，一行一个，支持IP区间段，比如：10.0.0.0/24，或者10.0.0.0-10.0.0.255"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="任务名称" prop="taskname">
        <el-input v-model="taskForm.taskname" placeholder="请输入任务名称"></el-input>
      </el-form-item>

      <el-form-item label="目标网络环境" prop="target_env">
        <el-select v-model="taskForm.target_env" placeholder="请选择">
          <el-option label="生产网" value="scw"></el-option>
          <el-option label="办公网" value="bgw"></el-option>
        </el-select>
      </el-form-item>

      <h3 class="app-margin--bottom" @click="handleShowMore">
        高级信息
        <i v-show="showMore" class="el-icon-caret-bottom"></i>
        <i v-show="!showMore" class="el-icon-caret-left"></i>
      </h3>
      <transition name="el-zoom-in-top">
        <div v-show="showMore">
          <el-form-item label="扫描公共Headers" prop="custom_header">
            <el-input v-model="taskForm.custom_header" placeholder="请输入公共Headers"></el-input>
          </el-form-item>

          <el-form-item label="指纹数据导入" prop="port_much">
            <el-input
              type="textarea"
              :rows="3"
              v-model="taskForm.port_much"
              placeholder="格式： IP(空格)端口，一行一个。 例如：10.0.0.1 80"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="URL数据导入" prop="url_much">
            <el-input
              type="textarea"
              :rows="6"
              v-model="taskForm.url_much"
              placeholder="支持以下四种方式：
  http://xiaojukeji.com/a.php?a=c&d=d
  http://xiaojukeji.com/a.php?a=c&d=d(空格)GET
  http://xiaojukeji.com/a.php?a=c&d=d(空格)POST?param=aaa&&dd=epw
  http://xiaojukeji.com/a.php?a=c&d=d(空格)POST?{'param': 'aaa'}"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="扫描类型">
            <el-checkbox :true-label="1" :false-label="0" disabled v-model="taskForm.touchscan">指纹扫描</el-checkbox>
            <el-checkbox :true-label="1" :false-label="0" v-model="taskForm.spider">爬虫扫描</el-checkbox>
            <el-checkbox :true-label="1" :false-label="0" v-model="taskForm.webscan">Web漏洞扫描</el-checkbox>
            <el-checkbox :true-label="1" :false-label="0" v-model="taskForm.hostscan">主机漏洞扫描</el-checkbox>
          </el-form-item>

          <el-form-item label="任务优先级" prop="privilege">
            <el-select v-model="taskForm.privilege" placeholder="请选择">
              <el-option label="常规" :value="0"></el-option>
              <el-option label="紧急" :value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="扫描QPS" prop="scan_qps">
            <el-select v-model="taskForm.scan_qps" placeholder="请选择">
              <el-option label="全部节点" :value="0"></el-option>
              <el-option label="1个节点" :value="1"></el-option>
              <el-option label="2个节点" :value="2"></el-option>
              <el-option label="3个节点" :value="3"></el-option>
              <el-option label="4个节点" :value="4"></el-option>
              <el-option label="5个节点" :value="5"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="爬虫扫描URL数量" prop="spiderOption_maxlinknum">
            <el-select v-model="taskForm.spiderOption_maxlinknum" placeholder="请选择">
              <el-option label="500条URL" :value="500"></el-option>
              <el-option label="1000条URL" :value="1000"></el-option>
              <el-option label="5000条URL" :value="5000"></el-option>
              <el-option label="10000条URL" :value="10000"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="指纹扫描端口配置" prop="touchscanOption_port_tag">
            <el-select v-model="taskForm.touchscanOption_port_tag" placeholder="请选择">
              <el-option label="标准端口" :value="0"></el-option>
              <el-option label="全端口[1-65536]" :value="1"></el-option>
              <el-option label="自定义端口" :value="2"></el-option>
              <el-option label="快速端口扫描[1-1024]" :value="3"></el-option>
            </el-select>
            <el-input v-if="taskForm.touchscanOption_port_tag === 2" v-model="taskForm.touchscanOption_port_range" placeholder="自定义端口：80,443,22,21,8000-9000,1-1024"></el-input>
          </el-form-item>

          <el-form-item label="Web漏洞扫描配置" prop="webscanOption_plugin_name">
            <!-- <el-input
              type="textarea"
              :rows="3"
              v-model="taskForm.webscanOption_plugin_name"
              placeholder="请输入Web漏洞扫描配置"
            >
            </el-input> -->
            <el-select
              v-model="value"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请选择Web漏洞扫描配置"
              :remote-method="handleGetWebPluginScan">
              <el-option
                v-for="item in webPluginOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="主机漏洞插件" prop="hostscanOption_plugin_name">
            <!-- <el-input
              type="textarea"
              :rows="3"
              v-model="taskForm.hostscanOption_plugin_name"
              placeholder="请输入主机漏洞插件"
            >
            </el-input> -->
            <el-select
              v-model="value"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请选择主机漏洞插件"
              :remote-method="handleGetHostPluginScan">
              <el-option
                v-for="item in hostPluginOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="任务备注" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              v-model="taskForm.remark"
              placeholder="请输入任务备注"
            >
            </el-input>
          </el-form-item>
        </div>
      </transition>
      <div class="app-button--right">
        <el-button class="btn-custom--primary" type="primary" @click="hancleTaskSubmit">保存</el-button>
        <el-button class="btn-custom--default" @click="handleCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {connect} from '@/lib'
import _ from 'lodash'

export default connect(() => {
  return {
  }
  }, {
    createScanTask: 'octopus_initiative/createScanTask',
    getWebPluginScan: 'octopus_initiative/getWebPluginScan',
    getHostPluginScan: 'octopus_initiative/getHostPluginScan'
  })({
    data() {
      return {
        taskForm: {
          taskType: '',
          taskname: '',
          target_env: '',
          custom_header: '',
          touchscan: 1,
          spider: 1,
          webscan: 1,
          hostscan: 1,
          webscanOption_plugin_name: [],
          hostscanOption_plugin_name: [],
          remark: ''
        },
        taskRules: {
          taskType: [{ required: true, message: '请输入扫描目标', trigger: 'blur' }],
          taskname: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          target_env: [{ required: true, message: '请选择目标网络环境', trigger: 'change' }]
        },

        showMore: false,

        webPluginOptions: [],
        hostPluginOptions: []
      }
    },

    created() {
      this.getWebPluginScan({
        plugin_name: '',
        page_size: 50,
        current_page: 1
      }).then(data => {
        this.taskForm.webscanOption_plugin_name = data.datas
        this.webPluginOptions = data.datas
      })
      this.getHostPluginScan({
        plugin_name: '',
        page_size: 50,
        current_page: 1
      }).then(data => {
        this.taskForm.hostscanOption_plugin_name = data.datas
        this.hostPluginOptions = data.datas
      })
    },

    methods: {
      handleShowMore() {
        this.showMore = !this.showMore
      },

      handleCancel() {
        this.$refs.taskForm.resetFields()
        this.$emit('close')
      },

      hancleTaskSubmit() {
        this.$refs.taskForm.validate(valid => {
          if (valid) {
            this.createScanTask(this.taskForm).then(data => {
              this.$message.success('任务创建成功')
              this.$refs.taskForm.resetFields()
              this.$emit('close', true)
            })
          }
        })
      },

      handleGetWebPluginScan(query) {
        _.debounce(this.getWebPluginScan({
          plugin_name: query,
          page_size: 50,
          current_page: 1
        }).then(data => {
          this.webPluginOptions = data.datas
        }), 500)
      },

      handleGetHostPluginScan(query) {
        _.debounce(this.getHostPluginScan({
          plugin_name: query,
          page_size: 50,
          current_page: 1
        }).then(data => {
          this.hostPluginOptions = data.datas
        }), 500)
      }
    }
  })
</script>

<style lang="less">
  .initiative-task-edit {
    padding: 0 80px 0 15px;

    margin-bottom: 60px;

    .btn-custom--primary {
      padding-left: 10px;
      padding-right: 10px;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
      float: right;
      background: #FC9153;
      border: #FC9153;
      color: white;
      margin-left: 20px;
      margin-top: 15px;
      width: 120px;
    }

    .btn-custom--default {
      float: right;
      -webkit-font-smoothing: antialiased;
      margin-left: 20px;
      margin-top: 15px;
      width: 120px;
      font-size: 13px;
    }
  }
  .el-select {
    width: 100%;
  }

</style>
