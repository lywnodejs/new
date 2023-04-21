<template>
       <el-dialog id="base-line-cobra-dialog"
                title="Cobra规则"
               :visible.sync="dialogCobraRuleVisible"
               width="1200px">
      <div class="flex">
        <el-input placeholder="请输入Cobra规则名称"
                  style="width: 40%; margin-bottom: 20px;" v-model="cobraQueryParam.keywords.rule_name">
        </el-input>
        <el-button class="base-line-diaolog-btn search-btn" @click="searchCobraRule" type="primary">检&nbsp;索</el-button>
      </div>
      <el-table
        ref="cobraTable"
        :data="cobraList"
        @selection-change="handleCobraSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="ID"
          width="55"
          align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column
          label="Cobra规则编号"
          width="120"
          align="center">
          <template slot-scope="scope">{{ scope.row.rule_id }}</template>
        </el-table-column>
        <el-table-column
          label="Cobra规则名称"
          align="center">
          <template slot-scope="scope">{{ scope.row.rule_name }}</template>
        </el-table-column>
        <el-table-column
          label="规则描述"
          width="300"
          align="center">
          <template slot-scope="scope">{{ scope.row.rule_description }}</template>
        </el-table-column>
        <el-table-column
          label="开发语言"
          width="100"
          align="center">
          <template slot-scope="scope">{{ scope.row.language }}</template>
        </el-table-column>
        <el-table-column
          label="规则可信度"
          width="100"
          align="center">
          <template slot-scope="scope">{{ scope.row.rule_credibility }}</template>
        </el-table-column>
      </el-table>
      <div align="right" style="margin-top: 10px;">
        <el-pagination
          @size-change="handleCobraSizeChange"
          @current-change="handleCobraCurrentChange"
          :current-page="cobraQueryParam.page"
          :page-sizes="[10,20,30,50]"
          :page-size="cobraQueryParam.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="cobraNum">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="base-line-diaolog-button" @click="dialogCobraRuleVisible = false">取消</el-button>
        <el-button class="base-line-diaolog-btn" type="primary" @click="bindCobraRule()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
      cobraList: 'dolphin_baseline_relation/cobraList',
      cobraNum: 'dolphin_baseline_relation/cobraListLength',
      cobraIds: 'dolphin_baseline_relation/cobraIds'
  }
}, {
    getCobraList: 'dolphin_baseline_relation/getCobraList',
    getTestRuleIdsByBaselineId: 'dolphin_baseline_relation/getTestRuleIdsByBaselineId',
    bindTestRuleByBaselineId: 'dolphin_baseline_relation/bindTestRuleByBaselineId'
})({
  name: 'vul-type',
  props: ['dialogCobraVisible', 'didiBaselineId'],
  data() {
    return {
        cobraMultipleSelection: [],
        didi_baseline_id: this.didiBaselineId,
        dialogCobraRuleVisible: this.dialogCobraVisible,
        bindIds: [],
        diffIds: [],
        currentIds: [],

        //  cobra: 1 , fatbird: 2
        didi_test_rule_type: 1,
        cobraQueryParam: {
            page: 1,
            limit: 10,
            keywords: {
                rule_name: ''
            }
        }
    }
  },
  created() {
      this.searchCobraRule()
  },
  mounted() {
  },
  watch: {
    bindIds() {
        this.toggleSelection()
    },
    dialogCobraVisible(val) {
        this.dialogCobraRuleVisible = val
        if (val) {
          this.toggleSelection()
        }
    },
    didiBaselineId(val) {
        this.didi_baseline_id = val
        let getBindPostParam = {
            didi_baseline_id: this.didi_baseline_id,
            didi_test_rule_type: this.didi_test_rule_type
        }
        this.getTestRuleIdsByBaselineId(getBindPostParam).then(res => {
            this.bindIds = res
        })
    },
    dialogCobraRuleVisible(val) {
        this.$emit('cobraVisible', this.dialogCobraRuleVisible)
    }
  },
  methods: {
      bindCobraRule() {
        this.handleCurrentId()
        let postParam = {
          didi_baseline_id: this.didi_baseline_id,
          test_rule_ids: this.currentIds,
          didi_test_rule_type: this.didi_test_rule_type
        }
        this.bindTestRuleByBaselineId(postParam)
        this.dialogCobraRuleVisible = false
      },
      handleCobraSelectionChange(val) {
        this.cobraMultipleSelection = val
      },
      handleCurrentId() {
        this.currentIds = []
        this.cobraMultipleSelection.forEach(cobraRule => {
          this.currentIds.push(cobraRule.id)
        })
        let arr = []
        let temp = []
        for (let i = 0; i < this.diffIds.length; i++) {
            temp[this.diffIds[i]] = true
        }
        for (let i = 0; i < this.bindIds.length; i++) {
            if (!temp[this.bindIds[i]]) {
                arr.push(this.bindIds[i])
            }
        }
        arr.forEach(id => {
            this.currentIds.push(id)
        })
        this.bindIds = this.currentIds
      },
      searchCobraRule() {
        let queryParam = this.cobraQueryParam
        this.getCobraList(queryParam).then(res => {
          this.toggleSelection()
        })
      },
      toggleSelection() {
        let ids = this.bindIds
        this.diffIds = []
        this.$nextTick(() => {
            if (this.$refs.cobraTable != undefined) {
              this.$refs.cobraTable.clearSelection()
              for (let i = 0; i < ids.length; i++) {
                for (let j = 0; j < this.cobraList.length; j++) {
                  if (ids[i] == this.cobraList[j].id) {
                    this.$refs.cobraTable.toggleRowSelection(this.cobraList[j])
                    this.diffIds.push(ids[i])
                  }
                }
              }
            }
        })
      },
      handleCobraSizeChange(val) {
        this.cobraQueryParam.limit = val
        this.handleCurrentId()
        this.searchCobraRule()
      },
      handleCobraCurrentChange(val) {
        this.cobraQueryParam.page = val
        this.handleCurrentId()
        this.searchCobraRule()
      }
  }
})
</script>
<style lang="less">
#base-line-cobra-dialog{
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