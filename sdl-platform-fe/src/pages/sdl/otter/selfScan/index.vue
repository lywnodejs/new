<template>
  <div id="self_scan">
    <div class="el-main">
      <el-form
        class="searchForm"
        label-position="left"
        label-width="90px"
        :inline="true"
      >
        <el-row>
          <el-form-item label="语言:">
            <el-select
              name="language"
              v-model="formData.language"
              :clearable="true"
              placeholder="请选择语言"
              @change="languageChange"
            >
              <el-option
                v-for="item in languages"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="规则ID:">
            <el-select
              class="self_scan_select"
              name="language"
              v-model="formData.rule_id_list"
              @change="lrule_id_listChange"
              multiple
              collapse-tags
              :clearable="true"
              :filterable="true"
              placeholder="请选择规则ID"
            >
              <el-option
                v-for="item in cobraList"
                :key="item.id"
                :label="item.rule_id + '——' +item.rule_name"
                :value="item.rule_id"
              >
              </el-option>
            </el-select>
            <el-checkbox v-model="allselect" style="margin-left: 20px;" @change="allSelectFun">全选</el-checkbox>
          </el-form-item>
        </el-row>
        <el-row v-if="formData.language === 'Java'">
          <el-form-item label="被扫描对象:">
            <el-radio @change="typeChange" v-model="formData.type" :label="0">Git</el-radio>
            <el-radio @change="typeChange" v-model="formData.type" :label="1">jar包</el-radio>
          </el-form-item>
        </el-row>
        <el-row v-show="formData.language === 'Java' && formData.type===1">
          <el-form-item label="上传jar包:">
            <el-upload
              class="scan-upload"
              action="/api/otter/self/scan"
              ref="upload"
              :multiple="false"
              name="file"
              :data="formData"
              :limit="1"
              :auto-upload="false"
              :on-change="fileChange"
              :on-remove="removeFile"
              :on-success="fileSuccess"
              :file-list="fileList"
            >
              <el-button v-show="fileList.length === 0" size="mini" type="primary">点击添加</el-button>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row v-show="(formData.language === 'Java' && formData.type===0) || formData.language === 'Golang'">
          <el-form-item label="Git地址:">
            <el-input
              style="width: 300px;"
              v-model="formData.git_url"
              placeholder="SSH形式，如 git@git.xiaojikeju.com:group/dem"
            >
            </el-input>
          </el-form-item>
          <el-form-item style="margin-left:30px" label="分支:">
            <el-input
              style="width: 200px;"
              v-model="formData.git_branch"
              placeholder="Git仓库分支，默认master"
            >
            </el-input>
          </el-form-item>
          <el-form-item style="margin-left:30px" label="相对路径:">
            <el-select
              style="width: 280px;"
              name="language"
              v-model="formData.relative_path"
              :clearable="true"
              placeholder="代码相对路径以'/'开头，默认为根目录"
            >
              <el-option value="./" label="./"></el-option>
            </el-select>
<!--            <el-input v-model="formData.relative_path"></el-input>-->
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="2">
            <el-form-item>
              <el-button :loading="scanIng" class="goscan" size="medium" type="primary" @click="goScan()">开始扫描</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="row">
        <div class="cutLine"></div>
        <!-- 展示数据 -->
        <app-table
          url="/otter/self/task/list"
          methods="POST">
          <el-table-column
            prop="git_url"
            label="Git地址"
            align="center">
          </el-table-column>
          <el-table-column
            prop="git_branch"
            label="分支"
            min-width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="git_relative_path"
            label="相对路径"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="jar_md5"
            label="jar包md5"
            width="105"
            align="center">
          </el-table-column>
          <el-table-column
            prop="jar_name"
            label="jar包name"
            width="105"
            align="center">
          </el-table-column>
          <el-table-column
            prop="language"
            label="压缩包语言"
            width="105"
            align="center">
          </el-table-column>
          <el-table-column
            prop="rule_id"
            label="扫描规则id"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="任务状态"
            width="200"
            align="center"
            :formatter="fmtStatus"
            >
          </el-table-column>
          <el-table-column
            prop="task_create_time"
            label="创建时间"
            width="100"
            align="center">
          </el-table-column>         
          <el-table-column
            align="center"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <router-link style="color:#FC9153" :to="{ path : '/sdl/otter/selfScan/detail', query: {id: scope.row.fatbird_task_id}}" target=_blank>
                查看
              </router-link>
            </template>
          </el-table-column>
        </app-table>
      </div>
    </div>
  </div>
</template>
<script>
import { connect } from '@/lib'
import { language } from '@/commons/autoscan'
// eslint-disable-next-line camelcase
import { STSTUS_OPTIONSCopy } from '@/commons/otter'

