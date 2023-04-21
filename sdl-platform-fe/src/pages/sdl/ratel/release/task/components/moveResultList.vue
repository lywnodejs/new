<template>
  <div id="ratel-move-task-result-list">
    <el-collapse v-model="activeNames" style="margin:0 20px;">
        <el-collapse-item title="网络请求" name="1">
            <el-form  label-width="100px" label-position='left'>
                <el-form-item label="HTTP敏感信息">
                </el-form-item>
            </el-form>
            <el-table
                :data="http_info_vul"
                v-loading>
                    <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="right" inline class="demo-table-expand">
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="URL： ">
                                        <span class="expand-span">{{ props.row.url }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="BODY: ">
                                        <span class="expand-span">{{ props.row.body }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                    </el-table-column>
                    <el-table-column
                        label="方法"
                        width="80"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.method}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="数据包类型"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.type}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="敏感信息"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.sensitiveInfo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="URL"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.url}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="BODY"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.body}}</span>
                        </template>
                    </el-table-column>
            </el-table>

            <el-form  label-width="100px" label-position='left'>
                <el-form-item label="HTTP协议漏洞">
                </el-form-item>
            </el-form>
            <el-table
                :data="http_protocol_vul"
                v-loading>
                
                    <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="right" inline class="demo-table-expand">
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="URL： ">
                                        <span class="expand-span">{{ props.row.url }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="BODY： ">
                                        <span class="expand-span">{{ props.row.body }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                    </el-table-column>
                    <el-table-column
                        label="方法"
                        width="80"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.method}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="数据包类型"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.type}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="URL"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.url}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="BODY"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.body}}</span>
                        </template>
                    </el-table-column>
            </el-table>

            <el-form  label-width="100px" label-position='left'>
                <el-form-item label="第三方交互数据">
                </el-form-item>
            </el-form>
            <el-table
                :data="http_thirdparty_vul"
                v-loading>
                    <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="right" inline class="demo-table-expand">
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="第三方URL： ">
                                        <span class="expand-span">{{ props.row.thirdpartyURL }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                    </el-table-column>
                    <el-table-column
                        label="第三方URL"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.thirdpartyURL}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="公司名称"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.registrationInfo.CompanyName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="公司类型"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.registrationInfo.CompanyType}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="网站主页"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.registrationInfo.MainPage}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="备案人姓名"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.registrationInfo.Owner}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="备案编号"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.registrationInfo.SiteLicense}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="网站中文名称"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.registrationInfo.SiteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="认证时间"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.registrationInfo.VerifyTime}}</span>
                        </template>
                    </el-table-column>
            </el-table>
            <el-form  label-width="100px" label-position='left'>
                <el-form-item label="跨境传输数据">
                </el-form-item>
            </el-form>
            <el-table
                :data="overseas_info_vul"
                v-loading>
                    <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="right" inline class="demo-table-expand">
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="URL： ">
                                        <span class="expand-span">{{ props.row.url }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="BODY： ">
                                        <span class="expand-span">{{ props.row.body }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                    </el-table-column>
                    <el-table-column
                        label="IP地址"
                        width=""
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.country}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="IP域名"
                        width=""
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.domain}}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column
                        label="跨境IP"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.ip}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="方法"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.method}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="类型"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.type}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="URL"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.url}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="BODY"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.body}}</span>
                        </template>
                    </el-table-column>
            </el-table>
        </el-collapse-item>
        <el-collapse-item title="敏感动作" name="2">
            <el-form  label-width="170px" label-position='left'>
                <el-form-item label="隐私协议前敏感操作" >
                </el-form-item>
            </el-form>
            <el-table
                :data="action_before_policy"
                :default-sort = "{prop: 'name', order: 'descending'}"
                v-loading>
                    <el-table-column
                        label="动作名称"
                        prop="name"
                        sortable
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="直接调用函数"
                        prop="callerFunction"
                        sortable
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.callerFunction}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="监听函数"
                        prop="listenFunction"
                        sortable
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.listenFunction}}</span>
                        </template>
                    </el-table-column>
            </el-table>
            <el-form  label-width="170px"  label-position='left'>
                <el-form-item label="隐私协议后敏感操作" >
                </el-form-item>
            </el-form>
            <el-table
                :data="action_after_policy"
                :default-sort = "{prop: 'name', order: 'descending'}"
                v-loading>
                    <el-table-column
                        label="动作名称"
                        prop="name"
                        sortable
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="直接调用函数"
                        prop="callerFunction"
                        sortable
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.callerFunction}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="监听函数"
                        prop="listenFunction"
                        sortable
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.listenFunction}}</span>
                        </template>
                    </el-table-column>
            </el-table>
        </el-collapse-item>
        <el-collapse-item title="文件读写" name="3">
            <el-form  label-width="170px"  label-position='left'>
                <el-form-item label="文件敏感信息" >
                </el-form-item>
            </el-form>
            <el-table
                :data="file_info_vul"
                v-loading>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="right" inline class="demo-table-expand">
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="路径： ">
                                        <span class="expand-span">{{ props.row.path }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="文件内容： ">
                                        <span class="expand-span">{{ props.row.fileBody }}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                    </el-table-column>
                    <el-table-column
                        label="方法"
                        width="80"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.method}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="路径"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.path}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="敏感信息"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.sensitiveInfo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="文件内容"
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.fileBody}}</span>
                        </template>
                    </el-table-column>
            </el-table>
        </el-collapse-item>
        <el-collapse-item title="日志打印" name="4">
            <el-form  label-width="100px" label-position='left'>
                <el-form-item label="日志">
                </el-form-item>
            </el-form>
            <el-table
                :data="logcat_info_vul"
                v-loading>
                    <el-table-column
                        label="敏感信息"
                        width=""
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.sensitiveInfo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="敏感信息原内容"
                        width=""
                        align="center">
                        <template slot-scope="scope">
                        <span class="ellipsis">{{scope.row.logcatBody}}</span>
                        </template>
                    </el-table-column>
            </el-table>
        </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import {connect} from '@/lib'

