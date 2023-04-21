<template>
    <el-dialog :title="title"  id="base-line-dialog"
     :visible.sync="dialogFormVisible" width="460px">
      <el-form :inline="true" :model="baselineForm" ref="baselineForm" label-width="100px" label-position="left" :rules='baselineFormRules'>
        <el-form-item label="基线类型" prop="baselineTypeArray">
          <el-cascader class="inputBaseline"
                      :options="baselineType"
                      v-model="baselineForm.baselineTypeArray"
                      clearable
                      change-on-select
                      @change="handleBaselineTypeArray"
                      placeholder="请选择基线类型"
                      expand-trigger="hover">
          </el-cascader>
        </el-form-item>
        <el-form-item label="基线编号" prop="baseline_no_2">
          <el-input class="inputBaseline"
                    style="width: 153px;"
                    v-model="baselineForm.baseline_no_1"
                    placeholder=""
                    clearable
                    disabled>
          </el-input>
          <span>-</span>
          <el-input class="inputBaseline"
                    style="width: 153px;"
                    v-model="baselineForm.baseline_no_2"
                    placeholder="请输入基线编号"
                    clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="基线名称" prop="baseline_name">
          <el-input class="inputBaseline"
                    v-model="baselineForm.baseline_name"
                    placeholder="请输入基线名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="安全要求" prop="security_requirements">
          <el-input class="inputBaseline"
                    type="textarea"
                    v-model="baselineForm.security_requirements"
                    placeholder="请输入安全要求"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="开发规范">
          <el-input class="inputBaseline"
                    type="textarea"
                    v-model="baselineForm.check_method"
                    placeholder="请输入检查方法"
                    clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="加固方案" prop="mitigation">
          <el-input class="inputBaseline"
                    type="textarea"
                    v-model="baselineForm.mitigation"
                    placeholder="请输入加固方案"
                    clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="是否强制" prop="is_forced">
          <el-select class="inputBaseline"
                    clearable
                    placeholder="请选择是否强制"
                    v-model="baselineForm.is_forced"
                    auto-complete="off">
            <el-option v-for="item in isForced"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞类型" >
                <vul-type class="inputBaseline" v-model="baselineForm.vul_type_id" ></vul-type>
        </el-form-item>
        <el-form-item label="威胁列表">
          <el-select class="inputBaseline"
            v-model="baselineForm.threat_list"
            placeholder="请选择威胁列表"
            filterable
            clearable
            multiple
            reserve-keyword>
            <el-option
              v-for="item in threatList"
              :key="item.didi_threat_id"
              :label="item.threat_name"
              :value="item.didi_threat_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="STRIDE">
          <el-select class="inputBaseline"
            v-model="baselineForm.stride"
            placeholder="请选择STRIDE"
            filterable
            clearable
            multiple
            reserve-keyword>
            <el-option
              v-for="item in stride"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设计原则">
          <el-input class="inputBaseline"
                    type="textarea"
                    v-model="baselineForm.design_principle"
                    placeholder="请输入设计原则"
                    clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间" v-if="title=='编辑基线'">
          <el-input class="inputBaseline"
                    v-model="baselineForm.create_time"
                    placeholder=""
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="更新时间" v-if="title=='编辑基线'">
          <el-input class="inputBaseline"
                    v-model="baselineForm.update_time"
                    placeholder=""
                    disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="base-line-diaolog-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="base-line-diaolog-btn" type="warning" round @click="submitForm('baselineForm')">确定
        </el-button>
      </div>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'
import * as CONSTANTS from '@/commons/dolphin'
import vulType from './vulType'

