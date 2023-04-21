<template>
  <div class="evaluation-business-edit">
    <el-form label-suffix="：" :model="value" :rules="rules" ref="objectForm" label-width="130px">
      <el-form-item :label="$t('compliance.evaluation.businessName')" prop="business_id" class="is-required">
        <el-select v-model="value.business_id" @change="value => handleValueChange('business_id', value)" :placeholder="$t('manage.select')" style="width: 100%;">
          <el-option v-for="item in businessList" :key="item.id" :label="item.business_name" :value="item.business_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.evalTarget')" prop="object_name" class="is-required">
        <el-input :value="value.object_name" @input="value => handleValueChange('object_name', value)"></el-input>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.evalInterface')">
        <el-select :value="value.users || []" @change="value => handleValueChange('users', value)" remote reserve-keyword :remote-method="evalSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
          <el-option v-for="item in usersOptions" :key="item.label" :label="item.label" :value="item.value">
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
    businessList: [], // 已添加评估业务，用于判断业务名称
    objectList: [], // 已添加评估对象
    value: [] // 传入的评估业务，编辑时使用
  },
  data() {
    var validateName = (rule, value, callback) => {
      const _value = this.value.object_name
      const _business = this.value.business_id

      if (_value === '') return callback('请输入对象名称')
      if (this.originalName != _value && _.findIndex(_.filter(this.objectList, ['business_id', _business]), { object_name: _value }) != -1) {
        return callback('对象名称已存在')
      }
      callback()
    }
    var required = (rule, value, callback) => {
      setTimeout(() => {
        const _value = this.value.business_id

        if (!_value) return callback('请输入对象名称')
        callback()
      }, 0);
    }

    return {
      usersOptions: [],

      rules: {
        business_id: [
          { validator: required, trigger: 'change' }
        ],
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
    handleValueChange(prop, value = []) {
      this.$emit('input', {
        ...this.value,
        [prop]: value
      })
    },

    /**
     * 初始化部分数据
     */
    init() {
      const fields = ['_users']
      this.originalName = this.value.object_name // 初始化业务名称，用于去重校验
      this.initOption(fields) // 初始化人员下拉框，用于下拉选择
    },

    evalSearchList(query) {
      this.empSearch(query, 'usersOptions')
    }
  },
  created() {
    this.formName = 'objectForm'
    this.init()
    console.log(this.value)
  }
}
</script>

<style lang="less">
.evaluation-business-edit {
  &__buttons {
    text-align: center;
  }
}
</style>