export default connect(() => {
  return {
    cobraList: 'dolphin_baseline_relation/fatbirdList',
    selfScan: 'self_scan/selfScan'
  }
}, {
  getFatbirdList: 'dolphin_baseline_relation/getFatbirdList',
  setSelfScan: 'self_scan/setSelfScan'
})({
  data() {
    return {
      formData: {
        language: '',
        relative_path: '',
        type: 0,
        git_url: '',
        git_branch: '',
        rule_id_list: ''
      },
      fileList: [],
      rule_id_lists: [], // 规则id
      languages: language,
      scanIng: false,
      allselect: false
    }
  },
  created() {
    this.gatRuleIdList();
  },
  methods: {

    // 格式化任务状态
    fmtStatus(row, column, cellValue, index) {
      console.log(STSTUS_OPTIONSCopy[cellValue])
      return STSTUS_OPTIONSCopy[cellValue] || '--'
    },

    // 语言变化方法
    languageChange() {
      this.formData.relative_path = '';
      this.formData.type = 0;
      this.formData.git_branch = '';
      this.formData.git_url = '';
      this.formData.rule_id_list = [];
      this.fileList = [];

      this.allselect = false;
      this.gatRuleIdList();
    },

    // 被扫描对象改变事件
    typeChange() {
      this.formData.relative_path = '';
      this.formData.git_branch = '';
      this.formData.git_url = '';
      this.fileList = [];
    },

    // 添加文件时的勾子
    fileChange(file) {
      if (!(file && file.raw && file.raw.type === 'application/java-archive')) {
        this.$message.error('文件上传格式错误~');
        this.fileList = [];
      } else {
        if (file && file.raw) {
          this.fileList = [file];
        }
      }
    },

    // 删除文件时的勾子
    removeFile() {
      this.fileList = [];
    },

    // 获取rule_id
    gatRuleIdList() {
      let queryParam = {
        keywords: {
          language: this.formData.language
        },
        page: 1,
        limit: 1000
      }
      this.getFatbirdList(queryParam)
    },

    // 文件上传成功
    fileSuccess(response) {
      this.scanIng = false;
      if (response.errno === 0) {
        this.$message.success('扫描完成');
        this.resetForm();
      } else {
        this.$message.success(response && response.errmsg)
      }
    },

    // 全选操作
    allSelectFun(val) {
      if (val) {
        let selectList = []
        this.cobraList.map(item => {
          selectList.push(item.rule_id)
        })
        this.formData.rule_id_list = selectList;
      } else {
        this.formData.rule_id_list = [];
      }
    },
    lrule_id_listChange() {
      this.allselect = this.formData.rule_id_list.length === this.cobraList.length;
    },

    // 表单重置
    resetForm() {
      this.formData = {
        language: '',
        relative_path: '',
        type: 0,
        git_url: '',
        git_branch: '',
        rule_id_list: []
      };
      this.fileList = [];
      this.allselect = false;
    },

    // 开始扫描
    goScan() {
      if (this.formData.rule_id_list.length === 0) {
        this.$message.error('请选择规则ID');
        return false;
      }
      if (this.formData.type === 1) { // 选择文件扫描
        if (this.fileList.length === 0) {
          this.$message.error('请选择扫描文件');
          return false;
        }
        this.$refs.upload.submit();
        this.scanIng = true;
      } else { // 选择Git地址扫描
        if (this.formData.git_url === '') {
          this.$message.error('请填写Git地址');
          return false;
        }
        let formData = new FormData();
        if (this.formData.git_branch === '') { // 添加默认值
          formData.append('git_branch', 'master');
        } else {
          formData.append('git_branch', this.formData.git_branch);
        }
        if (this.formData.relative_path === '') { // 添加默认值
          formData.append('relative_path', './');
        } else {
          formData.append('relative_path', this.formData.relative_path);
        }
        formData.append('git_url', this.formData.git_url);
        formData.append('type', 0);
        formData.append('rule_id_list', this.formData.rule_id_list.join(','));
        formData.append('language', this.formData.language);
        this.scanIng = true;
        this.setSelfScan(formData).then(() => {
          this.$message.success('扫描完成');
          this.resetForm();
          this.scanIng = false;
        }).catch(() => {
          this.scanIng = false;
        })
      }

    }
  }
})
</script>
<style lang="less">
#self_scan {
  margin: auto;
  width: 100%;
  height: 100%;
  background: white;
  // margin-top: -15px;
  box-sizing: border-box;
  .goscan{
    margin: 20px 0;
  }

  .self_scan_select{
    width: 800px;
  }
  .el-main {
    width: 100%;
    box-sizing: border-box;
    background: white;
  }
  .scan-upload{
    .el-upload--text{
      float: right;
    }
    .el-upload-list{
      float: left;
      margin-right: 10px;
      .el-upload-list__item{
        margin: 0;
        line-height: 32px;
      }
      .el-upload-list__item .el-icon-close{
        top: 10px;
      }
    }
  }
}
.cutLine {
  // border: 1px solid
  margin-top: 5px;
  margin-bottom: 17px;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  // background: rgba(0, 0, 0, 0.10);
  // border-radius: 4px;
}
.el-select-dropdown__item{
  //max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

