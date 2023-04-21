<template>
       <el-dialog id="ratel-vulnerability-dialog"
                title="查看详情"
               :visible.sync="dialogFormVisible"
                width="860px">
       <el-table
        :data="data"
        v-loading>
            <el-table-column
                label="项目ID"
                width="80"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.ratel_project_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="app_name"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="app_package_name"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_package_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="app_release_name"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_release_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="app_type"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_type}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="dept_name"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.dept_name}}</span>
                </template>
            </el-table-column>
        </el-table>

    <div align="right" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
    </div>
      
      <!-- <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-btn" type="primary" @click="dialogFormVisible = false">确定</el-button>
      </span> -->
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    getListByProjectId: 'ratel_project/getListByProjectId'
})({
  props: ['dialogVisible', 'projectID'],
  data() {
    return {
        data: [],
        dialogFormVisible: null,
        queryParam: {
            ratel_project_id: this.projectID,
            page: 1,
            limit: 10
        },
        num: 0
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.dialogFormVisible = val
    },
    dialogFormVisible(val) {
        this.$emit('projectDialog', this.dialogFormVisible)
    },
    projectID(val) {
        this.queryParam.ratel_project_id = val
        this.fetchData()
    }
  },
  methods: {
        fetchData() {
            this.getListByProjectId(this.queryParam).then(res => {
                console.log(res)
                this.num = res.count
                this.data = res.vul_list
            })
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
#ratel-vulnerability-dialog{
  .octopus-diaolog-button {
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    line-height: 10px;
    font-size: 13px;
  }

  .octopus-diaolog-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    line-height: 10px;
    font-size: 13px;
    border: none;
  }

  .octopus-diaolog-btn.search-btn {
    margin-left: 15px;
    width: 95px;
  }

  .inputWidth {
    width: 320px;
  }
  .mutileInput{
      margin-top: 7px;
  }
   .myIcon {
      color: #FC9153;
      font-size: 16px;
      cursor: pointer;
      position: relative;
      top: 0px;
      left: 7px;
    }
    .myIcon:hover {
      top: 1.5px;
    }
}
</style>