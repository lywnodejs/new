<template>
  <div id="ratel-falsePositive">
      <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="项目ID:">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.ratel_project_id"
                    clearable
                    placeholder="请输入项目ID"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="规则名称:" style="margin-left: 50px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.mobile_rule_name_en"
                    clearable
                    placeholder="请输入规则名称"
                    auto-complete="off">
          </el-input>
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
                label="误报规则ID"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.ratel_fp_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="项目ID"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.ratel_project_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="规则名称"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.mobile_rule_name_en}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="类名"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.issue_class}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="方法名"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.issue_method}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span class="opera" @click="open(scope.row.ratel_fp_id)">删除</span>
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
export default connect(() => {
    return {
    }
    }, {
        getFpList: 'ratel_falsePositive/getFpList',
        deleteFpById: 'ratel_falsePositive/deleteFpById'
    })({
    data() {
      return {
        data: [],
        queryParam: {
            keywords: {
                ratel_project_id: null,
                mobile_rule_name_en: ''
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
    methods: {
        fetchData() {
            this.getFpList(this.queryParam).then(res => {
                this.num = res.count
                this.data = res.ratel_false_positive_list
            })
        },
        deleteById(id) {
            this.deleteFpById({ratel_fp_id: id}).then(res => {
                console.log(res)
                this.fetchData()
            })
        },
        open(id) {
            this.$confirm('确认删除该规则?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.deleteById(id)
            }).catch(() => {
            });
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
  #ratel-falsePositive {
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
  }
</style>