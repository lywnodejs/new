var generateStockHolderUtil = {

  //十大股东共用部分
  generateStockHolder:function(holderList, floatHolderList) {
    //十大股东
    var tenShareholderList = holderList;
    var tagTenHolder = '';
    tenShareholderList.forEach(function (item, index) {
      tagTenHolder +=
        '<ul>' +
        '<li><h5>' + item.shldName + '</h5></li>' +
        '<li>' + item.hldPercent.toFixed(2) + '%</li>' +
        '<li>' + (item.chanOfLast === 0 ? '未变' : (item.chanOfLast / 10e3).toFixed(2)) + '<b class="' + generateStockHolderUtil.getHolderClsByType(item.chanOfLastType).class + '">' + generateStockHolderUtil.getHolderClsByType(item.chanOfLastType).name + '</b></li>' +
        '</ul>';
    });

    //十大流通股东
    var tenFloatShareholderSList = floatHolderList;
    var tagTenFloatHolder = '';
    tenFloatShareholderSList.forEach(function (item, index) {
      tagTenFloatHolder +=
        '<ul>' +
        '<li><h5>' + item.shldName + '</h5></li>' +
        '<li>' + item.hldPercent.toFixed(2) + '%</li>' +
        '<li>' + (item.chanOfLast === 0 ? '未变' : (item.chanOfLast / 10e3).toFixed(2)) + '<b class="' + generateStockHolderUtil.getHolderClsByType(item.chanOfLastType).class + '">' + generateStockHolderUtil.getHolderClsByType(item.chanOfLastType).name + '</b></li>' +
        '</ul>'
    });

    var tagBody =
      '<div class="tab_shareholdersTop">'+
      '<nav onclick="stockHolderTabClick(event)">'+
      '<a class="on">十大股东<b></b></a>'+
      '<a>十大流通股东<b></b></a>'+
      '</nav>'+
      // <!-- 十大股东 -->
      '<div class="nav_con show">'+
      '<div class="box_show_ol2 lBox_shareholders">'+
      '<ol>'+
      '<li>股东</li>'+
      '<li>占比</li>'+
      '<li>变动(万股)</li>'+
      '</ol>'+
      tagTenHolder+
      '</div>'+
      '</div>'+
      // <!-- 十大流通股东 -->
      '<div class="nav_con">'+
      '<div class="box_show_ol2 lBox_shareholders">'+
      '<ol>'+
      '<li>股东</li>'+
      '<li>占比</li>'+
      '<li>变动(万股)</li>'+
      '</ol>'+
      tagTenFloatHolder+
      '</div>'+
      '</div>'+
      '</div>';

    return tagBody;
  },

  /**
   * 1. 增：在b标签加样式名：b_red
   * 2. 减：在b标签加样式名：b_green
   * 3. 新：在b标签加样式名：b_blue
   * 4. 未变：在li标签上加样式名：null
   * @param type
   * @returns {string}
   */
  getHolderClsByType:function(type) {
    var cls = {class: '', name: ''};
    switch (type) {
      case 1:
        cls.class = 'b_blue';
        cls.name = '新';
        break;
      case 2:
        cls.class = 'b_red';
        cls.name = '增';
        break;
      case 3:
        cls.class = 'b_green';
        cls.name = '减';
        break;
      case 4:
        cls.class = 'null';
        cls.name = '未';
        break;
    }
    return cls;
  }
}

export default generateStockHolderUtil;