export default connect(() => {
  return {
      threatList: 'dolphin_threat/threatList'
  }
}, {
    getThreatList: 'dolphin_threat/getThreatList',
    updateBaseline: 'dolphin_baseline/updateBaseline',
    createBaseline: 'dolphin_baseline/createBaseline'
})({
  name: '',
  props: ['dialogVisible', 'formData'],
  components: { vulType },
  data() {
    return {
        dialogFormVisible: this.dialogVisible,
        title: '新建基线',
        isForced: CONSTANTS.isForced,
        stride: CONSTANTS.stride,
        baselineType: CONSTANTS.baselineType,
        tempFormData: {},
        baselineFormRequest: {},
        baselineForm: {
          id: 0,
          baseline_no: '',
          baseline_no_1: '',  // 编号前半部分
          baseline_no_2: '',  // 编号后半部分
          baseline_name: '',
          baselineTypeArray: [],
          baseline_type1: '',
          baseline_type2: '',
          baseline_type3: '',
          security_requirements: '',
          check_method: '',
          mitigation: '',    // 加固方案
          is_forced: '',
          threat_list: [],
          stride: [],
          design_principle: '',
          vul_type_id: []
        },
        baselineFormRules: {
          baselineTypeArray: [{type: 'array', required: true, message: '', trigger: 'change'}],
          baseline_no_2: [{required: true, message: '', trigger: 'change'}],
          baseline_name: [{required: true, message: '', trigger: 'change'}],
          security_requirements: [{required: true, message: '', trigger: 'change'}],
          mitigation: [{required: true, message: '', trigger: 'change'}],
          is_forced: [{required: true, message: '', trigger: 'change'}]
        }
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
    formData(data) {
        this.tempFormData = data
        if (this.$refs.baselineForm != undefined) {
          this.$refs.baselineForm.clearValidate()
        }
        if (data != null) {
          this.title = '编辑基线'
          this.baselineForm.id = data.id
          this.baselineForm.baseline_no = data.baseline_no
          this.baselineForm.baseline_name = data.baseline_name
          this.baselineForm.security_requirements = data.security_requirements
          this.baselineForm.check_method = data.check_method
          this.baselineForm.mitigation = data.mitigation
          this.baselineForm.is_forced = data.is_forced
          this.baselineForm.threat_list = data.threat_list
          this.baselineForm.stride = data.stride
          this.baselineForm.design_principle = data.design_principle
          this.baselineForm.create_time = data.create_time
          this.baselineForm.update_time = data.update_time
          this.baselineForm.vul_type_id = [data.vul_type1_id, data.vul_type2_id]

          // 给基线类型赋值
          this.baselineForm.baselineTypeArray.splice(0)
          if (data.baseline_type1 != '') {
            this.baselineForm.baselineTypeArray.splice(0, 1, parseInt(data.baseline_type1))
            if (data.baseline_type2 != '') {
              this.baselineForm.baselineTypeArray.splice(1, 1, parseInt(data.baseline_type2))
              if (data.baseline_type3 != '') {
                this.baselineForm.baselineTypeArray.splice(2, 1, parseInt(data.baseline_type3))
              }
            }
          }

          // 给威胁列表赋值
          if (this.baselineForm.threat_list != '' && typeof (this.baselineForm.threat_list) == 'string') {
            this.baselineForm.threat_list = this.baselineForm.threat_list.split(',')
            this.baselineForm.threat_list = this.baselineForm.threat_list.map((value) => {
              return parseInt(value);
            })
          }

          // 给stride赋值
          if (this.baselineForm.stride != '' && typeof (this.baselineForm.stride) == 'string') {
            this.baselineForm.stride = this.baselineForm.stride.split(',')
          }

          // 给基线编号赋值
          this.baselineForm.baseline_no_1 = data.baseline_no.split('-')[0]
          this.baselineForm.baseline_no_2 = data.baseline_no.split('-')[1]
          if (data.baseline_no.split('-').length >= 3) {
            this.baselineForm.baseline_no_2 += '-' + data.baseline_no.split('-')[2]
          }
        } else {
          this.title = '新建基线'
          this.clearBaselineForm()
          this.baselineForm.vul_type_id = [0]
          if (this.$refs.baselineForm != undefined) {
            this.$refs.baselineForm.clearValidate()
          }
        }
    },
    dialogFormVisible(val) {
        this.$emit('formVisible', this.dialogFormVisible)
    }
  },
  methods: {
      submitForm(formname) {
        this.$refs[formname].validate((valid) => {
          if (valid) {
            this.submitBaselineInfo()
            this.$parent.fetchData()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitBaselineInfo() {

        // if (this.baseline.id) {
        this.handleBaselineFormValue()   // 处理给后台发送到数据
        if (this.title == '编辑基线') {
          this.updateBaselineInfo()
        } else {
          this.createBaselineInfo()
        }
        this.clearBaselineForm()
        this.dialogFormVisible = false
      },
      createBaselineInfo() {
        this.createBaseline(this.baselineFormRequest)
        this.$parent.fetchData()
      },
      updateBaselineInfo() {
        this.updateBaseline(this.baselineFormRequest)
        this.$parent.fetchData()
      },
      handleBaselineFormValue() {

        // 如果baselineType没有update也要给type1，2，3都赋值
        this.handleBaselineTypeArray()
        this.baselineForm.baseline_no = this.baselineForm.baseline_no_1 + '-' + this.baselineForm.baseline_no_2
        if (this.baselineForm.threat_list) {
          this.baselineForm.threat_list = this.baselineForm.threat_list.join(',')
        }
        if (this.baselineForm.stride) {
          this.baselineForm.stride = this.baselineForm.stride.join(',')
        }

        // 新建一个obj给update接口传值
        this.baselineFormRequest = {
          id: this.baselineForm.id,
          baseline_type1: this.baselineForm.baseline_type1,
          baseline_type2: this.baselineForm.baseline_type2,
          baseline_type3: this.baselineForm.baseline_type3,
          baseline_no: this.baselineForm.baseline_no,
          baseline_name: this.baselineForm.baseline_name,
          security_requirements: this.baselineForm.security_requirements,
          check_method: this.baselineForm.check_method,
          mitigation: this.baselineForm.mitigation,
          is_forced: this.baselineForm.is_forced,
          threat_list: this.baselineForm.threat_list,
          stride: this.baselineForm.stride,
          design_principle: this.baselineForm.design_principle,
          create_time: this.baselineForm.create_time,
          update_time: this.baselineForm.update_time,
          vul_type1_id: this.baselineForm.vul_type_id[0],
          vul_type2_id: this.baselineForm.vul_type_id[1]
        }
      },
      handleBaselineTypeArray() {
        this.baselineForm.baseline_type1 = this.baselineForm.baselineTypeArray[0]
        this.baselineForm.baseline_type2 = this.baselineForm.baselineTypeArray[1]
        this.baselineForm.baseline_type3 = this.baselineForm.baselineTypeArray[2]
        if (!this.baselineForm.baselineTypeArray[2]) {
          this.baselineForm.baseline_type3 = ''
          if (!this.baselineForm.baselineTypeArray[1]) {
            this.baselineForm.baseline_type2 = ''
            if (!this.baselineForm.baselineTypeArray[0]) {
              this.baselineForm.baseline_type1 = ''
            }
          }
        }
        this.baselineForm.baseline_no_1 = this.baselineForm.baselineTypeArray.join('.')
      },
      clearBaselineForm() {
        this.baselineForm = {
          baseline_no: '',
          baseline_no_1: '',
          baseline_no_2: '',
          baseline_name: '',
          baseline_type1: '',
          baseline_type2: '',
          baseline_type3: '',
          baselineTypeArray: [],
          security_requirements: '',
          check_method: '',
          mitigation: '',    // 加固方案
          is_forced: '',
          threat_list: '',
          stride: [],
          design_principle: '',
          vul_type_id: []
        }
        this.baselineForm.vul_type_id.splice(0)
        this.baselineForm.baselineTypeArray.splice(0) // 清空array
      }
  }
})
</script>
<style lang="less">
#base-line-dialog{
  .inputBaseline {
    width: 320px;
  }
  .el-button--text {
    font-weight: 400;
  }
  .table-expand {
    padding: 10px 20px;
  }
  
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    word-wrap: break-word;
    span {
      display: inline-block;
      width: 100%;
      font-size: 12.5px;
    }
    
  }
  .base-line-diaolog-button {
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
  }

  .base-line-diaolog-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
    border: none;
  }

  .base-line-diaolog-btn.search-btn {
    margin-left: 15px;
    width: 95px;
  }
}
</style>