<template>
    <div id="octopus-grpup-project-detail">
        <div class="el-main">
        <h4 class="myH4">团队信息</h4>
        <div class="basicContentDisplay" id="basicContentDisplay">
          <div class="items">
            <span class="c1">项目编号：</span>
            <span class="c2">{{detail.octopus_group_project_id}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">项目名称：</span>
            <span class="c2">{{detail.group_project_name}}</span>
          </div>
          
          <div class="items">
            <span class="c1">项目类型：</span>
            <span class="c2">{{detail.group_project_type==1?'团队项目':'默认项目'}}</span>
          </div>
          <div class="rightItem">
              <span class="c1">创建人：</span>
            <span class="c2">{{detail.creator_zh}}</span>
            
          </div>
           <div class="items">
            <span class="c1">创建时间：</span>
            <span class="c2">{{detail.create_time}}</span>
          </div>
          <div class="rightItem">
              <span class="c1">所属部门：</span>
            <span class="c2">{{detail.dept_name}}</span>
          </div>
          <div class="items">
            
            <span class="c1">Git 路径：</span>
            <span class="c2"><span v-for="item in detail.git_url" :key="item">{{item}}<br></span></span>
          </div>
          <div class="rightItem">
          </div>
      </div>
 <!-- 任务列表 -->
      <div class="task">
        <div class="myH4">模板列表
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            size="mini"
            class="newTemplate-btn"
            @click="openDialog(1)">
            新建模板
          </el-button>
        </div>
        
        <el-table
          :data="template"
          v-loading>
          <el-table-column
            label="模板ID"
            width="130"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.octopus_group_template_id}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="扫描流量筛选"
            width=""
            align="center">
            <template slot-scope="scope">
              <span>host：{{scope.row.filter.host.join(',')}}</span>&nbsp;&nbsp;<span>URL关键字：{{scope.row.filter.uri_black_word}}</span><br>
              <span>开始时间：{{scope.row.filter.start_time}}</span>&nbsp;&nbsp;<span>结束时间：{{scope.row.filter.end_time}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="身份认证参数标注"
            width=""
            align="center">
            <template slot-scope="scope">
              <div  v-for="(item, index) in scope.row.locator" :key="index">
                <div>参数组{{index+1}}：{{handleFilter(item)}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="100"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.create_time.split(' ')[0]}}<br>{{scope.row.create_time.split(' ')[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button type="text">
                <span class="opera" @click="openDialog(2, scope.row)">编辑</span>&nbsp;
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div align="right" style="margin-top: 10px;">
        </div>
      </div>

    </div>
    <div class="follower">
        <!-- <h3>关注人列表</h3> -->
        <div class="followerTitle">关注人列表</div>
        <div class="followTag">
          <el-tag type="info" v-for="item in followers" :key="item.account" class="tag"><span @click="bouncePerson(item.account)">{{item.name_zh}}</span></el-tag>
        </div>
        <app-employee class="inputFollow" v-model="follower" multiple></app-employee>
        <button class="follower-btn" type="button" @click="addFollower(octopus_group_project_id, follower)">添&nbsp;加</button>
    </div>


    <template-dialog :dialogVisible='dialogFormVisible' :octopusId='$route.query.id' @projectDialog='getFormDialog'></template-dialog>
    <update-template-dialog :dialogUpdateVisible='dialogUpdateFormVisible' @projectUpdateDialog='getUpdateFormDialog'
                           :octopusId='$route.query.id' :data='scopeRow'>
    </update-template-dialog>
    </div>
</template>
<script>
import {connect} from '@/lib'
import templateDialog from './dialog/newTemplateDialog'
import updateTemplateDialog from './dialog/updateTemplateDialog'

  export default connect(() => {
    return {
    }
  }, {
      getDetailGroupProjectByID: 'octopus_group/getDetailGroupProjectByID',
      getTemplateByProjectId: 'octopus_group/getTemplateByProjectId',
      getfollowerGroupProject: 'octopus_group/getfollowerGroupProject',
      addfollowerGroupProject: 'octopus_group/addfollowerGroupProject'
  })({
    data() {
        return {
          octopus_group_project_id: null,
          num: 0,
          detail: {},
          keyArray: [{value: 'QUERY', label: 'Query'}, {value: 'HEADER', label: 'Header'}, {value: 'BODY', label: 'Body'}],
          template: null,
          dialogFormVisible: false,
          dialogUpdateFormVisible: false,
          scopeRow: null,
          followers: [],
          follower: []
        }
    },
    components: {templateDialog, updateTemplateDialog},
    created() {
        this.fetchData()
        this.getTemplate()
        this.getFollower(this.octopus_group_project_id)
    },
    methods: {
        fetchData() {
            this.octopus_group_project_id = parseInt(this.$route.query.id)
            let queryParam = {octopus_group_project_id: this.octopus_group_project_id}
            this.getDetailGroupProjectByID(queryParam).then(res => {
                this.detail = res.data

                // this.num = res.data.length
                this.detail.git_url = this.detail.git_url.split(',')
            })
        },
        getTemplate() {
            this.octopus_group_project_id = parseInt(this.$route.query.id)
            let queryParam = {octopus_group_project_id: this.octopus_group_project_id}
            this.getTemplateByProjectId(queryParam).then(res => {
                this.template = res.data
            })
        },
        openDialog(type, scopeRow) {
          if (type === 1) {
            this.dialogFormVisible = true
          } else if (type === 2) {
            this.dialogUpdateFormVisible = true
            this.scopeRow = scopeRow
          }
        },
        handleFilter(item) {

          // let query = [], header = [], body = []
          let str = ''

          // new Promise(function(resolve) {
          //   item.forEach(element => {
          //     if (element.Header != undefined) {
          //       header.push(element.header)
          //     }
          //     if (element.Query != undefined) {
          //       query.push(element.Query)
          //     }
          //     if (element.Body != undefined) {
          //       body.push(element.body)
          //     }
          //   })
          //   resolve()
          // }).then(() => {
          //   let str = query.join(',') == '' ? '' : 'Query：' + query.join(',')
          //   let str1 = header.join(',') == '' ? '' : 'Header：' + header.join(',')
          //   let str2 = body.join(',') == '' ? '' : 'Body：' + body.join(',')
          //   console.log(str + str1 + str2)
          //   return (str + str1 + str2)
          // })

          item.forEach(element => {
              let a = Object.keys(element).join(',')
              str += str == '' ? this.handleTag(a) + ':' + element[a] : ' , ' + this.handleTag(a) + ':' + element[a]
          })
          return str
        },
        addFollower(id, followers) {
          this.addfollowerGroupProject({octopus_group_project_id: id, follower_list: followers}).then(res => {
            this.getFollower(id)
            this.follower = []
          })
        },
        getFollower(id) {
          this.getfollowerGroupProject({octopus_group_project_id: id}).then(res => {
            this.followers = res.data
          })
        },
        bouncePerson(name) {
          let url = 'http://i.xiaojukeji.com/space/personal/' + name
          window.open(url)
        },
        getFormDialog(val) {
            this.dialogFormVisible = val
        },
        getUpdateFormDialog(val) {
            this.dialogUpdateFormVisible = val
        },
        handleTag(keyTag) {
          for (let index = 0; index < this.keyArray.length; index++) {
              if (this.keyArray[index].value == keyTag) {
                  return this.keyArray[index].label
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
#octopus-grpup-project-detail {
     margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        // margin-top: -15px;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        .el-main {
          .task {
            margin-top: 30px;
          }
          .myH4{
            color: #333333;
            font-size: 14px;
            margin: 0;
            font-weight: normal;
            margin-bottom: 20px;
          }
            width: 100%;
            box-sizing: border-box;
            background: white;
            .displayFlex {
                display: flex;
            }
            .searchForm {
                .searchInput {
                  width: 320px;
                }
            }
          .aLink{
            color: #FC9153;
          }
          .el-tag{
            height: 25px;
            line-height: 25px;
          }
          .blue{
            background-color: rgba(64,158,255,.1);
            color: #409eff;
            border: 1px solid rgba(64,158,255,.2);
          }
        }
        .basicContentDisplay {
          margin-top: 10px;
          padding-bottom: 10px;
          display: flex;
          flex-wrap: wrap;
          background: #ffff;
          box-sizing: border-box;
          border: 1px solid #e2e2e2;
          border-radius: 8px;
          font-size: 13px;
          .items {
            padding-top: 10px;
            flex: 1;
            flex-basis: 40%;
            justify-content: center;
            display: flex;
            // font-size: 15px;
            font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
            color: gray;
            .c1 {
                flex: 2;
                text-align: left;
                padding-left: 20px;
            }
            .c2 {
                flex: 5;
                color: black;
                font-family: PingFang-SC;
            }
          }
          .rightItem {
            padding-top: 10px;
            flex: 2;
            flex-basis: 60%;
            justify-content: center;
            display: flex;
            // font-size: 15px;
            font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
            color: gray;
            .c1 {
                flex: 2;
                text-align: left;
                padding-left: 20px;
            }
            .c2 {
                flex: 11;
                color: black;
                font-family: PingFang-SC;
            }
          }
        }
        .follower {
          margin-top: 30px;
          .followTag {
            margin-top: 10px;
            .tag {
              border: none;
              color: #fc9153;
              background: white;
              font-size: 12px;
              height: 32px;
              span{
                font-weight: 400;
                cursor: pointer;
              }
            }
          }
          span {
            font-weight: bold;
          }
          .inputFollow {
            margin-top: 10px;
            width: 100%;
          }
          .follower-btn {
            height: 32px;
            width: 100px;
            text-align: center;
            padding: 5px;
            border: 1px solid #fc9153;
            background: #fc9153;
            border-radius: 4px;
            // font-weight: 100;
            color: white;
            cursor: pointer;
            margin-top: 15px;
            font-size: 12px;
          }
        }
        .linkClass{
          cursor: pointer;
          color: #FC9153;
        }

        .opera {
        color: #FC9153;
        cursor: pointer;
        // display: inline-block;
        // margin-left: 5px;
    } 
    .newTemplate-btn {
      background: white;
      color: #fc9153 !important;
      border-radius: 4px;
      float: right;
      margin-left: 15px;
      border: 1px solid #fc9153;
      height: 28px;
      width: 96px;
      position: relative;
      top: -2px;
    }
    .newTemplate-btn:hover {
      background: #fff7f2;
    }
}
</style>

