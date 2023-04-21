<template>
    <div id="vulList">
      
    <div class="el-main">
      <el-form class="searchForm" label-position="left" label-width="90px" :inline='true'>
        <div class="displayFlex">
          <el-form-item label="漏洞状态:" prop="name">
            <!-- <el-input class="searchInput"
                      clearable
                      placeholder="请输入漏洞状态"
                      
                      auto-complete="off">
            </el-input> -->
            <el-select v-model="queryParam.keywords.vul_status" placeholder="请选择漏洞状态" class="searchInput" clearable>
                    <el-option v-for="item in this.vulStatus" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门名称:" style="margin-left:30px" prop="name">
            <app-department class="searchInput" v-model="queryParam.keywords.dept_id"></app-department>
          </el-form-item>
        </div>
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='vulknowledge-button' @click="fetchData()"><span>搜&nbsp;&nbsp;索</span>
              </button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="cutLine"></div>

      <!-- 展示数据 -->
      <el-table
        :data="otterVulList"
        v-loading>
        <el-table-column
          prop="otter_vulnerability_id"
          label="ID"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column
          label="项目ID"
          align="center"
          width="70">
          <template slot-scope="scope">
            <router-link :to="'/sdl/otter/project/detail?otter_project_id='+scope.row.otter_project_id" target='_blank'><span class="linkClass">{{scope.row.otter_project_id}}</span></router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="git_url"
          label="Git路径"
          align="center">
          <template slot-scope="scope">{{scope.row.git_url.split(':')[1]}}
          </template>
        </el-table-column>
        <el-table-column
          label="漏洞类型"
          align="center">
          <template slot-scope="scope">{{scope.row.vul_type_id}}
          </template>
        </el-table-column>
        <el-table-column
          prop="dept_name"
          label="部门"
          align="center">
        </el-table-column>
        <el-table-column
            label="漏洞级别"
            align="center"
            width="100">
            <template slot-scope="scope"><span>{{choseVulLevel(scope.row.vul_level_id)}}</span>
            </template>
          </el-table-column>
        <el-table-column
          label="漏洞状态"
          width="110"
          align="center">
          <template slot-scope="scope"><span>{{choseVulStatus(scope.row.vul_status)}}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="漏洞工单"
          width="110"
          align="center">
          <template slot-scope="scope"><span class="linkClass" @click="bounceAnquan(scope.row.anquan_vul_id)">{{scope.row.anquan_vul_id}}</span>
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
import appDepartment from '../components/department'
import addFollower from '../../../../components/addFollower/index'

  export default connect(() => {
    return {
      otterVulList: 'otter/otterVulList',
      num: 'otter/otterVulListLength'
    }
  }, {
    getOtterVulList: 'otter/getOtterVulList',
    getPreInfo: 'dolphin_knowledgeBase/getPreInfo'
  })({
    data() {
        return {
          vulStatus: CONSTANTS.vulStatus,
            vulTypeList: [],
            queryParam: {
                page: 1,
                limit: 10,
                keywords: {
                    dept_id: 0,
                    vul_status: ''
                }
            }
        }
    },
    components: { addFollower, appDepartment },
    created() {
      this.getPreInfo().then(response => {
        const data = response.vul_type
        this.vulTypeList = data
        this.fetchData()
      })
    },
    methods: {
      fetchData() {
        console.log(Number(this.queryParam.keywords.dept_id))
        if (Number(this.queryParam.keywords.dept_id) == 0) {
          this.queryParam.keywords.dept_id = 0
        }
        this.getOtterVulList(this.queryParam).then(response => {
          for (let i = 0; i < this.otterVulList.length; i++) {
            this.otterVulList[i].vul_type_id = this.getVulType(this.otterVulList[i].vul_type_id)
          }

          if (Number(this.queryParam.keywords.dept_id) == 0) {
            this.queryParam.keywords.dept_id = ''
          }
        })
      },
      getVulType(myId) {
            for (let i = 0; i < this.vulTypeList.length; i++) {
              let name = this.vulTypeList[i].label
              for (let j = 0; j < this.vulTypeList[i].children.length; j++) {
                if (this.vulTypeList[i].children[j].value == myId) {
                  return `${name}/${this.vulTypeList[i].children[j].label}`
                }
              }
            }
      },
      bounceAnquan(id) {
        let url = `http://anquan.didichuxing.com/project/portals/pages/hole-detail.html?id=${id}`
        window.open(url)
      },
      choseVulLevel(id) {
        for (let i = 0; i < CONSTANTS.vulLevel.length; i++) {
              if (CONSTANTS.vulLevel[i].value == id) {
                  return CONSTANTS.vulLevel[i].label
              }
        }
      },
      choseVulStatus(id) {
        for (let i = 0; i < CONSTANTS.vulStatus.length; i++) {
              if (CONSTANTS.vulStatus[i].value == id) {
                  return CONSTANTS.vulStatus[i].label
              }
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
  #vulList {
        margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        // margin-top: -15px;
        box-sizing: border-box;
        .el-main {
            width: 100%;
            box-sizing: border-box;
            background: white;
            .displayFlex {
                display: flex;
            }
            .searchForm {
                .searchInput {
                width: 230px;
                }
            }
        }
        .linkClass{
          cursor: pointer;
          color: #FC9153;
        }
    }
  .vulknowledge-btn {
    border: 1px solid #FC9153;
    border-radius: 4px;
    width: 110px;
    height: 36px;
    color: #FC9153;
    background: white;
    margin-left: 25px;
    cursor: pointer;
    // font-weight: 100;
    line-height: 33px;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      // font-weight: 100;
    }
  }
  .cutLine {
    // border: 1px solid
    margin-top: 5px;
    margin-bottom: 17px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
    // background: rgba(0, 0, 0, 0.10);
    // border-radius: 4px;
  }

  .vulknowledge-btn:hover {
    background-color: #fff3e8;
  }

  .vulknowledge-button {
    background: #FC9153;
    border-radius: 4px;
    width: 95px;
    height: 32px;
    border: none;
    color: white;
    margin-top: 5px;
    margin-left: 90px;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    cursor: pointer;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
    }
  }

  .vulEvalu-button {
    width: 90px;
    // font-weight: 100;
  }

  .vulEvalu-btn {
    background: #FC9153;
    border-radius: 4px;
    height: 36px;
    width: 90px;
    padding: 5px;
    border: none;
    // font-weight: 100;
    margin-right: 12px;
  }

</style>

