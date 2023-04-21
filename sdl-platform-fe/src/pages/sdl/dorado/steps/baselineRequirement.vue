<template>
  <div id="baselineRequirement">
    <span>
      <div class="baselineRequirementTitle">基线要求</div>
      <app-permission>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          size="mini"
          style="float:right;width:96px;"
          class="basicline-requirement-btn"
          @click="openDialog">
          添加基线
        </el-button>
      </app-permission>
      <app-permission>
          <el-select v-model="tempStatus" style="float:right;margin-right:20px"
                       class="selectInput"
                       type="text"
                       placeholder="请选择基线确认状态"
                       size="mini"
                       @change="changeSelectTemp()">
              
              <el-option
              v-for="item in baselineFirstConfirmStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </app-permission>
      
    </span>
    
    <el-table :data="baselineReqList"
        v-loading
        :row-style="tableRowStyle"
        row-key="id"
        :expand-row-keys="expands"
        @row-click="rowClick"
        style="margin-top: 10px;width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand" label-width="130px">
            <div class="flex-box">
            <el-form-item label="基线编号:" class="items">
              <span>{{ props.row.baseline_no }}</span>
            </el-form-item>
            <el-form-item label="基线名称:" class="items1">
              <span>{{ props.row.baseline_name }}</span>
            </el-form-item>
            </div>
            <!-- <el-form-item label="基线确认状态:">
              <span>{{ handleParams(props.row.baseline_first_confirm_status) }}</span>
            </el-form-item> -->
            <el-form-item label="安全要求:" >
              <span><pre>{{ props.row.security_requirements }}</pre></span>
            </el-form-item>
            <el-form-item label="开发规范及代码示例:" >
              <span  v-for="item in props.row.check_method.split(',')" :key='item'><a @click="checkMethod(props.row.baseline_no)" class="checkMethod" target="_blank" :href="item">{{ item }}</a> </span>
            </el-form-item>
            <el-form-item label="缓解机制:">
              <span><pre v-html='handleMitigation(props.row.mitigation)'></pre></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="baseline_no"
        label="基线编号"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        label="基线名称">
        <template slot-scope="scope">
          <span class="highlight"> {{ scope.row.baseline_name }} </span>
        </template>
      </el-table-column>
      <el-table-column
        label="安全要求">
        <template slot-scope="scope">
          <p class="lengthLimit"> {{ scope.row.security_requirements }} </p>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-tooltip :disabled="scope.row.baseline_first_confirm_status!==2?true:false" :content="'不需要原因：'+scope.row.remark" placement="top" effect="light">
            <!-- <div style="width:150px;" slot="content">不需要原因：{{scope.row.remark}}</div> -->
          <app-permission>
              <el-select v-model="scope.row.baseline_first_confirm_status"
                       class="selectInput"
                       type="text"
                       placeholder="请选择基线确认状态"
                       size="mini"
                       @change="changeSelect(scope.row.id, scope.row.baseline_first_confirm_status)">
              <el-tooltip placement="left" class="tooltip" 
                        :visible-arrow='true' 
                        transition="bounce" 
                        v-for="item in baselineFirstConfirmStatus"
                        :key="item.value"
                        :disabled="item.label!=='待改进'&&item.label!=='不需要'&&item.label!=='已满足'||isDisabled">
              <div slot="content" >
                <!-- 基线操作说明 -->
                <span v-show="item.label==='待改进'"><span style="color:red">待改进</span>：认可基线但需要时间开发实现，修复后记得改成已满足哦！</span>
                <span v-show="item.label==='不需要'"><span style="color:red">不需要</span>：基线不适用我的业务场景</span>
                <span v-show="item.label==='已满足'"><span style="color:red">已满足</span>：已满足该基线要求，请安全工程师检测吧</span>
                <!-- <button class="tooltip-button" @click="isDisabled = !isDisabled">确定</button> -->
              </div>
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-tooltip>
            </el-select>
             
            <el-select v-model="scope.row.baseline_first_confirm_status"
                       class="selectInput"
                       type="text"
                       placeholder="请选择基线确认状态"
                       size="mini"
                       :disabled="currentStatus!=100"
                       @change="changeSelect(scope.row.id, scope.row.baseline_first_confirm_status)">
            <el-tooltip placement="left" class="tooltip" 
                        :visible-arrow='false' 
                        transition="bounce" 
                        v-for="item in baselineFirstConfirmStatus"
                        :key="item.value"
                        :disabled="item.label!=='待改进'&&item.label!=='不需要'&&item.label!=='已满足'||isDisabled">
              <div slot="content" >
                <!-- 基线操作说明 -->
                <span v-show="item.value==='待改进'"><span style="color:red">待改进</span>：认可基线但需要时间开发实现，修复后记得改成已满足哦！</span>
                <span v-show="item.value==='不需要'"><span style="color:red">不需要</span>：基线不适用我的业务场景</span>
                <span v-show="item.value==='已满足'"><span style="color:red">已满足</span>：已满足该基线要求，请安全工程师检测吧</span>
                <!-- <button class="tooltip-button" @click="isDisabled = !isDisabled">确定</button> -->
              </div>
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-tooltip>
            </el-select>
             
          </app-permission>
          </el-tooltip>
          
          <!-- <app-permission>
            <span class='el-icon-close closeIcon' @click="deleteBaseline(scope.row.id)"></span>
          </app-permission> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="submitButton">
      <!-- <throttle-debounce :time='2000' !isDebounce>
            <el-button class="baseline-button" type="warning" @click="throttleButton(submitBaselineRequirement)">提 交</el-button>
        </throttle-debounce> -->
      <app-permission>
        <el-button class="baseline-button" type="warning" @click="throttleButton(submitBaselineRequirement)">提 交</el-button>
        <el-button v-show="currentStatus==100" class="baseline-button" type="warning" @click="throttleButton(submitBaselineRequirement)">提 交</el-button>
      </app-permission>
      <span class="tip" v-if="commitDisabled">提示：不能提交状态为“未处理”的基线</span>
    </div>

    <add-baseline :dialogVisible='dialogFormVisible' @projectDialog='getFormVisible'></add-baseline>
  </div>
