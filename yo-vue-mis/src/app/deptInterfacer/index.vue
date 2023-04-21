<template>
  <div class="dept-interfacer">
    <toggle-form title="deptInterfacer.title">
      <form-field label="deptInterfacer.deptName" for-id="dept_id">
        <el-select v-model="dept_id" remote reserve-keyword :remote-method="deptSearchList" placeholder="请选择" filterable style="width: 100%;" clearable>
          <el-option
            v-for="item in deptOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </form-field>

      <form-field label="deptInterfacer.userName" for-id="emp_id">
        <el-select v-model="emp_id" remote reserve-keyword :remote-method="empSearchList" placeholder="请选择" filterable style="width: 100%;" clearable>
          <el-option
            v-for="item in empOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </form-field>

      <form-action>
        <button class="btn btn-primary" @click="search">
          <i class="fa fa-search" aria-hidden="true"></i> {{$t('buttons.query')}}
        </button>
        <button class="btn btn-secondary" @click="reset">
          <i class="fa fa-undo" aria-hidden="true"></i> {{$t('buttons.reset')}}</button>
      </form-action>
    </toggle-form>

    <sdl-table
      v-if="showTable"
      :url="url"
      border
      style="width: 100%"
      ref="deptInterfacerListTable"
      :default-sort = "{prop: 'dept_name', order: 'descending'}"
      :query-params="deptParamQueryList"
      >
      <el-table-column
        prop="dept_name"
        sortable="custom"
        :label="$t('deptInterfacer.deptName')">
      </el-table-column>

      <el-table-column
        prop="interfacer"
        sortable="custom"
        :label="$t('deptInterfacer.interfacerUserName')">
        <template slot-scope="scope">
          {{scope.row.interfacer ? scope.row.interfacer.realname : ''}}
        </template>
      </el-table-column>

      <el-table-column
        prop="interfacer"
        sortable="custom"
        :label="$t('deptInterfacer.interfacerEmail')">
        <template slot-scope="scope">
          {{scope.row.interfacer ? scope.row.interfacer.email : ''}}
        </template>
      </el-table-column>

      <el-table-column
        prop="type"
        sortable="custom"
        :label="$t('deptInterfacer.interfacerJob')">
         <template slot-scope="scope">
          {{scope.row.interfacer ? scope.row.interfacer.job_desc : ''}}
        </template>
      </el-table-column>

      <el-table-column
        prop="action"
        :label="$t('buttons.action')"
        width="150px">
        <template slot-scope="scope">
          <b-button variant="primary" size="sm" @click="updateUser(scope.row)" >
            {{ $t('buttons.update') }}
          </b-button>
          <b-button variant="primary" size="sm" @click="clearUser(scope.row)">
            {{ $t('buttons.clear') }}
          </b-button>
        </template>
      </el-table-column>
    </sdl-table>

    <el-dialog :title="modelListTitle" :visible.sync="dialogListVisible" width="70%">
      <user-list v-if="dialogListVisible" :dept-id="deptId" @close="close"></user-list>
    </el-dialog>
  </div>
</template>
<style scoped>

</style>
<style lang="less" scoped>
.rd-max {
  max-width: 220px;
  > a {
    overflow-wrap: normal;
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>

<script>
import moment from 'moment'
import { DATE_FORMAT, DATE_OPTIONS } from '@/constants.es6'
import ToggleForm from 'commons/ToggleForm.vue'
import FormField from 'commons/FormField.vue'
import FormAction from 'commons/FormAction.vue'
import _ from 'lodash'

import userList from './userList.vue'

export default {

  name: "MANAGE-EVENT-INDEX",

  computed: {
    eventDownloadURL: function() {
      let paramUrl = ''
      for(let [key, value] of Object.entries(this.eventParamQueryList())) {
        paramUrl += key + '=' + value + '&'
      }
      return '/secEvent/download?' + paramUrl.substring(0, paramUrl.length-1)
    },

    queryParams: function() {
      let paramStr = ''
      for(let [key, value] of Object.entries(this.eventParamQueryList())) {
        paramStr += key + '=' + value + '&'
      }
      return paramStr.substring(0, paramStr.length-1)
    }
  },

  components: {
    userList,
    ToggleForm,
    FormField,
    FormAction
  },

  data() {
    return {
      dept_id: '',
      emp_id: {},

      url: 'process/deptInterfacer/getList',
      showTable: true,

      deptOptions: [],
      empOptions: [],

      dialogListVisible: false,
      modelListTitle: this.$t('deptInterfacer.lsitTitle', ['']),

      deptId: null //更新修改使用

    }
  },

  methods: {
    clearUser(row) {
      this.$confirm('确认是否清空数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       this.$http.post('/process/deptInterfacer/remove', {
          dept_id: row.dept_id
        }, { emulateJSON: true }).then(res => {
          if (res.data.errno == 0) {
            this.$message.success(res.data.errmsg)
            this.search()
          } else {
            this.$message.error(res.data.errmsg)
          }
        })
      })
    },
    updateUser(row) {
      if (row.dept_name) {
        this.modelListTitle = this.$t('deptInterfacer.listTitle', [row.dept_name])
      }
      this.deptId = row.dept_id
      this.dialogListVisible = true
    },

    close(fresh) {
      if (fresh) {
        this.search()
      }
      this.dialogListVisible = false
    },
    /**
     * 查询参数
     */
    deptParamQueryList() {
      let params = {
        dept_id: this.dept_id,
        emp_id: this.emp_id.id,
      }
      return this.dealElement(params)
    },

    dealElement(obj){
      var param = {}
      if ( obj === null || obj === undefined || obj === "" ) return param;
      for ( var key in obj ){
          if ( obj[key] !== null && obj[key] !== undefined && obj[key] !== "" ){
              param[key] = obj[key]
          }
      }
      return param
    },

    search() {
      this.$refs.deptInterfacerListTable.reload()
    },

    /**
     * 涉及人员
     */
    empSearchList(query) {
      if(query !== '') {
        this.$http.get('secEvent/searchEmpList', {params: {'account': query}}).then(res => {
          if (res.data.errno == 0) {
            this.empOptions = []
            this.empOptions = res.data.data.map((item) => {
              return {
                value: item,
                label: item.name + '(' + item.email+ ')'
              }
            })
          } else {
            this.empOptions = []
          }
        })
      } else {
        this.empOptions = []
      }
    },

    deptSearchList(query) {
      if(query !== '') {
        this.$http.get('sdl/dept', {params: {'name': query}}).then(res => {
          if (res.status == 200) {
            this.deptOptions = []
            this.deptOptions = res.data
          } else {
            this.deptOptions = []
          }
        })
      } else {
        this.deptOptions = []
      }
    },

    showEventDetail(id) {
      this.event_id = id
      this.dialogEventVisible = true
    },

    reset() {
      this.dept_id = null
      this.emp_id = {}
    }
  }
}
</script>
<style lang="less">
.dept-interfacer {

  &__modal {
    .modal-dialog {
      max-width: 1100px;
    }
  }

  .el-table__header th {
    color: #494b55;
    text-align: center;
    background-color: #f3f4f5;
  }
}
</style>


