<template>
  <div id="devsecops-ops-sacn" v-show="!isPassed">
      <span class="title-span">开源组件扫描</span>
      <el-table
      :data="opsData"
      :default-sort = "{prop: 'cve', order: 'descending'}"
      v-loading>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand" label-width="130px">
            <div class="flex-box">
            <!-- <el-form-item label="detail:" class="items">
              <span>{{ props.row.detail }}</span>
            </el-form-item>
            <el-form-item label="基线名称:" class="items1">
              <span>{{ props.row.baseline_name }}</span>
            </el-form-item> -->
            </div>
            <!-- <el-form-item label="基线确认状态:">
              <span>{{ handleParams(props.row.baseline_first_confirm_status) }}</span>
            </el-form-item> -->
            <el-form-item label="详情:" >
              <span>{{ props.row.detail }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="artifactId"
        label="基线编号"
        sortable
        align="center">
      </el-table-column>

      <el-table-column
        label="cve"
        prop="cve"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.cve}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="fixedVersion"
        prop="fixedVersion"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.fixedVersion}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="title"
        prop="title"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      
      <!-- <el-table-column
        label="操作"
        width="80px"
        align="center">123
        <template slot-scope="scope">
          <span>123</span>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>
<script>
  import {connect} from '@/lib'

  export default connect(() => {
    return {
    }
  }, {
    getAllResults: 'devsecops_index/getAllResults',
    updateRuleResult: 'devsecops_index/updateRuleResult',
    updateBaselineResult: 'devsecops_index/updateBaselineResult',
    updateVulResult: 'devsecops_index/updateVulResult'
  })({
    data() {
      return {
          opsData: [],
          isPassed: true
      }
    },
    components: {},
    created() {

      // this.fetchData()
    },
    props: ['datas'],
    watch: {
      datas(val) {
        if (val) {
          this.opsData = val.data
          this.isPassed = val.isPassed
        }
      }
    },
    mounted() {
    },
    methods: {
      fetchData() {
        this.getAllResults({taskId: 50}).then(res => {
            let data = res.data
            if (!data.opsScan.isPassed) {
              this.opsData = data.opsScan.data
            }
        })
      }
    }
  })
</script>

<style lang="less">
#devsecops-ops-sacn{
  padding: 10px 20px 30px 20px;
}
</style>

