<template>

  <div id="devsecops-code-sacn" >
     <!-- v-show="!isPassed" -->
    <span class="title-span">代码扫描</span>
    <div v-if="createUrl" class="uncreated-url"><a :href="createUrl" class="create-url">没有创建基线安全评估项目，请点击创建</a> </div>
      
    <div v-else class="invoice-list">
      <!-- 表头的值,自己单独写的 -->
      <!-- <ul class="invoice-header">
        <li class="invoice-item">基线编号</li>
        <li class="invoice-item">基线名称</li>
        <li class="invoice-item">操作</li>
      </ul> -->
        <el-tree v-loading="loading"
          :props="props"
          :data="scanData"
          show-checkbox
          :default-expanded-keys='defaultExpandArr'
          ref="treeData"
          node-key="id"
          @check-change="handleCheckChange">
          <!-- 使用自定义,需要加slot-scope,返回两个值,node是当前节点指定的对象
          data是当前节点的数据 -->
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span class="table_info_node" v-if="data" >
              <span class="table_info table_info_item2 padding"  v-show="data.isPassed === false">基线ID</span>
              <span class="table_info table_info_item3"  v-show="data.isPassed === false">基线名称</span>
              <span class="table_info table_info_item1"  v-show="data.isPassed === false">操作</span>
              <!-- <span  class="table_title" v-show="data.isPassed === false">
              </span> -->
              <span class="table_info table_info_item2" v-show="data.baselineNo">{{data.baselineNo}}</span>
              <span class="table_info table_info_item3" v-show="data.baselineName">{{data.baselineName}}</span>

              <span class="table_info table_info_item4" v-show="data.ruleResultId"> <span class="title">结果ID：</span> {{data.ruleResultId}}</span>
              <span class="table_info table_info_item4" v-show="data.ruleId"><span class="title">规则ID：</span>{{data.ruleId}}</span>
              <span class="table_info table_info_item5" v-show="data.ruleName"><span class="title">规则名称：</span>{{data.ruleName}}</span>
              
              <span class="table_info table_info_item4" v-show="data.vulId"><span class="title">漏洞ID：</span>{{data.vulId}}</span>
              <span class="table_info table_info_item" v-if="data.vulId"  @click="openDialog(data, 'vul')">
                
                <span class="title">来源文件：</span>
                <span class="backgroundColor">{{handlePath(data.sfPath)}}</span>
                <span class="backgroundLineColor">{{`[${data.sfLine}]`}}</span>
              </span>
              <span class="table_info table_info_item" v-show="data.vulId"  @click="openDialog(data, 'vul')">
                <span class="title">目标文件：</span>
                <span class="backgroundColor">{{handlePath(data.dfPath)}}</span>
                <span class="backgroundLineColor">{{`[${data.dfLine}]`}}</span>
              </span>
              <span class="table_info table_info_item1" v-show="data.baselineId"><span class="detail" @click="openDialog(data, 'baseline')">查看基线详情</span></span>
              <!-- <span class="table_info table_info_item1" v-show="data.vulId"><span class="detail" @click="openDialog(data, 'vul')">查看漏洞详情</span></span> -->
            </span>
          </div>
        </el-tree>
    </div>
    
    <baseline-dialog-info :dialogVisible='baselineDialog' :data='tempData' @getDialog='getBaselineDialog'></baseline-dialog-info>
    <vul-dialog-info  :dialogVisible='vulDialog' :data='tempData' @getDialog='getVulDialog'></vul-dialog-info>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import baselineDialogInfo from './components/baselineDialog'
  import vulDialogInfo from './components/vulDialog'

  export default connect(() => {
    return {
    }
  }, {
    updateRuleResult: 'devsecops_index/updateRuleResult',
    updateBaselineResult: 'devsecops_index/updateBaselineResult',
    updateVulResult: 'devsecops_index/updateVulResult'
  })({
    data() {
      return {
        scanData: [],
        isPassed: true,
        createUrl: null,
        baselineDialog: false,
        vulDialog: false,
        tempData: [],
        props: {
          label: 'baselineId',
          children: 'data'
        },
        loading: true,
        defaultExpandArr: []
      }
    },
    props: ['datas'],
    watch: {
      datas(val) {
        console.log(val)
        if (!val) {
          this.loading = false
        } else {
          this.isPassed = val.isPassed
          let index = 1
          val.id = index++
          this.defaultExpandArr.push(val.id)
          if (val.data) {
            val.data.forEach(item => {
              if (item.baselineMode === 0) {
                item.disabled = true
              }
              item.id = index++
              if (item.data) {
                item.data.forEach(element => {
                  element.id = index++
                  if (element.data) {
                    element.data.forEach(i => {
                      i.id = index++
                    })
                  }
                })
              }
            })
          }
          if (val.createUrl) {
            this.createUrl = val.createUrl
          }
          this.scanData = [val]
          this.loading = false
        }
      }
    },
    components: { baselineDialogInfo, vulDialogInfo },
    created() {
    },
    mounted() {
    },
    methods: {
      fetchData() {
      },
      submitBaselineResult(id, reason) {
        let queryParam = {
          baselineId: id,
          reason: reason
        }
        this.updateBaselineResult(queryParam).then(res => {
          this.$parent.fetchData()
        })
      },
      submitRuleResult(id, reason) {
        let queryParam = {
          ruleResultId: id,
          reason: reason
        }
        this.updateRuleResult(queryParam).then(res => {
          this.$parent.fetchData()
        })
      },
      submitVulResult(id, reason) {
        let queryParam = {
          vulId: id,
          reason: reason
        }
        this.updateVulResult(queryParam).then(res => {
          this.$parent.fetchData()
        })
      },
      openDialog(data, type) {
        if (type === 'baseline') {
          this.baselineDialog = true
        }
        if (type === 'vul') {
          this.vulDialog = true
        }
        this.tempData = data
      },
      handlePath(path) {
        if (!path) {
          return ''
        }
        let pathArr = path.split('/')
        return pathArr[pathArr.length - 1]
      },
      getBaselineDialog(val) {
        this.baselineDialog = val
      },
      getVulDialog(val) {
        this.vulDialog = val
      },

      // tree组件选择改变事件
      handleCheckChange(val, isSelected, isChildSelected) {

        // console.log(val)
        // 使用getCheckedNodes可以获取当前被选中的节点数据
        let selected = this.$refs.treeData.getCheckedNodes()
        let nodes = this.$refs.treeData.getCheckedKeys()
        if (isSelected) {
          this.$prompt('', '请输入误报原因', {
            confirmButtonText: '提交误报',
            cancelButtonText: '取消',
            inputValue: '',
            inputType: 'textarea',
            customClass: 'remarkBox'
          }).then(res => {
            if (res.value === '') {
              this.$message.error('误报原因不能为空');
              this.resetChecked(this.tempData)
            } else {
              this.tempData = nodes
              let baselineId = null
              let ruleResultId = null
              let vulId = null
              selected.forEach(item => {
                if (item.baselineId) {
                  baselineId = item.baselineId
                }
                if (item.ruleResultId) {
                  ruleResultId = item.ruleResultId
                }
                if (item.vulId) {
                  vulId = item.vulId
                }
              })
              if (baselineId) {
                  return this.submitBaselineResult(baselineId, res.value)
              }
              if (ruleResultId) {
                  return this.submitRuleResult(ruleResultId, res.value)
              }
              if (vulId) {
                  return this.submitVulResult(vulId, res.value)
              }
            }

            // console.log(this.tempData)
            // console.log(res.value)
          }).catch(res => {
            this.resetChecked(this.tempData)
          })
        } else {
          this.tempData = nodes
        }
      },
      resetChecked(data) {
        this.$refs.treeData.setCheckedKeys(data);
      }
    }
  })
