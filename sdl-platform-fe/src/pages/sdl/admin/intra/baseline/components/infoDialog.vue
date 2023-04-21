<template>
 <el-dialog title="测试结果" id="admin-intra-baseline-info-dialog"
               :visible.sync="dialogInfoVisible"
               width="460px">
      <el-table
        :data="infoData"
        v-loading>
        <el-table-column
          property="param.language"
          label="语言"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          property="param.project_level"
          label="等级"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          property="bottom_security_bp"
          label="兜底BP"
          align="center">
        </el-table-column>
        <el-table-column
          property="general_security_bp"
          label="普通BP"
          align="center">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button class="base-line-diaolog-btn" type="primary" @click="dialogInfoVisible = false">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
})({
  name: '',
  props: ['dialog', 'info'],
  data() {
    return {
        dialogInfoVisible: false,
        infoData: null
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialog(val) {
        this.dialogInfoVisible = val
    },
    info(val) {
        this.infoData = [val]
    },
    dialogInfoVisible(val) {
        this.$emit('infoDialog', this.dialogInfoVisible)
    }
  },
  methods: {
  }
})
</script>
<style lang="less">
#admin-intra-baseline-info-dialog{
  .base-line-diaolog-button {
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
  }

  .base-line-diaolog-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
    border: none;
  }

  .base-line-diaolog-btn.search-btn {
    margin-left: 15px;
    width: 95px;
  }
}
</style>