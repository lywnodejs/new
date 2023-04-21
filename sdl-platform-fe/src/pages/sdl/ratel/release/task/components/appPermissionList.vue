<template>
  <div id="ratel-release-task-list">
    <el-form  label-width="30px">
        <el-form-item label="">
            <el-switch 
                v-model="comparisonShow"
                active-color="#ff4949"
                inactive-color="#13ce66"
                active-text="比对信息"
                inactive-text="详细信息">
            </el-switch>
            <el-select v-show="comparisonShow" v-model="value" placeholder="请选择" :change='handleChange(value)' style="width: 100px">
                    <el-option
                    v-for="item in tabName"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
            </el-select>
            <span v-show="comparisonShow">-</span>
            <el-select v-show="comparisonShow" v-model="value1" placeholder="请选择" :change='handleChange(value1)' style="width: 100px">
                    <el-option
                    v-for="item in tabName"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
            </el-select>
        </el-form-item>
        
    </el-form>
    
    <el-tabs v-show="!comparisonShow" v-model="activeName" @tab-click="handleClick" type="border-card">
            <el-tab-pane v-for="(item, key) in data" :key="key" :label="item.app_version" :name="item.app_version">
                <!-- <button type="button" class='ratel-button' @click="openDialog('create', item.app_version)"><span>新&nbsp;增</span></button> -->
                <button type="button" class='ratel-button' @click="exportExecl(item)"><span>导出Excel</span></button>
                <el-table
                :data="item.tempData"
                row-key="id"
                lazy
                v-loading>
                    <el-table-column
                        label="ID"
                        width="80"
                        align="center">
                        <template slot-scope="scope">
                        <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="权限名称"
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
                        label="官方等级"
                        align="center">
                        <template slot-scope="scope">
                        <span>{{scope.row.official_level}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="权限备注"
                        align="center">
                        <template slot-scope="scope">
                        <span>{{scope.row.permission_remark}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="80px"
                        align="center">
                        <template slot-scope="scope">
                            <span class="operator-link" @click="openDialog('update', scope.row, item.app_version)">修改</span>
                            <span class="operator-link" @click="deletePermission(scope.row.id)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div align="right" style="margin-top: 10px;">
                    <el-pagination
                        @size-change="handleSizeChange($event, item.app_version)"
                        @current-change="handleCurrentChange($event, item.app_version)"
                        :current-page="dataPageParam.page"
                        :page-sizes="[10,20,30, 50, 100, 500, 1000]"
                        :page-size="dataPageParam.limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="item.permissions.length">
                    </el-pagination>
                </div>
            </el-tab-pane>
            
    </el-tabs>

    <el-tabs v-show="comparisonShow" v-model="activeName1" @tab-click="handleComparisonClick" type="border-card">
            <el-tab-pane v-if="!comparisonData" label="无">暂无数据</el-tab-pane>
            <el-tab-pane v-for="(item, key) in comparisonData" :key="key" :label="item.app_version" :name="item.app_version">
                {{item.app_version.split('-')[0]}}版本 比对 {{item.app_version.split('-')[1]}}版本
                <el-table
                :data="item.tempData"
                row-key="id"
                lazy
                v-loading>
                    <el-table-column
                        label="ID"
                        width="80"
                        align="center">
                        <template slot-scope="scope">
                        <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="权限名称"
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
                        label="权限备注"
                        align="center">
                        <template slot-scope="scope">
                        <span>{{scope.row.permission_remark}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        width="80px"
                        align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.status === '新增'? 'green' : scope.row.status === '删除' ? 'red':'blue'">{{scope.row.status}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div align="right" style="margin-top: 10px;">
                    <el-pagination
                        @size-change="handleComparisonDataSizeChange($event, item.app_version)"
                        @current-change="handleComparisonDataCurrentChange($event, item.app_version)"
                        :current-page="comparisonDataPageParam.page"
                        :page-sizes="[10,20,30, 50, 100, 500, 1000]"
                        :page-size="comparisonDataPageParam.limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="item.permissions.length">
                    </el-pagination>
                </div>
            </el-tab-pane>
            
    </el-tabs>


    <!-- <div align="right" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
      
    </div> -->
    <app-permission-dialog :dialogFormVisible='permissionDialogVisible' :scopeRows='transferData' @createDialog='getFormVisible'></app-permission-dialog>
  </div>
</template>
<script>
import {connect} from '@/lib'
import appPermissionDialog from './dialog/appPermissonDialog'
import XLSX from 'xlsx';
export default connect(() => {
    return {
    }
    }, {
        updateTaskPermission: 'ratel_assets/updateTaskPermission',
        getTaskPermission: 'ratel_assets/getTaskPermission',
        createTaskPermission: 'ratel_assets/createTaskPermission',
        delTaskPermission: 'ratel_assets/delTaskPermission'
    })({
    data() {
      return {
        value: '',
        value1: '',
        data: [],
        dataPageParam: {
            limit: 10,
            page: 1
        },
        comparisonDataPageParam: {
            limit: 10,
            page: 1
        },
        queryParam: {
            ratel_task_id: parseInt(this.$route.query.ratel_task_id),
            page: 1,
            limit: 10
        },
        num: 0,
        transferData: [],
        activeName: '',
        activeName1: '',
        permissionDialogVisible: false,
        comparisonData: [],
        tabName: [],
        comparisonShow: false
      }
    },
    created() {
        this.fetchData()
    },
    watch: {
        data(val) {
            this.activeName = this.data[0].app_version
        },
        comparisonData(val) {
            this.activeName1 = this.comparisonData[0].app_version
        }
    },
    components: {appPermissionDialog},
    props: ['scopeRow'],
    methods: {
        fetchData() {
            this.getTaskPermission({ratel_task_id: parseInt(this.$route.query.ratel_task_id)}).then(res => {
                this.data = res
                this.data.forEach(item => {
                    let index = this.dataPageParam.limit * this.dataPageParam.page
                    item.tempData = item.permissions.slice(index - this.dataPageParam.limit, index)
                    this.$set(item, 'tempData', item.permissions.slice(index - this.dataPageParam.limit, index))
                })

                for (let i = 0; i < res.length; i++) {
                    this.tabName.push(res[i].app_version)
                    if (i > 0) {
                        this.comparisonData.push(this.diff(_.cloneDeep(res[i - 1]), _.cloneDeep(res[i])))
                    }
                }
                this.comparisonData.forEach(item => {
                    let index = this.comparisonDataPageParam.limit * this.comparisonDataPageParam.page
                    item.tempData = item.permissions.slice(index - this.comparisonDataPageParam.limit, index)
                    this.$set(item, 'tempData', item.permissions.slice(index - this.comparisonDataPageParam.limit, index))
                })
            })
        },
        diff(a, b) {
            let arr = a.app_version.split('.')
            let brr = b.app_version.split('.')
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] > brr[i]) {
                    let temp = a
                    a = b
                    b = temp
                    break;
                }
            }
            let obj = {
                app_version: `${b.app_version}-${a.app_version}`,
                permissions: []
            }
            for (let i = 0; i < b.permissions.length; i++) {
                b.permissions[i].status = '新增'
                for (let j = 0; j < a.permissions.length; j++) {
                    if (b.permissions[i].permission_declare === a.permissions[j].permission_declare) {
                        b.permissions[i].status = '继承'
                        break;
                    }
                }
                obj.permissions.push(_.cloneDeep(b.permissions[i]))
            }
            for (let i = 0; i < a.permissions.length; i++) {
                a.permissions[i].status = '删除'
                for (let j = 0; j < b.permissions.length; j++) {
                    if (b.permissions[j].permission_declare === a.permissions[i].permission_declare) {
                        a.permissions[i].status = '继承'
                        break;
                    }
                }
                if (a.permissions[i].status !== '继承') {
                    obj.permissions.push(_.cloneDeep(a.permissions[i]))
                }
            }
            return obj
        },
        exportExecl(val) {
            let filename = `${val.app_version}版本申请权限列表.xlsx`;
            let data = [[`${val.app_version}版本详细信息：`], ['ID', '权限名称', '权限中文名', '权限描述', '权限等级', '权限备注']];
            val.permissions.forEach(element => {
                data.push([element.id, element.permission_declare, element.permission_name_zh, element.permission_description, element.permission_level, element.permission_remark])
            });
            this.comparisonData.forEach(element => {
                if (element.app_version.split('-')[1] === val.app_version) {
                    data.push(['比对信息：' + element.app_version])
                    data.push(['ID', '权限名称', '权限中文名', '权限描述', '权限等级', '权限备注', '状态'])
                    element.permissions.forEach(item => {
                        data.push([item.id, item.permission_declare, item.permission_name_zh, item.permission_description, item.permission_level, item.permission_remark, item.status])
                    })
                }
            })
            let wsName = 'Sheet1';
            let wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, wsName);
            XLSX.writeFile(wb, filename);
        },
        openDialog(type, data, version) {
            if (type === 'create') {
                this.transferData = data
                this.permissionDialogVisible = true
            } else if (type === 'update') {
                this.transferData = data
                this.transferData.app_version = version
                this.permissionDialogVisible = true
            }
        },
        getFormVisible(val) {
            this.permissionDialogVisible = val
        },
        deletePermission(id) {
          this.$confirm('确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            this.delTaskPermission({id: id}).then(res => {
                this.fetchData()
            })
          }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
          });
        },
        handleChange(val) {
            if (!this.value1 || !this.value || !val || this.value1 === this.value) return
            let a, b
            for (let i = 0; i < this.data.length; i++) {
                if (this.value === this.data[i].app_version) {
                    a = _.cloneDeep(this.data[i])
                }
                if (this.value1 === this.data[i].app_version) {
                    b = _.cloneDeep(this.data[i])
                }
            }
            let result = this.diff(a, b)
            for (let i = 0; i < this.comparisonData.length; i++) {
                if (this.comparisonData[i].app_version === result.app_version) {
                    return
                }
            }
            this.comparisonData.push(result)
            this.activeName1 = result.app_version
        },
        handleClick(tab, event) {
            this.dataPageParam.page = 1
            this.data.forEach(item => {
                if (item.app_version === tab.name) {
                    let index = this.dataPageParam.limit * this.dataPageParam.page
                    item.tempData = item.permissions.slice(index - this.dataPageParam.limit, index)
                }
            })
        },
        handleComparisonClick(tab, event) {
            this.comparisonDataPageParam.page = 1
            this.comparisonData.forEach(item => {
                if (item.app_version === tab.name) {
                    let index = this.comparisonDataPageParam.limit * this.comparisonDataPageParam.page
                    item.tempData = item.permissions.slice(index - this.comparisonDataPageParam.limit, index)
                }
            })
        },
        handleSizeChange(val, version) {
            this.dataPageParam.limit = val
            this.data.forEach(item => {
                if (item.app_version === version) {
                    let index = this.dataPageParam.limit * this.dataPageParam.page
                    item.tempData = item.permissions.slice(index - this.dataPageParam.limit, index)
                }
            })
        },
        handleCurrentChange(val, version) {
            this.dataPageParam.page = val
            this.data.forEach(item => {
                if (item.app_version === version) {
                    let index = this.dataPageParam.limit * this.dataPageParam.page
                    item.tempData = item.permissions.slice(index - this.dataPageParam.limit, index)
                }
            })
        },
        handleComparisonDataSizeChange(val, version) {
            this.comparisonDataPageParam.limit = val
            this.comparisonData.forEach(item => {
                if (item.app_version === version) {
                    let index = this.comparisonDataPageParam.limit * this.comparisonDataPageParam.page
                    item.tempData = item.permissions.slice(index - this.comparisonDataPageParam.limit, index)
                }
            })
        },
        handleComparisonDataCurrentChange(val, version) {
            this.comparisonDataPageParam.page = val
            this.comparisonData.forEach(item => {
                if (item.app_version === version) {
                    let index = this.comparisonDataPageParam.limit * this.comparisonDataPageParam.page
                    item.tempData = item.permissions.slice(index - this.comparisonDataPageParam.limit, index)
                }
            })
        }
    }
})
</script>
<style lang="less">
#ratel-release-task-list {
    // .el-tabs--border-card{
    //     display: inline-block;
    //     width: 49%;
    // }
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;  
    box-sizing: border-box;
    position: relative;
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
    .operator-link {
        color: #fc5913;
    }
    .ratel-button{
        background: #FC9153;
        border-radius: 4px;
        width: 95px;
        height: 32px;
        border: none;
        color: white;
        margin-bottom: 5px;
        font-size: 13px;
        -webkit-font-smoothing: antialiased;
        cursor: pointer;
        span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        }
    }
    // .el-switch{
    //     position: absolute;
    //     z-index: 100;
    //     right: 17px;
    //     top: 10px;
    // }
    .red{
        color: red;
    }
    .blue{
        color: blue;
    }
    .green{
        color: green;
    }
}
</style>