</script>

<style lang="less">
#devsecops-code-sacn{
    padding: 10px 20px 30px 20px;
    .title-span{
      margin: 10px 0;
      color: #333333;
      font-size: 14px;
      display: inline-block;
      line-height: 28px;
    }
    .uncreated-url{
      padding-top: 15px;
      .create-url{
        color: #fc9153;
        text-decoration: underline;
        margin-top: 20px;
      }
    }
     
    .expandTable{
      // padding: 20px;
    }
    .el-table__body{
      // border-top: 1px solid #CCCCCC;
      background-color: #616367;
      border-bottom: none;
    }
    .invoice-list {
    border: 1px solid #ebeef5;
    margin-top: 10px;
    font-size: 12.5px;
    color: #616367;
    .invoice-header {
      background-color: #f8f8f9;
      display: flex;
      padding-left: 63px;
      border-bottom: 1px solid #ebeef5;
      .invoice-item {
        padding: 10px;
        padding-right: 0;
        flex: 1;
        border-left: 1px solid #ebeef5;
        padding-left: 10px;
      }
    }
    .el-tree-node__content {
      background: #f2f2f2;
      height: 45px;
    }
    .el-tree-node__children {
      .el-tree-node__content {
        background: #fff;
        border-bottom: 1px solid #ebeef5;
      }
    }
    .custom-tree-node {
      width: 100%;
      height: 100%;
      .total_info_box {
        background: #f2f2f2;
        line-height: 40px;
        span{
          float: left;
          font-size: 12px;
          margin: 0 15px;
          i{
            display: inline-block;
            margin-right: 3px;
          }
        }
      }
      .table_info_node {
        display: flex;
        height: 100%;
        .table_title {
          display: flex;
        }
        .title {
          color: #c09853;
        }
        .table_info {
          // border-left: 1px solid #ebeef5;
          padding-left: 10px;
          line-height: 45px;
          height: 100%;
          .detail{
            color: #fc9153;
            cursor: pointer;
          }
          .backgroundColor{
                color: rgb(179, 9, 9);
                cursor: pointer;
                text-decoration: underline;
          }
          .backgroundLineColor{
                color: green;
                text-decoration: underline;
          }
        }
        .table_info_item {
          flex: 1;
        }
        .table_info_item1 {
          width: 100px;
          text-align: center;
        }
        .table_info_item2 {
          width: 150px;
          text-align: center;
        }
        .padding {
          padding-left: 27px;
        }
        .table_info_item3 {
          flex: 1;
          text-align: center;
        }
        .table_info_item4 {
          width: 190px;
          text-align: center;
        }
        .table_info_item5 {
          flex: 1;
          padding-left: 35px;
        }
      }
    }
    
  }
}
  .remarkBox{
      .el-message-box__content {
          position: relative;
          padding: 0px 20px !important;
          color: #606266;
          font-size: 13px;
      }
      textarea{
          min-height: 80px !important;
      }
  }
</style>

