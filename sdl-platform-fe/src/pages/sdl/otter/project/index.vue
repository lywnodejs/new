<template>
    <div id="projectList">
      
    <div class="el-main">
      <el-form class="searchForm" label-position="left" :inline='true' label-width="80px" >
        <div class="displayFlex">
          <el-form-item label="创建时间:" prop="name">
            <el-date-picker class="searchInput dataHeight"
              v-model="createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Git 路径:" style="margin-left:30px" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入Git路径"
                      v-model="queryParam.keywords.git_url"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="检测时间:" style="margin-left:30px" prop="name">
            <el-date-picker class="searchInput dataHeight"
              v-model="detectionTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="所属部门:" prop="name">
            <app-department class="searchInput" v-model="queryParam.keywords.dept_id"></app-department>
          </el-form-item>
          <el-form-item label="语言:" style="margin-left:30px" prop="name">
            <el-select v-model="queryParam.keywords.language" placeholder="请选择语言" class="searchInput" clearable>
                  <el-option v-for="item in languages" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- <el-input class="searchInput"
                      clearable
                      placeholder="请输入语言"
                      v-model="queryParam.keywords.language"
                      auto-complete="off">
            </el-input> -->
          </el-form-item>
        </div>
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='project-button' @click="fetchData()"><span>搜&nbsp;索</span>
              </button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="cutLine"></div>
       
      <!-- 展示数据 -->
      <el-table
        :data="otterList"
        v-loading>
        <el-table-column
          prop="otter_project_id"
          label="ID"
          width="70"
          align="center">
        </el-table-column>
        <el-table-column
            prop="git_url"
            label="Git路径"
            min-width="200"
            align="center">
            <template slot-scope="scope">
              <a class="aLink" @click="gitHandle(scope.row.git_url, 'link')">{{gitHandle(scope.row.git_url, 'url')}}</a>
            </template>
        </el-table-column>
        <el-table-column
          prop="git_branch"
          label="代码分支"
          min-width="100"
          align="center">
        </el-table-column>
        <el-table-column
          label="所属部门名称"
          min-width="200"
          align="center">
          <template slot-scope="scope">{{scope.row.dept_name}}
          </template>
        </el-table-column>
        <el-table-column
          label="最后检测时间"
          width="105"
          align="center">
          <template slot-scope="scope"><span v-html="timeOper(scope.row.last_check_time)"></span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
              <router-link style="color:#FC9153" :to="{ path : '/sdl/otter/project/detail', query: {otter_project_id: scope.row.otter_project_id}}" target=_blank>
              查看详情
              </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div align="right" style="margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParam.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="queryParam.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="num">
        </el-pagination>
      </div>
    </div>
    

    </div>
</template>
<script>
import {connect} from '@/lib'
import * as CONSTANTS from '@/commons/otter'
import addFollower from '../../../../components/addFollower/index'
import appDepartment from '../components/department'

  export default connect(() => {
    return {
      otterList: 'otter/otterList',
      num: 'otter/otterListLength'
    }
  }, {
    getOtterList: 'otter/getOtterList'
  })({
    data() {
        return {
            createTime: [],
            detectionTime: [],
            languages: CONSTANTS.language,
            queryParam: {
                page: 1,
                limit: 10,
                keywords: {
                    create_begin_time: '',
                    create_end_time: '',
                    git_url: '',
                    dept_id: '',
                    check_begin_time: '',
                    check_end_time: '',
                    language: ''
                }
            }
        }
    },
    components: { addFollower, appDepartment },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        if (this.createTime) {
          this.queryParam.keywords.create_begin_time = this.createTime[0]
          this.queryParam.keywords.create_end_time = this.createTime[1]
        } else {
          this.queryParam.keywords.create_begin_time = ''
          this.queryParam.keywords.create_end_time = ''
        }
        if (this.detectionTime) {
          this.queryParam.keywords.check_begin_time = this.detectionTime[0]
          this.queryParam.keywords.check_end_time = this.detectionTime[1]
        } else {
          this.queryParam.keywords.check_begin_time = ''
          this.queryParam.keywords.check_end_time = ''
        }
        this.getOtterList(this.queryParam).then(response => {
        })
      },
      timeOper(time) {
        let arr = time.split(' ')
        return `${arr[0]}<br>${arr[1]}`
      },
      gitHandle(url, name) {
        let arr = url.split(':')
        if (name == 'url') {
          return arr[1]
        }
        if (name == 'link') {
          let myUrl = 'https://git.xiaojukeji.com/' + arr[1]
          window.open(myUrl)
        }
      },
        handleSizeChange(val) {
            this.queryParam.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParam.page = val
            this.fetchData()
        }
    }
})
</script>
<style lang="less">
  #projectList {
        width: 100%;
        height: 100%;
        background: #ffffff;
        // margin-top: -15px;
        box-sizing: border-box;
        .el-main {
            width: 100%;
            background: white;
            .displayFlex {
                display: flex;
            }
            .searchForm {
                .searchInput {
                width: 230px;
                }
            }
            .dataHeight{
              position: relative;
              // top: 3px;
            }
            .aLink{
              color: #FC9153;
            }
        }
    .project-button {
      background: #FC9153;
      border-radius: 4px;
      width: 95px;
      height: 32px;
      border: none;
      color: white;
      margin-top: 5px;
      margin-left: 80px;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
      cursor: pointer;
      span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
      }
    }
    .cutLine {
      // border: 1px solid
      margin-top: 5px;
      margin-bottom: 17px;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.10);
      // background: rgba(0, 0, 0, 0.10);
      // border-radius
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
      // border-color: yellow;
    }
  }

</style>

