<template>
    <div id="itemList">
    <div class="el-main">
      <el-form class="searchForm" label-position="left" :inline='true' label-width="95px">
        <div class="displayFlex">
          <el-form-item label="总任务数:" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入总任务数"
                      v-model="queryParam.keywords.task_total_count"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="最大任务数:" style="margin-left:25px" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入最大任务数"
                      v-model="queryParam.keywords.task_total_count_max"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="每日任务数:" style="margin-left:25px" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入每日任务数"
                      v-model="queryParam.keywords.task_day_count"
                      auto-complete="off">
            </el-input>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="每日最大任务数:" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入每日最大任务数"
                      v-model="queryParam.keywords.task_day_count_max"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="并发任务数:" style="margin-left:25px" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入并发任务数"
                      v-model="queryParam.keywords.task_running_task"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="最大并发任务数:" style="margin-left:25px" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入最大并发任务数"
                      v-model="queryParam.keywords.task_running_task_max"
                      auto-complete="off">
            </el-input>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="最大资产数:" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入最大资产数"
                      v-model="queryParam.keywords.single_task_asset_count_max"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="到期时间:" style="margin-left:25px" prop="name">
             <el-date-picker class="searchInput"
                v-model="queryParam.keywords.dead_time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入到期时间">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="用户名:" style="margin-left:25px" prop="name">
            <app-employee  class="searchInput"
                    clearable
                    placeholder="请输入用户名"
                    v-model="queryParam.keywords.username">
            </app-employee>
          </el-form-item>
        </div>
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='vulknowledge-button' @click="fetchData()"><span>搜&nbsp;&nbsp;索</span>
              </button>
            </el-form-item>
            <div class="floatR">
            <app-permission>
              <el-button
                @click="openDialog('create')"
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="mini"
                class="add-btn"
                style="font-weight: 400;">
                添加
              </el-button>
            </app-permission>
          </div>
          </el-col>
        </el-row>
      </el-form>
      
      <div class="cutLine"></div>

      <!-- 展示数据 -->
      <el-table
        :data="userauthList"
        v-loading>
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
          width="170">
        </el-table-column>
        <el-table-column
          label="到期时间"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.dead_time.split(' ')[0]}}<br>{{scope.row.dead_time.split(' ')[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最大资产数"
          align="center"
          prop="single_task_asset_count_max"
          width="120">
        </el-table-column>
        <el-table-column
          prop="task_total_count_max"
          label="最大任务数"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="task_day_count_max"
          label="每日任务数"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="task_running_task_max"
          label="最大并发任务数"
          width="120"
          align="center">
        </el-table-column>
         <el-table-column
          prop="user_agreement_status"
          label="用户协议状态"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openDialog('update', scope.row)">
              <span>更新</span>
            </el-button>
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
        <!-- 更新数据 -->
        <el-dialog title="更新数据" :visible.sync="dialogFormVisible" width="460px">
            <el-form :inline="true" label-width="100px" label-position="left">
              <!-- <el-col> -->
                <el-form-item label="总任务数" >
                    <el-input class="inputWidth" v-model="updateParam.task_total_count_max" placeholder="请输入总任务数" clearable></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="每日任务数" >
                    <el-input class="inputWidth" v-model="updateParam.task_day_count_max" placeholder="请输入每日任务数" clearable></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="最大并发任务数" >
                  <el-input class="inputWidth" v-model="updateParam.task_running_task_max" placeholder="请输入最大并发任务数" clearable></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="最大资产数" >
                  <el-input class="inputWidth" v-model="updateParam.single_task_asset_count_max" placeholder="请输入最大资产数" clearable></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="用户协议状态" >
                  <el-input class="inputWidth" v-model="updateParam.user_agreement_status" placeholder="请输入用户协议状态" clearable></el-input>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="到期时间" >
                  <el-date-picker class="inputWidth"
                             v-model="updateParam.dead_time"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择到期时间">
                  </el-date-picker>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="用户名" >
                      <app-employee class="inputWidth" v-model="updateParam.username" placeholder="请输入用户名" clearable></app-employee>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col> -->
                <el-form-item label="描述" >
                    <el-input class="inputWidth" v-model="updateParam.description" placeholder="请输入描述" clearable></el-input>
                </el-form-item>
              <!-- </el-col> -->
              
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="userAuth-button" @click="dialogFormVisible = false">取消</el-button>
                <el-button class="userAuth-btn" type="primary" round @click="updateUserAuth(updateParam)">确定</el-button>
            </div>
        </el-dialog>

        <!-- 新建数据 -->
        <el-dialog title="新建数据" :visible.sync="createFormVisible" width="460px">
          <el-tabs v-model="userAuthName">
            <el-tab-pane  v-for="item in newUserAuth" :key="item.label" :label="item.label" :name="item.label">
              <el-form :inline="true" label-width="100px" label-position="left">
                <el-col>
                  <el-form-item label="总任务数" >
                      <el-input class="inputWidth" v-model="item.value.task_total_count_max" placeholder="请输入总任务数" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="每日任务数" >
                      <el-input class="inputWidth" v-model="item.value.task_day_count_max" placeholder="请输入每日任务数" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="最大并发任务数" >
                    <el-input class="inputWidth" v-model="item.value.task_running_task_max" placeholder="请输入最大并发任务数" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="最大资产数" >
                    <el-input class="inputWidth" v-model="item.value.single_task_asset_count_max" placeholder="请输入最大资产数" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="用户协议状态" >
                    <el-input class="inputWidth" v-model="item.value.user_agreement_status" placeholder="请输入用户协议状态" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="到期时间" >
                    <el-date-picker class="inputWidth"
                              v-model="item.value.dead_time"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择到期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="用户名" >
                      <app-employee class="inputWidth" v-model="item.value.username" placeholder="请输入用户名" clearable></app-employee>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="描述" >
                      <el-input class="inputWidth" v-model="item.value.description" placeholder="请输入描述" clearable></el-input>
                  </el-form-item>
                </el-col>
                
              </el-form>
            </el-tab-pane>
          </el-tabs>
            
            <div slot="footer" class="dialog-footer">
                <el-button class="userAuth-button" @click="createFormVisible = false">取消</el-button>
                <el-button class="userAuth-btn" type="primary" round @click="createUserAuth(updateParam)">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {connect} from '@/lib'

  export default connect(() => {
    return {
      userauthList: 'octopus_userauth/userauthList',
      num: 'octopus_userauth/userAuthListLength'
    }
  }, {
    userAuthList: 'octopus_userauth/userAuthList',
    userAuthcreate: 'octopus_userauth/userAuthcreate',
    userAuthUpdate: 'octopus_userauth/userAuthUpdate',
    userAuthDelete: 'octopus_userauth/userAuthDelete',
    userAuthTemplete: 'octopus_userauth/userAuthTemplete'
  })({data() {
        return {
            dialogFormVisible: false,
            createFormVisible: false,
            newUserAuth: [],
            userAuthName: '普通授权',
            queryParam: {
                page: 1,
                limit: 10,
                keywords: {
                  task_total_count: '',
                  task_total_count_max: '',
                  task_day_count: '',
                  task_day_count_max: '',
                  task_running_task: '',
                  task_running_task_max: '',
                  user_agreement_status: '',
                  single_task_asset_count_max: '',
                  dead_time: '',
                  username: ''
                }
            },
            updateParam: {
              task_total_count_max: 0,
              task_day_count_max: 0,
              task_running_task_max: 0,
              single_task_asset_count_max: 0,
              user_agreement_status: '',
              dead_time: '',
              username: '',
              description: ''
            }
        }
    },
    created() {
      this.fetchData()
      this.userAuthTemplete().then(res => {
        this.newUserAuth = res.data
      })
    },
    methods: {
      fetchData() {
        let queryParam = {queryParam: this.queryParam}
        this.userAuthList(queryParam).then(res => {
        })
      },
      openDialog(opera, param) {
        if (opera == 'update') {
          this.updateParam = {
            task_total_count_max: param.task_total_count_max,
            task_day_count_max: param.task_day_count_max,
            task_running_task_max: param.task_running_task_max,
            single_task_asset_count_max: param.single_task_asset_count_max,
            user_agreement_status: param.user_agreement_status,
            dead_time: param.dead_time,
            username: param.username,
            description: param.description
          }
          this.dialogFormVisible = true
        }
        if (opera == 'create') {
          this.createFormVisible = true
        }
      },
      updateUserAuth(param) {
        this.userAuthUpdate(param).then(response => {
          this.fetchData()
          this.dialogFormVisible = false
        })
      },
      createUserAuth() {
        for (let i = 0; i < this.newUserAuth.length; i++) {
          if (this.newUserAuth[i].label == this.userAuthName) {
            this.userAuthcreate(this.newUserAuth[i].value).then(response => {
              console.log(response.errno)
              const errno = response.errno
              const errmsg = response.errmsg
              if (errno == 0) {
                this.$notify({
                  title: '操作成功',
                  message: errmsg,
                  type: 'success'
                })
              } else {
                this.$notify({
                  title: '操作失败',
                  message: errmsg,
                  type: 'error'
                })
              }
              this.createFormVisible = false
              this.fetchData()
            })
          }
          break
        }
      },
      deleteUserAuth(name) {
        let queryParam = {username: name}
        this.userAuthDelete(queryParam).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '操作成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '操作失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
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
  #itemList {
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
          width: 220px;
          }
      }
    }
    .floatR{
      float: right;
      position: relative;
      top: 5px;
    }
    .add-btn {
      background: white;
      color: #fc9153 !important;
      border-radius: 4px;
      float: right;
      margin-left: 15px;
      border: 1px solid #fc9153;
      height: 32px;
      width: 95px;
      // top: 5px;
      // position:absolute;
    }
    .inputWidth{
      width: 320px;
    }
    .userAuth-button {
      width: 80px;
      height: 32px;
      padding: 7px 15px;
      font-size: 13px;
    }

    .userAuth-btn {
      background: #FC9153;
      border-radius: 4px;
      font-size: 13px;
      height: 32px;
      width: 80px;
      padding: 7px 15px;
      border: none;
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
    border: 1px solid #FC9153;
    color: white;
    margin-left: 95px;
    margin-top: 5px;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    cursor: pointer;
    // font-weight: 100;
    // line-height: 33px;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      // font-weight: 100;
    }
  }

  

</style>

