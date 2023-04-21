<template>
  <div class="manage-event-notify">
    <div class="manage-event__bu">
      <b-button v-if="hasWriteAuthority" class="manage-event__import" variant="primary"  @click.stop="createConfig()">
        {{ $t('manage.notify.addConfig') }}
      </b-button>

      <b-button v-if="hasWriteAuthority" class="manage-event__import" variant="danger"  @click.stop="batchRemoveHandle()">
        {{ $t('manage.notify.batchRemove') }}
      </b-button>

      <b-button v-if="hasWriteAuthority" class="manage-event__import" variant="primary"  @click.stop="batchEnableHandle()">
        {{ $t('manage.notify.batchEnable') }}
      </b-button>

      <b-button v-if="hasWriteAuthority" class="manage-event__import" variant="primary"  @click.stop="batchDisableHandle()">
       {{ $t('manage.notify.batchDisable') }}
      </b-button>
    </div>
    <toggle-form :icon-only="true" title="manage.title">
      <form-field label="manage.notify.name" for-id="id">
        <input type="text" class="form-control" id="id" v-model="form.name" maxlength="100" >
      </form-field>

      <form-field label="manage.notify.user" for-id="emp_id">
        <el-select v-model="form.notify_user_id" remote reserve-keyword :remote-method="empSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" clearable>
          <el-option
            v-for="item in empOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </form-field>

      <form-field label="manage.notify.status" for-id="label_ids">
        <el-select v-model="form.status" :placeholder="$t('manage.select')" style="width: 100%;">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </form-field>

      <form-action>
        <button class="btn btn-primary" @click="search">
          <i class="fa fa-search" aria-hidden="true"></i> {{$t('manage.query')}}
        </button>
        <button class="btn btn-secondary" @click="reset">
          <i class="fa fa-undo" aria-hidden="true"></i> {{$t('manage.reset')}}</button>
      </form-action>
    </toggle-form>

    <sdl-table
      :url="url"
      border
      style="width: 100%"
      :query-params="eventParamQueryList"
      ref="configListTable"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('manage.notify.name')">
      </el-table-column>

      <el-table-column
        prop="user"
        :label="$t('manage.notify.user')">
        <template slot-scope="scope">
          <span class="manage-event-notify__name" v-for="user in scope.row.notify_user" :key="user.id">
            {{ user.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="create_user_name"
        :label="$t('manage.notify.creator')">
      </el-table-column>

      <el-table-column
        prop="create_time"
        :label="$t('manage.notify.createTime')">
      </el-table-column>

      <el-table-column
        prop="status_name"
        :label="$t('manage.notify.status')">
      </el-table-column>

      <el-table-column
        prop="action"
        :label="$t('manage.action')"
        width="220px">
        <template slot-scope="scope">
          <b-button variant="primary" size="sm" @click.stop="showConfig(scope.row.id)">
            {{ $t('manage.link') }}
          </b-button>
          <b-button variant="primary" size="sm" @click.stop="changeConfig(scope.row.id, scope.row.status)">
            {{  scope.row.status == 1 ? $t('manage.disable') : $t('manage.enable') }}
          </b-button>
          <b-button variant="primary" v-if="hasWriteAuthority" size="sm" @click.stop="updateConfig(scope.row.id)">
            {{$t('manage.update')}}
          </b-button>
          <b-button variant="danger" size="sm" @click.stop="removeConfig(scope.row.id)">
            {{ $t('manage.delete') }}
          </b-button>
        </template>
      </el-table-column>
    </sdl-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogNotifyVisible" width="70%" top="5vh">
      <notify-detail :notify="notify" v-if="isDetail && dialogNotifyVisible" ></notify-detail>
      <notify-edit v-model="notify" v-if="!isDetail && dialogNotifyVisible"></notify-edit>
      <div style="text-align: center; margin-top: -35px;" slot="footer" v-if="!isDetail">
        <el-button type="primary" @click="saveConfigHandle">{{$t('buttons.save')}}</el-button>
        <el-button @click="dialogNotifyVisible = false">{{$t('buttons.offset')}}</el-button>
      </div>
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
import { mapState } from 'vuex'
import { DATE_FORMAT, DATE_OPTIONS } from '@/constants.es6'

import ToggleForm from 'commons/ToggleForm.vue'
import FormField from 'commons/FormField.vue'
import FormAction from 'commons/FormAction.vue'
import NotifyEdit from './notifyEdit.vue'
import NotifyDetail from './notifyDetail.vue'

const DEFAULT_NOTIFY = {
        id: null,
        name: '',
        event_type_list: [],
        event_level_list: [],
        event_status_list: [],
        notify_user_list: [],
        status: ''
      }

export default {

  name: "MANAGE-EVENT-EMAIL-CONFIG",

  computed: {
    ...mapState(['lang'])
  },

  components: {
    ToggleForm,
    FormField,
    FormAction,
    NotifyEdit,
    NotifyDetail
  },

  data() {
    return {
      form: {
        name: '',
        notify_user_id: '',
        status: ''
      },
      notify: DEFAULT_NOTIFY,
      statusOptions: [
        {
          value: 1,
          label: this.$t('manage.enable')
        }, {
          value: 2,
          label: this.$t('manage.disable')
        }
      ],
      url: 'secEvent/notify/list',
      dialogTitle: this.$t('manage.notify.detailTitle'),
      dialogNotifyVisible: false,
      status: 0,
      event_id: '',
      hasWriteAuthority: true, // 当用户授权只有sec_event_guest并且不包含sec_event_user和sec_event_admin时，需要将添加、修改、导入按钮隐藏不显示
      DATE_OPTIONS,
      deptOptions: [],
      empOptions: [],
      isDetail: false
    }
  },

  methods: {

    /**
     * 查询参数
     */
    eventParamQueryList() {
      let param = {}, obj = this.form

      if ( obj === null || obj === undefined || obj === "" ) return param;
      for ( var key in obj ){
          if ( obj[key] !== null && obj[key] !== undefined && obj[key] !== "" ){
              param[key] = obj[key]
          }
      }
      return param
    },

    /**
     * 列表查询
     */
    search() {
      this.$refs.configListTable.reload()
    },

    /**
     * 人员查询
     */
    empSearchList(query) {
      if(query !== '') {
        this.$http.get('secEvent/searchEmpList', {params: {'account': query}}).then(res => {
          if (res.data.errno == 0) {
            this.empOptions = []
            this.empOptions = res.data.data.map((item) => {
              return {
                value: item.id,
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

    /**
     * 改变状态
     */
    changeConfigStatus(ids, status) {
      return this.$http.post('secEvent/notify/change', {
        ids,
        status
      }).then(res => {
        if (res.data.errno == 0) {
          this.$message.success(this.$t('manage.notify.hint.success'))
          this.search()
        } else {
          this.$message.error(this.$t('manage.notify.hint.error'))
        }

        return res
      })
    },

    /**
     * 改变配置状态
     */
    changeConfig(id, status) {
      this.changeConfigStatus([id], status == 1 ? 2 : 1)
    },

    /**
     * 删除配置
     */
    removeConfig(id) {
      this.$confirm(this.$t('manage.notify.hint.confirm'), this.$t('manage.hint'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('manage.sure'),
        cancelButtonText: this.$t('manage.cancel')
      })
        .then(() => {
          this.changeConfigStatus([id], 9)
        })
        .catch(action => {
        })
    },

    /**
     * 批量禁用
     */
    batchDisableHandle() {
      let ids = this.$refs.configListTable.getSelection().map(data => data.id)

      if (ids.length === 0) {
        return this.$message.warning(this.$t('manage.notify.hint.empty'))
      }
      this.changeConfigStatus(ids, 2)
    },

    /**
     * 批量启用
     */
    batchEnableHandle() {
      let ids = this.$refs.configListTable.getSelection().map(data => data.id)

      if (ids.length === 0) {
        return this.$message.warning(this.$t('manage.notify.hint.empty'))
      }
      this.changeConfigStatus(ids, 1)
    },

    /**
     * 批量删除
     */
    batchRemoveHandle() {
      let ids = this.$refs.configListTable.getSelection().map(data => data.id)

      if (ids.length === 0) {
        return this.$message.warning(this.$t('manage.notify.hint.empty'))
      }

      this.$confirm(this.$t('manage.notify.hint.batchConfirm'), this.$t('manage.hint'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('manage.sure'),
        cancelButtonText: this.$t('manage.cancel')
      })
        .then(() => {
          this.changeConfigStatus(ids, 9)
        })
        .catch(action => {
        })
    },

    /**
     * 格式化数据
     */
    format(data) {
      const notify = {}

      notify.id = data.id
      notify.name = data.name
      notify.event_type_list = data.event_type.map(type => type.id)
      notify.event_level_list = data.event_level.map(level => level.id)
      notify.event_status_list = data.event_status.map(status => status.id)
      notify.notify_user_list = data.notify_user.map(user => user.id)
      notify.user_full_list = data.notify_user.map(user => {
        return {value: user.id, label: user.name}
      })
      notify.status = data.status

      return notify
    },

    /**
     * 获取配置
     */
    getConfig(id) {
      return this.$http.get('secEvent/notify/info', {params: { id }}).then(res => {
        if (res.data.errno == 0) {

          this.dialogNotifyVisible = true
          return res.data.data
        }
        this.$message.error(this.$t('manage.notify.hint.error'))
        this.empOptions = DEFAULT_NOTIFY
        this.dialogNotifyVisible = false
        return Promise.reject()
      })
    },

    /**
     * 新建配置
     */
    createConfig() {
      this.isDetail = false
      this.dialogTitle = this.$t('manage.notify.addTitle')
      this.notify = DEFAULT_NOTIFY
      this.dialogNotifyVisible = true
    },

    /**
     * 查看配置详情
     */
    showConfig(id) {
      this.isDetail = true
      this.dialogTitle = this.$t('manage.notify.detailTitle')
      this.getConfig(id).then(data => {
        this.notify = data
      })
    },

    /**
     * 更新配置
     */
    updateConfig(id) {
      this.isDetail = false
      this.dialogTitle = this.$t('manage.notify.updateTitle')
      this.getConfig(id).then(data => {
        this.notify = this.format(data)
      })
    },

    /**
     * 保存配置修改
     */
    saveConfigHandle() {
      this.$http.post(this.notify.id ? 'secEvent/notify/update' : 'secEvent/notify/add', {
        ...this.notify
      }).then(res => {
        if (res.data.errno == 0) {
          this.notify = DEFAULT_NOTIFY
          this.dialogNotifyVisible = false
          this.$message.success(this.$t('manage.notify.hint.success'))
          this.search()
        } else {
          this.$message.error(this.$t('manage.notify.hint.error'))
        }
      })
    },

    reset() {
      this.form.name = ''
      this.form.notify_user_id = ''
      this.form.status = ''
    },

    // 当用户授权只有sec_event_guest并且不包含sec_event_user和sec_event_admin时，需要将添加、修改、导入按钮隐藏不显示
    getUserAuthority() {
      this.$http.get('userInfo').then(rsp => {
          let roles = rsp.body.roles, roleNames = []

          if(Array.isArray(roles) && roles.length > 0) {
            roles.forEach(item => {
              roleNames.push(item.name)
            })

            if (roleNames.includes('sec_event_guest') && !roleNames.includes('sec_event_user') && !roleNames.includes('sec_event_admin')) {
              this.hasWriteAuthority = false
            } else {
              this.hasWriteAuthority = true
            }
          } else {
            this.hasWriteAuthority = false
          }
      })
    }
  },

  created() {

    // 获取用户信息，权限判断
    this.getUserAuthority()
  }
}
</script>
<style lang="less">
.manage-event {
  &__import {
    float: right;
    margin-left: 10px;
  }
  &__modal {
    .modal-dialog {
      max-width: 1100px;
    }
  }
  .datepicker-range .datepicker-popup {
    width: 415px;
  }

  .el-table__header th {
    color: #494b55;
    text-align: center;
    background-color: #f3f4f5;
  }
}

.manage-event__modal {
  a {
    margin-right: 5px;
  }
  .modal-dialog {
    max-width: 1100px;
  }
  .modal-content .modal-body .row .col-sm-2 > label {
    float: right;

    &::after {
      content: ":";
    }
  }
}

.manage-event__import__form--save {
  float: right;
  margin-top: 15px;
}
.manage-event-notify {
  &__name {
    margin-right: 5px;
  }
}
</style>
