<template>
  <div id="ocean-report" >
      <div class="exports-button">
        <input class="pdf-button" type="button" value="导出PDF" @click="htmlToPdf('月报', 'box')">
        <br><br>
        <input class="png-button" type="button" value="导出PNG" @click="htmlToPNG('月报', 'box')">
      </div>
    
    <!-- <input type="button" value="导出canvas" @click="getCanvasByHtmlId('box')"> -->
    <div id="box">
        <header id="header">
            <div class="header-left">
                <!-- <div class="didi-monthly-picture"></div> -->
                <img id="myImg" src="@/assets/report/sstg_logo.png" alt="">
                <div class="didi-monthly-title">滴滴产品安全月报</div>
                <div class="didi-monthly-year">{{year}}年</div>
                <div class="didi-monthly-data">主体数据调查范围：{{year}}年</div>
                <div class="didi-monthly-data">报告发布时间：{{year}}/{{ '0' +  (parseInt(this.month) + 1) > 9 ? parseInt(this.month) + 1 : '0' +  (parseInt(this.month) + 1) }}</div>
                <div class="didi-monthly-data">安全产品技术部</div>
                <img class="didi-img-orange" src="@/assets/report/orange.png" alt="">
            </div>
            <div class="header-right">
                <img src="@/assets/report/logo.png" alt="" >
            </div>
        </header>
        <div id="content">
            <div class="title">
                <img class="title-chapter" src="@/assets/report/chapter1.png" alt="">
                <div class="title-word">数据总览</div>
            </div>
            <!-- <web-sorted-vul-type-statistic-list></web-sorted-vul-type-statistic-list> -->
            <lastYear-vulStatistic-list class="chart1" :data='last_year_vul_statistic_list'></lastYear-vulStatistic-list>
            <sorted-vul-statistic-group-by-dept-list  class="chart2"  :data='sorted_vul_statistic_group_by_dept_list'></sorted-vul-statistic-group-by-dept-list>
            <year-on-time-rate-of-fixed-of-r2-vul-list  class="chart3"  :data='year_on_time_rate_of_fixed_of_r2_vul_list'></year-on-time-rate-of-fixed-of-r2-vul-list>
            <div id="distribute"  class="chart4" >
              <web-sorted-vul-type-statistic-list  :data='web_sorted_vul_type_statistic_list'></web-sorted-vul-type-statistic-list>
              <mob-sorted-vul-type-statistic-list :data='mob_sorted_vul_type_statistic_list'></mob-sorted-vul-type-statistic-list>
            </div>
            <month-high-risk-vul-list  class="chart5"  :data='month_baseline_list'></month-high-risk-vul-list>
            <div class="title">
                <img class="title-chapter" src="@/assets/report/chapter2.png" alt="">
                <div class="title-word">外部高危漏洞通报</div>
            </div>
            <div id="table">
                <table border="1" cellspacing="0">
                    <tr>
                      <th class="table-th1">排序</th>
                      <th class="table-th2">漏洞名称</th>
                      <th class="table-th1">部门</th>
                    </tr>
                    <tr v-for="(item, index) in month_high_risk_vul_list.slice(1, month_high_risk_vul_list.length)" :key="index">
                      <td class="table-td1">{{index + 1}}</td>
                      <td class="table-td2">{{item[1]}}</td>
                      <td class="table-td1">{{item[0]}}</td>
                    </tr>
                  </table>
            </div>
        </div>
        <div id="footer">
            <div class="title">
                <div class="title-word"><img class="title-chapter" src="@/assets/report/didi_logo2.png" alt=""></div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import html2canvas from 'html2canvas'
  import JsPDF from 'jspdf'
  import webSortedVulTypeStatisticList from './components/web-sorted-vul-type-statistic-list'
  import mobSortedVulTypeStatisticList from './components/mob-sorted-vul-type-statistic-list'
  import lastYearVulStatisticList from './components/last-year-vul-statistic-list'
  import sortedVulStatisticGroupByDeptList from './components/sorted-vul-statistic-group-by-dept-list'
  import yearOnTimeRateOfFixedOfR2VulList from './components/year-on-time-rate-of-fixed-of-r2-vul-list'
  import monthHighRiskVulList from './components/month-high-risk-vul-list'

  export default connect(() => {
    return {
    }
  }, {
    monthlyReport: 'ocean_report/monthlyReport'
  })({
    data() {
      return {
        year: '2020',
        month: '00',
        day: '',
        last_year_vul_statistic_list: [],
        mob_sorted_vul_type_statistic_list: [],
        month_baseline_list: [],
        month_high_risk_vul_list: [],
        sorted_vul_statistic_group_by_dept_list: [],
        web_sorted_vul_type_statistic_list: [],
        year_on_time_rate_of_fixed_of_r2_vul_list: []
      }
    },
    components: { webSortedVulTypeStatisticList, mobSortedVulTypeStatisticList, lastYearVulStatisticList, sortedVulStatisticGroupByDeptList, yearOnTimeRateOfFixedOfR2VulList, monthHighRiskVulList },
    created() {
        this.getCurrentTime()
        this.fetchData()
    },
    mounted() {
    },
    methods: {
      fetchData() {
        this.monthlyReport({year_month_date: `${this.year}-${this.month}`}).then(res => {
            this.last_year_vul_statistic_list = res.last_year_vul_statistic_list
            this.mob_sorted_vul_type_statistic_list = res.mob_sorted_vul_type_statistic_list
            this.month_baseline_list = res.month_baseline_list
            this.month_high_risk_vul_list = res.month_high_risk_vul_list
            this.sorted_vul_statistic_group_by_dept_list = res.sorted_vul_statistic_group_by_dept_list
            this.web_sorted_vul_type_statistic_list = res.web_sorted_vul_type_statistic_list
            this.year_on_time_rate_of_fixed_of_r2_vul_list = res.year_on_time_rate_of_fixed_of_r2_vul_list
        })
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
        this.year = y
        this.month = m
        this.day = d
      },
      async getCanvasByHtmlId(elId) {
        let shareContent = document.getElementById(elId);
        let width = shareContent.offsetWidth;
        let height = shareContent.offsetHeight;
        let canvas = await html2canvas(shareContent, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            taintTest: true,
            imageTimeout: 0,
            width: width,
            height: height,
            logging: true,
            backgroundColor: null
        }).then(canvas => {
            document.body.appendChild(canvas)
            return canvas;
        });
        return canvas;
      },
      canvasToPdf(htmlCanvas) {
        console.log(htmlCanvas)
        let canvasWidth = htmlCanvas.width;
        let canvasHeight = htmlCanvas.height;
        let imgBase64 = htmlCanvas.toDataURL('image/jpeg', 1.0);

        //  a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let imgWidth = 595.28;

        //  图片高度需要等比缩放
        let imgHeight = 595.28 / canvasWidth * canvasHeight;

        let pageHeight = imgHeight;
        console.log(pageHeight)

        //  pdf转化后页面总高度
        let position = 0;

        let pdfInstance = new JsPDF('', 'pt', 'a4');
        pdfInstance.setFontSize(12);

        // pdfInstance.addImage(imgBase64, 'JPEG', 0, 0, imgWidth, imgHeight);

        if (imgHeight < 841.89) {
            pdfInstance.addImage(imgBase64, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
            while (pageHeight > 0) {
                pdfInstance.addImage(imgBase64, 'JPEG', 0, position, imgWidth, imgHeight);
                pageHeight -= 841.89;
                position -= 841.89;
                if (pageHeight > 0) {
                    pdfInstance.addPage();
                }
            }
        }
        return pdfInstance;
      },
      async htmlToPNG(title = '文件', elId) {
        if (!elId) {
          console.error('导出节点不存在！');
          return;
        }

        //  将html dom节点生成canvas
        let htmlCanvas = await this.getCanvasByHtmlId(elId);

        // 将canvas对象转为png
        let dom = document.createElement('a');
        dom.href = htmlCanvas.toDataURL('image/png');
        dom.download = new Date().getTime() + '.png';
        dom.click();
      },
      async htmlToPdf(title = '文件', elId) {
        if (!elId) {
          console.error('导出节点不存在！');
          return;
        }

        //  将html dom节点生成canvas
        let htmlCanvas = await this.getCanvasByHtmlId(elId);

        // 将canvas对象转为pdf
        let pdf = this.canvasToPdf(htmlCanvas);

        // 通过浏览器下载pdf
        // 文件名过长导致下载失败
        if (title.length > 50) {
            title = title.substring(title.length - 50);
        }

        pdf.save(title + '.pdf', { returnPromise: true }).then(function() {

            //  搜狗浏览器下载机制问题暂时不关闭
            if (!(navigator.userAgent.toLowerCase().indexOf('se 2.x') > -1)) {
            setTimeout(window.close, 300);
            }
        });
      }
    }
  })