</template>

<script>
  import {connect} from '@/lib'
  import throttle from '@/plugin/throttle'
  import {Omega} from '@/lib/omega.js'
  import * as CONSTANTS from '@/commons/dorado'
  import addBaseline from './dialogs/addBaselineDialog'

  export default connect(() => {
    return {
      user: 'user/user',
      baselineReqList: 'baseline_requirement/baselineReqList'
    }
  }, {
    getBaselineReqList: 'baseline_requirement/getBaselineReqList',
    confirmBaselineReqList: 'baseline_requirement/confirmBaselineReqList',
    deleteOutputBaseline: 'baseline_requirement/deleteOutputBaseline',
    remarkBaseline: 'baseline_requirement/remarkBaseline',
    baselineNewCTR: 'baseline_requirement/baselineNewCTR',
    queryNewUser: 'baseline_requirement/queryNewUser'
  })({
    name: 'baseline-requirement',
    data() {
      return {
        sdl_project_id: 0,
        baselineFirstConfirmStatus: CONSTANTS.baselineFirstConfirmStatus,
        baselineReqSubmitList: [],
        commitDisabled: false,
        expands: [],
        dialogFormVisible: false,
        isDisabled: false,
        tempStatus: 0
      }
    },
    components: {addBaseline},
    props: ['currentStatus'],
    created() {
      this.fetchData()

      this.queryNewUser().then(res => {
        if (res.count <= 5) {
          this.isDisabled = false
        } else {
          this.isDisabled = true
        }
      })
    },
    watch: {},
    methods: {
      fetchData() {
        this.sdl_project_id = this.$route.query['projectId']
        let queryParam = {
          sdl_project_id: this.sdl_project_id
        }
        this.getBaselineReqList(queryParam).then(res => {
          this.baselineReqSubmitList = JSON.parse(JSON.stringify(res.baseline_output_list))
        })
      },
      handleParams(param) {
        for (let i = 0; i < CONSTANTS.baselineFirstConfirmStatus.length; i++) {
          if (param == CONSTANTS.baselineFirstConfirmStatus[i].value) {
            return CONSTANTS.baselineFirstConfirmStatus[i].label
          }
        }
      },
      changeSelect(id, status) {
        let seqStatus = this.getBaselineConfirmStatus(id)
        if (status == 2) {
          this.open(id, '').then((value) => {
            this.remarkBaseline({id: id, remark: value.value}).then(res => {
              if (res.errno === 0) {
                status = 2
              }
              this.changeBaselineConfirmStatus(id, 2, value.value)
            }).catch(res => {
              status = 0
              this.changeBaselineConfirmStatus(id, seqStatus)
            })
          })
        } else {
          this.changeBaselineConfirmStatus(id, status)
        }
        this.commitDisabled = false
      },
      changeSelectTemp() {
        for (let i = 0; i < this.baselineReqSubmitList.length; i++) {
              this.baselineReqSubmitList[i].baseline_first_confirm_status = this.tempStatus
        }
        for (let i = 0; i < this.baselineReqList.length; i++) {
          this.baselineReqList[i].baseline_first_confirm_status = this.tempStatus
        }
      },
      getBaselineConfirmStatus(id) {
        for (let i = 0; i < this.baselineReqSubmitList.length; i++) {
            if (id == this.baselineReqSubmitList[i].id) {
              return this.baselineReqSubmitList[i].baseline_first_confirm_status
            }
        }
      },
      changeBaselineConfirmStatus(id, status, remark) {
        for (let i = 0; i < this.baselineReqSubmitList.length; i++) {
            if (id == this.baselineReqSubmitList[i].id) {
              this.baselineReqSubmitList[i].baseline_first_confirm_status = status
            }
        }
        for (let i = 0; i < this.baselineReqList.length; i++) {
            if (id == this.baselineReqList[i].id) {
              this.baselineReqList[i].baseline_first_confirm_status = status
              if (remark) {
                this.baselineReqList[i].remark = remark
              }
            }
        }
      },
      async open(id, remark) {
        let seqStatus = this.getBaselineConfirmStatus(id)

        // 基线操作不需要状态弹框
        return await this.$prompt('', '请输入不需要原因', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: remark,
          inputType: 'textarea',
          customClass: 'remarkBox'
        }).catch(res => {
          this.commitDisabled = false
          this.changeBaselineConfirmStatus(id, seqStatus)
        })
      },
      throttleButton: throttle(function(func) {

        // console.log(func)
        let args = Array.from(arguments).slice(1);
        func.apply(this, args);
      }, 2200),
      submitBaselineRequirement() {
        let baselineFirstConfirmStatusList = []
        for (let i = 0; i < this.baselineReqSubmitList.length; i++) {
          baselineFirstConfirmStatusList.push(
              {
                'id': this.baselineReqSubmitList[i].id,
                'baseline_first_confirm_status': this.baselineReqSubmitList[i].baseline_first_confirm_status
              }
          )
          if (this.baselineReqSubmitList[i].baseline_first_confirm_status == 0) {
            this.commitDisabled = true
            return 0
          }
        }
        let queryParam = {
          'sdl_project_id': this.sdl_project_id,
          'baseline_first_confirm_status_list': baselineFirstConfirmStatusList
        }
        this.$alert('<i class="el-icon-warning"></i> &nbsp; 请继续提交以下的 评估材料 、 代码仓库 、 测试环境', '提示', {
          confirmButtonText: '确定',
          customClass: 'material-alert',
          dangerouslyUseHTMLString: true,
              type: 'warning'
        }).then(res => {
          document.getElementById('evaMaterial').scrollIntoView(true)
        });
        this.confirmBaselineReqList(queryParam).then(res => {
          this.$parent.getWorkFlow()
        })
      },
      openDialog() {
        this.dialogFormVisible = true
      },
      getFormVisible(val) {
        this.dialogFormVisible = val
      },
      arrayRemove(array, val) {
        let index = array.indexOf(val);
        if (index > -1) {
          array.splice(index, 1);
        }
      },
      rowClick(row, event, column) {
        if (this.expands.indexOf(row.id) < 0) {
          this.expands = []
          this.expands.push(row.id);
        } else {
          this.arrayRemove(this.expands, row.id);
        }
        Omega.trackEvent('sdl_dorado_baseline', {}).then((event) => {

            // console.log(event.getData());
        });
      },
      tableRowStyle({ row, rowIndex }) {
        return 'cursor: pointer;'
      },
      checkMethod(baselineNo) {
        let queryParam = {
          CTR_data: {
            sdl_project_id: parseInt(this.sdl_project_id),
            baseline_no: baselineNo,
            username: this.user.username
          },
          function_name: 'baseline_normalize'
        }
        this.baselineNewCTR(queryParam).then(res => {
        })

        Omega.trackEvent('sdl_dorado_baseline_checkmethod', {check_method: true}).then((event) => {
        });
      },
      deleteBaseline(no) {
        this.$confirm('此操作将删除该基线, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {id: no}
          this.deleteOutputBaseline(param).then(res => {
            this.fetchData()
          })
        }).catch(() => {
        });
      },
      handleMitigation(value) {

        // let reg = /(http):\/\/[-A-Za-z0-9+/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
        let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        let n = value.replace(reg, '<a href="$1$2" target="_blank" class="mitigation-link">$1$2</a>')
        console.log(n)
        return n
      }
    }
  })
