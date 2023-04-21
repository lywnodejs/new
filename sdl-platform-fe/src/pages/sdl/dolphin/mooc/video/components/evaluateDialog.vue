<template>
       <el-dialog id="evaluate-dialog"
                title="问卷调查"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :show-close="true"
               :visible.sync="dialogFormVisible"
                width="510px">
      
      <el-form :inline="true" label-width="100px" label-position="top"  :model="param" ref="param"  :rules='rules'>
        
        <el-form-item label="1. 根据本次安全教育视频的观看体验，您有多大可能推荐给您的同事？" prop="nps_evaluate">
          <div class="displayFloat">
            <div class="floatLeft">绝对不会推荐</div>
            <div class="floatRight">绝对推荐</div>
            <div class="clear"></div> 
          </div>
          <div class="nps-box" >
            <div class="nps-item" :class="listStyle[index]" 
                  @mouseenter='mouseover(index)'
                  @mouseleave="mouseover(param.nps_evaluate)"
                  @click="confirmLevel(index)" v-for="(i,index) in 11"  
                  :key="index">{{index}}
            </div>
          </div>
          <span v-show="!flag && param.nps_evaluate===null" class="flag-info"><i class="el-icon-warning"></i> 此项未填，请填写完整</span>
        </el-form-item>
        <el-form-item v-show="param.nps_evaluate < 9 && param.nps_evaluate >= 0 && param.nps_evaluate!=null" label="2. 请问您觉得安全教育视频在以下哪些方面做出改善，您会愿意给出更高分数？" prop="improve_suggest">
          <el-checkbox-group style='margin-left:20px;' v-model="param.improve_suggest">
            <el-checkbox label="内容更易理解"></el-checkbox><br>
            <el-checkbox label="时间更简短"></el-checkbox><br>
            <el-checkbox label="观看体验更好"></el-checkbox><br>
            <el-checkbox label="对工作帮助更大"></el-checkbox>
          </el-checkbox-group>
          <span v-show="!flag && param.improve_suggest.length==0" class="flag-info1"><i class="el-icon-warning"></i> 此项未填，请填写完整</span>
        </el-form-item>
        <el-form-item  v-show="param.nps_evaluate >= 9" :label="'2. 请问您刚才给出 ' + param.nps_evaluate + ' 分的主要原因是？'" prop="improve_suggest">
          <el-checkbox-group  style='margin-left:20px;' v-model="param.improve_suggest">
            <!-- <el-checkbox v-for="(item, index) in data" :key="index" label="体验好（如平台操作很方便）"></el-checkbox><br> -->
            <el-checkbox label="讲述专业、逻辑清晰"></el-checkbox><br>
            <el-checkbox label="观看体验好"></el-checkbox><br>
            <el-checkbox label="对实际工作有帮助"></el-checkbox>
          </el-checkbox-group>
          <span v-show="!flag && param.improve_suggest.length==0" class="flag-info1"><i class="el-icon-warning"></i> 此项未填，请填写完整</span>
        </el-form-item>
        <el-form-item label="3. 关于安全教育视频，如果您还有其他意见或建议，欢迎您的反馈:" prop="description">
            <el-input
            type="textarea" class="inputWidth"
            :autosize="{ minRows: 3, maxRows: 5}"
            v-model="param.description"
            auto-complete="off"
            placeholder="其他需要改善的地方或您认为做的好的地方">
            </el-input>
        </el-form-item>
        <!-- <ul class="StarsWrap">
            <li v-for="(i,index) in list" :key="index" @click="clickStars(index)">
            <i class="myIcon iconfont" :class="xing>index?'icon-xingxing-fill': 'icon-xingxing'"></i>
            </li>
            <p>{{rateScoreText}}</p>
        </ul> -->
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button class="evaluate-button" @click="dialogFormVisible = false">取消</el-button> -->
        <el-button class="evaluate-btn" type="primary" @click="validateProblemInfo('param')">提交</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
    user: 'user/user'
  }
}, {
    newQuestionnaire: 'dolphin_mooc/newQuestionnaire'
})({
  props: ['dialogVisible'],
  data() {
    return {
        dialogFormVisible: false,
        param: {
          video_id: parseInt(this.$route.query['video_id']),
          nps_evaluate: null,
          improve_suggest: [],
          description: '',
          creator: ''
        },
        flag: 1,
        listStyle: ['off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off'],
        list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        rules: {
          nps_evaluate: [{required: true, message: '请选择', trigger: 'change'}],
          improve_suggest: [{type: 'array', required: true, message: '请选择', trigger: 'change'}]
        },
        data: [{label: '体验好（如平台操作很方便）', value: '体验好'}]
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
      console.log(val)
      this.dialogFormVisible = val
    },
    dialogFormVisible(val) {
        this.$emit('evaluate', this.dialogFormVisible)
    },
    'param.nps_evaluate': {
      handler(val) {
        this.param.improve_suggest = []
      }
    }
  },
  methods: {
      createProject() {
          this.dialogFormVisible = false
          let queryParam = {
              data: this.param,
              source: 2
          }
          queryParam.data.creator = this.user.username
          this.newQuestionnaire(queryParam).then(res => {
              console.log(res)
          })

        //   this.$parent.fetchData()
      },
      validateProblemInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.createProject()
          } else {
              this.flag = 0
            console.log('error submit!!');
            return false;
          }
        });
      },
      validate(project, rules) {
        for (let name in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, name)) {
                if (project[name] != '') {
                this.confirm = true
                } else {
                this.confirm = false
                return alert('请填写' + name)
                }
            }
        }
      },
      mouseover(index) {
        this.listStyle = []
        let temp = index
        if (index === null) {
          temp = -1
        }
        for (let i = 0; i <= 11; i++) {
          if (i <= temp) {
            this.listStyle.push('on')
          } else {
            this.listStyle.push('off')
          }
        }
      },
      confirmLevel(index) {
        this.param.nps_evaluate = index
        this.listStyle = []
        for (let i = 0; i <= 11; i++) {
          if (i <= this.param.nps_evaluate) {
            this.listStyle.push('on')
          } else {
            this.listStyle.push('off')
          }
        }
      },
      clickStars(i, val) {
        this.param[val] = i + 1
      },
      judgeZiduan(i) {
          if (i < 0) {
              return '请填写'
          }
          return this.rateScoreDesc[i - 1]
      },
      judgeClass(param, index) {
        if (param === 'validate') {
            return 'icon-xingxing redIcon'
        }
        return param > index ? 'icon-xingxing-fill' : 'icon-xingxing'
      }
  }
})
</script>
<style lang="less">
#evaluate-dialog{
  .evaluate-button {
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    line-height: 10px;
    font-size: 13px;
  }

  .evaluate-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    line-height: 10px;
    font-size: 13px;
    border: none;
    margin-right: 5px;
  }

  .evaluate-btn.search-btn {
    margin-left: 15px;
    width: 95px;
  }

  .inputWidth {
    width: 465px;
  }
  .displayFloat {
    // height: 20px;;
    font-size: .24rem;
    margin-top: 10px;
    color: #6e707c;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    line-height: .24rem;
    margin-bottom: .24rem;
    .floatLeft{
      float: left;
    }
    .floatRight{
      float: right;
    }
    .clear{
      clear:both;
    }
  }
  .nps-box{
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
    .nps-item{
      flex: 1;
      // border: 1px solid black;
      margin-right: 5px;
      cursor: pointer;
      height: 20px;
      width: 30px;
      font-size: .28rem;
      line-height: 20px;
      font-weight: 600;
      text-align: center;
      color: #fff;
      border-radius: 2px;
    }
    .nps-item:last-child {
        margin-right: 0px;
    }
    .off {
      background-color: #e3e4e8;
    }
    .on{
      background-color: #FC9153;
    }
  }
  .flag-info{
    color: red;
    position: absolute;
    margin-bottom: -10px;
    top: 35px;
  }
  .flag-info1{
    color: red;
    position: absolute;
    margin-bottom: -10px;
    top: 95px;
  }
  .StarsWrap{
    width: 100%;
    height: 0.2rem;
    margin: 0.1rem 0;
    position: relative;
    li{
      float: left;
      margin-right: 0.1rem;
    }
  }
   .myIcon {
      color: #FC9153;
      font-size: 20px;
      cursor: pointer;
      margin-right: 20px;
    }
    .redIcon{
        color: red;
    }
    .inputWarning{
        position: absolute;
        left: 0px;
        top: 22px;
        width: 80px;
        font-size: 11px;
        color: red;
    }
  .el-form-item__label{
    font-weight: bold;
  }
}
</style>
