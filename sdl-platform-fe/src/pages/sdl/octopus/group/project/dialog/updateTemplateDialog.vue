<template>
       <el-dialog id="update-octopus-group-project-template-dialog"
                title="编辑模板"
               :visible.sync="dialogFormVisible"
                width="1150px">
      <el-form :inline="true" label-width="70px" label-position="left" >
        <div class="title">扫描流量筛选</div>
        <el-form-item label="HOST">
              <div v-for="(item, index) in hostArray" :key="index">
                  <el-input class="inputWidth"
                            :class="index==0?'':'mutileInput'"
                            v-model="item.value"
                            placeholder="请输入HOST"
                            clearable>
                  </el-input>
                <i v-if="hostArray.length==index+1" class="myIcon el-icon-circle-plus-outline"
                  @click=addProperty(1)></i>
                <i v-if="hostArray.length>index+1" class="myIcon el-icon-remove-outline"
                  @click=subProperty(1,index)></i>
              </div>
        </el-form-item>
        <el-form-item label="URL关键字"  label-position="right" style="margin-left: 25px;">
              <div v-for="(item, index) in uriArray" :key="index">
                  <el-input class="inputWidth"
                            :class="index==0?'':'mutileInput'"
                            v-model="item.value"
                            placeholder="请输入URL关键字"
                            clearable>
                  </el-input>
                <i v-if="uriArray.length==index+1" class="myIcon el-icon-circle-plus-outline"
                  @click=addProperty(2)></i>
                <i v-if="uriArray.length>index+1" class="myIcon el-icon-remove-outline"
                  @click=subProperty(2,index)></i>
              </div>
        </el-form-item>
        <el-form-item label="起止时间"  label-width="70px"  label-position="left" style="margin-left: 20px;">
                <el-date-picker
                class="dataPicker"
                @change="changeTime(time)"
                    v-model="time"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
        </el-form-item>
        <!-- <el-button class="octopus-diaolog-btn" type="primary" @click="updataFilter">筛选</el-button> -->
      </el-form>
      <el-table 
        v-show="resultGroupFilter.length!=0"
        :data="resultGroupFilter"
        max-height="280px"
        style="width: 100%;max-height: 200px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand" label-width="90px">
                <el-form-item label="query">
                    <span>{{ props.row.query }}</span>
                </el-form-item>
                <el-form-item label="请求体">
                    <span>{{ props.row.request_body }}</span>
                </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
        label="域名"
        prop="Host">
        </el-table-column>
        <el-table-column
        label="接口"
        prop="cgi">
        </el-table-column>
        <el-table-column
        label="方法"
        width="100"
        prop="method">
        </el-table-column>
    </el-table>
    <div  v-show="resultGroupFilter.length!=0">
        <div class="cutLine"></div>
    <div class="title">身份认证参数标注</div>
    <el-card
     :body-style="{ padding: '0px' }" shadow="never" class="box-card">
       <!-- <div slot="header" class="clearfix">
          <span>参数组</span>
          
        </div> -->
        <div  class="body"  
          v-for="(item,index) in updateLocator" :key="index"
          :class="index==0?'':'elCardBorder'">
          <el-button v-show="updateLocator.length!==1" style="float: right; padding: 3px 0" type="text" @click="subNewList(index)"><i class="el-icon-close myCloseIcon"></i></el-button>
          <el-tag class="myTag"
            type="info"
            :key="index"
            v-for="(tag,index) in item"
            closable
            :disable-transitions="false"
            @close="handleClose(tag, item)">
                {{handleTag(tag.key) + ':' + tag.value}}
          </el-tag>
          <span v-if="judgeVisible(index)" class="inlineBlock">
          <el-select v-model="tempUpdateLocator.key" placeholder="请选择认证参数位置"  class="inputWidth1">
              <el-option
              v-for="(item, index) in keyArray"
              :key="index"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>&nbsp;:
          <el-input @keyup.enter.native="handleInputConfirm(item, index)"
        
            @blur="handleInputConfirm(item,index)"
            :ref="'saveTagInput' + index"
             v-model="tempUpdateLocator.value" placeholder="请输入认证参数字段名" class="inputWidth1"></el-input>
        </span>
        <el-button v-else class="button-new-tag" size="small" @click="showInput(item, index)">+ 新增认证参数</el-button>
        
        </div>
    </el-card>
     <el-button  type="text" @click="addNewList" class="newListButton">+ 新增认证参数组</el-button>
         <!-- <el-button  type="text" @click="updateTemplate">上传</el-button> -->
      
    </div>
    <span slot="footer" class="dialog-footer"  v-show="resultGroupFilter.length!=0">
        <el-button  class="octopus-diaolog-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button  class="octopus-diaolog-btn" type="primary" @click="updateTemplate">保存</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    updateGroupFilter: 'octopus_group/updateGroupFilter',
    getStatusGroupFilter: 'octopus_group/getStatusGroupFilter',
    getResultGroupFilter: 'octopus_group/getResultGroupFilter',
    updateTemplateLocator: 'octopus_group/updateTemplateLocator',
    reloadTemplateGroup: 'octopus_group/reloadTemplateGroup',
    saveTemplateGroup: 'octopus_group/saveTemplateGroup',
    getTemplateByProjectId: 'octopus_group/getTemplateByProjectId'
})({
  props: ['dialogUpdateVisible', 'octopusId', 'data'],
  data() {
    return {
        octopus_group_project_id: parseInt(this.octopusId),
        dialogFormVisible: null,
        loading: true,
        sessionId: null,
        scopeRow: this.data,
        time: '',
        hostArray: [{value: '10.96.98.96:8030'}],
        uriArray: [{value: 'sdffsadfasfdasa'}],
        resultGroupFilter: [],
        params: {
            host: [],
            uri_black_word: '',
            start_time: '',
            end_time: ''
        },
        locator_json_dict: [],
        filter_json_dict: [],
        keyArray: [{value: 'QUERY', label: 'Query'}, {value: 'HEADER', label: 'Header'}, {value: 'BODY', label: 'Body'}],
        updateLocator: [[]],
        tempUpdateLocator: {key: '', value: ''},
        inputVisible: false
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogUpdateVisible(val) {
        this.dialogFormVisible = val
        this.scopeRow = this.data
        if (val) {
            this.valueVariable()
            this.reloadTemplate()
        }
    },
    dialogFormVisible(val) {
        this.$emit('projectUpdateDialog', this.dialogFormVisible)
    }
  },
  methods: {
      valueVariable() {
        this.sessionId = this.scopeRow.session_id
        this.time = [this.scopeRow.filter.start_time, this.scopeRow.filter.end_time]
        this.hostArray = []
        this.uriArray = []
        this.scopeRow.filter.host.forEach(item => {
            this.hostArray.push({value: item})
        })
        this.scopeRow.filter.uri_black_word.split(',').forEach(item => {
            this.uriArray.push({value: item})
        })
        this.updataFilter()
        this.params = this.scopeRow.filter
        this.updateLocator = []
        this.scopeRow.locator.forEach(item => {
            let temp = []
            item.forEach(i => {
                temp.push({key: Object.keys(i), value: i[Object.keys(i)]})
            })
            this.updateLocator.push(temp)
        })
      },
      changeTime(time) {
        this.params.start_time = time[0]
        this.params.end_time = time[1]
      },
      updataFilter() {
          this.params.host = []
          this.params.uri_black_word = []
          let temp = []
          this.hostArray.forEach(element => {
              this.params.host.push(element.value)
          });
          this.uriArray.forEach(element => {
              temp.push(element.value)
          });
          this.params.uri_black_word = temp.join(',')
          let queryParam = {
              session_id: this.sessionId,
              filter_json_dict: this.params
          }
          this.updateGroupFilter(queryParam).then(res => {
              if (res.errno === 0) {
                this.openFullScreen()
              }
          })
      },
      reloadTemplate() {
          this.reloadTemplateGroup({session_id: this.sessionId}).then(res => {})
      },
      openFullScreen() {
        const loading = this.$loading({
          lock: true,
          fullscreen: false,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          target: document.querySelectorAll('.el-dialog')[1]
        });
        let send = setInterval(() => {
            this.getStatusGroupFilter({session_id: this.sessionId}).then(res => {
              if (res.errno != 0) {
                window.clearInterval(send)
                loading.close();
              }
                if (res.data == 'DONE') {
                    this.getResultFilter()
                    loading.close();
                    window.clearInterval(send)
                }
            })
        }, 1000);
      },
      getResultFilter() {
          this.resultGroupFilter = []
          this.getResultGroupFilter({session_id: this.sessionId}).then(res => {
              this.resultGroupFilter = res.data
          })
      },
      updateTemplate() {
        let params = {session_id: this.sessionId, locator_json_dict: []}
        this.updateLocator.forEach(element => {
          if (element.length !== 0) {
            let temp = []
            element.forEach(i => {
              let obj = {}
              obj[i.key] = i.value
              temp.push(obj)
            })
            params.locator_json_dict.push(temp)
            this.locator_json_dict = params.locator_json_dict
          }
        });
        this.updateTemplateLocator(params).then(res => {
          if (res.errno == 0) {
            this.saveTemplate()
          }
        })
      },
      saveTemplate() {
        let queryParam = {
          octopus_group_project_id: this.octopus_group_project_id,
          session_id: this.sessionId,
          filter_json_dict: this.params,
          locator_json_dict: this.locator_json_dict
        }
        this.saveTemplateGroup(queryParam).then(res => {
          this.getTemplate()
        })
        this.initialVariable()
        this.dialogFormVisible = false
      },
      getTemplate() {
        this.$parent.getTemplate()
      },
      initialVariable() {
        this.resultGroupFilter = []
        this.params = {
            host: [],
            uri_black_word: '',
            start_time: '',
            end_time: ''
        }
        this.locator_json_dict = []
        this.filter_json_dict = []
        this.updateLocator = [[]]
        this.tempUpdateLocator = {key: '', value: ''}
        this.time = ''
        this.hostArray = [{value: 'sdl.xiaojukeji.com'}]
        this.uriArray = [{value: 'sdffsadfasfdasa'}]
      },
      addProperty(type) {
        if (type === 1) {
          this.hostArray.push({value: ''})
        } else if (type === 2) {
          this.uriArray.push({value: ''})
        }
      },
      subProperty(type, index) {
        if (type === 1) {
          this.hostArray.splice(index, 1)
        } else if (type === 2) {
          this.uriArray.splice(index, 1)
        }
      },
      handleClose(tag, item) {
        item.splice(item.indexOf(tag), 1);
      },
      judgeVisible(index) {
        if (index == this.inputVisible) return true;
      },
      showInput(item, index) {
        this.inputVisible = index;

        // this.$nextTick(_ => {
        //   this.$refs['saveTagInput' + index].input.focus();
        // });
      },
      handleTag(keyTag) {
          for (let index = 0; index < this.keyArray.length; index++) {
              if (this.keyArray[index].value == keyTag) {
                  return this.keyArray[index].label
              }
          }
      },
      handleInputConfirm(item) {
        let inputValue = this.tempUpdateLocator;
        if (inputValue.value && inputValue.key) {
          item.push(inputValue);
          this.inputVisible = -1;
        }
        this.tempUpdateLocator = {key: '', value: ''};
      },
      addNewList() {
        this.updateLocator.push([])
      },
      subNewList(index) {
        this.updateLocator.splice(index, 1)
      }
  }
})
</script>
<style lang="less">
#update-octopus-group-project-template-dialog{
    .title{
        font-weight: bold;
        margin-bottom: 15px;
    }
    .box-card{
        margin-top: 10px;
    }
    .myTag{
        margin-bottom: 10px;
        margin-right: 15px;
    }
    .myCloseIcon{
      font-size: 14px;
      position: relative;
      top: -20px;
      right: -18px;
    }
    .table-expand {
      padding: 6px 20px;
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
    .table-expand label {
      // color: #7e8fa7;
      color: #596385;
      font-size: 12.5px;
    }

    .inputWidth {
      width: 200px;
    }
    .inputWidth1{
        width: 180px;
    }
    .mutileInput{
        margin-top: 7px;
    }
    .myIcon {
      color: #FC9153;
      font-size: 16px;
      cursor: pointer;
      position: relative;
      top: 2px;
      left: 7px;
    }
    .myIcon:hover {
      top: 1.5px;
    }
    .dataPicker{
        width: 407px;
    }
    .el-card__header{
      padding: 10px 20px;
    }
    .elCardBorder{
      border-top: 1px solid #e2e2e2;
    }
  .bottom {
    line-height: 12px;
    padding: 5px 20px;
  }
  .body{
    line-height: 12px;
    padding: 20px;
  }
  .button {
    padding: 0;
    float: right;
  }
  .inlineBlock{
    display: inline-block;
  }
  .image {
    width: 100%;
    display: block;
  }
  .cutLine {
    // border: 1px solid
    // margin-top: 20px;
    margin-bottom: 17px;
    width: 100%;
    // border-top: 1px solid rgba(0, 0, 0, 0.10);
    // background: rgba(0, 0, 0, 0.10);
    // border-rad
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  .newListButton{
    // text-decoration: underline;
  }
  .button-new-tag{
    margin-left: 0px;
  }
  .octopus-diaolog-button {
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    line-height: 10px;
    font-size: 13px;
  }

  .octopus-diaolog-btn {
    float: right;
    background: #FC9153;
    border-radius: 4px;
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    line-height: 10px;
    font-size: 13px;
    border: none;
  }
  .octopus-diaolog-btn.search-btn {
    margin-left: 15px;
    width: 95px;
  }
  .follower {
    -webkit-font-smoothing: antialiased;
    padding-top: 40px;
    .followerTitle {
      color: #333333;
      font-size: 14px;
    }
    .followTag {
      .tag {
        margin-top: 10px;
        border: none;
        color: #fc9153;
        background: white;
        font-size: 12px;
        span{
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
    span {
      // font-weight: bold;
    }
    .inputFollow {
      margin-top: 10px;
      width: 100%;
    }
    .follower-btn {
      height: 32px;
      width: 100px;
      text-align: center;
      padding: 5px;
      border: 1px solid #fc9153;
      background: #fc9153;
      border-radius: 4px;
      // font-weight: 100;
      color: white;
      cursor: pointer;
      margin-top: 15px;
      font-size: 12px;
    }
  }
}
</style>