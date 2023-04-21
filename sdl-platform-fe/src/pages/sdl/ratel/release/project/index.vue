<template>
  <div id="ratel-release">
      <el-form class="searchForm" label-position="left" label-width="100px" :inline='true'>
      <div class="displayFlex">
          
          <el-form-item label="应用标识:">
            <el-input class="searchInput"
                        v-model="queryParam.keywords.app_package_name"
                        clearable
                        placeholder="请输入应用标识"
                        auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="部门:" style="margin-left: 30px;">
            <app-department class="searchInput" v-model="queryParam.keywords.dept_id"></app-department>
          <!-- <el-input class="searchInput"
                    v-model="queryParam.keywords.dept_id"
                    clearable
                    placeholder="请输入部门ID"
                    auto-complete="off">
          </el-input> -->
        </el-form-item>
      </div>
      <div class="displayFlex">
          <el-form-item label="创建时间" label-width="100px">
                <el-date-picker
                  @change="changeTime(time)"
                    v-model="time"
                    class="searchInput"
                    type="daterange"
                    align="right"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
          </el-form-item>
          <el-form-item label="检测时间" label-width="100px"  style="margin-left: 30px;">
                <el-date-picker
                  @change="changeTime1(time1)"
                    v-model="time1"
                    type="daterange"
                    class="searchInput"
                    align="right"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
          </el-form-item>
        
      </div>

      <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='ratel-button' @click="fetchData"><span>搜&nbsp;索</span></button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="cutLine"></div>

    <el-table
        :data="data"
        v-loading>
            <el-table-column
                label="ID"
                width="80"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.ratel_project_id}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                label="名称"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_name}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                label="名称"
                width="240"
                align="center">
                <template slot-scope="scope">
                  <div class="flexbox">
                    <img class="appIcon" :src="scope.row.icon_link" alt="">&nbsp;
                    <span>{{scope.row.app_release_name}}</span>
                  </div>
                </template>
            </el-table-column>
            <el-table-column
                label="应用标识"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_package_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="类型"
                width="70"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_type}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="部门"
                min-width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.dept_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="70"
                align="center">
                <template slot-scope="scope">
                    <router-link style="color:#FC9153" :to="{ path : '/sdl/ratel/release/project/detail', query: {ratel_project_id: scope.row.ratel_project_id}}" target=_blank>
                    详情
                    </router-link>
                <!-- <span class="opera" @click="openDialog(scope.row.ratel_project_id)">查看详情</span> -->
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
</template>
<script>
import {connect} from '@/lib'
import appDepartment from '../components/department'
export default connect(() => {
    return {
    }
    }, {
        getRatelProjectList: 'ratel_project/getRatelProjectList',
        getRatelProjectDetail: 'ratel_project/getRatelProjectDetail',
        getRatelFollower: 'ratel_project/getRatelFollower',
        addRatelFollower: 'ratel_project/addRatelFollower'
    })({
    data() {
      return {
        time: '',
        time1: '',
        data: [],
        queryParam: {
            keywords: {
                create_begin_time: null,
                create_end_time: '',
                check_begin_time: '',
                check_end_time: '',
                app_package_name: '',
                dept_id: null
            },
            page: 1,
            limit: 10
        },
        num: 0
      }
    },
    created() {
        this.fetchData()
    },
    components: {appDepartment},
    methods: {
        fetchData() {
            this.getRatelProjectList(this.queryParam).then(res => {
                this.num = res.count
                this.data = res.ratel_project_list
            })
        },
        openDialog(id) {
            this.getRatelProjectDetail({ratel_project_id: id}).then(res => {
            })
        },
        handleSizeChange(val) {
            this.queryParam.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParam.page = val
            this.fetchData()
        },
        changeTime(time) {
            this.queryParam.keywords.create_begin_time = time[0]
            this.queryParam.keywords.create_end_time = time[1]
        },
        changeTime1(time) {
            this.queryParam.keywords.check_begin_time = time[0]
            this.queryParam.keywords.check_end_time = time[1]
        }
    }
  })
</script>
<style lang="less">
  #ratel-release {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;  
    box-sizing: border-box;
    .displayFlex {
      display: flex;
      // width: 1240px;
    }
    .searchForm {
      .searchInput {
        width: 230px;
      }
    }
    .flexbox {
      display: flex;
      align-items: center;
      justify-content: center;
      .appIcon {
        width: 15px;
        height: 15px;
        border-radius: 3px;
      }
    }
    .ratel-button{
        background: #FC9153;
        border-radius: 4px;
        width: 95px;
        height: 32px;
        border: none;
        color: white;
        margin-top: 5px;
        margin-left: 100px;
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
      // border-radius: 4px;
    }
    .opera {
        color: #FC9153;
        cursor: pointer;
        // display: inline-block;
        // margin-left: 5px;
    } 
  }
</style>

