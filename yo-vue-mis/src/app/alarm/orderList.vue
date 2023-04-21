<template>
  <div class="select-alarm-list">
    <el-form label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="题目/单号" prop="id">
            <el-input v-model="nameOrId"></el-input>
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
        <!-- <el-col :span="12">
          <el-form-item label="工单标题" prop="name">
            <el-input v-model="name"></el-input>
          </el-form-item>
        </el-col> -->

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
          <el-form-item label="风险等级" prop="riskType">
            <el-select v-model="riskType" placeholder="请选择">
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
      url="alarm/workOrder/list"
      :query-params="orderParamQueryList"
      border
      ref="orderListTable"
      style="width: 100%">

      <el-table-column
        type="selection"
        :selectable = "selectableMethod"
        width="55">
      </el-table-column>

      <el-table-column
        prop="id"
        label="工单编号">
      </el-table-column>

      <el-table-column
        prop="alarmType"
        label="告警类型">
      </el-table-column>

      <el-table-column
        prop="riskLevel"
        :formatter="fmtRiskLevel"
        label="风险等级">
      </el-table-column>

      <el-table-column
        prop="name"
        label="工单标题">
      </el-table-column>

      <el-table-column
        prop="postTime"
        label="上报时间">
      </el-table-column>

      <el-table-column
        prop="id"
        :label="$t('buttons.action')"
        width="100px">
        <template slot-scope="scope">
          <a class="el-button el-button--text el-button--small" target="_blank" :href="'http://anquan.didichuxing.com/project/portals/pages/alarm-order-detail.html?id=' + scope.row.id"  type="text" size="small">{{$t('buttons.link')}}</a>
        </template>
      </el-table-column>
    </sdl-table>

    <el-row :gutter="20">
      <el-col :offset="10" :span="12">
        <el-button type="primary" @click="saveSelectOrder">{{ $t('buttons.save') }}</el-button>
        <el-button style="margin-top: 15px;" @click="close">{{ $t('buttons.offset') }}</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>

import { DATE_OPTIONS } from '@/constants.es6'
import moment from 'moment'

export default {
  name: 'SELECT-ORDER-LIST',

  props: {
    orderIds: String
  },

  data() {
    return {
      nameOrId: '',
      type: null,
      alarm_time: [],
      riskType: null,

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

    fmtRiskLevel(row, column, cellValue, index) {
      let valueHtml = ''
      switch(cellValue + '') {
        case '0':
          valueHtml = 'S0(严重)'
          break;
        case '1':
          valueHtml = 'S1(高危)'
          break;
        case '2':
          valueHtml = 'S2(中危)'
          break;
        case '3':
          valueHtml = 'S3(低危)'
          break;
        case '4':
          valueHtml = '忽略'
          break;
      }
      return valueHtml
    },
    /**
     * 设置已经选择过的告警为选中状态
     */
    selectableMethod(row, index) {
      let _this = this
      if(_this.orderIds) {
        let ids = _this.orderIds.split(',')
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
      this.$refs.orderListTable.reload()
    },

    /**
     * 重置查询参数
     */
    reset() {
      this.nameOrId = ''
      this.type = null
      this.alarm_time = []
      this.riskType = []
    },

    /**
     * 查询参数
     */
    orderParamQueryList() {
      return {
        nameOrId: this.nameOrId,
        alarmType: this.type,
        alarm_begin_time: this.alarm_time.length > 0 ? moment(this.alarm_time[0]).format('YYYY-MM-DD') : '',
        alarm_end_time: this.alarm_time.length > 0 ? moment(this.alarm_time[1]).format('YYYY-MM-DD') : '',
        riskLevel: this.riskType
      }
    },

    // 获取选中的数据
    saveSelectOrder() {
      let selectData = this.$refs.orderListTable.getSelection()
      this.$emit('selection', selectData)
    },

    close() {
      this.$emit('close')
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


