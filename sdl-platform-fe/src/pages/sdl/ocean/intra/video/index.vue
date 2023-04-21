<template>
  <div id="ocean-intra-video">
    <video-coverage></video-coverage>
    <div class="designTitle" style="margin:20px 0 15px 0">视频NPS</div>
    <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="时间范围:">
            <el-date-picker class="searchInput"
                    v-model="value"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="dataChange">
            </el-date-picker>
        </el-form-item>
      </div>
      <!-- <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='dorado-btn' @click="fetchData"><span>搜&nbsp;索</span></button>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <div class="cutLine"></div>

    <el-table
      :data="tableData"
      v-loading>
      <el-table-column
        label="视频名"
        width="210"
        sortable
        prop="title"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="作者"
        width="110"
        prop="author"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建者"
        width="110"
        prop="data.creator"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.data.creator}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="NPS值"
        width="110"
        sortable
        prop="nps_evaluate"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.data.nps_evaluate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提升建议"
        sortable
        prop="improve_suggest"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.data.improve_suggest.join(',')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        width="110"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.data.description}}</span>
        </template>
      </el-table-column>
      
      <el-table-column
        label="创建时间"
        prop="create_time"
        width="180"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.create_time}}</span>
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
  </div>
</template>
<script>
 import {connect} from '@/lib'
 import videoCoverage from './components/videoCoverage'

  export default connect(() => {
    return {
    }
  }, {
    videoNpsDetails: 'ocean_video/videoNpsDetails'
  })({
    data() {
      return {
        value: '',
        queryParam: {
            start_day: '',
            end_day: '',
            limit: 20,
            page: 1
        },
        num: 0,
        tableData: [],
        coverageData: {},
        dept_id: 100561
      }
    },
    components: {videoCoverage},
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.videoNpsDetails(this.queryParam).then(res => {
                this.tableData = res.nps_details
                this.num = res.num
            })
        },
        dataChange(value) {
            this.queryParam.start_day = value[0]
            this.queryParam.end_day = value[1]
            this.fetchData()
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
#ocean-intra-video{
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
                .href{
                  color: #fc9153;
                  font-size: 13px;
                  text-decoration: underline;
                  cursor: pointer;
                }
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
                .href{
                  color: #fc9153;
                  font-size: 13px;
                  text-decoration: underline;
                }
                .el-tag{
                  position: relative;
                  top: -2px;
                  height: 25px;
                  line-height: 23px;
                }
            }
          }
        }
}
</style>