</script>

<style lang="less">
  #baselineRequirement {
    padding-top: 40px;
    -webkit-font-smoothing: antialiased;
    .baselineRequirementTitle {
      color: #333333;
      font-size: 14px;
      display: inline-block;
      line-height: 28px;
    }
    .selectInput {
      width: 90px;
    }
    .lengthLimit {
      max-width: 350px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .table-expand {
      padding: 10px 20px;
    }
    .flex-box {
      display: flex;
      .items {
        flex-grow: 1;
        flex-basis: 25%
      }
      .items1 {
        flex-grow: 3
      }
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
    .submitButton {
      margin-top: 15px;
      .tip {
        color: red;
        font-size: 10px;
        margin-left: 20px;
      }
    }
    .closeIcon{
      color: #fc9153;
      position: relative;
      left: 13px;
    }
    .baseline-button {
      height: 32px;
      // width: 110px;
      width: 100px;
      padding: 0px;
      text-align: center;
      background: #fc9153;
      border-radius: 4px;
      border: none;
      // font-weight: 100;
      -webkit-font-smoothing: antialiased;
      // margin-left: -10px;
      span {
        font-size: 12px;
      }
    }
    .basicline-requirement-btn {
      background: white;
      color: #fc9153;
      position: relative;
      // bottom: 30px;
    }
    .basicline-requirement-btn:hover {
      background: #fff7f2;
    }
    .table-expand label {
      // color: #7e8fa7;
      color: #596385;
      font-size: 12.5px;
    }
    .checkMethod {
      text-decoration: underline;
      color: #fc9153;
    }
    .highlight{
      color: #fc9153;
    }
    .el-table__expand-icon > .el-icon{
      color: #fc9153;
    }
  }  
  .el-message-box__close{
      position: relative;
      top: -2px;
    }
  .remarkBox{
    .el-message-box__content {
        position: relative;
        padding: 0px 20px !important;
        color: #606266;
        font-size: 13px;
    }
    textarea{
        min-height: 80px !important;
    }
  }
.el-tooltip__popper {
      max-width: 150px !important;
}
.is-dark.el-tooltip__popper{
  max-width: 440px !important;
  // background: #f2f6fc  !important;
  // color: #333333;
  // border: 1px solid #ebeef5;
  // background-image: linear-gradient(90deg, #C2E9FB 0%, #A1C4FD 100%);
  // background-image: linear-gradient(135deg, #FCC687 0%, #F286A0 100%);
  .tooltip-button{
    float: right;
    height: 27px;
      font-size: 12px;
      width: 60px;
      padding: 0px;
      text-align: center;
      background: white;
      border-radius: 4px;
      -webkit-font-smoothing: antialiased;
      cursor: pointer;
  }
}
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  transition: opacity .5s;
}
 .bounce-leave-active /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.material-alert{
    .el-message-box__title{
      color: red;
    }
    .el-message-box__message{
      color: red;
    }
    .el-message-box__status:before {
      padding-left: 1px;
    }
    .el-icon-warning:before {
        content: "\e62e";
    }
}
.mitigation-link{
  text-decoration: underline;
  color: #fc9153 !important;
}
</style>