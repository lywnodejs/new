var toolsUtil = {
  /**
   * 判断文字内容较多时是否需要收缩内容及显示展开按钮
   * @param ids [contentId, expandBtnId], contentId：内容容器Id， expandBtnId：展开按钮Id
   */
  checkTextOverflow:function(ids) {
    for (var i = 0; i < ids.length; i++) {
      var contentId, expandBtnId;
      contentId = ids[i][0];
      expandBtnId = ids[i][1];
      var content = $('#' + contentId);
      // console.log(content[0].scrollHeight, content.height())
      if (content[0].scrollHeight <= content.height())
        $('#' + expandBtnId).hide();
      else {
        content.addClass('show_row3');
        $('#' + expandBtnId).show();
      }
    }
  },

  /**
   * 格式化成交量
   * @param value 股数
   * @returns {*} 手数
   */
  formatVolume: function (value) {
    if (!isNaN(value)) {
      if (value < 10 * 10000)
        return value / 100;
      else
        return (value / (100 * 10000)).toFixed(2) + '万';
    } else {
      return value;
    }
  },

  //获取浏览器参数
  getQueryString:function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r !== null)
      return decodeURI(r[2]);
    return null;
  },

  /**
   * 替换该文章中的回车符
   * @param txt
   * @returns {*}
   */
  replaceLineBreak: function (content) {
    try {
      var summary = content;
      var reg = new RegExp(/[\u4e00-\u9fa5]{1}\r\n[\u4e00-\u9fa5]{1}/g);
      var matches = summary.match(reg);
      for (var m in matches) {
        var t = matches[m].replace('\r\n', '');
        summary = summary.replace(matches[m], t);
      }
      summary = summary.replace(/(\r)*\n(\s)+/g, '');
      reg = new RegExp(/(\r)*\n+(\s){0}/g);
      matches = summary.match(reg);
      for (var n in matches) {
        var index = summary.indexOf(matches[n]);
        if (index !== 0)
          summary = summary.replace(matches[n], '</br></br>');
      }
      return summary;
    } catch (e) {
      // alert(e.message);
      var string = content;
      string = string.replace(/\r\n/g, "<BR>");
      string = string.replace(/\n/g, "<BR>");
      saveLog('error', e.message, location.href, 0, 'replaceLineBreak()', e.stack.toString());
      return string;
    }
  },

  /**
   * 点击加载更多
   * @param hideClass
   * @param moreId
   * @param stepSize 步长，即每次展示的条数，默认值为2
   */
  showMoreArticle:function(hideClass, moreId, stepSize) {
    if (!stepSize)
      stepSize = 2;

    //根据隐藏项的class，取出标签列表
    var list = $('.' + hideClass);
    for (var i = 0; i < list.length && i < stepSize; i++) {
      var divReport = $(list[i]);
      divReport.show();
      divReport.removeClass(hideClass); //移除
      //处理文字内容多的情况
      var contentIds = divReport.find('[id^=contentId]');
      var expandBtnIds = divReport.find('[id^=expandBtnId]');
      if (contentIds && expandBtnIds) {
        for (var j = 0; j < contentIds.length; j++) {
          toolsUtil.checkTextOverflow([[contentIds[j].id, expandBtnIds[j].id]]);
        }
      }
    }
    //再取一遍看是否还有隐藏项，判断是否显示加载更多
    list = $('.' + hideClass);
    if (list.length === 0)
      $('#' + moreId).remove();
  },

  /**
   * 点击加载更多，针对多列
   * @param hideClass
   * @param moreId
   * @param stepSize 步长，即每次展示的条数，默认值为2
   */
  showMoreListItem(hideClass, moreId, stepSize) {
    if (!stepSize)
      stepSize = 2;
    else
      stepSize = parseInt(stepSize);

    //根据隐藏项的class，取出标签列表
    var list = hideClass.split('|');
    for(var i=0; i<list.length; i++){
      this.showMoreArticle(list[i], moreId, stepSize)
    }
  },

  /**
   * 生成随机class名
   * @param classNamePrefix 前缀
   */
  generateRandomClassName: function (classNamePrefix) {
    var randomTime = new Date().getTime();
    return classNamePrefix + randomTime + (Math.random() * 10000).toFixed(0);
  },

  //日期格式转换
  timeChange:function(nS,delimiter) {
    if (nS) {
      var date = new Date(parseInt(nS));
      return [date.getFullYear(), String(date.getMonth() + 1).length > 1 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1), String(date.getDate()).length > 1 ? date.getDate() : "0" + date.getDate()].join(delimiter||'-');
    } else {
      return '';
    }
  },

  //股权激励字段说明
  incSubject(num) {
    var incSubject;
    if (!num || isNaN(num))
      return '';
    if (num == 1)
      incSubject = '期权';
    else if (num == 2)
      incSubject = '股票';
    else if (num == 3)
      incSubject = '股票增值权';
    return incSubject;
  },


  //股权激励字段说明
  incType(num) {
    var incType;
    if (!num || isNaN(num))
      return '';
    if (num == 1)
      incType = '股东转让股票';
    else if (num == 2)
      incType = '股票增值权';
    else if (num == 3)
      incType = '上市公司定向发行股票';
    else if (num == 4)
      incType = '上市公司提取激励基金买入流通A股';
    else if (num == 5)
      incType = '授予期权,行权股票源为股东转让股票';
    else if (num == 6)
      incType = '授予期权,行权股票来源为上市公司定向发行股票';
    return incType;
  },

  /**
   * 激励总数单位
   * @param num2 奖励方式
   */
  incAmount(num1,num2){
    var incAmount;
    if (!num1 || isNaN(num1)||!num2 || isNaN(num2))
      return '';
    if(num2 !=2 ){
      return incAmount= num1+'万份'
    }else{
      return incAmount= num1+'万股'
    }
    return incAmount
  },

  /**
   * 格式化成交额
   * @param value
   * @returns {*}
   */
  formatAmount(value) {
    if (!isNaN(value)) {
      if (value < 10000)
        return value + '元';
      else if (value < 10e7)
        return (value / 10000).toFixed(2) + '万';
      else
        return (value / 10e7).toFixed(2) + '亿';
    } else {
      return value;
    }
  },

  //加"%"
  addPer(num) {
    // console.log(num);
    return num ? (num>=0.01?num.toFixed(2) + "%":'<0.01%') : '--';
  },

