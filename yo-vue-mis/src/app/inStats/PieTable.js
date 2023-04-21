  /*平行子栏排列方式*/
 let PieTable = function PieTable(datas, header) {
     let tabs = '<table class="table table-bordered table-striped table-hover">',
         sum = 0
     if(!header) {
         header = '<thead><tr><th>名称</th><th>数量</th><th>占比</th></tr><thead>'
     }
     tabs += header
     //   处理数据
     for(let i = 0, len = datas.length; i < len; i ++) {
         sum += Number(datas[i].value) ? Number(datas[i].value) : 0
     }
     let statsRow = ['总计', sum]
     //
      //   处理数据
     for(let i = 0, len = datas.length; i < len; i ++) {
         let row = '<tr>'
         row += '<td>' + datas[i].name + '</td>'
         row += '<td class="td-value">' + datas[i].value + '</td>'
         row += '<td class="td-value">' + Number.prototype.toFixed.call((datas[i].value * 10000 / sum) / 100, 2) + '%</td>'
         row += '</tr>'
         tabs += row
     }

     //
     let  lastRow = '<tr>'
     lastRow += '<td>' + statsRow[0] + '</td>'
     lastRow += '<td class="td-value" colspan="2">' + statsRow[1] + '</td></tr>'
     tabs += lastRow
     return tabs + '</table>'
 }

export default PieTable
