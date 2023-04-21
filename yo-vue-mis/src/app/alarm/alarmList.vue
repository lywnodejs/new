<template>
  <div class="select-alarm-list">
    <el-form label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('alarm.id')" prop="id">
            <el-input v-model="alarm_ids"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('alarm.type')" prop="type">
            <el-select v-model="type" placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('alarm.alarmTime')" prop="alarm_time">
            <el-date-picker
              v-model="alarm_time"
              type="daterange"
              :picker-options="DATE_OPTIONS"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('alarm.occuredTime')" prop="occured_time">
            <el-date-picker
              v-model="occured_time"
              type="daterange"
              :picker-options="DATE_OPTIONS"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('alarm.level')" prop="level">
            <el-select v-model="level" placeholder="请选择">
              <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" @click="query">{{ $t('buttons.query') }}</el-button>
            <el-button @click="reset">{{ $t('buttons.reset') }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <sdl-table
      url="alarm/queryList"
      border
      style="width: 100%"
      ref="alarmListTable"
      :query-params="alarmParamQueryList"
      >

      <el-table-column
        type="selection"
        :selectable = "selectableMethod"
        width="55">
      </el-table-column>

      <el-table-column
        prop="id"
        :label="$t('alarm.id')">
      </el-table-column>

      <el-table-column
        prop="type_name"
        :label="$t('alarm.type')">
      </el-table-column>

      <el-table-column
        prop="level_name"
        :label="$t('alarm.level')">
      </el-table-column>

      <el-table-column
        prop="alarm_time"
        :label="$t('alarm.alarmTime')">
      </el-table-column>

      <el-table-column
        prop="occured_time"
        :label="$t('alarm.occuredTime')">
      </el-table-column>

      <el-table-column
        prop="action"
        :label="$t('buttons.action')"
        width="100px">
        <template slot-scope="scope">
          <el-button @click="handleDetailClick(scope.row)" type="text" size="small">{{$t('buttons.link')}}</el-button>
        </template>
      </el-table-column>
    </sdl-table>

    <el-row :gutter="20">
        <el-col :offset="10" :span="12">
          <el-button type="primary" @click="saveSelectAlarm">{{ $t('buttons.save') }}</el-button>
          <el-button style="margin-top: 15px;" @click="close">{{ $t('buttons.offset') }}</el-button>
        </el-col>
      </el-row>

    <el-dialog :title="modelAlarmTitle" :visible.sync="dialogAlarmVisible" width="70%" append-to-body>
      <alarm-detail v-if="dialogAlarmVisible" @dialogSwitch="dialogSwitch" :alarm-row="alarm_row"></alarm-detail>
    </el-dialog>

  </div>
</template>

<script>

import { DATE_OPTIONS } from '@/constants.es6'
import moment from 'moment'

export default {
  name: 'SELECT-ALARM-LIST',

  props: {
    alarmIds: String
  },

  data() {
    return {
      alarm_ids: '',
      type: null,
      level: null,
      alarm_time: [],
      occured_time: [],

      DATE_OPTIONS,

      modelAlarmTitle: this.$t('manage.alarm.detail_title'),
      dialogAlarmVisible: false,

      alarm_row: {},

      typeOptions: [],
      levelOptions: [{
        value: 0,
        label: 'S0(严重)'
      }, {
        value: 1,
        label: 'S1(高危)'
      }, {
        value: 2,
        label: 'S2(中危)'
      }, {
        value: 3,
        label: 'S3(低危)'
      }, {
        value: 4,
        label: '忽略'
      }]
    }
  },

  methods: {
    /**
     * 设置已经选择过的告警为选中状态
     */
    selectableMethod(row, index) {
      let _this = this
      if(_this.alarmIds) {
        let ids = _this.alarmIds.split(',')
        if(ids.indexOf(row.id+'') === -1) {
          // 导致内存溢出，filter-method方法注册不起作用
          // this.$refs.alarmListTable.toggleRowSelection(row)
          return true
        } else {
          return false
        }
      }
      return true
    },

    /**
     * 查询按钮
     */
    query() {
      this.$refs.alarmListTable.reload()
    },

    /**
     * 重置查询参数
     */
    reset() {
      this.alarm_ids = ''
      this.level = null
      this.type = null
      this.alarm_time = []
      this.occured_time = []
    },

    /**
     * 查询参数
     */
    alarmParamQueryList() {
      return {
        alarm_ids: this.alarm_ids,
        level: this.level,
        type: this.type,
        alarm_begin_time: this.alarm_time.length > 0 ? moment(this.alarm_time[0]).format('YYYY-MM-DD') : '',
        alarm_end_time: this.alarm_time.length > 0 ? moment(this.alarm_time[1]).format('YYYY-MM-DD') : '',
        occured_begin_time: this.occured_time.length > 0 ? moment(this.occured_time[0]).format('YYYY-MM-DD') : '',
        occured_end_time: this.occured_time.length > 0 ? moment(this.occured_time[1]).format('YYYY-MM-DD') : ''
      }
    },

    // 获取选中的数据
    saveSelectAlarm() {
      let selectData = this.$refs.alarmListTable.getSelection()
      this.$emit('selection', selectData)
    },

    close() {
      this.$emit('close')
    },

    /**
     * 查看详情
     */
    handleDetailClick(row) {
      this.dialogAlarmVisible = true
      this.alarm_row = row
    },

    /**
     * 获取下拉列表初始化参数
     */
    getSelectOptions(id) {
      let url = 'dictionary/listByDataAuth/' + id
      this.$http.get(url).then(({ body }) => {
        let options = body.data.map(({ id: value, dName: label }) => {
          return {
            value,
            label
          };
        });
        switch (id) {
          case 1103:
            this.typeOptions = options
            break
        }
      })
    }

  },

  created() {
    this.getSelectOptions(1103) //typeOptions
  }
}
</script>

<style lang="less">
  .select-alarm-list {
    .el-table__header th {
      color: #494b55;
      text-align: center;
      background-color: #f3f4f5;
    }
    .el-form-item {
      margin-bottom: 5px;
    }

    .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner {
      width: 373px;
    }
  }
</style>


