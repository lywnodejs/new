<template>
  <div id="ratel-selfService-detail" v-loading="loading">
      <el-button type="primary" class="export-pdf" @click="pdf">导出PDF</el-button>
    <div class="base-info">
        <!-- <div>基本信息</div> -->
        <div class="base-info__box">
            <img v-if="base_info.icon_link" :src="base_info.icon_link" alt="" class="base-info__box__picture">
            <img v-else-if="base_info.app_type=='ipa'" src="@/assets/apple.png" alt="" class="base-info__box__picture">
            <img v-else-if="base_info.app_type=='apk'" src="@/assets/android.jpeg" alt="" class="base-info__box__picture">
            <div class="base-info__box__content">
                <div class="base-info__box__content__appName">{{base_info.app_name}}</div>
                <div class="base-info__box__content__info">类型：{{base_info.app_type === 'ios' ? 'IOS': base_info.app_type}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 版本：{{base_info.app_version}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 包名：{{base_info.app_package_name}}</div>
                <div class="base-info__box__content__info">MD5：{{base_info.app_md5}}</div>
                <div class="base-info__box__content__info" v-show="!isZip">证书：{{base_info.certification}}</div>
                <div class="base-info__box__content__info">上传人：
                    <a :href="bounceDChat(base_info.rd)">
                        <i class="base-info__box__content__info__engineerLogo"><img src="@/assets/D-Chat_logo.svg" alt="" style="width:14px;height:14px;"></i>
                        <span class='base-info__box__content__info__engineerName'>{{base_info.rd_zh}}</span>
                    </a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传时间：{{base_info.task_create_time}}</div> 
                    <div class="base-info__box__content__info">部门：{{base_info.dept_name}}</div>
                <div><a :href="base_info.app_url" class="base-info__box__content__href">APP下载地址</a><br></div>
            </div>
        </div>
    </div>
    <el-collapse v-model="activeNames" class="collapse-info">
        <el-collapse-item v-show="!isZip" :title='"引用SDK列表（"+ sdk_info.length + "个）"' name="1" >
            <div class="collapse-info__box">
                <span v-for="(item,index) in sdk_info" :key="index">{{item}}</span>&nbsp;
                <span></span>
            </div>
        </el-collapse-item>
        <el-collapse-item v-show="!isZip" :title='"申请权限列表（"+ permission_info.length + "个）"' name="2">
            <div class="collapse-info__box">
                <span v-for="(item, index) in permission_info" :key="index">{{item}}</span>&nbsp;
                <span></span>
            </div>
        </el-collapse-item>
        <el-collapse-item v-show="!isZip" :title='"风险列表（"+ vulTotle + "个）"' name="3">
             <el-table :show-header='false'
                :data="vul_info">
                <el-table-column type="expand" label="">
                <template slot-scope="props"><i class="vul-info__box__expand__i">风险点:（{{props.row.vul_list.length}}个）</i>
                    <div class="vul-info__box__expand" v-for="(item, index) in props.row.vul_list" :key="index">
                        <!-- <span class="vul-info__box__expand__ID"><pre>ID: {{item.ratel_project_id}}</pre> </span> -->
                        <span class="vul-info__box__expand__name">类名:  {{item.issue_class}}</span>
                        <span class="vul-info__box__expand__method">方法名: {{item.issue_method}}</span>
                    </div>
                </template>
                </el-table-column>
                <el-table-column
                    prop="vul_level_id"
                    label="漏洞等级"
                    width="150"
                    align="center">
                    <template slot-scope="scope">
                        <span>{{judgeVulLevel(scope.row.vul_level_id)}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="mobile_rule_name"
                    label="漏洞名称"
                    min-width="400"
                    align="left">
                </el-table-column>
                
                <el-table-column
                align="center"
                label="操作"
                width="300">
                <template slot-scope="scope">
                     <router-link style="color:#FC9153" :to="{ path : '/sdl/dolphin/vulnerability/knowledgeDetail', query: {knowledgeId: scope.row.vul_knowledge_id}}" target=_blank>
                        查看漏洞知识
                    </router-link>
                </template>
                </el-table-column>
            </el-table>
        </el-collapse-item>
        <el-collapse-item v-show="isZip" :title='"动态沙箱检测结果"' name="4">
             <move-info></move-info>
        </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import {connect} from '@/lib'
import * as CONSTANTS from '@/commons/ratel';
import moveInfo from './components/moveInfo'
export default connect(() => {
    return {
    }
    }, {
        getResultByTaskId: 'ratel_selfService/getResultByTaskId',
        getOneTimeByPackageName: 'ratel_selfService/getOneTimeByPackageName'
    })({
    data() {
      return {
        base_info: '',
        sdk_info: '',
        permission_info: '',
        vul_info: [],
        activeNames: ['3'],
        vulLevel: CONSTANTS.vulLevel,
        vulTotle: 0,
        loading: true,
        isZip: false
      }
    },
    components: {moveInfo},
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.getResultByTaskId({ratel_onetime_task_id: this.$route.query.ratel_onetime_task_id}).then(res => {
                this.base_info = res.base_info
                this.sdk_info = res.sdk_info
                this.permission_info = res.permission_info
                this.vul_info = res.vul_info
                this.vulTotle = 0
                for (let i = 0; i < this.vul_info.length; i++) {
                    this.vulTotle += this.vul_info[i].vul_list.length
                }
                if (this.base_info.app_type === 'Android' || this.base_info.app_type === 'ios') {
                    this.isZip = true
                    this.activeNames = ['4']
                }
                this.loading = false
            })
        },
        pdf() {
          this.$getPdf(`详情`, '#ratel-selfService-detail')
        },
        judgeVulLevel(id) {
            for (let i = 0; i < this.vulLevel.length; i++) {
                if (this.vulLevel[i].value === id) {
                    return this.vulLevel[i].label
                }
            }
        },
        bounceDChat(sdlDngineer) {

            // let url = 'dingtalk://dingtalkclient/action/sendmsg?dingtalk_id='
            let url = 'dchat://im/start_conversation?name='
            url = url + sdlDngineer
            return url
        }
    }
  })
</script>
<style lang="less">
  #ratel-selfService-detail {
      font: normal 14px/1.5em 'Microsoft YaHei', '微软雅黑', arial, helvetica, sans-serif;
      .el-loading-mask {
          top: -5px;
      }
    .export-pdf{
        float: right;
    }
    .base-info{
        margin: 10px 0 20px 0;
        &__box{
            padding: 0 20px;
            display: flex;
            &__picture{
                display: inline-block;
                margin: 10px;
                border-radius: 8px;
                width: 100px;
                height: 100px;
            }
            &__content{
                margin-left: 30px;
                display: inline-block;
                margin-top: -5px;
                color: #303133;
                &__appName{
                    font-size: 20px;
                    margin-bottom: 5px;
                }
                &__info{
                    font-size: 13px;
                    &__engineerLogo{
                        position: relative;
                        top:2px;
                    }
                    &__engineerName{
                        margin-left: -3px;
                        color: #fc9153;
                    }
                }
                &__href{
                    color: #fc9153;
                    font-size: 13px;
                    text-decoration: underline;
                }
            }
        }
    }
    .collapse-info{
        margin-bottom: 20px;
        .el-table__expanded-cell{padding: 10px;}
        // .el-table__row>td{
        //     border: none;
        // }
        .el-table::before {
            left: 0;
            bottom: 0;
            width: 100%;
            height: 0px;
        }
        &__box{
            display: flex;
            width: 100%;
            // justify-content: space-around;
            flex-wrap: wrap;
            line-height: 25px;
            span{
                color: #616367;
                flex-flow: 1;
                padding-left: 20px;
                width: 40%;
                margin: 0 auto;
                align-self: center;
                font-size: 12.5px;
                font-style: monospace;
            }
        }
    }
    .vul-info{
        &__box{
            &__expand{
                display: flex;
                width: 98%;
                justify-content: space-around;
                line-height: 25px;
                padding-left: 30px;
                overflow: hidden;
                &__name{
                    // flex-flow: 1;
                    flex-basis: 50%;
                    word-wrap:break-word;
                    overflow-wrap: break-word;
                    word-break: break-all;
                }
                &__method{
                    // flex-flow: 1;
                    flex-basis: 50%;
                    word-wrap:break-word;
                    word-break: break-all;
                    padding-left: 10px;
                }
                &__i{
                    position: relative;
                    margin-left: 5px;
                }
            }
            &__expand:hover{
                background: rgba(32, 159, 255, 0.06);
            }
        }
    }
  }
</style>

