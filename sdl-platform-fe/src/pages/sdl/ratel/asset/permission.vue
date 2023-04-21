<template>
  <div id="ratel-asset-permission">
      <el-form class="searchForm" label-position="left" label-width="100px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="权限声明:">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.permission_declare"
                    clearable
                    placeholder="请输入应用权限名称"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="权限描述:" style="margin-left: 30px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.permission_description"
                    clearable
                    placeholder="请输入应用权限名称"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </div>
      <div class="displayFlex">
        <el-form-item label="敏感等级" >
          <el-select class="searchInput"
            v-model="queryParam.keywords.permission_level"
            placeholder="请选择"
            clearable
            :multiple="false">
            <el-option
              v-for="(item, index) in dataLevel"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保护级别" style="margin-left: 30px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.official_level"
                    placeholder="保护级别"
                    clearable></el-input>
            <!-- <el-select class="searchInput"
              v-model="queryParam.keywords.official_level"
              placeholder="请选择"
              clearable
              :multiple="false">
              <el-option
                v-for="(item, index) in dataLevel"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
        </el-form-item>
      </div>
      <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='ratel-button' @click="fetchData"><span>搜&nbsp;索</span></button>
            <button type="button" class='ratel-btn' @click="openDialog('create')"><span>新&nbsp;增</span></button>
          </el-form-item>
        </el-col>
        <el-upload
              class="upload-demo"
              action="/api/ratel/asset/permission/uploadByExcel"
              multiple
              :name="'excel'"
              :limit="3"
              :file-list="fileList">
              <el-button size="small" type="primary">通过EXCEL上传</el-button>
            </el-upload>
        <!-- <el-col :span='4'>
          <el-form-item align="center">

          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>

      <div class="cutLine"></div>

       <el-table
        :data="data"
        v-loading>
            <el-table-column
                label="ID"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="声明的权限"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.permission_declare}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="权限分类"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.permission_name_zh}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="权限描述"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.permission_description}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="敏感等级"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.permission_level}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="保护级别"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.official_level}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span class="opera" @click="openDialog('update', scope.row)">编辑</span>&nbsp;&nbsp;&nbsp;
                <span class="opera" @click="deletePermission(scope.row.id)">删除</span>
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

    <permission-dialog :dialogFormVisible='dialogVisible' :scopeRows='scopeRow' @createDialog='getFormVisible'></permission-dialog>
  </div>
</template>
<script>
import {connect} from '@/lib'
import permissionDialog from './dialog/permissionDialog'
import * as CONSTANTS from '@/commons/ratel'
export default connect(() => {
    return {
    }
    }, {
        uploadExcelPermission: 'ratel_assets/uploadExcelPermission',
        getAssetPermissionList: 'ratel_assets/getAssetPermissionList',
        deleteAssetPermission: 'ratel_assets/deleteAssetPermission'
    })({
    data() {
      return {
        data: [],
        queryParam: {
            keywords: {
                permission_level: '',
                permission_description: '',
                permission_declare: '',
                official_level: ''
            },
            page: 1,
            limit: 10
        },
        dataLevel: CONSTANTS.dataLevel,
        fileList: [],
        num: 0,
        scopeRow: null,
        dialogVisible: false
      }
    },
    created() {
        this.fetchData()
    },
    components: {permissionDialog},
    methods: {
        fetchData() {
            this.getAssetPermissionList(this.queryParam).then(res => {
              this.num = res.count
              this.data = res.ratel_asset_permissions_list
            })
        },
        deletePermission(id) {
          this.$confirm('确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            this.deleteAssetPermission({id: id}).then(res => {
                this.fetchData()
            })
          }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
          });
        },
        openDialog(type, data) {
            if (type === 'create') {
                this.scopeRow = ''
                this.dialogVisible = true
            } else if (type === 'update') {
                this.scopeRow = data
                this.dialogVisible = true
            }
        },
        getFormVisible(val) {
            this.dialogVisible = val
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
  #ratel-asset-permission {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;
    box-sizing: border-box;
    .displayFlex {
      display: flex;
    }
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
        margin-left: 100px;
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
    .upload-demo{
      position: absolute;
      top: 5px;
      right: 0px;
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
  }
</style>
