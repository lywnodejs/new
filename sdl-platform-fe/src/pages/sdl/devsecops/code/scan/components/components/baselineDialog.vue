<template>
    <el-dialog id="devsecops-codeScan-baseline-detail-dialog"
                title="基线详情"
                :close-on-click-modal='true'
                :close-on-press-escape='true'
                :show-close="true"
               :visible.sync="dialogFormVisible"
                width="1010px">
        <el-form label-position="left" class="table-expand" label-width="100px">
            <div class="flex-box">
            <el-form-item label="基线编号:" class="items">
              <span>{{ baselineData.baselineNo }}</span>
            </el-form-item>
            <el-form-item label="基线名称:" class="items1">
              <span>{{ baselineData.baselineName }}</span>
            </el-form-item>
            </div>
            <!-- <el-form-item label="基线确认状态:">
              <span>{{ handleParams(props.row.baseline_first_confirm_status) }}</span>
            </el-form-item> -->
            <el-form-item label="安全要求:" >
              <span><pre>{{ baselineData.securityRequirements }}</pre></span>
            </el-form-item>
            <el-form-item label="开发规范:" v-if="baselineData.checkMethod">
              <span  v-for="item in baselineData.checkMethod.split(',')" :key='item'><a class="checkMethod" target="_blank" :href="item">{{ item }}</a><br> </span>
            </el-form-item>
            <el-form-item label="缓解机制:">
              <span><pre>{{ baselineData.mitigation }}</pre></span>
            </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button class="vulDetail-button" @click="dialogFormVisible = false">取消</el-button> -->
        <el-button class="vulDetail-btn" type="primary" @click="dialogFormVisible = false">确定</el-button>
      </span>
    </el-dialog>
</template>
<script>
  import {connect} from '@/lib'

  export default connect(() => {
    return {
    }
  }, {
  })({
    data() {
      return {
        baselineData: [],
        dialogFormVisible: false,
        multipleSelection: []
      }
    },
    props: ['data', 'dialogVisible'],
    watch: {
        data(val) {
            this.baselineData = val
        },
        dialogVisible(val) {
            this.dialogFormVisible = val
        },
        dialogFormVisible(val) {
            this.$emit('getDialog', this.dialogFormVisible)
        }
    },
    components: {},
    created() {
        this.fetchData()

        // this.updateRuleResult({taskId: 51})
        // this.updateBaselineResult({taskId: 51})
        // this.updateVulResult({taskId: 51})
    },
    mounted() {
    },
    methods: {
      fetchData() {
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  })
</script>

<style lang="less">
#devsecops-codeScan-baseline-detail-dialog{
    margin: 23px 20px;
    height: 100%;
    .table-expand {
      padding: 10px 20px;
      pre{
        white-space: pre-wrap;           /* css-3 */
        white-space: -moz-pre-wrap;      /* Mozilla, since 1999 */
        white-space: -pre-wrap;          /* Opera 4-6 */
        white-space: -o-pre-wrap;        /* Opera 7 */
        word-wrap: break-word;           /* Internet Explorer 5.5+ */
      }
      .checkMethod {
        text-decoration: underline;
        color: #fc9153;
      }
      .el-form-item__label{
          color: #c09853;
      }
    }
    .flex-box {
      display: flex;
      .items {
        flex-grow: 1;
        flex-basis: 35%
      }
      .items1 {
        flex-grow: 3
      }
    }
    .vulDetail-button {
      font-size: 13px;
      height: 32px;
      width: 95px;
      padding: 0px;
    }
    .vulDetail-btn {
      background: #fc9153;
      border-radius: 4px;
      font-size: 13px;
      height: 32px;
      width: 95px;
      padding: 0px;
      border: none;
    }
}
</style>

