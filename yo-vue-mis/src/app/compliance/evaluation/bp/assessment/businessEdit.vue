<template>
  <div class="evaluation-business-edit">
    <el-form label-suffix="：" :model="value" :rules="rules" ref="businessForm" label-width="130px">
      <el-form-item :label="$t('compliance.evaluation.businessName')" prop="business_name" class="is-required">
        <el-input :value="value.business_name" @input="value => handleValueChange('business_name', value)"></el-input>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.businessManager')">
        <el-select :value="value.business_mgr" @change="value => handleValueChange('business_mgr', value)" remote reserve-keyword :remote-method="businessMgrSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
          <el-option v-for="item in business_mgrOptions" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.infoSecInterface')">
        <el-select :value="value.security_user" @change="value => handleValueChange('security_user', value)" remote reserve-keyword :remote-method="infoSecSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
          <el-option v-for="item in security_userOptions" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.productTechManager')">
        <el-select :value="value.product_mgr" @change="value => handleValueChange('product_mgr', value)" remote reserve-keyword :remote-method="productTechSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
          <el-option v-for="item in product_mgrOptions" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.productInterface')">
        <el-select :value="value.product_user" @change="value => handleValueChange('product_user', value)" remote reserve-keyword :remote-method="productSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
          <el-option v-for="item in product_userOptions" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.qaInterface')">
        <el-select :value="value.qa" @change="value => handleValueChange('qa', value)" remote reserve-keyword :remote-method="qaSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
          <el-option v-for="item in qaOptions" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.biInterface')">
        <el-select :value="value.bi" @change="value => handleValueChange('bi', value)" remote reserve-keyword :remote-method="biSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
          <el-option v-for="item in biOptions" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('compliance.evaluation.accountManager')">
        <el-select :value="value.ua" @change="value => handleValueChange('ua', value)" remote reserve-keyword :remote-method="accountSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
          <el-option v-for="item in uaOptions" :key="item.label" :label="item.label" :value="item.value">
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
    businessList: {}, // 已添加评估业务，用于判断业务名称
    value: {} // 传入的评估业务，编辑时使用
  },
  data() {
    var validateName = (rule, value, callback) => {
      const _value = this.value.business_name

      if (this.value.business_name === '') return callback('请输入业务名称')
      if (this.originalName != _value && _.findIndex(this.businessList, { business_name: _value }) != -1) {
        return callback('业务名称已存在')
      }
      callback()
    }

    return {
      business_mgrOptions: [],
      security_userOptions: [],
      product_mgrOptions: [],
      product_userOptions: [],
      qaOptions: [],
      biOptions: [],
      uaOptions: [],

      rules: {
        business_name: [
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
      const fields = ['_business_mgr', '_security_user', '_product_mgr', '_product_user', '_qa', '_bi', '_ua']

      this.originalName = this.value.business_name // 初始化业务名称，用于去重校验
      this.initOption(fields) // 初始化人员下拉框，用于下拉选择
    },

    businessMgrSearchList(query) {
      this.empSearch(query, 'business_mgrOptions')
    },
    infoSecSearchList(query) {
      this.empSearch(query, 'security_userOptions')
    },
    productTechSearchList(query) {
      this.empSearch(query, 'product_mgrOptions')
    },
    productSearchList(query) {
      this.empSearch(query, 'product_userOptions')
    },
    qaSearchList(query) {
      this.empSearch(query, 'qaOptions')
    },
    biSearchList(query) {
      this.empSearch(query, 'biOptions')
    },
    accountSearchList(query) {
      this.empSearch(query, 'uaOptions')
    }
  },
  created() {
    this.formName = 'businessForm'
    this.init()
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
