<template>
  <div id="ratel-release-task-sdk-list">
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
                    <el-table-column
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
                    </el-table-column>
                    <el-table-column
                        label="SDK描述"
                        align="center">
                        <template slot-scope="scope">
                        <span>{{scope.row.sdk_description}}</span>
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
                        width="80px"
                        align="center">
                        <template slot-scope="scope">
                            <span class="operator-link" @click="openDialog('update', scope.row, item.app_version)">修改</span>
                            <span class="operator-link" @click="deleteSdk(scope.row.id)">删除</span>
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
                        :total="item.sdks.length">
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
                    <el-table-column
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
                    </el-table-column>
                    <el-table-column
                        label="SDK描述"
                        align="center">
                        <template slot-scope="scope">
                        <span>{{scope.row.sdk_description}}</span>
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
                        :total="item.sdks.length">
                    </el-pagination>
                </div>
            </el-tab-pane>
            
    </el-tabs>

    <app-sdk-dialog :dialog='sdkDialogVisible' :scopeRows='transferData' @createDialog='getFormVisible'></app-sdk-dialog>
  </div>
</template>
<script>
import {connect} from '@/lib'
import appSdkDialog from './dialog/appSDKDialog'
import XLSX from 'xlsx';
import * as CONSTANTS from '@/commons/ratel'
export default connect(() => {
    return {
    }
    }, {
        getListByTaskId: 'ratel_project/getListByTaskId',
        updateTaskSDK: 'ratel_assets/updateTaskSDK',
        getTaskSDK: 'ratel_assets/getTaskSDK',
        createTaskSDK: 'ratel_assets/createTaskSDK',
        delTaskSDK: 'ratel_assets/delTaskSDK'
    })({
    data() {
      return {
        value: '',
        value1: '',
        data: [],
        dataPageParam: {
            limit: 10,
            page: 1,
            version: ''
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
        sdkDialogVisible: false,
        transferData: [],
        activeName: '',
        activeName1: '',
        comparisonData: [],
        tabName: [],
        sdkType: CONSTANTS.sdkType,
        comparisonShow: false
      }
    },
    created() {
        this.fetchData()
    },
    mounted() {
        console.log(this.$el.clientHeight)
    },
    watch: {
        data(val) {
            this.activeName = this.data[0].app_version
        }
    },
    components: { appSdkDialog },
    methods: {
        fetchData() {
            this.getTaskSDK({ratel_task_id: parseInt(this.$route.query.ratel_task_id)}).then(res => {
                this.data = res
                this.data.forEach(item => {
                    let index = this.dataPageParam.limit * this.dataPageParam.page
                    item.tempData = item.sdks.slice(index - this.dataPageParam.limit, index)
                    this.$set(item, 'tempData', item.sdks.slice(index - this.dataPageParam.limit, index))
                })
                for (let i = 0; i < res.length; i++) {
                    this.tabName.push(res[i].app_version)
                    if (i > 0) {
                        this.comparisonData.push(this.diff(_.cloneDeep(res[i - 1]), _.cloneDeep(res[i])))
                    }
                }
            })
        },
        openDialog(type, data, version) {
            this.sdkDialogVisible = true
            if (type === 'create') {
                this.transferData = data
                this.sdkDialogVisible = true
            } else if (type === 'update') {
                this.transferData = data
                this.transferData.app_version = version
                this.sdkDialogVisible = true
            }
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
        exportExecl(val) {
            let filename = `SDK-${val.app_version}版本检测信息.xlsx`;
            let data = [[`${val.app_version}版本详细信息：`], ['ID', 'SDK名称', 'SDK权限', 'SDK_Tag', 'SDK版本', '提交信息', 'Git地址', 'Git分支', 'SDK最近提交者', 'SDK描述', '是否外采', '是否滴滴内部']];
            val.sdks.forEach(element => {
                data.push([element.id, element.sdk_name, element.sdk_permission, element.sdk_tag, element.sdk_version, element.sdk_commit_id, element.sdk_git_url, element.sdk_git_branch, element.sdk_git_last_committer, element.sdk_description])
            });
            this.comparisonData.forEach(element => {
                if (element.app_version.split('-')[1] === val.app_version) {
                    data.push(['比对信息：' + element.app_version])
                    data.push(['ID', 'SDK名称', 'SDK权限', 'SDK_Tag', 'SDK版本', '提交信息', 'Git地址', 'Git分支', 'SDK最近提交者', 'SDK描述', '状态'])
                    element.sdks.forEach(item => {
                        data.push([item.id, item.sdk_name, item.sdk_permission, item.sdk_tag, item.sdk_version, item.sdk_commit_id, item.sdk_git_url, item.sdk_git_branch, item.sdk_git_last_committer, item.sdk_description, item.status])
                    })
                }
            })
            let wsName = 'Sheet1';
            let wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, wsName);
            XLSX.writeFile(wb, filename);
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
        deleteSdk(id) {
          this.$confirm('确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            this.delTaskSDK({id: id}).then(res => {
                this.fetchData()
            })
          }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
          });
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
                sdks: []
            }
            for (let i = 0; i < b.sdks.length; i++) {
                b.sdks[i].status = '新增'
                for (let j = 0; j < a.sdks.length; j++) {
                    if (b.sdks[i].sdk_name === a.sdks[j].sdk_name) {
                        b.sdks[i].status = '继承'
                        break;
                    }
                }
                obj.sdks.push(_.cloneDeep(b.sdks[i]))
            }
            for (let i = 0; i < a.sdks.length; i++) {
                a.sdks[i].status = '删除'
                for (let j = 0; j < b.sdks.length; j++) {
                    if (b.sdks[j].sdk_name === a.sdks[i].sdk_name) {
                        a.sdks[i].status = '继承'
                        break;
                    }
                }
                if (a.sdks[i].status !== '继承') {
                    obj.sdks.push(_.cloneDeep(a.sdks[i]))
                }
            }
            return obj
        },
        getFormVisible(val) {
            this.sdkDialogVisible = val
        },
        handleClick(tab, event) {
            this.dataPageParam.page = 1
            this.data.forEach(item => {
                if (item.app_version === tab.name) {
                    let index = this.dataPageParam.limit * this.dataPageParam.page
                    item.tempData = item.sdks.slice(index - this.dataPageParam.limit, index)
                }
            })
        },
        handleSizeChange(val, version) {
            this.dataPageParam.limit = val
            this.data.forEach(item => {
                if (item.app_version === version) {
                    let index = this.dataPageParam.limit * this.dataPageParam.page
                    item.tempData = item.sdks.slice(index - this.dataPageParam.limit, index)
                }
            })
        },
        handleCurrentChange(val, version) {
            this.dataPageParam.page = val
            this.data.forEach(item => {
                if (item.app_version === version) {
                    let index = this.dataPageParam.limit * this.dataPageParam.page
                    item.tempData = item.sdks.slice(index - this.dataPageParam.limit, index)
                }
            })
        },
        handleComparisonClick(tab, event) {
            this.comparisonDataPageParam.page = 1
            this.comparisonData.forEach(item => {
                if (item.app_version === tab.name) {
                    let index = this.comparisonDataPageParam.limit * this.comparisonDataPageParam.page
                    item.tempData = item.sdks.slice(index - this.comparisonDataPageParam.limit, index)
                }
            })
        },
        handleComparisonDataSizeChange(val, version) {
            this.comparisonDataPageParam.limit = val
            this.comparisonData.forEach(item => {
                if (item.app_version === version) {
                    let index = this.comparisonDataPageParam.limit * this.comparisonDataPageParam.page
                    item.tempData = item.sdks.slice(index - this.comparisonDataPageParam.limit, index)
                }
            })
        },
        handleComparisonDataCurrentChange(val, version) {
            this.comparisonDataPageParam.page = val
            this.comparisonData.forEach(item => {
                if (item.app_version === version) {
                    let index = this.comparisonDataPageParam.limit * this.comparisonDataPageParam.page
                    item.tempData = item.sdks.slice(index - this.comparisonDataPageParam.limit, index)
                }
            })
        }
    }
})
</script>
<style lang="less">
#ratel-release-task-sdk-list {
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

