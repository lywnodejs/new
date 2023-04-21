<template>
    <el-dialog :title="title" 
            id="cachalot-onlineVul-dialog" 
            :visible.sync="dialogVisible" 
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
           <div v-if="key === status[0]">
                <el-form-item label="暴露风险">
                    <el-input class="inputWidth"
                                v-model="create_workflow.expose_risk"
                                placeholder="请输入暴露风险"
                                clearable></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input class="inputWidth"
                                v-model="create_workflow.remark"
                                placeholder="请输入备注"
                                type="textarea"
                                clearable></el-input>
                </el-form-item>
           </div>
           <div v-if="key === status[1]">
                <el-form-item label="code">
                    <el-input class="inputWidth"
                                v-model="human_analysis.code"
                                placeholder="请输入暴露风险"
                                clearable></el-input>
                </el-form-item>
                <el-form-item label="路径">
                    <el-input class="inputWidth"
                                v-model="human_analysis.path"
                                placeholder="请输入路径"
                                clearable></el-input>
                </el-form-item>
           </div>
           <div v-if="key === status[2]">
                <el-form-item label="状态">
                    <el-select class="inputWidth"
                                v-model="process_transform.status"
                                placeholder="请选择状态"
                                clearable>
                        <el-option
                        v-for="item in processTransformStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安全工程师">
                    <el-select class="inputWidth"
                                v-model="process_transform.sdl_engineer"
                                placeholder="请选择状态"
                                clearable>
                        <el-option
                        v-for="item in engineer"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="备注">
                    <el-input class="inputWidth"
                                v-model="process_transform.remark"
                                placeholder="请输入备注"
                                type="textarea"
                                clearable></el-input>
                </el-form-item>
           </div>
           <div v-if="key === status[3]">
               <el-form-item label="SDL ID">
                    <el-input class="inputWidth"
                                v-model="design_transform.sdl_projct_id"
                                placeholder="请输入SDL ID"
                                clearable></el-input>
                </el-form-item>
                <el-form-item label="安全工程师">
                    <el-select class="inputWidth"
                                v-model="design_transform.sdl_engineer"
                                placeholder="请选择状态"
                                clearable>
                        <el-option
                        v-for="item in engineer"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select class="inputWidth"
                                v-model="design_transform.status"
                                placeholder="请选择状态"
                                clearable>
                        <el-option
                        v-for="item in processTransformStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
           </div>
           <div v-if="key === status[4] || key === status[5]">
                <el-form-item label="安全工程师">
                    <el-select class="inputWidth"
                                v-model="white_transform.sdl_engineer"
                                placeholder="请选择状态"
                                clearable>
                        <el-option
                        v-for="item in engineer"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select class="inputWidth"
                                v-model="white_transform.status"
                                placeholder="请选择状态"
                                clearable>
                        <el-option
                        v-for="item in processTransformStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input class="inputWidth"
                                v-model="white_transform.remark"
                                placeholder="请输入备注"
                                type="textarea"
                                clearable></el-input>
                </el-form-item>
           </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="dialogVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="updateInfo()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import * as CONSTANTS from '@/commons/cachalot'
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    updateOnlineVul: 'cachalot_onlineVul/updateOnlineVul'
})({
  props: ['visible', 'data'],
  data() {
    return {
      dialogVisible: null,
      scopeRow: this.data,
      queryParam: {
          vul_id: null,
          current_status: null
      },
      title: '更新信息',
      processTransformStatus: CONSTANTS.processTransformStatus,
      engineer: CONSTANTS.engineer,
      key: '',
      status: [
          'create_workflow',
          'human_analysis',
          'process_transform',
          'design_transform',
          'white_transform',
          'black_transform'
      ],
      create_workflow: {
          expose_risk: '',
          remark: ''
      },
      human_analysis: {
          code: '',
          path: ''
      },
      process_transform: {
          sdl_engineer: '',
          remark: '',
          status: ''
      },
      design_transform: {
          sdl_engineer: '',
          sdl_projct_id: '',
          status: ''
      },
      white_transform: {
          remark: '',
          status: '',
          sdl_engineer: ''
      },
      black_transform: {
          sdl_engineer: '',
          remark: '',
          status: ''
      }
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    visible(val) {
        this.dialogVisible = val
    },
    dialogVisible(val) {
        this.$emit('dialog', this.dialogVisible)
    },
    data(val) {
        this.scopeRow = val
        this.queryParam.vul_id = this.scopeRow.vul_id
        this.queryParam.current_status = this.scopeRow.current_status
        this.key = this.scopeRow.key
        if (this.key === this.status[0]) {
            if (val.data) { this.create_workflow = val.data }
            this.title = 'R2漏洞信息更新'
        }
        if (this.key === this.status[1]) {
            if (val.data) { this.human_analysis = val.data }
            this.title = '手工分析信息更新'
        }
        if (this.key === this.status[2]) {
            if (val.data) { this.process_transform = val.data }
            this.title = '流程卡点转换信息更新'
        }
        if (this.key === this.status[3]) {
            if (val.data) { this.design_transform = val.data }
            this.title = '设计转换信息更新'
        }
        if (this.key === this.status[4]) {
            if (val.data) { this.white_transform = val.data }
            this.title = '白盒转换信息更新'
        }
        if (this.key === this.status[5]) {
            this.process_transform = this.black_transform
            if (val.data) { this.white_transform = val.data }
            this.title = '黑盒转换信息更新'
        }
    }
  },
  methods: {
    updateInfo() {
        let param
        if (this.key === this.status[0]) {
            param = {
                ...this.queryParam,
                ...this.create_workflow
            }
            delete param.update_time
        }
        if (this.key === this.status[1]) {
            param = {
                ...this.queryParam,
                human_analysis: this.human_analysis
            }
            delete param.update_time
        }
        if (this.key === this.status[2]) {
            param = {
                ...this.queryParam,
                process_transform: this.process_transform
            }
            delete param.updaste_time
        }
        if (this.key === this.status[3]) {
            param = {
                ...this.queryParam,
                design_transform: this.design_transform
            }
            delete param.update_time
        }
        if (this.key === this.status[4]) {
            param = {
                ...this.queryParam,
                white_transform: this.white_transform
            }
            delete param.update_time
        }
        if (this.key === this.status[5]) {
            param = {
                ...this.queryParam,
                black_transform: this.white_transform
            }
            delete param.update_time
        }
        this.updateOnlineVul(param).then(res => {
            this.dialogVisible = false
            this.$emit('updateData', {data: res, vul_id: this.queryParam.vul_id})

            // this.$parent.fetchData()
        })
    }
  }
})
</script>
<style lang="less">
#cachalot-onlineVul-dialog{
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
    .inputWidth{
        width: 320px;
    }
}
</style>