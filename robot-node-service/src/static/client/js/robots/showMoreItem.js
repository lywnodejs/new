
/**
 * 点击加载更多
 * @param hideClass
 * @param moreId
 * @param stepSize 步长，即每次展示的条数，默认值为2
 * @param getQuota 1, 0  股票推荐答案中的股票行情分页取，否则多了取不到
 */
function showMoreArticle(hideClass, moreId, stepSize, getQuota) {
  if (!stepSize)
    stepSize = 2;
  else
    stepSize = parseInt(stepSize);

  //根据隐藏项的class，取出标签列表
  var list = $('.' + hideClass);
  var arrStockCode = [];
  for (var i = 0; i < list.length && i < stepSize; i++) {
    var divReport = $(list[i]);
    divReport.show();
    divReport.removeClass(hideClass); //移除
    //处理文字内容多的情况
    var contentIds = divReport.find('[id^=contentId]');
    var expandBtnIds = divReport.find('[id^=expandBtnId]');
    if (contentIds && expandBtnIds) {
      for (var j = 0; j < contentIds.length; j++) {
        checkTextOverflow([[contentIds[j].id, expandBtnIds[j].id]]);
      }
    }

    if(getQuota === 1){
      arrStockCode.push(divReport.attr('symbol'));
    }
  }
  //再取一遍看是否还有隐藏项，判断是否显示加载更多
  list = $('.' + hideClass);
  if (list.length === 0)
    $('#' + moreId).remove();

  // 股票推荐答案中的股票行情分页取，否则多了取不到
  if(getQuota === 1 && arrStockCode.length > 0){
    // 取行情
    getPriceList(arrStockCode.join(','), function (priceResult) {
      // predicateType = '行业个股推荐理由';

      priceResult.items.forEach(function (quota, index) {
        $('p.stockPrice'+quota.stkCode).each(function (index, item) {
          $(this).html(quota.newPrice.toFixed(2))
        });
        $('h6.stockRise'+quota.stkCode).each(function (index, item) {
          $(this).html(quota.rise.toFixed(2)+'%')
        });
        $('li#stockColor'+quota.stkCode).each(function (index, item) {
          $(this).attr('class', quota.rise > 0 ? 't_red' : (quota.rise===0?'':'t_green'))
        });
      })
    });
  }
}

/**
 * 点击加载更多，针对多列
 * @param hideClass
 * @param moreId
 * @param stepSize 步长，即每次展示的条数，默认值为2
 */
function showMoreListItem(hideClass, moreId, stepSize) {
  if (!stepSize)
    stepSize = 2;
  else
    stepSize = parseInt(stepSize);

  //根据隐藏项的class，取出标签列表
  var list = hideClass.split('|');
  for(var i=0; i<list.length; i++){
    showMoreArticle(list[i], moreId, stepSize)
  }
}
