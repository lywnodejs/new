<template>
  <div class="evaluation-content-edit">
    <el-form label-suffix="：" :model="value" :rules="rules" ref="businessForm" label-width="130px">
      <el-form-item :label="$t('compliance.evaluation.businessName')" prop="business_name">
        <el-select :value="value.type" @change="value => handleValueChange('type', value)" :placeholder="$t('manage.select')" style="width: 100%;" v-if="value.id == null">
          <el-option v-for="item in contentList" :key="item.id" :label="item.dName" :value="item.id">
          </el-option>
        </el-select>
        <span v-else>{{value.name}}</span>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.evalInterface')">
        <el-select :value="value.mgrs" @change="value => handleValueChange('mgrs', value)" remote reserve-keyword :remote-method="evalSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
          <el-option v-for="item in mgrsOptions" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import _ from 'lodash'
import employeeSearchMixin from 'app/compliance/evaluation/mixins/employee'

const separator = '&'

export default {
  props: {
    contentList: {}, // 已添加评估业务，用于判断业务名称
    objectList: {}, // 已添加评估对象
    value: {} // 传入的评估业务，编辑时使用
  },
  data() {
    var validateName = (rule, value, callback) => {
      const _value = this.value.object_name

      if (_value === '') return callback('请输入对象名称')
      if (this.originalName != _value && _.findIndex(this.objectList, { object_name: _value }) != -1) {
        return callback('对象名称已存在')
      }
      callback()
    }

    return {
      mgrsOptions: [],

      rules: {
        object_name: [
          { validator: validateName, trigger: 'change' }
        ]
      }
    }
  },
  mixins: [employeeSearchMixin],
  methods: {

    /**
     * 监听表单域变化
     * 触发input事件
     */
    handleValueChange(prop, value) {
      this.$emit('input', {
        ...this.value,
        [prop]: value
      })
    },

    /**
     * 初始化部分数据
     */
    init() {
      const fields = ['_mgrs']

      this.originalName = this.value.object_name // 初始化业务名称，用于去重校验
      this.initOption(fields) // 初始化人员下拉框，用于下拉选择
    },

    evalSearchList(query) {
      this.empSearch(query, 'mgrsOptions')
    }
  },
  created() {
    this.init()
  }
}
</script>