export default connect(() => {
    return {
    }
    }, {
        getListByTaskId: 'ratel_project/getListByTaskId',
        getTaskDynamic: 'ratel_assets/getTaskDynamic'
    })({
    data() {
      return {
        ratel_task_id: parseInt(this.$route.query.ratel_task_id),
        value: '',
        data: [],
        queryParam: {
            ratel_task_id: parseInt(this.$route.query.ratel_task_id),
            is_return_all: 0,
            page: 1,
            limit: 10
        },
        action_after_policy: [],
        action_before_policy: [],
        file_info_vul: [],
        http_info_vul: [],
        http_protocol_vul: [],
        http_thirdparty_vul: [],
        overseas_info_vul: [],
        num: 0,
        activeNames: ['1', '2', '3', '4']
      }
    },
    created() {
        this.fetchData()
        this.getTaskDynamic({ratel_task_id: this.ratel_task_id}).then(res => {
            this.action_after_policy = res.action_after_policy ? res.action_after_policy.action_after_policy : []
            this.action_before_policy = res.action_before_policy ? res.action_before_policy.action_before_policy : []
            this.file_info_vul = res.file_info_vul ? res.file_info_vul.file_info_vul : []
            this.http_info_vul = res.http_info_vul ? res.http_info_vul.http_info_vul : []
            this.http_thirdparty_vul = res.http_thirdparty_vul ? res.http_thirdparty_vul.http_thirdparty_vul : []
            this.overseas_info_vul = res.overseas_info_vul ? res.overseas_info_vul.overseas_info_vul : []
            this.http_protocol_vul = res.http_protocol_vul ? res.http_protocol_vul.http_protocol_vul : []
            this.logcat_info_vul = res.logcat_info_vul ? res.logcat_info_vul.logcat_info_vul : []
        })
    },
    props: ['status'],
    watch: {
        'queryParam.is_return_all': {
            handler(val) {
                this.fetchData()
            }
        }
    },
    methods: {
        fetchData() {
            this.getListByTaskId(this.queryParam).then(res => {
                this.num = res.count
                this.data = res.ratel_result_list
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
  #ratel-move-task-result-list {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;  
    box-sizing: border-box;
    .el-collapse-item__content{
        padding-left: 10px !important;
    }
    .ellipsis{
      white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .el-form-item{
        margin-top: 14px !important;
        margin-bottom: 0px !important;
    }
    .el-form-item__content {
        word-break: break-all;
    }
    .demo-table-expand {
        font-size: 0;
        .expand-span{
            width: 70%;
        }
        label {
            width: 90px;
            color: #99a9bf;
        }
        .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
        }
    }
  }
</style>