</script>

<style lang="less">
#ocean-report{
    .exports-button {
        position: fixed;
        top: 70px;
        margin-left: 10px;
        .pdf-button {
            cursor: pointer;
            margin-left: 5px;
            background-color: #496cd6; /* Green */
            border: none;
            color: white;
            padding: 10px 22px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            width: 110px;
        }
        .png-button {
            cursor: pointer;
            margin-left: 5px;
            background-color: #496cd6; /* Green */
            border: none;
            color: white;
            padding: 10px 22px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            width: 110px;
        }
    }
    #box{
        width: 900px;
        margin: 0 auto;
        background-color: white;
        position: relative;
        top: 0px;
        #header {
            display: flex;
            padding-top: 35px;
            background-color: white;
            .header-left{
                flex-grow: 1;
                padding-left: 55px;
                position: relative;
                .didi-monthly-title {
                    padding-top: 30px;
                    /* margin-left: 55px; */
                    font-size: 52px;
                    line-height: 60px;
                    font-family: "Adobe Heiti Std";
                    color: rgb(58, 46, 131);
                    line-height: 1.2;
                }
                .didi-monthly-year {
                    padding-top: 1px;;
                    padding-bottom: 20px;
                    font-size: 30px;
                    font-family: "Adobe Heiti Std";
                    color: rgb(58, 46, 131);
                    line-height: 1.2;
                }
                .didi-monthly-data {
                    font-size: 15px;
                    font-family: "Adobe Heiti Std";
                    color: rgb(58, 46, 131);
                }
                .didi-img-orange{
                    position: absolute;
                    top: 180px;
                    left: 315px;
                }
            }
            .header-right{
                flex-grow: 1;
                img{
                    float: right;
                    padding-right: 55px;
                }
            }
        }
        #content {
            padding: 0 55px;
            padding-top: 50px;
            background-color: white;
            .title {
                text-align:center;
                padding-top: 150px;
                .title-chapter {
                    background-color: linear-gradient(to right, #bbf6db , #496cd6);
                }
                .title-word{
                    font-size: 35px;
                    /* padding-bottom: 5px; */
                    font-family: "Adobe Heiti Std";
                    color: rgb(255, 255, 255);
                    line-height: 1.2;
                    background-image: linear-gradient(to right, #bbf6db , #496cd6);
                }
            }
            #distribute {
                display: flex;
                padding-top: 100px;
            }
            #table {
                width: 100%;
                padding-top: 100px;
                table {
                    border-color: #f27d52;
                    td{
                        height: 30px;
                    }
                    .table-td1{
                        height: 30px;
                        text-align: center;
                    }
                    .table-th2{
                        width: 600px;
                        border-color: #f27d52;
                        height: 30px;
                    }
                    .table-th1{
                        width: 150px;
                        border-color: #f27d52;
                        height: 30px;
                    }
                }
            }
        }
        #footer {
            padding-top: 100px;
            .title {
                text-align: center;
                line-height: 1.2;
                padding-top: 5px;;
                .title-word{
                    padding-top: 20px;
                    padding-bottom: 5px;
                    font-size: 35px;
                    font-family: "Adobe Heiti Std";
                    color: rgb(255, 255, 255);
                    line-height: 1.3;
                    background-image: linear-gradient(to right, #bbf6db , #496cd6);
                }
            }
        }
    }
}
</style>
