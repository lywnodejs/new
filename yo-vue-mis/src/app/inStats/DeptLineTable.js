
let DeptLineTable = function(datas, xdata, title) {
  let tabs = '<table class="table table-bordered table-striped table-hover">'
  let thead = '<thead><tr>'
  thead = '<th>' + title + '</th>'
  if (datas.length > 0) {
    datas.forEach(items => {
      thead += '<th>' + items.name + '</th>'
    })
  }
  tabs += thead

  datas[0].data.forEach((item,index) => {
    let row = '<tr>'
    row += '<td>' + xdata[index] + '</td>'
    row += '<td>' + item + '</td>'
    row += '<td>' + datas[1].data[index] + '</td>'
    row += '<td>' + datas[2].data[index] + '</td>'
    row += '<td>' + datas[3].data[index] + '</td>'
    row += '</tr>'
    tabs += row
  })
  return tabs + '</table>'
}

export default DeptLineTable
