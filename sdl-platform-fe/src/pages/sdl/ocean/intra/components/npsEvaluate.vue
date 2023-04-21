<template>
  <div id="ocean-nps-evaluate">
    <div class="block">
        <el-col class="statistic-box" style="margin-left: 23px;">
          <div class="box-header">
            
            <span>nps指标查询</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-date-picker
                  @change="changeTime(time)"
                    v-model="time"
                    type="daterange"
                    align="right"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <!-- <el-button @click="getNpsDatails" class="nps-xslx-btn">导出NPS EXCEL</el-button> -->
          </div>
          <el-row>
            <el-col :span="12">
              <nps-ocean :time='time'></nps-ocean>
            </el-col>
            <el-col :span="12">
              <nps-start-count :time='time'></nps-start-count>
            </el-col>
          </el-row>    
        </el-col>
      </div>
      <nps-details :time='time'></nps-details>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import npsDetails from './npsDetails'
  import npsOcean from './npsOcean'
  import npsStartCount from './npsStartCount'
  import xlsx from 'xlsx'

  export default connect(() => {
    return {
    }
  }, {
    npsDetails: 'ocean_baseline/npsDetails'
  })({
    data() {
      return {
        time: ['', ''],
        start_day: '',
        end_day: '',
        finishInfo: {},
        checkIssueInfo: {},
        scanTaskInfo: {},
        processTimeData: {}
      }
    },
    created() {
        this.getCurrentTime()
        this.changeTime(this.time)
        this.fetchData()
    },
    mounted() {
    },
    components: { npsDetails, npsOcean, npsStartCount },
    methods: {
      fetchData() {
      },
      changeTime(time) {
        this.start_day = time[0]
        this.end_day = time[1]
        this.fetchData()
      },
      getCurrentTime() {
        let nowdate = new Date();
        let y = nowdate.getFullYear();
        let m = nowdate.getMonth() + 1;
        let d = nowdate.getDate();
        if (m < 10) {
          m = '0' + m
        }
        if (d < 10) {
          d = '0' + d
        }
        this.time[1] = y + '-' + m + '-' + d;
        nowdate.setMonth(nowdate.getMonth() - 1);
        y = nowdate.getFullYear();
        m = nowdate.getMonth() + 1;
        d = nowdate.getDate();
        if (m < 10) {
          m = '0' + m
        }
        if (d < 10) {
          d = '0' + d
        }
        this.time[0] = y + '-' + m + '-' + d;
      },
      tranTime(time) {
        time = time + '+0800'
        let date = new Date(time)
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y + M + D + h + m + s
      },
      getNpsDatails() {
        let param = {
          start_day: this.time[0],
          end_day: this.time[1],
          index: 'nps_evaluate',
          rate_type: 'all'
        }
        this.npsDetails(param).then(res => {
          let data = res.nps_details
          let jsonData = []
          for (let i = 0; i < data.length; i++) {
            jsonData.push({
              nps_evaluate: data[i].data.nps_evaluate,
              low_efficiency: parseInt(data[i].data.nps_evaluate) >= 9 ? ' ' : data[i].data.improve_suggest.join(';').replace(/,/g, '，'),
              high_efficiency: parseInt(data[i].data.nps_evaluate) >= 9 ? data[i].data.improve_suggest.join(';').replace(/,/g, '，') : ' ',
              description: data[i].data.description ? data[i].data.description.replace(/,/g, '，').replace(/[\r\n]/g, '') : ' ',
              sdl_project_id: data[i].data.sdl_project_id,
              creator: data[i].data.creator,
              create_time: this.tranTime(data[i].create_time)
            })
          }
          this.tableToExcel(jsonData)
        })
      },
      toExcel(jsonData) {
        let filename = '测试.xlsx';

        //  数据需要转化成二维数组
        let data = [['表头1', '表头2', '表头3'], ['数据1', '数据2', '数据3']];

        //  Excel第一个sheet的名称
        let wsName = 'Sheet1';

        //  创建工作薄对象
        let wb = xlsx.utils.book_new();

        //  向工作簿追加一个工作表
        let ws = xlsx.utils.aoa_to_sheet(data);

        //  添加数据
        xlsx.utils.book_append_sheet(wb, ws, wsName);

        //  导出Excel
        xlsx.writeFile(wb, filename);
      },
      tableToExcel(jsonData) {

        //  列标题，逗号隔开，每一个逗号就是隔开一个单元格
        let str = `根据您最近一次在SDL完成的安全评估，您有多大可能推荐给同事,请问您觉得安全评估在以下哪些方面做出改善，您会愿意给出更高的分数？,请问您刚才给出xx分数的主要原因是？,关于安全评估如果您还有其他意见或建议，欢迎您的反馈：,项目ID,提交人,提交时间\n`;

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
      tableToExcel1(jsonData) {
        let str = `<tr>
                    <td>根据您最近一次在SDL完成的安全评估，您有多大可能推荐给同事</td>
                    <td>请问您觉得安全评估在以下哪些方面做出改善，您会愿意给出更高的分数？</td>
                    <td>请问您刚才给出xx分数的主要原因是？</td>
                    <td>关于安全评估如果您还有其他意见或建议，欢迎您的反馈：</td>
                    <td>项目ID</td>
                    <td>提交人</td>
                    <td>提交时间</td>
                  </tr>`
        for (let i = 0; i < jsonData.length; i++) {
          str += '<tr>';
          for (let item in jsonData[i]) {

              //  增加\t为了不让表格显示科学计数法或者其他格式
              if (jsonData[i][item]) {
                str += `<td>${jsonData[i][item] + '\t'}</td>`
              }
          }
          str += '</tr>';
        }

        //  Worksheet名
        let worksheet = 'Sheet1'
        let uri = 'data:application/vnd.ms-excel;base64,';

        //  下载的表格模板数据
        let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
        xmlns:x="urn:schemas-microsoft-com:office:excel" 
        xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>${worksheet}</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
          </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
          </head><body><table>${str}</table></body></html>`;

        //  下载模板
        window.location.href = uri + base64(template)
        function base64(s) { return window.btoa(unescape(encodeURIComponent(s))) }
      }
    }
  })
</script>

<style lang="less">
#ocean-nps-evaluate{
    margin-top:11.5px;
     margin-right: 23px;
     margin-left: 23px;;
     background-color: white;
    .block {
    //   margin: 23px 11.5px 11.5px 11.5px;
      display: flex;
      .statistic-box {
        color: #333;
        background-color: white;
        .box-header {
          padding: 15px 0px;
          font-size: 12.5px;
          font-style: normal;
        }
        .point {
          font-weight: bold;
        }
        .color1 {
          color: #73A6F7;
        }
        .color2 {
          color: #98e23e;
        }
        .color3 {
          color: #FF7B41;
        }
        .color4 {
          color: #E6A23C;
        }
        .box-content {
          margin-top: 10px;
          margin-bottom: 20px;
          .item{
            //   text-align: center;
              padding-left: 10px;
              margin: 0 auto;
              .content{
                  margin-left: 40px;
                  line-height: 25px;
              }
              .content-header{
                  line-height: 30px;
                  text-align: center;
              }
              .box-card{

              }
          }
          .popover-btn{
            border: none;
            font-size: 45px;
          }
          .el-button:hover {
            background: none;
          }
          .el-button:focus {
            background: none;
          }
        }
      }
    }
    .domainCoverageDetail{
      color: #73A6F7;
      cursor: pointer;
    }
    .el-form-item__label{
        color: white;
        width: 60px;
    }
    .nps-xslx-btn{
      // position: relative;
      float: right;
      margin-right: 20px;
      height: 32px;
      line-height: 10px;
      margin-top: 1px;
      color: #FF7B41;
      border-color: #FF7B41;
    }
}
</style>

