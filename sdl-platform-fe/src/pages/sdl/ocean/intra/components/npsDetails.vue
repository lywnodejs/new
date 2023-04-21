<template>
  <div id="ocean-nps-evaluate-detail">
    <el-button @click="getNpsDatails" class="nps-xslx-btn">导出NPS EXCEL</el-button>
    <el-table
      :data="tableData"
      :default-sort = "{prop: 'data.nps_evaluate', order: 'descending'}"
      v-loading>
      <el-table-column
        prop="data.sdl_project_id"
        label="项目ID"
        sortable
        align="center"
        width="85">
        <template slot-scope="scope">
          <span> <a style="color: #fc9153" :href="`/sdl/dorado/baseline/ProjectWorkflow?projectId=`+ scope.row.data.sdl_project_id" target="_blank">{{scope.row.data.sdl_project_id}}</a> </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="data.nps_evaluate"
        label="评分"
        sortable
        align="center"
        width="70">
        <template slot-scope="scope">
          <span>{{scope.row.data.nps_evaluate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="data.creator"
        label="创建人"
        sortable
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.data.creator}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sdl_engineer"
        label="安全工程师"
        align="center"
        width="85">
        <template slot-scope="scope">
          <span>{{ handleEngineer(scope.row.sdl_engineer)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="round"
        label="检测轮次"
        align="center"
        width="80">
        <template slot-scope="scope">
          <span>{{scope.row.round}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="data.improve_suggest"
        label="评分依据"
        align="center">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.data.improve_suggest" :key="index">{{item.split('（')[0]}} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="data.description"
        label="建议"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.data.description}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="跟进原因">
          <template slot-scope="scope">
            {{ scope.row.data.sdlRemark }}
            <br><a style="color:#fc9153" @click="open(scope.row.id, scope.row.data.sdlRemark)">修改/添加</a>
          </template>
      </el-table-column>
      <el-table-column
        prop="project_check_issue_time"
        label="首轮人工审计时长"
        align="center"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.project_check_issue_time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="project_finish_time"
        label="项目完成时长"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.project_finish_time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="create_time"
        width="100"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{tranTime(scope.row.create_time)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div align="right" style="margin-top: 10px;">
      <!-- <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination> -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10,20,30,50, 1000]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import * as CONSTANTS from '@/commons/dorado'

  export default connect(() => {
    return {
    }
  }, {
    npsHighStartByTime: 'ocean_baseline/npsHighStartByTime',
    npsLowStartByTime: 'ocean_baseline/npsLowStartByTime',
    npsDetails: 'ocean_baseline/npsDetails',
    npsOcean: 'ocean_baseline/npsOcean',
    updateQuestionnaire: 'ocean_baseline/updateQuestionnaire'
  })({
    data() {
      return {
          tableData: [],
          tempData: [],
          num: 0,
          page: 1,
          limit: 20,
          engineer: CONSTANTS.engineer
      }
    },
    created() {
        this.fetchData()
    },
    mounted() {
    },
    watch: {
        time(val) {
            this.fetchData()
        }
    },
    props: ['time'],
    components: {},
    methods: {
      fetchData() {
        let params = {
          start_day: this.time[0],
          end_day: this.time[1],

          // index: 'nps_evaluate',
          // rate_type: 'all'
          page: this.page,
          limit: this.limit
        }
        this.npsDetails(params).then(res => {
            this.tempData = []
            this.tableData = res.nps_details
            this.num = res.count
        })
      },
      async open(id, remark) {
        await this.$prompt('', '跟进原因', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: remark,
          inputType: 'textarea',
          customClass: 'remarkBox'
        }).then(({ value }) => {
          this.remark = value
          this.updateQuestionnaire({id: id, data: {sdlRemark: this.remark}}).then(res => {
            this.fetchData()
          })
          this.fetchData()
        }).catch(() => {
          this.$message({
            message: '输入失败',
            type: 'warning'
          });
        });
      },
      getNpsDatails() {
        let data = this.tableData
        let jsonData = []
        for (let i = 0; i < data.length; i++) {
              jsonData.push({
                nps_evaluate: data[i].data.nps_evaluate,
                low_efficiency: parseInt(data[i].data.nps_evaluate) >= 9 ? ' ' : data[i].data.improve_suggest.join(';').replace(/,/g, '，'),
                high_efficiency: parseInt(data[i].data.nps_evaluate) >= 9 ? data[i].data.improve_suggest.join(';').replace(/,/g, '，') : ' ',
                description: data[i].data.description ? data[i].data.description.replace(/,/g, '，').replace(/[\r\n]/g, '') : ' ',
                sdlRemark: data[i].data.sdlRemark ? data[i].data.sdlRemark.replace(/,/g, '，').replace(/[\r\n]/g, '') : ' ',
                sdl_project_id: data[i].data.sdl_project_id,
                creator: data[i].data.creator,
                create_time: this.tranTime(data[i].create_time)
              })
        }
        this.tableToExcel(jsonData)
      },
      tableToExcel(jsonData) {

        //  列标题，逗号隔开，每一个逗号就是隔开一个单元格
        let str = `根据您最近一次在SDL完成的安全评估，您有多大可能推荐给同事,请问您觉得安全评估在以下哪些方面做出改善，您会愿意给出更高的分数？,请问您刚才给出xx分数的主要原因是？,关于安全评估如果您还有其他意见或建议，欢迎您的反馈：,跟进原因,项目ID,提交人,提交时间\n`;

        //  增加\t为了不让表格显示科学计数法或者其他格式
        for (let i = 0; i < jsonData.length; i++) {
          for (let item in jsonData[i]) {
            if (jsonData[i][item]) {
              str += `${jsonData[i][item] + '\t'},`
            }
          }
          str += '\n';
        }

        //  encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);

        //  通过创建a标签实现
        let link = document.createElement('a');
        link.href = uri;

        //  对下载的文件命名
        link.download = 'nps指标数据.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      tranTime(time) {
        if (time) {
            time = time + '+0800'
            let data = new Date(time);
            let y = data.getFullYear();
            let M = data.getMonth() + 1;
            let d = data.getDate();
            let h = data.getHours();
            let m = data.getMinutes();
            let s = data.getSeconds();
            return y + '-' + this.addZero(M) + '-' + this.addZero(d) + ' ' + this.addZero(h) + ':' + this.addZero(m) + ':' + this.addZero(s);
        }
        return '';
      },
      addZero(m) {
        return m < 10 ? '0' + m : m;
      },
      handleEngineer(val) {
        for (let i = 0; i < this.engineer.length; i++) {
          if (this.engineer[i].value === val) {
            return this.engineer[i].label
          }
        }
      },
      handleSizeChange(val) {
        this.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.page = val
        this.fetchData()
      }
    }
  })
</script>

<style lang="less">
#ocean-nps-evaluate-detail{
     width: 100%;
    box-sizing: border-box;
    // margin-top:11.5px;
    padding: 10px 20px 30px 20px;
    .nps-xslx-btn{
      // position: relative;
      float: right;
      margin-right: 20px;
      height: 32px;
      line-height: 10px;
      margin-top: 1px;
      color: #FF7B41;
      border-color: #FF7B41;
      position: relative;
      top: -408px;
      right: -20px;
    }
}
</style>

