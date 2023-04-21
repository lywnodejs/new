import H from 'highcharts'
import highchartsExport from 'highcharts/modules/exporting'

// 手动执行highchart导出扩展程序
highchartsExport(H)

// 设置导出单位宽度
const UNIT_W = {
  A4: 17 // 毫米到像素值转换
}

H.extend(H.Chart.prototype, {
  getSVGByCol: function (col = 24, size = 'A4') {
    return this.getSVG({
      sourceWidth: col * UNIT_W[size]
    })
  }
})
