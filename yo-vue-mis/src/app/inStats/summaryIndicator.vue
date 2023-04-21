<template>
  <div class="summary-indicator">
    <div class="summary-indicator__search">
      <label class="summary-indicator__search--title">安全大盘指标</label>
      <el-date-picker
        v-model="week"
        type="week"
        format="yyyy 第 WW 周"
        placeholder="选择周">
      </el-date-picker>
      <button class="btn btn-primary" @click="initInStats">确定</button>
    </div>
     <div calss="summary-indicator__content">
       <el-row>
        <el-col :span="24">
          <div class="summary-indicator__content--chart">
            <div class="summary-indicator__content--chart__header">
              <label>安全大盘指标</label>
            </div>
            <div class="summary-indicator__content--chart__content" id="oneChart">
              <table id="table-sparkline" class="table table-bordered">
                <thead>
                  <tr >
                    <th v-for="(item, index) in tableHead" :key="index">{{item}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in tableDatas" :key="i">
                    <!-- <td>{{i + ',' + item[2] + ',' + item[5] + ',' + item[4] + item[3]}}</td> -->
                    <td style="vertical-align: middle" v-if="i == 0 || i + 1 == item[2]" :rowspan="item[1]">{{item[0]}}</td>
                    <td style="vertical-align: middle" v-if="i == 0 || i + 1 == item[5]" :rowspan="item[4]">{{item[3]}}</td>
                    <template v-for="(rowData, index) in item">
                      <td v-if="index > 5 && index < item.length-4" :key="index">{{rowData}}</td>
                    </template>
                    <!-- 月趋势 -->
                    <td width="160">
                      <div style="width: 150px" class="inlinesparkline1">{{item[item.length-4]}}</div>
                    </td>
                    <!-- 周趋势 -->
                    <td width="130">
                      <div style="width: 100px" class="inlinesparkline2">{{item[item.length-3]}}</div>
                    </td>
                    <!-- 本周关注重点 -->
                    <td width="130">
                      <el-tooltip class="item" effect="light" :content="item[item.length-2]" :hide-after="2000" placement="top-start">
                        <el-input type="text" :value="item[item.length-2]" @blur="handlerChangeInput($event, item, i)"></el-input>
                      </el-tooltip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-col>
      </el-row>
     </div>
  </div>
</template>

<script>
import $ from 'jquery'
import sparkline from 'jquery-sparkline'
import moment from 'moment'

export default {
  data() {
    return {
      tableDatas: [],
      tableHead: [],
      week: moment().day(-6).toDate(),
      inpu: ''
    }
  },
  created () {
    this.initInStats()
  },
  methods: {
    handlerChangeInput(event, rowData, index) {
      let postData = {
        week_year: this.week.getFullYear(),
        week_num: moment(this.week).week()
      }
      postData['comment'] = event.target.value
      postData['id'] = rowData[rowData.length-1] // id
      postData['battle_field'] = rowData[0]
      postData['category'] = rowData[3]
      postData['sub_type'] = rowData[6]
      this.$set(this.tableDatas[index], rowData.length-2, event.target.value)

      this.$http.post("inStats/secplate/updateSecPlate", postData, { emulateJSON: true }).then(res => {
        let type = 'error'
        if (res.data.errno == 0) {
          type = "success"
        }
        this.$message({
          message: res.data.errmsg,
          type: type
        })
      }).catch(exp => {
        this.$message.error(exp)
      })
    },
    initInStats() {
      let params = {
        week_year: this.week.getFullYear(),
        week_num: moment(this.week).week()
      }
      this.tableDatas = []
      this.$http.get("inStats/secplate/getdata", { params }).then(res => {
        if (res.data.errno == 0) {
          // this.tableDatas = res.data.data

          // 计算表头
          if (res.data.data) {
            this.tableHead = ['战场', '类别', '指标', '2018目标']
            let head = Object.keys(res.data.data['全员']['风险']['LCA安装率'].datas)
            let filterHead = []
            if (head.length > 0) {
              head.forEach(item => {
                if(item.length > 2) {
                  filterHead.push(item)
                }
              })
            }
            this.tableHead.push(...filterHead)
            this.tableHead.push(...['月趋势', '周趋势', '本周关注重点'])

            let sumOffset = 0

            // 计算第一列和第二列rowspan
            for(let key in res.data.data) {
              let obj = Object.keys(res.data.data[key])
              let rowSpan = [], sumRowSpan = 0, rowOffset = sumOffset, firstRowOffset = sumOffset, offset = [], offsetSpanRow = []
              obj.forEach(item => {
                let l = Object.keys(res.data.data[key][item]).length
                sumRowSpan += l
                rowSpan.push(l)
              })

              // 计算偏移量
              rowSpan.forEach(item => {
                offsetSpanRow.push(rowOffset + 1)
                rowOffset = rowOffset + item
              })
              sumOffset += sumRowSpan
              firstRowOffset += 1
              obj.forEach((item, index) => {

                for (let k in res.data.data[key][item]) {
                  let i = 0, rowData = [], monthTrend = [], weekTrend = []
                  rowData.push(key)
                  rowData.push(sumRowSpan)
                  rowData.push(firstRowOffset)
                  rowData.push(item)
                  rowData.push(rowSpan[index])
                  rowData.push(offsetSpanRow[index])
                  rowData.push(k)

                  // 2018年目标
                  rowData.push(res.data.data[key][item][k]['2018年目标'])
                  for(let m in res.data.data[key][item][k]['datas']) {
                    if (filterHead.includes(m)) {
                      rowData.push(res.data.data[key][item][k]['datas'][m])
                    }
                    monthTrend.push(res.data.data[key][item][k]['datas'][m])
                    if (m.includes('w')) {
                      weekTrend.push(res.data.data[key][item][k]['datas'][m])
                    }
                  }

                  // 月趋势
                  rowData.push(monthTrend.join(','))
                  //周趋势
                  rowData.push(weekTrend.join(','))

                  rowData.push(res.data.data[key][item][k]['本周重点关注'])

                  rowData.push(res.data.data[key][item][k]['id'])

                  this.tableDatas.push(rowData)
                }
              })
            }
          }
          this.initEcharts()
        }
      })
      console.log(this.tableDatas)
    },
    initEcharts() {
      setTimeout(function() {
        $('.inlinesparkline1').sparkline('html', {type: 'line', width: '150px', valueSpots: {':0': 'red', '0:': '#f39434'}})
      }, 800)
      setTimeout(function() {
        $('.inlinesparkline2').sparkline('html', {type: 'line', width: '100px', valueSpots: {':0': 'red', '0:': '#f39434'}})
      }, 800)
    }
  }
}
</script>

<style lang="less">
  .summary-indicator {
    &__search {
      &--title {
        font-size: 16px;
        font-weight: bold;
        margin-right: 15px;
      }

      .el-radio+.el-radio {
        margin-left: 15px;
        margin-right: 15px;
      }
      margin-bottom: 15px;
    }

    &__content {
      &--chart {
        border: 1px solid #ddd;
        background-color: #fff;
        min-height: 450px;
        margin-bottom: 15px;

        &__header {
          border-bottom: 1px solid #ddd;
          line-height: 25px;
          padding: 5px 15px;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
        }

        &__content {
          width: 100%;
          // height: 400px;
        }
      }
    }
  }
</style>

