/**
 * Created by BoBo on 2017-03-16.
 */

var requestUtil = {
  params: {
    local: "/question"
  },
  /**
   * 智能回答
   * @param sendTxt 发送给后端的问题
   * @param showTxt 显示的问题
   * @param voiceQuestion 是否为语音问题
   * @param questionId 个性化首页推荐需要参数  问句的id
   * @param userQuestionId  个性化首页推荐需要参数  用户问句关系的id
   * @param source  来源（便于百度统计）
   */
  freeQuestion: function (sendTxt, callback,tag) {
    $.ajax({
      type: "get",
      url: requestUtil.params.local + "/api/"+tag,
      data: {
        question: sendTxt
      },
      timeout: 15000,
      jsonp: "callback",
      success: function (json) {
        callback(json);
      },
      error: function (err) {
        console.log(err)
      },
      complete: function (XMLHttpRequest) {
        $(".showLoading").hide();
      }
    });
  },

  /**
   * 取股票报价列表品
   */
  getPriceList: function (symbol, success, errorHandler) {
    var URL = requestUtil.params.local + "/api/stock/quota";
    $.ajax({
      type: "get",
      url: URL,
      data: {
        symbol: symbol
      },
      success: success
    });
  },

  /**
   * 取股票报价
   * @param symbol
   * @param success
   * @param error
   */
  getPrice:function(symbol, success, error){
    var URL = requestUtil.params.local + "/api/stock/getprice";
    $.ajax({
      type: "get",
      url: URL,
      data: {
        symbol: symbol,
        userId: ''
      },
      success: success,
      error: error
    });
  },

  /**
   * 固定回答获取个股解析
   */
  expoitFixedAnswerForShare: function (subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, success, errorHandler) {
    url = requestUtil.params.local+"/api/stock/fix";
    $.ajax({
      type: "get",
      url: url,
      data: {
        subjectCode: subjectCode,
        subjectName: subjectName,
        subjectMarket: subjectMarket,
        subjectRawValue: subjectRawValue,
        predicateType: '行业个股推荐理由'
      },
      timeout: 10000,
      success: success,
      error: errorHandler ? errorHandler : ajaxErrorHandler
    })
  },

  /**
   * 固定回答获取个股解析
   */
  expoitFixedAnswer:function(subjectCode, subjectName, subjectMarket, subjectRawValue, predicateType, attribute, success, errorHandler) {
    url = requestUtil.params.local + "/api/stock/fix";
    $.ajax({
      type: "get",
      url: url,
      data: {
        subjectCode: subjectCode,
        subjectName: subjectName,
        subjectMarket: subjectMarket,
        subjectRawValue: subjectRawValue,
        predicateType: predicateType,
        attribute: attribute,
        attributeType: '时间'
      },
      timeout: 10000,
      success: success,
      error: errorHandler ? errorHandler : ajaxErrorHandler
    })
  },

  /**
   * 评价答案
   * @param spanId
   * @param rate
   * @param success
   * @param error
   */
  rateAnswer:function(spanId, rate, success, error) {
    $.ajax({
      type: "get",
      url: requestUtil.params.local + "/api/feedback",
      data: {
        spanId: spanId,
        commentFeedback: rate,
        // userId: userId,
        // clientId: clientId
      },
      success: success
    });
}
}









