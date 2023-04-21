
  function createHeader(label, legends) {
      let thead = '<thead><tr>'
      thead = '<th>' + label + '</th>'
      for (let i = 0, len = legends.length; i < len; i++) {
          thead += '<th>' + legends[i] + '</th>'
      }
      return thead + '</tr></thead>'
  }

  /*平行子栏排列方式*/
  let LineTable = function LineTable(datas, header, title) {
      let tabs = '<table class="table table-bordered table-striped table-hover">'
      let tableHeader = createHeader(title, header)
      tabs += tableHeader

      //   处理数据
      for (let prop in datas) {
          let row = '<tr>',
              data = datas[prop];
          row += '<td>' + data.name + '</td>';
          for (let i = 0, len = data.data.length; i < len; i++) {
            if (data.name == 'MTTD' || data.name == 'MTTR') {
              row += '<td class="td-value">' + data.data[i] + ' 小时' + '</td>';
            } else {
              row += '<td class="td-value">' + data.data[i] + '</td>';
            }
          }
          row += '</tr>'
          tabs += row;
      }

      return tabs + '</table>'
  }

  export default LineTable