//日期格式转换 pledgeUpDate
  timeChangeForPledgeUpDate:function(nS) {
    if (nS) {
      var date = new Date(parseInt(nS));
      return '（更新于'+[date.getFullYear(), String(date.getMonth() + 1).length > 1 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1), String(date.getDate()).length > 1 ? date.getDate() : "0" + date.getDate()].join('-')+"）";
    } else {
      return '';
    }
  },

  /**
   * 格式化数字
   * @param value
   * @param precision 小数点精度
   * @param fixSmallNumber 是否格式化小于1万的数， 默认值为：true
   * @returns {*}
   */
  formatNumber:function(value, precision, fixSmallNumber) {
    if (value && !isNaN(value)) {
      if(precision === undefined || precision === '' || precision === null)
        precision = 2;

      if(fixSmallNumber === undefined)
        fixSmallNumber = true;

      var prefix = '';
      if(value < 0){
        value = Math.abs(value);
        prefix = '-';
      }

      if (value < 10e3)
        return fixSmallNumber ? prefix + value.toFixed(precision) : value;
      else if (value < 10e7)
        return prefix + (value / 10e3).toFixed(precision) + '万';
      else
        return prefix + (value / 10e7).toFixed(precision) + '亿';
    } else {
      return value===0 ? value.toFixed(2) : '--';
    }
  },

  //处理小于0.00001的数值加"%"
  addPerForMin:function(hldAmount,hldPercent) {
    console.log(hldPercent);
    return hldAmount ? (hldPercent?(hldPercent>=0.01?hldPercent.toFixed(2) + "%":'<0.01%'):'<0.01%') : '--';
  },

  ifUndefined:function(val){
    return val?val:'--';
  },
  ifNone:function(val){
    return val?val:'';
  },

//小数点保存后两位
  fixed2:function(num) {
    return (!isNaN(num) && num !== '') ? num.toFixed(2) : '--';
  },

  /**
   * 深拷贝对象
   * @param source
   */
  deepCopy(source) {
    return JSON.parse(JSON.stringify(source));
  },

  /**
   * 评价回答
   * @param spanId 答案标识
   * @param rate 1-差评,2-好评
   * @param labelId
   */
  ratingAnswer:function(spanId, rate, labelId) {
    // console.log(labelId+":"+$("#"+labelId).hasClass('cur'))
    var curLabel = $("#" + labelId);
    if (curLabel.hasClass('cur'))
      return;

    toolsUtil.sendRateQuestion(rate);
    requestUtil.rateAnswer(spanId, rate, function (result) {
      // console.log(result)
      curLabel.addClass('cur');
      if (rate === "1") {
        toolsUtil.rateAnswerAfter('您可以点击反馈写下您的意见，小e会继续改进');
      }
      else if (rate === '2') {
        toolsUtil.rateAnswerAfter('谢谢您的评价，您可以继续提问');
      }
    })
  },

  /**
   * 输出评价内容
   * @param rate
   */
  sendRateQuestion:function(rate) {
    var temp = '';
    if (rate === '1')
      temp = '<i class="icon-bad2"></i>';
    else if (rate === '2')
      temp = '<i class="icon-good2"></i>';

    var questionId = toolsUtil.generateRandomClassName('thumbId');
    // appendAnswer(temp, 'md md_right_v2', questionId);
    // scrollToQuestion();
  },

  /**
   * 差评成功后输出
   * @param msg
   */
  rateAnswerAfter:function(msg) {
    sendPreAnswerContent(msg);
    var answerId = generateRandomClassName('answer');
    var temp =
      '<ul>' +
      '<li onclick="setFeedbackMode()">反馈</li>';
    if (appKey == "appEzt") {
      temp += '<li onclick="callAdviser2()">人工服务</li>';
    }
    temp += '</ul>';
    appendAnswer(temp, 'md_fastNav pt_1', answerId);
    lastQuestionId = answerId;
    // scrollToBodyEnd();
    scrollToQuestion();
  }

}


