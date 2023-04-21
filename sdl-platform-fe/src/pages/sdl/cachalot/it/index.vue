<template>
    <div id="cachalot-domain">
        <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="域名：">
              <el-input class="searchInput"
                        v-model="queryParam.keywords.domain_fullname"
                        placeholder="请输入域名"
                        clearable
                        auto-complete="off">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="DNS解析：">
              <el-input class="searchInput"
                        v-model="queryParam.keywords.dns"
                        placeholder="请输入DNS解析记录"
                        clearable
                        auto-complete="off">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='cachalot-btn' @click="fetchData"><span>搜&nbsp;索</span></button>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    

    <div class="cutLine"></div>

    <el-table
      :data="tableData"
      v-loading>
      <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand" label-width="80px">
            <el-container>
                <el-main width="50%">
                    <el-form-item label="ID:">
                        <span>{{ props.row.id }}</span> 
                    </el-form-item>
                </el-main>
                <el-main width="50%">
                    <el-form-item label="域名:">
                        <span>{{ props.row.domain_fullname }}</span>
                    </el-form-item>
                </el-main>
            </el-container>
            <el-container>
                <el-main width="50%">
                    <el-form-item label="同步时间:">
                        <span>{{ props.row.sync_time }}</span>
                    </el-form-item>
                </el-main>
                <el-main width="50%">
                    <el-form-item label="Git地址:">
                        <span v-for="(item, index) in props.row.new_git_url" :key="index">{{ item }}</span>
                        <i @click="gitDialog(props.row.id, props.row.new_git_url)"
                                    class="el-icon-circle-plus-outline add-icon"></i>
                    </el-form-item>
                </el-main>
            </el-container>
            <el-container>
                <el-main width="50%">
                    <el-form-item label="研发:">
                        <span>{{ props.row.rd }}</span>
                    </el-form-item>
                </el-main>
                <el-main width="50%">
                    <el-form-item label="研发上级:">
                        <span>{{ props.row.rd_leader }}</span>
                    </el-form-item>
                </el-main>
            </el-container>
            <!-- <el-container>
                <el-main width="50%">
                    <el-form-item label="失效时间:">
                        <span>{{ props.row.expire_time }}</span>
                    </el-form-item>
                </el-main>
                <el-main width="50%">
                    <el-form-item label="创建人:">
                        <span>{{ props.row.creator }}</span>
                    </el-form-item>
                </el-main>
            </el-container> -->
            <el-container>
                <el-main width="50%">
                    <el-form-item label="运维:">
                        <span>{{ props.row.op }}</span>
                    </el-form-item>
                </el-main>
                <el-main width="50%">
                    <el-form-item label="部门:">
                <span>{{ props.row.dept_name }}</span>
              </el-form-item>
                </el-main>
            </el-container>
            <el-container>
                <el-main width="50%">
                    <el-form-item label="备注:">
                        <span>{{ props.row.remark }}</span>
                    </el-form-item>
                </el-main>
            </el-container>

            <div v-if="props.row.is_kylin||props.row.is_didiyun" class="kylinCutLine"></div>
            <div v-if="props.row.is_kylin">
                <div class="kylinTitle">麒麟网关信息：</div>
                <div v-for="(item, index) in props.row.kylin_public_service_list" :key="index">
                    <el-container>
                    <el-main width="50%">
                        <el-form-item label="服务ID:">
                            <span>{{ item.service_id }}</span>
                        </el-form-item>
                    </el-main>
                    <el-main width="50%">
                        <el-form-item label="服务名:">
                            <span>{{ item.service_name }}</span>
                        </el-form-item>
                    </el-main>
                </el-container>
                <el-container>
                    <el-main width="50%">
                        <el-form-item label="创建人:">
                            <span>{{ item.owner }}</span>
                        </el-form-item>
                    </el-main>
                    <el-main width="50%">
                        <el-form-item label="部署环境:">
                            <span>{{ item.deploy_env_tag }}</span>
                        </el-form-item>
                    </el-main>
                </el-container>
                <el-container>
                     <el-main width="50%">
                        <el-form-item label="Git仓库:">
                            <span>{{ item.git_url }}</span>
                        </el-form-item>
                    </el-main>
                    <el-main width="50%">
                        <el-form-item label="下游节点:">
                            <span>{{ JSON.parse(item.target_list).join(', ') }}</span>
                        </el-form-item>
                    </el-main>
                </el-container>
                <el-container>
                    <el-main width="50%">
                        <el-form-item label="语言:">
                            <span>{{ item.language }}</span>
                        </el-form-item>
                    </el-main>
                    <el-main width="50%">
                        <el-form-item label="框架:">
                            <span>{{ item.framework }}</span>
                        </el-form-item>
                    </el-main>
                </el-container>
                <el-container>
                    <el-main width="50%">
                        <el-form-item label="服务描述:">
                            <span>{{ item.service_desc }}</span>
                        </el-form-item>
                    </el-main>
                    <el-main width="50%">
                    </el-main>
                </el-container>
                <div v-show="index != props.row.kylin_public_service_list.length-1" class="kylinCutLine"></div>
                </div>
            </div>
            <div v-if="props.row.is_kylin&&props.row.is_didiyun" class="kylinCutLine"></div>
            <div v-if="props.row.is_didiyun">
                <div class="didiyunTitle">滴滴云信息：</div>
                <div v-for="(item, index) in props.row.didiyun_waf_domain_list" :key="index">
                    <el-container>
                    <el-main width="50%">
                        <el-form-item label="租户ID:">
                            <span>{{ item.owner_id }}</span>
                        </el-form-item>
                    </el-main>
                    <el-main width="50%">
                        <el-form-item label="IP类型:">
                            <span>{{ item.ip_type }}</span>
                        </el-form-item>
                    </el-main>
                </el-container>
                <el-container>
                    <el-main width="50%">
                        <el-form-item label="IP:">
                            <span>{{ item.ip }}</span>
                        </el-form-item>
                    </el-main>
                    <el-main width="50%">
                        <el-form-item label="端口:">
                            <span>{{ item.port }}</span>
                        </el-form-item>
                    </el-main>
                </el-container>
                <div v-show="index != props.row.didiyun_waf_domain_list.length-1" class="kylinCutLine"></div>
                </div>
            </div>

            </el-form>
            
          </template>
        </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        sortable
        align="center"
        width="60">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="域名"
        sortable
        min-width="165"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.domain_fullname}}
          </span>
          
        </template>
      </el-table-column>
      <el-table-column
        label="DNS解析"
        sortable
        align="center"
        min-width="235">
        <template slot-scope="scope">
          <div>{{scope.row.dns}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="RD"
        sortable
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-button class="button" type="text" size="mini" @click="bounceDchat(scope.row.rd)">{{scope.row.rd}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="部门"
        sortable
        align="center"
        min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.dept_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="60">
        <template slot-scope="scope" prop="is_disable">
          <el-button class="button" type="text" size="mini" @click="openDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div align="right" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page"
        :page-sizes="[10,20,30,50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
    </div>
    <add-info-dialog :visible='dialogFormVisible' @dialog='getDialog' :data='scopeRow'></add-info-dialog>
    <add-git-dialog :visible='dialogVisible' @dialog='getItDialog' :data='scopeRows' @updateData='updateDomainGit'></add-git-dialog>
    </div>
</template>
<script>
import { connect } from '@/lib'
import addInfoDialog from './components/addInfoDialog'
import addGitDialog from './components/addGitDialog'

export default connect(() => {
  return {
  }
}, {
  getItDomain: 'cachalot_domain/getItDomain'
})({
    data() {
        return {
            tableData: [],
            queryParam: {
                page: 1,
                limit: 20,
                keywords: {
                    domain_fullname: '',
                    dns: ''
                }
            },
            updateDomain: {
                domain_fullname: '',
                dept_id: null,
                is_offsite: '0',
                is_outsource: '0'
            },
            num: 0,
            dialogFormVisible: false,
            dialogVisible: false,
            scopeRow: null,
            scopeRows: null
        }
    },
    mounted() {
    },
    created() {
        this.fetchData()
    },
    components: {addInfoDialog, addGitDialog},
    methods: {
        fetchData() {
            let postJson = this.queryParam
            this.getItDomain(postJson).then(res => {
                this.num = res.count
                this.tableData = res.cmdb_domain_list
            })
        },
        openDialog(text) {
            this.scopeRow = text
            this.dialogFormVisible = true
        },
        gitDialog(id, url) {
            this.scopeRows = {
                it_domain_id: id,
                git_url: url
            }
            this.dialogVisible = true
        },
        getDialog(val) {
            this.dialogFormVisible = val
        },
        getItDialog(val) {
            this.dialogVisible = val
        },
        updateDomainGit(data) {
            this.fetchData()
            this.tableData.forEach(element => {
                if (element.domain_id === element.domain_id) {
                    element.git_url_by_id_relate_git = element.git_url
                }
            });
        },
        bounceDchat(name) {
            let url = 'dchat://im/start_conversation?name=' + name
            window.open(url, '_self')
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
#cachalot-domain {
      .cachalot-btn {
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
    .searchInput {
        width: 240px;
    }
    .table-expand {
        padding: 10px 20px;
        .add-icon {
            color: #fc9153;
            font-size: 18px;
            cursor: pointer;
            position: relative;
            margin-top: 2px;
        }
    }
    .updateInput {
        width: 280px;
    }
    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 95%;
        word-wrap: break-word;
        span {
        display: inline-block;
        width: 100%;
        font-size: 12.5px;
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
    .kylinCutLine {
      // border: 1px solid
      margin-top: 5px;
      margin-bottom: 5px;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.10);
      // background: rgba(0, 0, 0, 0.10);
      // border-radius: 4px;
    }
    // .el-form-item__label{
    //     width: 60px !important;
    // }
    .kylinTitle{
        color: #fc9153;
    }
    .didiyunTitle{
        color: #409eff;
    }
    .diaolog-button {
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        font-size: 13px;
    }

    .diaolog-btn {
        background: #FC9153;
        border-radius: 4px;
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        font-size: 13px;
        border: none;
    }
    .myWidth{
        color: #666666;
        width: 130px;
    }
    .myWidth1{
        margin-left: 25px;
        color: #666666;
        width:130px;
    }
    .myWidth2{
        margin-left: 25px;
        color: #666666;
        width:130px;
    }
    .router{
        background-color: rgba(103, 194, 58, 0.1);
        color: #67c23a;
        display: inline-block;
        padding: 0 10px;
        -webkit-font-smoothing: antialiased;
        height: 26px;
        line-height: 23px;
        font-size: 12px;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid rgba(103, 194, 58, 0.2);
        white-space: nowrap;
    }
    .kylin {
        background-color: rgba(250, 137, 25, 0.1);
        display: inline-block;
        padding: 0 10px;
        -webkit-font-smoothing: antialiased;
        height: 26px;
        line-height: 23px;
        font-size: 12px;
        color: #fc9153;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid rgba(250, 137, 25, 0.2);
        white-space: nowrap;
    }
    .didiyun {
        background-color: #ecf5ff;
        display: inline-block;
        height: 26px;
        padding: 0 10px;
        line-height: 23px;
        font-size: 12px;
        color: #409eff;
        border: 1px solid #d9ecff;
        border-radius: 4px;
        box-sizing: border-box;
        white-space: nowrap;
    }
    .out-system{
        color: #f56c6c;
        background: #fef0f0;
        display: inline-block;
        height: 20px;
        padding: 0 5px;
        line-height: 17px;
        font-size: 12px;
        border: 1px solid #fbc4c4;
        border-radius: 4px;
        box-sizing: border-box;
        white-space: nowrap;
        width: 36px !important;
    }
}
</style>

