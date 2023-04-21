<template>
  <div id="ratel-asset-sdk">
      <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="SDK名称:">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.sdk_name"
                    clearable
                    placeholder="请输入SDK名称"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="SDK类型" style="margin-left: 30px;">
          <el-select class="searchInput"
            v-model="queryParam.keywords.sdk_type"
            placeholder="请选择"
            clearable
            :multiple="false">
            <el-option
              v-for="(item, index) in sdkType"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='ratel-button' @click="fetchData"><span>搜&nbsp;索</span></button>
            <button type="button" class='ratel-btn' @click="openDialog('create')"><span>新&nbsp;增</span></button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

      <div class="cutLine"></div>
       <el-table
        :data="data"
        v-loading>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" label-width="140px">
                    <el-form-item label="提交信息">
                        <span>{{ props.row.sdk_commit_id }}</span>
                    </el-form-item><br>
                    <el-form-item label="Git地址">
                        <span>{{ props.row.sdk_git_url }}</span>
                    </el-form-item><br>
                    <el-form-item label="Git分支">
                        <span>{{ props.row.sdk_git_branch }}</span>
                    </el-form-item><br>
                    <el-form-item label="SDK最近提交者">
                        <span>{{ props.row.sdk_git_last_committer }}</span>
                    </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
                label="ID"
                width="80"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="SDK名称"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.sdk_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="SDK权限"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.sdk_permission}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="SDK_TAG"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.sdk_tag}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="SDK版本"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.sdk_version}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                label="提交信息"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.sdk_commit_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="Git地址"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.sdk_git_url}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="Git分支"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.sdk_git_branch}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="SDK最近提交者"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.sdk_git_last_committer}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                label="SDK描述"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.sdk_remark}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="SDK类型"
                align="center">
                <template slot-scope="scope">
                <span>{{ judgeSDKType(scope.row.sdk_type) }}</span>
                </template>
            </el-table-column>
            
            <el-table-column
                label="操作"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span class="opera" @click="openDialog('update', scope.row)">编辑</span>&nbsp;&nbsp;&nbsp;
                <span class="opera" @click="deleteSDK(scope.row.id)">删除</span>
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

    <create-sdk-dialog :dialogVisible='createDialogVisible' :scopeRows='scopeRow' @createDialog='getFormVisible'></create-sdk-dialog>
  </div>
</template>
<script>
import {connect} from '@/lib'
import createSdkDialog from './dialog/createSDKDialog'
import * as CONSTANTS from '@/commons/ratel'
export default connect(() => {
    return {
    }
    }, {
        getAssetSDKList: 'ratel_assets/getAssetSDKList',
        deleteAssetSDK: 'ratel_assets/deleteAssetSDK'
    })({
    data() {
      return {
        data: [],
        queryParam: {

            keywords: {
                sdk_name: '',
                sdk_type: ''
            },
            page: 1,
            limit: 10
        },
        sdkType: CONSTANTS.sdkType,
        num: 0,
        createDialogVisible: false,
        scopeRow: null
      }
    },
    created() {
        this.fetchData()
    },
    components: {createSdkDialog},
    methods: {
        fetchData() {
            this.getAssetSDKList(this.queryParam).then(res => {
                this.num = res.count
                this.data = res.ratel_asset_sdk_list
            })
        },
        deleteSDK(id) {
            this.$confirm('确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            this.deleteAssetSDK({id: id}).then(res => {
                this.fetchData()
            })
          }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
          });
        },
        judgeSDKType(type) {
          let label = ''
          this.sdkType.forEach(item => {
            if (item.value === type) {
              label = item.label
            }
          })
          return label
        },
        openDialog(type, data) {
            if (type === 'create') {
                this.scopeRow = ''
                this.createDialogVisible = true
            } else if (type === 'update') {
                this.scopeRow = data
                this.createDialogVisible = true
            }
        },
        getFormVisible(val) {
            this.createDialogVisible = val
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
  #ratel-asset-sdk {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;  
    box-sizing: border-box;
    .forward {
      padding-top: 10px;
      // margin-top: 30px;
      text-align: center;
      font-size: 20px;
    }
    .need {
      text-align: center;
      font-size: 15px;
      padding-top: 10px;
      margin-bottom: 20px;
    }
    .searchForm {
        .searchInput {
            width: 230px;
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
        margin-left: 80px;
        font-size: 13px;
        -webkit-font-smoothing: antialiased;
        cursor: pointer;
        span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        }
    }
    .ratel-btn{
        border: 1px solid #FC9153;
        border-radius: 4px;
        width: 95px;
        height: 32px;
        color: #FC9153;
        margin-left: 25px;
        background: white;
        cursor: pointer;
        margin-top: 5px;
        font-size: 13px;
        -webkit-font-smoothing: antialiased;
        // font-weight: 100;
        // line-height: 32px;
        span{
        font-family: Avenir,Helvetica,Arial,sans-serif;
        // font-weight: 100;
        }
    }
    .ratel-btn:hover{
        background-color: #fff3e8;
    }
    .opera {
        color: #FC9153;
        cursor: pointer;
        // display: inline-block;
        // margin-left: 5px;
    } 
    .cutLine {
        // border: 1px solid
        margin-top: 5px;
        margin-bottom: 17px;
        width: 100%;
        border-top: 1px solid rgba(0, 0, 0, 0.10);
        // background: rgba(0, 0, 0, 0.10);
        // border-rad
    }
    .demo-table-expand {
        font-size: 0;
        margin-left: 50px;
    }
    .demo-table-expand label {
        width: 90px;
        color: #616367;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
  }
</style>