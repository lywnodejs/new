<template>
  <div id="mob-sorted-vul-type-statistic-list">
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import echarts from '@/lib/echarts'

  export default connect(() => {
    return {
    }
  }, {
  })({
    data() {
      return {
        chartData: [],
        chartTitleStyle: {
          color: 'rgb(91,91,91)',
          fontWeight: 'normal',
          fontSize: 18
        },
        barToolbox: {
          align: 'right',
          y: 20,
          right: 20,
          itemSize: 11
        }
      }
    },
    components: {},
    created() {

      // this.fetchData()
    },
    mounted() {
        this.drawChat(this.chartData)
    },
    props: ['data'],
    watch: {
        data(val) {
            this.chartData = val
            this.drawChat(this.chartData)
        }
    },
    methods: {
      fetchData() {
        this.monthlyReport()
      },
      drawChat(data) {

          // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('mob-sorted-vul-type-statistic-list'))

        // 指定图表的配置项和数据
        let option = {
          color: ['#496cd6', '#c9c5da', '#bbf6db', '#f27d52', '#4b82eb'],

          // color: ['#2665B4', '#7CE0C3', '#73A6F7', '#4486F7', '#93B2DA', '#5BC9F1', '#ADDE72', '#BBBBBB'],
          title: {
            text: '移动漏洞分布',
            left: 200,
            top: 30,
            textStyle: this.chartTitleStyle
          },

          // legend: {
          //   align: 'right',
          //   top: 65,
          //   right: 20,
          //   orient: 'vertical',
          //   itemGap: 10,
          //   textStyle: {
          //     color: '#999999',
          //     fontSize: 12
          //   }
          // },
          toolbox: this.barToolbox,
          tooltip: {
            trigger: 'item',
            formatter: function(value) {
              return value.marker + value.name + ':  ' + value.value[1] + ' (' + value.percent + '%) ';
            }
          },
          dataset: {
            source: data
          },
          series: [{
            type: 'pie',
            radius: ['0%', '62%'],
            center: ['50%', '60%']
          }]
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.clear()
        myChart.setOption(option);
      }
    }
  })
</script>

<style lang="less">
#mob-sorted-vul-type-statistic-list{
  flex-grow: 1;
  width: 50%;
  height: 360px;
}
</style>

