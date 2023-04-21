<template>
  <div class="el-main">
    <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="漏洞编号:">
          <el-input class="searchInput"
                    v-model="queryParam.oct_vul_main_id"
                    clearable
                    placeholder="请输入漏洞编号"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="任务编号:" style="margin-left:30px;">
          <el-select class="searchInput"
                     v-model="queryParam.oct_task_main_id"
                     filterable
                     clearable
                     placeholder="请选择漏洞类型">
            <el-option
              v-for="item in preSearchList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞URL:" style="margin-left:30px;">
          <el-input class="searchInput"
                    v-model="queryParam.url"
                    clearable
                    placeholder="请输入漏洞URL"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </div>
      <div class="displayFlex">
        <el-form-item label="问题参数:">
          <el-input class="searchInput"
                    v-model="queryParam.param"
                    clearable
                    placeholder="请输入请求问题参数"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="漏洞类型:" style="margin-left:30px;">
          <el-select class="searchInput"
                     v-model="queryParam.vul_type"
                     filterable
                     clearable
                     placeholder="请选择漏洞类型">
            <el-option
              v-for="item in vulType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求方式:" style="margin-left:30px;">
          <el-select class="searchInput"
                     v-model="queryParam.method"
                     filterable
                     clearable
                     placeholder="请选择请求方式">
            <el-option
              v-for="item in requestMethod"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <app-permission>
        <div class="displayFlex">
          <el-form-item label="任务创建人:">
            <el-input class="searchInput"
                      v-model="queryParam.username"
                      clearable
                      placeholder="请输入任务创建人"
                      auto-complete="off">
            </el-input>
          </el-form-item>
        </div>
      </app-permission>

      <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='octopus-btn' @click="searchVulnerability"><span>搜&nbsp;索</span></button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="cutLine"></div>

    <el-table
      :data="scanVulList"
      v-loading>
      <el-table-column
        prop="oct_vul_main_id"
        label="ID"
        sortable
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        label="任务编号"
        align="center"
        width="100">
        <template slot-scope="scope">
          <router-link :to="{ path : '/sdl/octopus/task',query: {taskId: scope.row.oct_task_main_id} }">
            <span>{{scope.row.oct_task_main_id}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞类型"
        width="130"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.vul_type}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="URL"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="级别"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.level}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.create_time.split(' ')[0]}}<br>{{scope.row.create_time.split(' ')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120px"
        align="center">
        <template slot-scope="scope">
          <span class="opera" @click="deleteVulnerabilityConfirm(scope.row.octopus_vul_id, '删除')">删除</span>
          <span class="opera" @click="openVulDetailTabs(scope.row)">详情</span>
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
  </div>
</template>

<script>
  import {connect} from '@/lib'
  import * as CONSTANTS from '@/commons/octopus'

  export default connect(() => {
    return {
      scanVulList: 'octopus_initiative/scanVulList',
      num: 'octopus_initiative/vulListLength'
    }
  }, {
    getScanVulList: 'octopus_initiative/getScanVulList'
  })({
    name: 'octopus-initiative-val-list',
    data() {
      return {
        requestMethod: CONSTANTS.requestMethod,
        vulType: CONSTANTS.vulType,
        vulStatus: CONSTANTS.vulStatus,
        vulLevel: CONSTANTS.vulLevel,
        preSearchList: [],
        queryParam: {
          page: 1,
          limit: 10,
          oct_vul_main_id: '',
          vul_type: '',
          method: '',
          oct_task_main_id: '',
          url: '',
          param: '',
          username: '',
          source_type: ''
        }
      }
    },
    created() {
      this.fetchData()
    },

    methods: {
      fetchData() {
        let queryParam = {queryParam: this.queryParam}
        this.getScanVulList(queryParam)
      },
      searchVulnerability() {
        this.fetchData()
      },

      // 分页
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

<style lang='less' scoped>
  .octopus-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 95px;
    height: 32px;
    border: none;
    color: white;
    cursor: pointer;
    // font-weight: 100;
    margin-top: 5px;
    margin-left: 80px;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      // font-weight: 100;
    }
  }

  .el-table th {
    background: #DDDDDD !important;
    font-size: large;
  }

  .el-input {
    width: 320px;
  }

  .el-select {
    width: 320px;
  }

  .el-main {
    width: 100%;
    box-sizing: border-box;
    background: white;
    // margin-bottom: 20px;
    // padding: 20px;
    // margin-left: -0px;
    // margin-top: -15px;
    // padding-right: -20px;
    .displayFlex {
      display: flex;
    }
    .searchForm {
      .searchInput {
        width: 230px;
      }
    }
  }

  .el-input__inner {
    width: 320px;
  }

  .el-tabs__item {
    width: 100%;
  }

  .cutLine {
    // border: 1px solid
    margin-top: 5px;
    margin-bottom: 17px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
    // background: rgba(0, 0, 0, 0.10);
    // border-rad
  }

  .vulCheck-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 95px;
    height: 32px;
    font-size: 13px;
    border: none;
    color: white;
    cursor: pointer;
    // font-weight: 100;
    float: right;
    -webkit-font-smoothing: antialiased;
    margin-top: 20px;
  }

  .action-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 120px;
    height: 32px;
    border: none;
    font-size: 13px;
    color: white;
    cursor: pointer;
    // font-weight: 100;
    float: right;
    -webkit-font-smoothing: antialiased;
    margin-top: 20px;
    margin-right: 10px;
  }

  .task-button {
    // font-weight: 300;
    height: 32px;
    float: right;
    -webkit-font-smoothing: antialiased;
    margin-left: 20px;
    font-size: 13px;
    // margin-top: -15px;
    width: 90px;
  }

  .task-btn {
    -webkit-font-smoothing: antialiased;
    // font-weight: 100;
    // float: right;
    height: 32px;
    background: #FC9153;
    border: #FC9153;
    color: white;
    font-size: 13px;
    margin-left: 20px;
    // margin-top: -15px;
    width: 90px;
  }

  .opera {
    color: #FC9153;
    cursor: pointer;
    // display: inline-block;
    // margin-left: 5px;
  }
</style>
