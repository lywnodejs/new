/**
 * Created by xdy on 18-07-30.
 * K线，中短期--日K  长期--周K
 * 指标MACD  kdj  rsi
 * 话术（中短期。长期。指标）
 *
 * @param from from == 'fromAPP'表示原生嵌套的个股分析页面   可跳转股票详情页  显示问小E
 * @param from from == 'fromPDF'表示研报PDF嵌套的个股分析页面  不可跳转股票详情页 不显示问小E(暂时不用)
 * @param from from == ''       表示智能小E套的个股分析页面    不可可跳转股票详情页 不显示问小E
 *
 * @param chartTabIndex chartTabIndex=0 显示趋势分析 chartTabIndex=1 显示区域分析
 * 非技术分析弹框 chartTabIndex=0 显示趋势分析
 * 技术分析弹框   chartTabIndex=1 显示区域分析 *
 * @param type type=‘指数综评’  指数类的显示区域分析   不显示tab切换
 *
 * isPopup  弹框页面不再显示弹框
 *
 * K线  最后一根数据的信号指标  up=1----表示上涨趋势；down=1----表示下跌趋势；mid=1---表示震荡趋势
 * 上升趋势，趋势线 红色，下降趋势，趋势线绿色，震荡趋势，趋势线 黑色
 * 波段买点在下跌趋势下的情况屏蔽，只展示在上升和震荡趋势下的情况
 *
 * 百度统计  点击查看详情 点击切换区域分析、趋势分析；  点击切换中短期、长期 ；点击切换macd kdj rsi；   点击指标说明
 *
 * 接口返回说明：起跌(2)、反弹(1)、末跌(3) 起涨(5)、回调(4)、末涨(6) 震荡(7) 无标志(0)（暂时没用到）
 */
var analysis_kline = {
  /**
   * 指标分析的百叶窗效果
   * @param this
   * @param index
   * @param sn
   * @param source 来源
   */
  openTitle: function (obj, index, sn, source) {
    var thisObj = $(obj);

    thisObj.parents("li").find(".box").slideUp();
    if (thisObj.parents("li").hasClass("on") > 0) {
      thisObj.parents("li").removeClass("on");
      thisObj.find("i").attr("class", "icon-arrow_open");
    } else {
      thisObj.parents("li").siblings().find(".box").slideUp();
      thisObj.parents("li").find(".box").slideDown();
      thisObj.parents("li").addClass("on").siblings().removeClass("on");
      thisObj.find("i").attr("class", "icon-arrow_closed2");
      thisObj.parents("li").siblings().find("i").attr("class", "icon-arrow_open");

      if (index == 0) {
        // baiduTrackEvent('macd指标', 'click', source);
      } else if (index == 1) {
        // baiduTrackEvent('kd指标', 'click', source);
      } else if (index == 2) {
        // baiduTrackEvent('rsi指标', 'click', source);
      }
    }

  },

  /**
   * 短线决策popup
   */
  openPop_juece: function () {
    $(".pop_analysis_1_2_shortPolicy").addClass("show").removeClass("hide");

    var propH = $(".pop_analysis_1_2_trendSystem .box").height(),
      propT = (winH - propH) / 2 - 20;
    $(".pop_prompt .box").css({"top": propT});
  },
  /**
   * 短线决策popup
   */
  openPop_introduction: function () {
    $(".pop_analysis_1_2_trendQuantization").addClass("show").removeClass("hide");

    var propH = $(".pop_analysis_1_2_trendQuantization .box").height(),
      propT = (winH - propH) / 2 - 20;
    $(".pop_prompt .box").css({"top": propT});
  },
  /**
   * 操盘线popup
   */
  openPop_expma: function () {
    $(".pop_analysis_1_3_expma").addClass("show").removeClass("hide");

    var propH = $(".pop_analysis_1_3_expma .box").height(),
      propT = (winH - propH) / 2 - 20;
    $(".pop_prompt .box").css({"top": propT});
  },

  /**
   * 获取图表的浮框
   * @param type day/week
   * @param sn
   * @param dif dif值
   * @param dea dea值
   * @param macd macd值
   * @param t 时间
   */
  getChartFloat: function (val) {
    var txt = '';
    /*txt = '<span style="display:block !important;background-color: #000; opacity: 0.7; -moz-border-radius: 0.125rem; -webkit-border-radius: 0.125rem; border-radius: 0.125rem; -moz-box-shadow: 0 0 0.5rem #4c4c4c; -webkit-box-shadow: 0 0 0.5rem #4c4c4c; box-shadow: 0 0 0.5rem #4c4c4c; display: inline-block; font-size: 0.75rem; font-weight: 500; line-height: 1.688rem; height: 1.688rem; padding: 0 0.625rem;;position:absolute;top: 65px;left: 3px">'+
            '<b style="color: #fff; opacity: 1;">'+
            val+
            '</b></span><br>';*/
    txt = '<span style="background-color: #000; opacity: 0.7; -moz-border-radius: 0.125rem; -webkit-border-radius: 0.125rem; border-radius: 0.125rem; -moz-box-shadow: 0 0 0.5rem #4c4c4c; -webkit-box-shadow: 0 0 0.5rem #4c4c4c; box-shadow: 0 0 0.5rem #4c4c4c; display: inline-block; font-size: 0.75rem; font-weight: 500; line-height: 1.688rem; height: 1.688rem; padding: 0 0.625rem;">' +
      '<b style="color: #fff; opacity: 1;">' +
      val +
      '</b></span><br>';

    return txt;
  },

  /**
   * 获取K线图表的标题
   * @param type day/week
   * @param sn
   * @param dif dif值
   * @param dea dea值
   * @param macd macd值
   * @param t 时间
   */
  getKDayTitle: function (type, sn, ma5, ma10, ma20, ma60, zsyjx) {
    if(zsyjx == undefined){
      zsyjx = "";
    }
    var $k = '', $zsyjx = '';
    if (type == 'day') {
      $k = $("#chart_note_day" + sn);
      $zsyjx = $("#chart_note_day_zsyjx" + sn);
    } else if (type == 'week') {
      $k = $("#chart_note_week" + sn);
      $zsyjx = $("#chart_note_week_zsyjx" + sn);
    }
    var txt = '', txt2;
    txt = '<b>均线</b>' +
      '<span>MA5:' + ma5 + '</span>' +
      '<span>10:' + ma10 + '</span>' +
      '<span>20:' + ma20 + '</span>' +
      '<span>60:' + ma60 + '</span>';
    if (zsyjx == '0.00') {
      zsyjx = '盘后更新'
    }
    txt2 = '<span style="margin-left: 4px;">操盘线：' + zsyjx + '</span>';
    $k.html(txt);
    $zsyjx.html(txt2)
  },
  getKCTitle: function (type, sn, t, hong2lv, lv2hong) {
    var $k = '';
    if (type == 'day') {
      $k = $("#chart_note_day_c" + sn);
    } else if (type == 'week') {
      $k = $("#chart_note_week_c" + sn);
    }
    var txt = '', hs = '';
    if (hong2lv == 1 && lv2hong == 0) {
      hs = "红转绿看空"
    } else if (hong2lv == 0 && lv2hong == 1) {
      hs = "绿转红看多"
    }

    txt =
      '<span style="color: inherit">最近转折</span>' +
      '<span style="margin: inherit;color: inherit">' + t + '</span>' +
      '<span style="margin-left: 2px;color: inherit">' + hs + '</span>';
    $k.html(txt);
  },
  /**
   * 获取K线图表--成交量的标题
   * @param type day/week
   * @param sn
   * @param dif dif值
   * @param dea dea值
   * @param macd macd值
   * @param t 时间
   */
  getKDayVolTitle: function (type, sn, column, vma5, vma10) {
    var $k_vol = '', $k_vol_c;
    if (type == 'day') {
      $k_vol = $("#chart_note_vol_day" + sn);
      $k_vol_c = $("#chart_note_vol_day_c" + sn);
    } else if (type == 'week') {
      $k_vol = $("#chart_note_vol_week" + sn);
      $k_vol_c = $("#chart_note_vol_week_c" + sn);
    }
    var txt = '';
    txt = '<b>成交量</b><span>' + column + '</span><span>MA5:' + vma5 + '</span><span>10:' + vma10 + '</span>';
    $k_vol.html(txt);
    $k_vol_c.html(txt);
  },
  /**
   * 获取macd图表的标题
   * @param type day/week
   * @param sn
   * @param dif dif值
   * @param dea dea值
   * @param macd macd值
   * @param t 时间
   */
  getMacdTitle: function (type, sn, dif, dea, macd, t) {
    var $macd = '';
    if (type == 'day') {
      $macd = $("#macd_title" + sn);
    } else if (type == 'week') {
      $macd = $("#macd_title_week" + sn);
    }
    var macd_txt = '';
    macd_txt += '<b>MACD</b>' +
      //'<span style="color: #636a87">[12,26,9]</span>'+
      '<span style="color: #337edb">DIFF:' + dif + '</span>' +
      '<span style="color: #ff7b00">DEA:' + dea + '</span>';
    if (macd >= 0) {
      macd_txt += '<span style="color: #dd113c">MACD:' + macd + '</span>'
    } else {
      macd_txt += '<span style="color: #33AA11">MACD:' + macd + '</span>'
    }
    macd_txt +=
      '<span style="color: #636a87">' + t + '</span>';
    $macd.html(macd_txt);
  },
  /**
   * 获取kd图表的标题
   * @param type day/week
   * @param sn
   * @param k k值
   * @param d d值
   * @param t 时间
   */
  getKdTitle: function (type, sn, k, d, t) {
    var $kd = '';
    if (type == 'day') {
      $kd = $("#kd_title" + sn);
    } else if (type == 'week') {
      $kd = $("#kd_title_week" + sn);
    }
    var kd_txt = '';
    kd_txt += '<b>KD</b>' +
      '<span style="color: #337edb">K:' + k + '</span>' +
      '<span style="color: #ff7b00">D:' + d + '</span>' + '<span style="color: #636a87">' + t + '</span>';
    ;
    $kd.html(kd_txt);
  },
  /**
   * 获取CCI 图表的标题
   * @param type day/week
   * @param sn
   * @param k k值
   * @param d d值
   * @param t 时间
   */
  getCCiTitle: function (type, sn, k, d, t) {
    var $cci = '';
    if (type == 'day') {
      $cci = $("#cci_title" + sn);
    } else if (type == 'week') {
      $cci = $("#cci_title_week" + sn);
    }
    var cci_txt = '';
    cci_txt += '<b>CCI</b>' +
      '<span style="color: #337edb">CCI:' + k + '</span>' +
      '<span style="color: #ff7b00">CI:' + d + '</span>' + '<span style="color: #636a87">' + t + '</span>';
    ;
    $cci.html(cci_txt);
  },
  /**
   * 获取rsi图表的标题
   * @param type day/week
   * @param sn
   * @param rsi6 rsi6值
   * @param rsi12 rsi12值
   * @param t 时间
   */
  getRsiTitle: function (type, sn, rsi6, rsi12, t) {
    var $rsi = '';
    if (type == 'day') {
      $rsi = $("#rsi_title" + sn);
    } else if (type == 'week') {
      $rsi = $("#rsi_title_week" + sn);
    }
    var rsi_txt = '';
    rsi_txt += '<b>RSI</b>' +
      '<span style="color: #337edb">RSI6:' + rsi6 + '</span>' +
      '<span style="color: #ff7b00">RSI12:' + rsi12 + '</span>' + '<span style="color: #636a87">' + t + '</span>';
    ;
    $rsi.html(rsi_txt);
  },
  /**
   * 获取wr图表的标题
   * @param type day/week
   * @param sn
   * @param wr6 wr6值
   * @param wr10 wr10值
   * @param t 时间
   */
  getWrTitle: function (type, sn, wr6, wr10, t) {
    var $wr = '';
    if (type == 'day') {
      $wr = $("#wr_title" + sn);
    } else if (type == 'week') {
      $wr = $("#wr_title_week" + sn);
    }
    var wr_txt = '';
    wr_txt += '<b>WR</b>' +
      '<span style="color: #337edb">WR6:' + wr6 + '</span>' +
      '<span style="color: #ff7b00">WR10:' + wr10 + '</span>' + '<span style="color: #636a87">' + t + '</span>';
    ;
    $wr.html(wr_txt);
  },

  //原生 取股票详情页
  showDetail: function (symbol, source) {
    if (appFrom === 'ios') {
      var params = {
        pageId: 'hs_market_stock_detail',
        stockCode: symbol.toString()
      };
      commonCallback('routerNative', JSON.stringify(params));

      baiduTrackEvent('ios股票详情', 'click', source);
    }
    if (appFrom === 'android') {
      var params = {
        pageId: 'hs_market_stock_detail',
        stockCode: symbol.toString()
      };
      commonCallback('navigationNative', JSON.stringify(params));

      baiduTrackEvent('android股票详情', 'click', source);
    }
  },
  initKData: function(data, type, sn, lastPrice, appKey) {
    if (type == 'day') {
      //有数据  用兆军接口 data.detail.EQUSHI.signals
      if (data.DAY_EQUSHI.signals.length > 0) {
        /**
         * K线数据组
         */
          //var stockList = rs.signals.slice(rs.signals.length-132,rs.signals.length);
        var stockList = data.DAY_EQUSHI.signals;
        var ohlc = [],//蜡烛图数据
          column = [],//柱形图数据

          peak = [],//波峰数据
          trough = [],//波谷数据

          up = [],//上升趋势 红色
          down = [],//下降趋势 绿色

          ma5 = [], ma10 = [], ma20 = [], ma60 = [],//K线均线

          vma5 = [], vma10 = [],//成交量均线

          macdblding = [],//股价顶背离
          macdbldi = [],//股价底背离
          bdmd = [],//股价波段买点（短线决策）
          zsyhong = [],
          zsylv = [],
          zsylv_total = [],
          zsyjx = [],//自适应均线（操盘线）
          zsyhong2lv = [],//自适应均线（操盘线）
          zsylv2hong = [];//自适应均线（操盘线）

        var peakList = data.DAY_EQUSHI.peak;
        var troughList = data.DAY_EQUSHI.trough;

        var nextPrice = stockList[stockList.length - 2].c;//上一交易日的收盘价


        //获取支撑线与压力线
        //等于当前价取上一交易日的收盘价为基准来做判断
        var arr = analysis_kline.getUpDown(stockList, peakList, troughList, lastPrice, nextPrice);
        //低于当前价位是支撑线（红色），高于当前价位的线是压力线（绿色）
        //两个点都是高于当前价位的，只给最近的一条
        if (arr.length > 0) {
          if (arr.length == 1) {
            if (arr[0].price0 == "+") {
              up.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
            } else if (arr[0].price0 == "-") {
              down.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
            }

          } else if (arr.length >= 2) {
            if (arr[0].price0 == '+' && arr[1].price0 == '+') {
              up.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
              up.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[0].price)
              ]);
            } else if (arr[0].price0 == '-' && arr[1].price0 == '-') {
              down.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
              down.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[0].price)
              ]);
            } else if (arr[0].price0 == '+' && arr[1].price0 == '-') {
              up.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
              down.push([
                chartTimeUtil.dataFormatter(arr[1].dt),//0
                Number(arr[1].price)
              ]);
              up.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[0].price)
              ]);
              down.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[1].price)
              ]);
            } else if (arr[0].price0 == '-' && arr[1].price0 == '+') {
              down.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
              up.push([
                chartTimeUtil.dataFormatter(arr[1].dt),//0
                Number(arr[1].price)
              ]);
              up.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[1].price)
              ]);
              down.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[0].price)
              ]);
            }
          }
        }

        if (peakList.length > 0) {
          //波峰
          if (peakList.length == 2) {
            var len = peakList.length;
            if (Number(peakList[1].dt) >= Number(stockList[0].dt)) {
              for (var j = 0; j < len; j++) {
                peak.push([
                  chartTimeUtil.dataFormatter(peakList[j].dt),//0
                  Number(peakList[j].price)
                ]);

              }
            }
          }
        }
        if (troughList.length > 0) {
          //波谷
          if (troughList.length == 2) {
            var len = troughList.length;
            if (Number(troughList[1].dt) >= Number(stockList[0].dt)) {
              for (var j = 0; j < len; j++) {
                trough.push([
                  chartTimeUtil.dataFormatter(troughList[j].dt),
                  Number(troughList[j].price)
                ]);
              }
            }
          }
        }


        if (stockList.length > 0) {
          var len = stockList.length;
          // var zsylv_total = [];
          var num_nor = '';
          for (var j = 0; j < len; j++) {
            ohlc.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),//0
              Number(stockList[j].o),//1
              Number(stockList[j].h),//2
              Number(stockList[j].l),//3
              Number(stockList[j].c),//4
              stockList[j].up,//5
              stockList[j].down,//6
              stockList[j].mid,//7
              Number(stockList[j].ma.ma5),//8
              Number(stockList[j].ma.ma10),//9
              Number(stockList[j].ma.ma20),//10
              Number(stockList[j].ma.ma60),//11
              Number(stockList[j].v),//12
              Number(stockList[j].vma5),//13
              Number(stockList[j].vma10),//14
              Number(stockList[j].macdblding),//15
              Number(stockList[j].macdbldi),//16
              Number(stockList[j].bdmd),//17
              stockList[j].zsyjx.zsyjx,//18
              Number(stockList[j].zsyjx.zsylv2hong),//19
              Number(stockList[j].zsyjx.zsyhong2lv),//20
              Number(stockList[j].zsyjx.zsyhong),//21
              Number(stockList[j].zsyjx.zsylv)//22
            ]);
            column.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].v)
            ]);
            ma5.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].ma.ma5)
            ]);
            ma10.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].ma.ma10)
            ]);
            ma20.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].ma.ma20)
            ]);
            ma60.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].ma.ma60)
            ]);
            vma5.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].vma5)
            ]);
            vma10.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].vma10)
            ]);
            zsyjx.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              stockList[j].zsyjx.zsyjx
            ]);
            if (stockList[j].zsyjx.zsylv != num_nor) {
              zsylv_total.push([]);
            }
            zsylv_total[zsylv_total.length - 1].push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].zsyjx.zsyjx),
              Number(stockList[j].zsyjx.zsyhong2lv),
              Number(stockList[j].zsyjx.zsylv2hong),
              Number(stockList[j].zsyjx.zsyhong),
              Number(stockList[j].zsyjx.zsylv)
            ]);
            num_nor = stockList[j].zsyjx.zsylv;
            if (stockList[j].macdblding == 1) {
              macdblding.push([
                chartTimeUtil.dataFormatter(stockList[j].dt),
                Number(stockList[j].h)
              ]);
            }
            if (stockList[j].macdbldi == 1) {
              macdbldi.push([
                chartTimeUtil.dataFormatter(stockList[j].dt),
                Number(stockList[j].l)
              ]);
            }
            //波段买点在下跌趋势下的情况屏蔽，只展示在上升和震荡趋势下的情况
            if (stockList[j].up === "1" || stockList[j].mid === "1") {
              // debugger
              if (stockList[j].bdmd == 1) {
                bdmd.push([
                  chartTimeUtil.dataFormatter(stockList[j].dt),
                  Number(stockList[j].l)
                ]);
              }
            }
          }
        } else {
          console.log("未返回K线数据");
        }

        peak = peak.reverse();
        trough = trough.reverse();

        //获取K线图表的图例
        var chart_legend_txt = '', chart_note_day_wenhao = '';
        if (peak.length > 0 || trough.length > 0 || up.length > 0 || down.length > 0) {
          chart_legend_txt += '<strong class="s1"><em class="t_red">-</em>/<em class="t_green">-</em>支撑压力</strong>';
        }
        if (macdblding.length > 0 || macdbldi.length > 0) {
          chart_legend_txt += '<strong class="s2"><b></b>/<b></b>股价macd背离</strong>';
        }

        chart_note_day_wenhao += '<a onclick="analysis_kline.openPop_expma()" style="color: #333;margin-left: .5rem;"><i class="icon-help2" style="margin-left: .25rem;color: #a1a2a8"></i></a>';
        if (bdmd.length > 0 && appKey !='report') {
          chart_legend_txt += '<strong class="s3" onclick="analysis_kline.openPop_juece()"><b></b>决策点<a><i class="icon-help2"></i></a></strong>';
        }

        if (type == 'day') {
          //获取K线图表的图例
          $('#chart_legend_day' + sn).html(chart_legend_txt);
          $('#chart_note_day_wenhao' + sn).html(chart_note_day_wenhao);
          //获取K线图表的标题
          analysis_kline.getKDayTitle('day', sn, ma5[ma5.length - 1][1], ma10[ma10.length - 1][1], ma20[ma20.length - 1][1], ma60[ma60.length - 1][1], zsyjx[zsyjx.length - 1][1]);

          //获取K线图表--成交量的标题
          analysis_kline.getKDayVolTitle('day', sn, analysis_kline.formatNumber(column[column.length - 1][1] / 100, 2), analysis_kline.formatNumber(vma5[vma5.length - 1][1] / 100, 2), analysis_kline.formatNumber(vma10[vma10.length - 1][1] / 100, 2));

          analysis_kline.createKLineChart('container_k' + sn, ohlc, column, ma5, ma10, ma20, ma60, sn, '日K', peak, trough, up, down, vma5, vma10, macdblding, macdbldi, bdmd, zsylv_total);

          analysis_kline.createKLineChart_c('container_k_c' + sn, ohlc, column, ma5, ma10, ma20, ma60, sn, '日K', peak, trough, up, down, vma5, vma10, macdblding, macdbldi, bdmd, zsylv_total);

          analysis_kline.getKCTitle(type, sn, chartTimeUtil.getTimeStr3(zsylv_total[zsylv_total.length - 1][0][0]), zsylv_total[zsylv_total.length - 1][0][2], zsylv_total[zsylv_total.length - 1][0][3]);

        }
      } else {
        console.log("未返回技术分析数据");
      }
      if (data.DAY_TXTQUSHI.memo.length > 0) {
        var txt = '<div class="hd_gl_white hd_gl_blue">' +
          '<b></b><span>价</span><b></b>' +
          '</div>' +
          '<h5>' + data.DAY_TXTQUSHI.memo + '</h5>';
        if (type == 'day') {
          $('#day_huashu_jia' + sn).html(txt);
        } else if (type == 'week') {
          $('#week_huashu_jia' + sn).html(txt);
        }
      } else {
        if (type == 'day') {
          $('#day_huashu_jia' + sn).removeClass("box_bgGray");
          $('#day_huashu_jia' + sn).html('');
        } else if (type == 'week') {
          $('#week_huashu_jia' + sn).removeClass("box_bgGray");
          $('#week_huashu_jia' + sn).html('');
        }
      }
      if (data.DAY_TXTQUSHIVOL.memo.length > 0) {
        var txt = '<div class="hd_gl_white hd_gl_blue">' +
          '<b></b><span>量</span><b></b>' +
          '</div>' +
          '<h5>' + data.DAY_TXTQUSHIVOL.memo + '</h5>';
        if (type == 'day') {
          $('#day_huashu_liang' + sn).html(txt);
        } else if (type == 'week') {
          $('#week_huashu_liang' + sn).html(txt);
        }
      } else {
        if (type == 'day') {
          $('#day_huashu_liang' + sn).removeClass("box_bgGray");
          $('#day_huashu_liang' + sn).html('');
        } else if (type == 'week') {
          $('#week_huashu_liang' + sn).removeClass("box_bgGray");
          $('#week_huashu_liang' + sn).html('');
        }
      }


      if (appKey != 'report') {

        //MACD KD RSI 话术
        // MACD 话术
        if (data.DAY_TXTMACD.memo.length > 0) {
          if (type == 'day') {
            $('#macdHuashu_day' + sn).html(data.DAY_TXTMACD.memo);
          } else if (type == 'week') {
            $('#macdHuashu_week' + sn).html(rs.memo);
          }
        } else {
          if (type == 'day') {
            $('#macdHuashu_day' + sn).html("MACD指标暂无明显信号");
          } else if (type == 'week') {
            $('#macdHuashu_week' + sn).html("MACD指标暂无明显信号");
          }
        }
        // KD 话术
        if (data.DAY_TXTKD.memo.length > 0) {
          if (type == 'day') {
            $('#kdHuashu_day' + sn).html(data.DAY_TXTKD.memo);
          } else if (type == 'week') {
            $('#kdHuashu_week' + sn).html(rs.memo);
          }
        } else {
          if (type == 'day') {
            $('#kdHuashu_day' + sn).html("KD指标暂无明显信号");
          } else if (type == 'week') {
            $('#kdHuashu_week' + sn).html("KD指标暂无明显信号");
          }
        }
        // RSI 话术
        if (data.DAY_TXTRSI.memo.length > 0) {
          if (type == 'day') {
            $('#rsiHuashu_day' + sn).html(data.DAY_TXTRSI.memo);
          } else if (type == 'week') {
            $('#rsiHuashu_week' + sn).html(rs.memo);
          }
        } else {
          if (type == 'day') {
            $('#rsiHuashu_day' + sn).html("RSI指标暂无明显信号");
          } else if (type == 'week') {
            $('#rsiHuashu_week' + sn).html("RSI指标暂无明显信号");
          }
        }
        if (data.DAY_TXTWR.memo.length > 0) {
          if (type == 'day') {
            $('#wrHuashu_day' + sn).html(data.DAY_TXTWR.memo);
          } else if (type == 'week') {
            $('#wrHuashu_week' + sn).html(rs.memo);
          }
        } else {
          if (type == 'day') {
            $('#wrHuashu_day' + sn).html("wr指标暂无明显信号");
          } else if (type == 'week') {
            $('#wrHuashu_week' + sn).html("RSI指标暂无明显信号");
          }
        }
        // cci 话术
        if (data.DAY_TXTCCI.memo.length > 0) {
          if (type == 'day') {
            $('#cciHuashu_day' + sn).html(data.DAY_TXTCCI.memo);
          } else if (type == 'week') {
            $('#cciHuashu_week' + sn).html(rs.memo);
          }
        } else {
          if (type == 'day') {
            $('#cciHuashu_day' + sn).html("CCI指标暂无明显信号");
          } else if (type == 'week') {
            $('#cciHuashu_week' + sn).html("CCI指标暂无明显信号");
          }
        }

        // MACD Kd  RSI 三个图标
        // MACD有数据  用兆军接口 data.detail.EMACD.signals
        if (data.DAY_EMACD.signals.length > 0) {
          var macdList = data.DAY_EMACD.signals;
          var difData = [],//dif数据
            deaData = [],//dea数据
            macdData = [],//macd数据
            _buyData = [],//买入数据
            _sellData = [],//卖出数据
            buyData = [],//买入数据
            sellData = [],//卖出数据
            bldingData = [],//顶背离数据
            bldiData = [];//底背离数据
          for (var k = 0; k < macdList.length; k++) {
            difData.push([
              chartTimeUtil.dataFormatter(macdList[k].dt),
              Number(macdList[k].diff)
            ]);
            deaData.push([
              chartTimeUtil.dataFormatter(macdList[k].dt),
              Number(macdList[k].dea),
              Number(macdList[k].macd),
              Number(macdList[k].diff),
              Number(macdList[k].b),
              Number(macdList[k].s),
              Number(macdList[k].blding),
              Number(macdList[k].bldi)
            ]);
            macdData.push([
              chartTimeUtil.dataFormatter(macdList[k].dt),
              Number(macdList[k].macd)
            ]);
            if (macdList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(macdList[k].dt),
                Number(macdList[k].b),
                Number(macdList[k].macd),
                Number(macdList[k].diff),
                Number(macdList[k].dea)
              ]);
            }
            if (macdList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(macdList[k].dt),
                Number(macdList[k].s),
                Number(macdList[k].macd),
                Number(macdList[k].diff),
                Number(macdList[k].dea)
              ]);
            }
            if (macdList[k].blding == 1) {
              bldingData.push([
                chartTimeUtil.dataFormatter(macdList[k].dt),
                Number(macdList[k].blding),
                Number(macdList[k].macd),
                Number(macdList[k].diff),
                Number(macdList[k].dea)
              ]);
            }
            if (macdList[k].bldi == 1) {
              bldiData.push([
                chartTimeUtil.dataFormatter(macdList[k].dt),
                Number(macdList[k].bldi),
                Number(macdList[k].macd),
                Number(macdList[k].diff),
                Number(macdList[k].dea)
              ]);
            }
          }
          if (type == 'day') {
            //MACD图表标题
            analysis_kline.getMacdTitle(type, sn, Number(difData[difData.length - 1][1]).toFixed(2), Number(deaData[deaData.length - 1][1]).toFixed(2), Number(macdData[macdData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(difData[difData.length - 1][0]));

            //MACD图表图例
            var legend_txt = '';
            if (_buyData.length > 0 || _sellData.length > 0) {
              legend_txt += '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>';
            }
            if (bldingData.length > 0 || bldiData.length > 0) {
              legend_txt += '<strong><b></b>/<b></b>股价和macd背离</strong>';
            }
            $('#macd_legend' + sn).html(legend_txt);

            //创建MACD图表
            analysis_kline.createMACDChart('container_macd' + sn, macdData, deaData, difData, _buyData, _sellData, sn, bldingData, bldiData);
          } else if (type == 'week') {
            //MACD图表标题
            analysis_kline.getMacdTitle(type, sn, Number(difData[difData.length - 1][1]).toFixed(2), Number(deaData[deaData.length - 1][1]).toFixed(2), Number(macdData[macdData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(difData[difData.length - 1][0]));

            //MACD图表图例
            var legend_txt = '';
            if (_buyData.length > 0 || _sellData.length > 0) {
              legend_txt += '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>';
            }
            if (bldingData.length > 0 || bldiData.length > 0) {
              legend_txt += '<strong><b></b>/<b></b>股价和macd背离</strong>';
            }
            $('#macd_legend_week' + sn).html(legend_txt);

            //创建MACD图表
            analysis_kline.createMACDChart('container_macd_week' + sn, macdData, deaData, difData, _buyData, _sellData, sn, bldingData, bldiData);
          }

        } else {
          console.log("未返回macd数据");
        }
        //Kd有数据  用兆军接口
        if (data.DAY_EKD.signals.length > 0) {
          var kdList = data.DAY_EKD.signals;
          var kData = [];//k数据
          var dData = [];//d数据
          var _buyData = [];//买入数据
          var _sellData = [];//卖出数据
          var buyData = [];//买入数据
          var sellData = [];//卖出数据
          for (var k = 0; k < kdList.length; k++) {
            //for(var k = kdList.length-100;k<kdList.length;k++){
            kData.push([
              chartTimeUtil.dataFormatter(kdList[k].dt),//0
              Number(kdList[k].k),//1
              Number(kdList[k].k),//2
              Number(kdList[k].k),//3
              Number(kdList[k].b),//4
              Number(kdList[k].s),//5
              Number(kdList[k].blding),//6
              Number(kdList[k].bldi)//7
            ]);
            dData.push([
              chartTimeUtil.dataFormatter(kdList[k].dt),
              Number(kdList[k].d)
            ]);
            if (kdList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(kdList[k].dt),
                Number(kdList[k].b),
                Number(kdList[k].k),
                Number(kdList[k].d)
              ]);
            }
            if (kdList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(kdList[k].dt),
                Number(kdList[k].s),
                Number(kdList[k].k),
                Number(kdList[k].d)
              ]);
            }
          }


          if (type == 'day') {
            //KD图表标题
            analysis_kline.getKdTitle(type, sn, Number(kData[kData.length - 1][1]).toFixed(2), Number(dData[dData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(kData[kData.length - 1][0]));

            //创建KD图表
            analysis_kline.createMACDChart('container_kd' + sn, [], kData, dData, _buyData, _sellData, sn);
          } else if (type == 'week') {
            //KD图表标题
            analysis_kline.getKdTitle(type, sn, Number(kData[kData.length - 1][1]).toFixed(2), Number(dData[dData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(kData[kData.length - 1][0]));

            //创建KD图表
            analysis_kline.createMACDChart('container_kd_week' + sn, [], kData, dData, _buyData, _sellData, sn);
          }

        } else {
          console.log("未返回Kd数据");
        }
        //RSI有数据  用兆军接口
        if (data.DAY_ERSI.signals.length > 0) {
          var rsiList = data.DAY_ERSI.signals;
          var rsi6Data = [];//k数据
          var rsi12Data = [];//d数据
          var _buyData = [];//买入数据
          var _sellData = [];//卖出数据
          for (var k = 0; k < rsiList.length; k++) {
            //for(var k = rsiList.length-100;k<rsiList.length;k++){
            rsi6Data.push([
              chartTimeUtil.dataFormatter(rsiList[k].dt),//0
              Number(rsiList[k].rsi6),//1
              Number(rsiList[k].rsi6),//2
              Number(rsiList[k].rsi6),//3
              Number(rsiList[k].b),//4
              Number(rsiList[k].s),//5
              Number(rsiList[k].blding),//6
              Number(rsiList[k].bldi)//7
            ]);
            rsi12Data.push([
              chartTimeUtil.dataFormatter(rsiList[k].dt),
              Number(rsiList[k].rsi12)
            ]);
            if (rsiList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(rsiList[k].dt),
                Number(rsiList[k].b),
                Number(rsiList[k].rsi6),
                Number(rsiList[k].rsi12)
              ]);
            }
            if (rsiList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(rsiList[k].dt),
                Number(rsiList[k].s),
                Number(rsiList[k].rsi6),
                Number(rsiList[k].rsi12)
              ]);
            }
          }

          if (type == 'day') {
            //RSI图表标题
            analysis_kline.getRsiTitle(type, sn, Number(rsi6Data[rsi6Data.length - 1][1]).toFixed(2), Number(rsi12Data[rsi12Data.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(rsi6Data[rsi6Data.length - 1][0]));

            //创建RSI图表
            analysis_kline.createMACDChart('container_rsi' + sn, [], rsi6Data, rsi12Data, _buyData, _sellData, sn);
          } else if (type == 'week') {
            //RSI图表标题
            analysis_kline.getRsiTitle(type, sn, Number(rsi6Data[rsi6Data.length - 1][1]).toFixed(2), Number(rsi12Data[rsi12Data.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(rsi6Data[rsi6Data.length - 1][0]));

            //创建RSI图表
            analysis_kline.createMACDChart('container_rsi_week' + sn, [], rsi6Data, rsi12Data, _buyData, _sellData, sn);
          }

        } else {
          console.log("未返回RSI数据");
        }
        // WR有数据  用兆军接口
        if (data.DAY_EWR.signals.length > 0) {
          var wrList = data.DAY_EWR.signals;
          var wr6Data = [];//wr1数据
          var wr10Data = [];//wr2数据
          var _buyData = [];//买入数据
          var _sellData = [];//卖出数据
          for (var k = 0; k < wrList.length; k++) {
            wr6Data.push([
              chartTimeUtil.dataFormatter(wrList[k].dt),//0
              Number(wrList[k].wr1),//1
              Number(wrList[k].wr1),//2
              Number(wrList[k].wr1),//3
              Number(wrList[k].b),//4
              Number(wrList[k].s),//5
              Number(wrList[k].blding),//6
              Number(wrList[k].bldi)//7
            ]);
            wr10Data.push([
              chartTimeUtil.dataFormatter(wrList[k].dt),
              Number(wrList[k].wr2)
            ]);
            if (wrList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(wrList[k].dt),
                Number(wrList[k].b),
                Number(wrList[k].wr1),
                Number(wrList[k].wr2)
              ]);
            }
            if (wrList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(wrList[k].dt),
                Number(wrList[k].s),
                Number(wrList[k].wr1),
                Number(wrList[k].wr2)
              ]);
            }
          }

          if (type == 'day') {
            //RSI图表标题
            analysis_kline.getWrTitle(type, sn, Number(wr6Data[wr6Data.length - 1][1]).toFixed(2), Number(wr10Data[wr10Data.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(wr6Data[wr6Data.length - 1][0]));

            //创建WR图表
            analysis_kline.createMACDChart('container_wr' + sn, [], wr6Data, wr10Data, _buyData, _sellData, sn);
          } else if (type == 'week') {
            //WR图表标题
            analysis_kline.getWrTitle(type, sn, Number(wr6Data[wr6Data.length - 1][1]).toFixed(2), Number(wr10Data[wr10Data.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(wr6Data[wr6Data.length - 1][0]));

            //创建WR图表
            analysis_kline.createMACDChart('container_wr_week' + sn, [], wr6Data, wr10Data, _buyData, _sellData, sn);
          }

        } else {
          console.log("未返回RSI数据");
        }

        //CCI 有数据  用兆军接口
        if (data.DAY_ECCI.signals.length > 0) {
          var cciList = data.DAY_ECCI.signals;
          var cciData = [];//cci k数据
          var ciData = [];//ci d数据
          var _buyData = [];//买入数据
          var _sellData = [];//卖出数据
          var buyData = [];//买入数据
          var sellData = [];//卖出数据
          for (var k = 0; k < cciList.length; k++) {
            //for(var k = kdList.length-100;k<kdList.length;k++){
            cciData.push([
              chartTimeUtil.dataFormatter(cciList[k].dt),//0
              Number(cciList[k].cci),//1
              Number(cciList[k].cci),//2
              Number(cciList[k].cci),//3
              Number(cciList[k].b),//4
              Number(cciList[k].s),//5
              Number(cciList[k].blding),//6
              Number(cciList[k].bldi)//7
            ]);
            ciData.push([
              chartTimeUtil.dataFormatter(cciList[k].dt),
              Number(cciList[k].ci)
            ]);
            if (cciList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(cciList[k].dt),
                Number(cciList[k].b),
                Number(cciList[k].cci),
                Number(cciList[k].ci)
              ]);
            }
            if (cciList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(cciList[k].dt),
                Number(cciList[k].s),
                Number(cciList[k].cci),
                Number(cciList[k].ci)
              ]);
            }
          }


          if (type == 'day') {
            //KD图表标题
            analysis_kline.getCCiTitle(type, sn, Number(cciData[cciData.length - 1][1]).toFixed(2), Number(ciData[ciData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(cciData[cciData.length - 1][0]));

            //创建KD图表
            analysis_kline.createMACDChart('container_cci' + sn, [], cciData, ciData, _buyData, _sellData, sn);
          } else if (type == 'week') {
            //KD图表标题
            analysis_kline.getCCiTitle(type, sn, Number(cciData[cciData.length - 1][1]).toFixed(2), Number(ciData[ciData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(cciData[cciData.length - 1][0]));

            //创建KD图表
            analysis_kline.createMACDChart('container_cci_week' + sn, [], cciData, ciData, _buyData, _sellData, sn);
          }

        }

      }
    }
    if (type == 'week') {
      //有数据  用兆军接口 data.detail.EQUSHI.signals
      if (data.WEEK_EQUSHI.signals.length > 0) {
        /**
         * K线数据组
         */
          //var stockList = rs.signals.slice(rs.signals.length-132,rs.signals.length);
        var stockList = data.WEEK_EQUSHI.signals;
        var ohlc = [],//蜡烛图数据
          column = [],//柱形图数据

          peak = [],//波峰数据
          trough = [],//波谷数据

          up = [],//上升趋势 红色
          down = [],//下降趋势 绿色

          ma5 = [], ma10 = [], ma20 = [], ma60 = [],//K线均线

          vma5 = [], vma10 = [],//成交量均线

          macdblding = [],//股价顶背离
          macdbldi = [],//股价底背离
          bdmd = [],//股价波段买点（短线决策）
          zsyhong = [],
          zsylv_total = [],
          zsylv = [],
          zsyjx = [],//自适应均线
          zsyhong2lv = [],//自适应均线红色转绿色
          zsylv2hong = [];//自适应均线绿色转红色


        var peakList = data.WEEK_EQUSHI.peak;
        var troughList = data.WEEK_EQUSHI.trough;

        var nextPrice = stockList[stockList.length - 2].c;//上一交易日的收盘价


        //获取支撑线与压力线
        //等于当前价取上一交易日的收盘价为基准来做判断
        var arr = analysis_kline.getUpDown(stockList, peakList, troughList, lastPrice, nextPrice);
        //低于当前价位是支撑线（红色），高于当前价位的线是压力线（绿色）
        //两个点都是高于当前价位的，只给最近的一条
        if (arr.length > 0) {
          if (arr.length == 1) {
            if (arr[0].price0 == "+") {
              up.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
            } else if (arr[0].price0 == "-") {
              down.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
            }

          } else if (arr.length >= 2) {
            if (arr[0].price0 == '+' && arr[1].price0 == '+') {
              up.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
              up.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[0].price)
              ]);
            } else if (arr[0].price0 == '-' && arr[1].price0 == '-') {
              down.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
              down.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[0].price)
              ]);
            } else if (arr[0].price0 == '+' && arr[1].price0 == '-') {
              up.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
              down.push([
                chartTimeUtil.dataFormatter(arr[1].dt),//0
                Number(arr[1].price)
              ]);
              up.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[0].price)
              ]);
              down.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[1].price)
              ]);
            } else if (arr[0].price0 == '-' && arr[1].price0 == '+') {
              down.push([
                chartTimeUtil.dataFormatter(arr[0].dt),//0
                Number(arr[0].price)
              ]);
              up.push([
                chartTimeUtil.dataFormatter(arr[1].dt),//0
                Number(arr[1].price)
              ]);
              up.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[1].price)
              ]);
              down.push([
                chartTimeUtil.dataFormatter(stockList[stockList.length - 1].dt),//0
                Number(arr[0].price)
              ]);
            }
          }
        }

        if (peakList.length > 0) {
          //波峰
          if (peakList.length == 2) {
            var len = peakList.length;
            if (Number(peakList[1].dt) >= Number(stockList[0].dt)) {
              for (var j = 0; j < len; j++) {
                peak.push([
                  chartTimeUtil.dataFormatter(peakList[j].dt),//0
                  Number(peakList[j].price)
                ]);

              }
            }
          }
        }
        if (troughList.length > 0) {
          //波谷
          if (troughList.length == 2) {
            var len = troughList.length;
            if (Number(troughList[1].dt) >= Number(stockList[0].dt)) {
              for (var j = 0; j < len; j++) {
                trough.push([
                  chartTimeUtil.dataFormatter(troughList[j].dt),
                  Number(troughList[j].price)
                ]);
              }
            }
          }
        }


        if (stockList.length > 0) {
          var len = stockList.length;
          var num_nor = '';
          for (var j = 0; j < len; j++) {
            ohlc.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),//0
              Number(stockList[j].o),//1
              Number(stockList[j].h),//2
              Number(stockList[j].l),//3
              Number(stockList[j].c),//4
              stockList[j].up,//5
              stockList[j].down,//6
              stockList[j].mid,//7
              Number(stockList[j].ma.ma5),//8
              Number(stockList[j].ma.ma10),//9
              Number(stockList[j].ma.ma20),//10
              Number(stockList[j].ma.ma60),//11
              Number(stockList[j].v),//12
              Number(stockList[j].vma5),//13
              Number(stockList[j].vma10),//14
              Number(stockList[j].macdblding),//15
              Number(stockList[j].macdbldi),//16
              Number(stockList[j].bdmd),//17
              stockList[j].zsyjx.zsyjx,//18
              Number(stockList[j].zsyjx.zsyhong2lv),//19
              Number(stockList[j].zsyjx.zsylv2hong),//20
              Number(stockList[j].zsyjx.zsyhong),//21
              Number(stockList[j].zsyjx.zsylv)//22
            ])
            column.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].v)
            ]);
            ma5.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].ma.ma5)
            ]);
            ma10.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].ma.ma10)
            ]);
            ma20.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].ma.ma20)
            ]);
            ma60.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].ma.ma60)
            ]);
            vma5.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].vma5)
            ]);
            vma10.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].vma10)
            ]);
            zsyjx.push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              stockList[j].zsyjx.zsyjx
            ]);
            if (stockList[j].zsyjx.zsylv != num_nor) {
              zsylv_total.push([]);
            }
            zsylv_total[zsylv_total.length - 1].push([
              chartTimeUtil.dataFormatter(stockList[j].dt),
              Number(stockList[j].zsyjx.zsyjx),
              Number(stockList[j].zsyjx.zsyhong2lv),
              Number(stockList[j].zsyjx.zsylv2hong),
              Number(stockList[j].zsyjx.zsyhong),
              Number(stockList[j].zsyjx.zsylv)
            ]);
            num_nor = stockList[j].zsyjx.zsylv;
            if (stockList[j].macdblding == 1) {
              macdblding.push([
                chartTimeUtil.dataFormatter(stockList[j].dt),
                Number(stockList[j].h)
              ]);
            }
            if (stockList[j].macdbldi == 1) {
              macdbldi.push([
                chartTimeUtil.dataFormatter(stockList[j].dt),
                Number(stockList[j].l)
              ]);
            }
            //波段买点在下跌趋势下的情况屏蔽，只展示在上升和震荡趋势下的情况
            if (stockList[j].up === "1" || stockList[j].mid === "1") {
              if (stockList[j].bdmd == 1) {
                bdmd.push([
                  chartTimeUtil.dataFormatter(stockList[j].dt),
                  Number(stockList[j].l)
                ]);
              }
            }
          }
        } else {
          console.log("未返回K线数据");
        }

        peak = peak.reverse();
        trough = trough.reverse();

        //获取K线图表的图例
        var chart_legend_txt = '', chart_note_week_wenhao = '';
        if (peak.length > 0 || trough.length > 0 || up.length > 0 || down.length > 0) {
          chart_legend_txt += '<strong class="s1"><em class="t_red">-</em>/<em class="t_green">-</em>支撑压力</strong>';
        }
        if (macdblding.length > 0 || macdbldi.length > 0) {
          chart_legend_txt += '<strong class="s2"><b></b>/<b></b>股价macd背离</strong>';
        }

        chart_note_week_wenhao += '<a onclick="analysis_kline.openPop_expma()" style="color: #333;margin-left: .5rem"><i class="icon-help2" style="margin-left: .25rem;color: #a1a2a8"></i></a>';
        if (bdmd.length > 0 && appKey !='report') {
          chart_legend_txt += '<strong class="s3" onclick="analysis_kline.openPop_juece()"><b></b>决策点<a><i class="icon-help2"></i></a></strong>';
        }
        if (type == 'week') {
          //获取K线图表的图例
          $('#chart_legend_week' + sn).html(chart_legend_txt);
          $('#chart_note_week_wenhao' + sn).html(chart_note_week_wenhao);
          //获取K线图表的标题
          analysis_kline.getKDayTitle('week', sn, ma5[ma5.length - 1][1], ma10[ma10.length - 1][1], ma20[ma20.length - 1][1], ma60[ma60.length - 1][1], zsyjx[zsyjx.length - 1][1]);

          //获取K线图表--成交量的标题
          analysis_kline.getKDayVolTitle('week', sn, analysis_kline.formatNumber(column[column.length - 1][1] / 100, 2), analysis_kline.formatNumber(vma5[vma5.length - 1][1] / 100, 2), analysis_kline.formatNumber(vma10[vma10.length - 1][1] / 100, 2));

          analysis_kline.createKLineChart('container_k_week' + sn, ohlc, column, ma5, ma10, ma20, ma60, sn, '周K', peak, trough, up, down, vma5, vma10, macdblding, macdbldi, bdmd, zsylv_total);

          analysis_kline.createKLineChart_c('container_k_week_c' + sn, ohlc, column, ma5, ma10, ma20, ma60, sn, '周K', peak, trough, up, down, vma5, vma10, macdblding, macdbldi, bdmd, zsylv_total);

          analysis_kline.getKCTitle(type, sn, chartTimeUtil.getTimeStr3(zsylv_total[zsylv_total.length - 1][0][0]), zsylv_total[zsylv_total.length - 1][0][2], zsylv_total[zsylv_total.length - 1][0][3]);
        }
      } else {
        console.log("未返回技术分析数据");
      }
      if (data.WEEK_TXTQUSHI.memo.length > 0) {
        var txt = '<div class="hd_gl_white hd_gl_blue">' +
          '<b></b><span>价</span><b></b>' +
          '</div>' +
          '<h5>' + data.WEEK_TXTQUSHI.memo + '</h5>';
        if (type == 'day') {
          $('#day_huashu_jia' + sn).html(txt);
        } else if (type == 'week') {
          $('#week_huashu_jia' + sn).html(txt);
        }
      } else {
        if (type == 'day') {
          $('#day_huashu_jia' + sn).removeClass("box_bgGray");
          $('#day_huashu_jia' + sn).html('');
        } else if (type == 'week') {
          $('#week_huashu_jia' + sn).removeClass("box_bgGray");
          $('#week_huashu_jia' + sn).html('');
        }
      }

      if (appKey != 'report') {
        //MACD KD RSI 话术
        // MACD 话术
        if (data.WEEK_TXTMACD.memo.length > 0) {
          if (type == 'day') {
            $('#macdHuashu_day' + sn).html("");
          } else if (type == 'week') {
            $('#macdHuashu_week' + sn).html(data.WEEK_TXTMACD.memo);
          }
        } else {
          if (type == 'day') {
            $('#macdHuashu_day' + sn).html("MACD指标暂无明显信号");
          } else if (type == 'week') {
            $('#macdHuashu_week' + sn).html("MACD指标暂无明显信号");
          }
        }
        // KD 话术
        if (data.WEEK_TXTKD.memo.length > 0) {
          if (type == 'day') {
            $('#kdHuashu_day' + sn).html(data.WEEK_TXTKD.memo);
          } else if (type == 'week') {
            $('#kdHuashu_week' + sn).html(data.WEEK_TXTKD.memo);
          }
        } else {
          if (type == 'day') {
            $('#kdHuashu_day' + sn).html("KD指标暂无明显信号");
          } else if (type == 'week') {
            $('#kdHuashu_week' + sn).html("KD指标暂无明显信号");
          }
        }
        // RSI 话术
        if (data.WEEK_TXTRSI.memo.length > 0) {
          if (type == 'day') {
            $('#rsiHuashu_day' + sn).html("");
          } else if (type == 'week') {
            $('#rsiHuashu_week' + sn).html(data.WEEK_TXTRSI.memo);
          }
        } else {
          if (type == 'day') {
            $('#rsiHuashu_day' + sn).html("RSI指标暂无明显信号");
          } else if (type == 'week') {
            $('#rsiHuashu_week' + sn).html("RSI指标暂无明显信号");
          }
        }

        // wr 话术
        if (data.WEEK_TXTWR.memo.length > 0) {
          if (type == 'day') {
            $('#wrHuashu_week' + sn).html(rs.memo);
          } else if (type == 'week') {
            $('#wrHuashu_week' + sn).html(data.WEEK_TXTWR.memo);
          }
        } else {
          if (type == 'day') {
            $('#wrHuashu_day' + sn).html("wr指标暂无明显信号");
          } else if (type == 'week') {
            $('#wrHuashu_week' + sn).html("wr指标暂无明显信号");
          }
        }

        // cci 话术
        if (data.WEEK_TXTCCI.memo.length > 0) {
          if (type == 'day') {
            $('#cciHuashu_week' + sn).html(rs.memo);
          } else if (type == 'week') {
            $('#cciHuashu_week' + sn).html(data.WEEK_TXTCCI.memo);
          }
        } else {
          if (type == 'day') {
            $('#cciHuashu_day' + sn).html("CCI指标暂无明显信号");
          } else if (type == 'week') {
            $('#cciHuashu_week' + sn).html("CCI指标暂无明显信号");
          }
        }

        if (data.WEEK_TXTQUSHIVOL.memo.length > 0) {
          var txt = '<div class="hd_gl_white hd_gl_blue">' +
            '<b></b><span>量</span><b></b>' +
            '</div>' +
            '<h5>' + data.WEEK_TXTQUSHIVOL.memo + '</h5>';
          if (type == 'day') {

            $('#day_huashu_liang' + sn).html(txt);
          } else if (type == 'week') {
            $('#week_huashu_liang' + sn).html(txt);
          }
        } else {
          if (type == 'day') {
            $('#day_huashu_liang' + sn).removeClass("box_bgGray");
            $('#day_huashu_liang' + sn).html('');
          } else if (type == 'week') {
            $('#week_huashu_liang' + sn).removeClass("box_bgGray");
            $('#week_huashu_liang' + sn).html('');
          }
        }


        if (data.WEEK_TXTQUSHIVOL.memo.length > 0) {
          var txt = '<div class="hd_gl_white hd_gl_blue">' +
            '<b></b><span>量</span><b></b>' +
            '</div>' +
            '<h5>' + data.WEEK_TXTQUSHIVOL.memo + '</h5>';
          if (type == 'day') {
            $('#day_huashu_liang' + sn).html(txt);
          } else if (type == 'week') {
            $('#week_huashu_liang' + sn).html(txt);
          }
        } else {
          if (type == 'day') {
            $('#day_huashu_liang' + sn).removeClass("box_bgGray");
            $('#day_huashu_liang' + sn).html('');
          } else if (type == 'week') {
            $('#week_huashu_liang' + sn).removeClass("box_bgGray");
            $('#week_huashu_liang' + sn).html('');
          }
        }
        // MACD Kd  RSI 三个图标
        // MACD有数据  用兆军接口 data.detail.EMACD.signals
        if (data.WEEK_EMACD.signals.length > 0) {
          var macdList = data.WEEK_EMACD.signals;
          var difData = [],//dif数据
            deaData = [],//dea数据
            macdData = [],//macd数据
            _buyData = [],//买入数据
            _sellData = [],//卖出数据
            buyData = [],//买入数据
            sellData = [],//卖出数据
            bldingData = [],//顶背离数据
            bldiData = [];//底背离数据
          for (var k = 0; k < macdList.length; k++) {
            //for(var k = macdList.length-100;k<macdList.length;k++){
            difData.push([
              chartTimeUtil.dataFormatter(macdList[k].dt),
              Number(macdList[k].diff)
            ]);
            deaData.push([
              chartTimeUtil.dataFormatter(macdList[k].dt),
              Number(macdList[k].dea),
              Number(macdList[k].macd),
              Number(macdList[k].diff),
              Number(macdList[k].b),
              Number(macdList[k].s),
              Number(macdList[k].blding),
              Number(macdList[k].bldi)
            ]);
            macdData.push([
              chartTimeUtil.dataFormatter(macdList[k].dt),
              Number(macdList[k].macd)
            ]);
            if (macdList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(macdList[k].dt),
                Number(macdList[k].b),
                Number(macdList[k].macd),
                Number(macdList[k].diff),
                Number(macdList[k].dea)
              ]);
            }
            if (macdList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(macdList[k].dt),
                Number(macdList[k].s),
                Number(macdList[k].macd),
                Number(macdList[k].diff),
                Number(macdList[k].dea)
              ]);
            }
            if (macdList[k].blding == 1) {
              bldingData.push([
                chartTimeUtil.dataFormatter(macdList[k].dt),
                Number(macdList[k].blding),
                Number(macdList[k].macd),
                Number(macdList[k].diff),
                Number(macdList[k].dea)
              ]);
            }
            if (macdList[k].bldi == 1) {
              bldiData.push([
                chartTimeUtil.dataFormatter(macdList[k].dt),
                Number(macdList[k].bldi),
                Number(macdList[k].macd),
                Number(macdList[k].diff),
                Number(macdList[k].dea)
              ]);
            }
          }

          if (type == 'day') {
            //MACD图表标题
            analysis_kline.getMacdTitle(type, sn, Number(difData[difData.length - 1][1]).toFixed(2), Number(deaData[deaData.length - 1][1]).toFixed(2), Number(macdData[macdData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(difData[difData.length - 1][0]));

            //MACD图表图例
            var legend_txt = '';
            if (_buyData.length > 0 || _sellData.length > 0) {
              legend_txt += '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>';
            }
            if (bldingData.length > 0 || bldiData.length > 0) {
              legend_txt += '<strong><b></b>/<b></b>股价和macd背离</strong>';
            }
            $('#macd_legend' + sn).html(legend_txt);

            //创建MACD图表
            analysis_kline.createMACDChart('container_macd' + sn, macdData, deaData, difData, _buyData, _sellData, sn, bldingData, bldiData);
          } else if (type == 'week') {
            //MACD图表标题
            analysis_kline.getMacdTitle(type, sn, Number(difData[difData.length - 1][1]).toFixed(2), Number(deaData[deaData.length - 1][1]).toFixed(2), Number(macdData[macdData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(difData[difData.length - 1][0]));

            //MACD图表图例
            var legend_txt = '';
            if (_buyData.length > 0 || _sellData.length > 0) {
              legend_txt += '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>';
            }
            if (bldingData.length > 0 || bldiData.length > 0) {
              legend_txt += '<strong><b></b>/<b></b>股价和macd背离</strong>';
            }
            $('#macd_legend_week' + sn).html(legend_txt);

            //创建MACD图表
            analysis_kline.createMACDChart('container_macd_week' + sn, macdData, deaData, difData, _buyData, _sellData, sn, bldingData, bldiData);
          }

        } else {
          console.log("未返回macd数据");
        }
        //Kd有数据  用兆军接口
        if (data.WEEK_EKD.signals.length > 0) {
          var kdList = data.WEEK_EKD.signals;
          var kData = [];//k数据
          var dData = [];//d数据
          var _buyData = [];//买入数据
          var _sellData = [];//卖出数据
          var buyData = [];//买入数据
          var sellData = [];//卖出数据
          for (var k = 0; k < kdList.length; k++) {
            //for(var k = kdList.length-100;k<kdList.length;k++){
            kData.push([
              chartTimeUtil.dataFormatter(kdList[k].dt),//0
              Number(kdList[k].k),//1
              Number(kdList[k].k),//2
              Number(kdList[k].k),//3
              Number(kdList[k].b),//4
              Number(kdList[k].s),//5
              Number(kdList[k].blding),//6
              Number(kdList[k].bldi)//7
            ]);
            dData.push([
              chartTimeUtil.dataFormatter(kdList[k].dt),
              Number(kdList[k].d)
            ]);
            if (kdList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(kdList[k].dt),
                Number(kdList[k].b),
                Number(kdList[k].k),
                Number(kdList[k].d)
              ]);
            }
            if (kdList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(kdList[k].dt),
                Number(kdList[k].s),
                Number(kdList[k].k),
                Number(kdList[k].d)
              ]);
            }
          }


          if (type == 'day') {
            //KD图表标题
            analysis_kline.getKdTitle(type, sn, Number(kData[kData.length - 1][1]).toFixed(2), Number(dData[dData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(kData[kData.length - 1][0]));

            //创建KD图表
            analysis_kline.createMACDChart('container_kd' + sn, [], kData, dData, _buyData, _sellData, sn);
          } else if (type == 'week') {
            //KD图表标题
            analysis_kline.getKdTitle(type, sn, Number(kData[kData.length - 1][1]).toFixed(2), Number(dData[dData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(kData[kData.length - 1][0]));

            //创建KD图表
            analysis_kline.createMACDChart('container_kd_week' + sn, [], kData, dData, _buyData, _sellData, sn);
          }

        } else {
          console.log("未返回Kd数据");
        }
        //RSI有数据  用兆军接口
        if (data.WEEK_ERSI.signals.length > 0) {
          var rsiList = data.WEEK_ERSI.signals;
          var rsi6Data = [];//k数据
          var rsi12Data = [];//d数据
          var _buyData = [];//买入数据
          var _sellData = [];//卖出数据
          for (var k = 0; k < rsiList.length; k++) {
            //for(var k = rsiList.length-100;k<rsiList.length;k++){
            rsi6Data.push([
              chartTimeUtil.dataFormatter(rsiList[k].dt),//0
              Number(rsiList[k].rsi6),//1
              Number(rsiList[k].rsi6),//2
              Number(rsiList[k].rsi6),//3
              Number(rsiList[k].b),//4
              Number(rsiList[k].s),//5
              Number(rsiList[k].blding),//6
              Number(rsiList[k].bldi)//7
            ]);
            rsi12Data.push([
              chartTimeUtil.dataFormatter(rsiList[k].dt),
              Number(rsiList[k].rsi12)
            ]);
            if (rsiList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(rsiList[k].dt),
                Number(rsiList[k].b),
                Number(rsiList[k].rsi6),
                Number(rsiList[k].rsi12)
              ]);
            }
            if (rsiList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(rsiList[k].dt),
                Number(rsiList[k].s),
                Number(rsiList[k].rsi6),
                Number(rsiList[k].rsi12)
              ]);
            }
          }

          if (type == 'day') {
            //RSI图表标题
            analysis_kline.getRsiTitle(type, sn, Number(rsi6Data[rsi6Data.length - 1][1]).toFixed(2), Number(rsi12Data[rsi12Data.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(rsi6Data[rsi6Data.length - 1][0]));

            //创建RSI图表
            analysis_kline.createMACDChart('container_rsi' + sn, [], rsi6Data, rsi12Data, _buyData, _sellData, sn);
          } else if (type == 'week') {
            //RSI图表标题
            analysis_kline.getRsiTitle(type, sn, Number(rsi6Data[rsi6Data.length - 1][1]).toFixed(2), Number(rsi12Data[rsi12Data.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(rsi6Data[rsi6Data.length - 1][0]));

            //创建RSI图表
            analysis_kline.createMACDChart('container_rsi_week' + sn, [], rsi6Data, rsi12Data, _buyData, _sellData, sn);
          }

        } else {
          console.log("未返回RSI数据");
        }
        // WR有数据  用兆军接口
        if (data.WEEK_EWR.signals.length > 0) {
          var wrList = data.WEEK_EWR.signals;
          var wr6Data = [];//wr1数据
          var wr10Data = [];//wr2数据
          var _buyData = [];//买入数据
          var _sellData = [];//卖出数据
          for (var k = 0; k < wrList.length; k++) {
            wr6Data.push([
              chartTimeUtil.dataFormatter(wrList[k].dt),//0
              Number(wrList[k].wr1),//1
              Number(wrList[k].wr1),//2
              Number(wrList[k].wr1),//3
              Number(wrList[k].b),//4
              Number(wrList[k].s),//5
              Number(wrList[k].blding),//6
              Number(wrList[k].bldi)//7
            ]);
            wr10Data.push([
              chartTimeUtil.dataFormatter(wrList[k].dt),
              Number(wrList[k].wr2)
            ]);
            if (wrList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(wrList[k].dt),
                Number(wrList[k].b),
                Number(wrList[k].wr1),
                Number(wrList[k].wr2)
              ]);
            }
            if (wrList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(wrList[k].dt),
                Number(wrList[k].s),
                Number(wrList[k].wr1),
                Number(wrList[k].wr2)
              ]);
            }
          }

          if (type == 'day') {
            //RSI图表标题
            analysis_kline.getWrTitle(type, sn, Number(wr6Data[wr6Data.length - 1][1]).toFixed(2), Number(wr10Data[wr10Data.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(wr6Data[wr6Data.length - 1][0]));

            //创建WR图表
            analysis_kline.createMACDChart('container_wr' + sn, [], wr6Data, wr10Data, _buyData, _sellData, sn);
          } else if (type == 'week') {
            //WR图表标题
            analysis_kline.getWrTitle(type, sn, Number(wr6Data[wr6Data.length - 1][1]).toFixed(2), Number(wr10Data[wr10Data.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(wr6Data[wr6Data.length - 1][0]));

            //创建WR图表
            analysis_kline.createMACDChart('container_wr_week' + sn, [], wr6Data, wr10Data, _buyData, _sellData, sn);
          }

        }

        //CCI 有数据  用兆军接口
        if (data.WEEK_ECCI.signals.length > 0) {
          var cciList = data.WEEK_ECCI.signals;
          var cciData = [];//cci k数据
          var ciData = [];//ci d数据
          var _buyData = [];//买入数据
          var _sellData = [];//卖出数据
          var buyData = [];//买入数据
          var sellData = [];//卖出数据
          for (var k = 0; k < cciList.length; k++) {
            //for(var k = kdList.length-100;k<kdList.length;k++){
            cciData.push([
              chartTimeUtil.dataFormatter(cciList[k].dt),//0
              Number(cciList[k].cci),//1
              Number(cciList[k].cci),//2
              Number(cciList[k].cci),//3
              Number(cciList[k].b),//4
              Number(cciList[k].s),//5
              Number(cciList[k].blding),//6
              Number(cciList[k].bldi)//7
            ]);
            ciData.push([
              chartTimeUtil.dataFormatter(cciList[k].dt),
              Number(cciList[k].ci)
            ]);
            if (cciList[k].b == 1) {
              _buyData.push([
                chartTimeUtil.dataFormatter(cciList[k].dt),
                Number(cciList[k].b),
                Number(cciList[k].cci),
                Number(cciList[k].ci)
              ]);
            }
            if (cciList[k].s == 1) {
              _sellData.push([
                chartTimeUtil.dataFormatter(cciList[k].dt),
                Number(cciList[k].s),
                Number(cciList[k].cci),
                Number(cciList[k].ci)
              ]);
            }
          }


          if (type == 'day') {
            //KD图表标题
            analysis_kline.getCCiTitle(type, sn, Number(cciData[cciData.length - 1][1]).toFixed(2), Number(ciData[ciData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(cciData[cciData.length - 1][0]));

            //创建KD图表
            analysis_kline.createMACDChart('container_cci' + sn, [], cciData, ciData, _buyData, _sellData, sn);
          } else if (type == 'week') {
            //KD图表标题
            analysis_kline.getCCiTitle(type, sn, Number(cciData[cciData.length - 1][1]).toFixed(2), Number(ciData[ciData.length - 1][1]).toFixed(2), chartTimeUtil.getTimeStr(cciData[cciData.length - 1][0]));

            //创建KD图表
            analysis_kline.createMACDChart('container_cci_week' + sn, [], cciData, ciData, _buyData, _sellData, sn);
          }

        }
      }
    }
  },

  //接口合并后拿到数据
  getKLineData: function (val, symbol, sn, isPopup, type, lastPrice) {
    var url_new = analysis_kline.TechnichalAnalysis + "/technichal/analysis/" + val + "/" + symbol;

    jQuery.ajax(
      {
        url: url_new,
        type: 'get',
        async: null,
        data: null,
        dataType: 'json',
        callback: '',
        success: function (rs) {
          if (rs) {
          }
        },
        error: function () {
          //console.log("error");
        }
      });
  },
  /**
   * 技术分析中短期(day)话术/长期(week)话术
   * @param val
   * @param symbol
   * @param sn
   * @param type  day/week
   */
  getHuashu: function (val, symbol, sn, type) {
    var url = '', url_vol = '', url_new = '';
    if (type == 'day') {
      // api/ta/get/fenhuashu/equshi/day/ http://stock-analysis-service:31001/
      // url = analysis_kline.stockAnalysis+"/api/ta/get/fenhuashu/equshi/day/"+val+symbol;
      url_new = analysis_kline.TechnichalAnalysis + "/technichal/analysis/" + val + "/" + symbol;
      // url_vol = analysis_kline.stockAnalysis+"/api/ta/get/fenhuashu/equshivol/day/"+val+symbol;
    } else if (type == 'week') {
      url = analysis_kline.stockAnalysis + "/api/ta/get/fenhuashu/equshi/week/" + val + symbol;
      url_vol = analysis_kline.stockAnalysis + "/api/ta/get/fenhuashu/equshivol/week/" + val + symbol;
    }
    jQuery.ajax(
      {
        url: url_new,
        type: 'get',
        async: null,
        data: null,
        dataType: 'jsonp',
        callback: '',
        success: function (rs) {
          //debugger
          if (rs) {
            if (data.TXTQUSHI.memo.length > 0) {
              var txt = '<div class="hd_gl_white hd_gl_blue">' +
                '<b></b><span>价</span><b></b>' +
                '</div>' +
                '<h5>' + data.TXTQUSHI.memo + '</h5>';
              if (type == 'day') {
                $('#day_huashu_jia' + sn).html(txt);
              } else if (type == 'week') {
                $('#week_huashu_jia' + sn).html(txt);
              }
            } else {
              if (type == 'day') {
                $('#day_huashu_jia' + sn).removeClass("box_bgGray");
                $('#day_huashu_jia' + sn).html('');
              } else if (type == 'week') {
                $('#week_huashu_jia' + sn).removeClass("box_bgGray");
                $('#week_huashu_jia' + sn).html('');
              }
            }
          }
          if (rs) {
            if (data.TXTQUSHIVOL.memo.length > 0) {
              var txt = '<div class="hd_gl_white hd_gl_blue">' +
                '<b></b><span>量</span><b></b>' +
                '</div>' +
                '<h5>' + data.TXTQUSHIVOL.memo + '</h5>';
              if (type == 'day') {
                $('#day_huashu_liang' + sn).html(txt);
              } else if (type == 'week') {
                $('#week_huashu_liang' + sn).html(txt);
              }
            } else {
              if (type == 'day') {
                $('#day_huashu_liang' + sn).removeClass("box_bgGray");
                $('#day_huashu_liang' + sn).html('');
              } else if (type == 'week') {
                $('#week_huashu_liang' + sn).removeClass("box_bgGray");
                $('#week_huashu_liang' + sn).html('');
              }
            }
          }
        }
      });

    /* //价
         jQuery.ajax(
             {
                 url: url,
                 type: 'get',
                 async: null,
                 data: null,
                 dataType: 'jsonp',
                 callback:'',
                 success: function(rs)
                 {
                     debugger
                     if(rs){
                         if(data.TXTQUSHI.memo.length>0){
                             var txt = '<div class="hd_gl_white hd_gl_blue">'+
                                 '<b></b><span>价</span><b></b>'+
                                 '</div>'+
                                 '<h5>'+data.TXTQUSHI.memo+'</h5>';
                             if(type == 'day'){
                                 $('#day_huashu_jia'+sn).html(txt);
                             }else if(type == 'week'){
                                 $('#week_huashu_jia'+sn).html(txt);
                             }
                         }
                         else{
                             if(type == 'day'){
                                 $('#day_huashu_jia'+sn).removeClass("box_bgGray");
                                 $('#day_huashu_jia'+sn).html('');
                             }else if(type == 'week'){
                                 $('#week_huashu_jia'+sn).removeClass("box_bgGray");
                                 $('#week_huashu_jia'+sn).html('');
                             }
                         }
                     }
                 }
             });
         //量
         jQuery.ajax(
             {
                 url: url_vol,
                 type: 'get',
                 async: null,
                 data: null,
                 dataType: 'json',
                 callback:'',
                 success: function(rs)
                 {
                     if(rs){
                         if(rs.memo.length>0){
                             var txt = '<div class="hd_gl_white hd_gl_blue">'+
                                 '<b></b><span>量</span><b></b>'+
                                 '</div>'+
                                 '<h5>'+rs.memo+'</h5>';
                             if(type == 'day'){
                                 $('#day_huashu_liang'+sn).html(txt);
                             }else if(type == 'week'){
                                 $('#week_huashu_liang'+sn).html(txt);
                             }
                         }else{
                             if(type == 'day'){
                                 $('#day_huashu_liang'+sn).removeClass("box_bgGray");
                                 $('#day_huashu_liang'+sn).html('');
                             }else if(type == 'week'){
                                 $('#week_huashu_liang'+sn).removeClass("box_bgGray");
                                 $('#week_huashu_liang'+sn).html('');
                             }
                         }
                     }
                 }
             });*/
  },

  /**
   * 技术分析指标话术  中短期(day)话术/长期(week)话术
   * @param val
   * @param symbol
   * @param sn
   * @param type  day/week
   */
  getMacdHuashu: function (val, symbol, sn, type) {
    var macd_url = '', kd_url = '', rsi_url = '', url_new = '';
    if (type == 'day') {
      url_new = analysis_kline.TechnichalAnalysis + "/technichal/analysis/" + val + "/" + symbol;
      macd_url = analysis_kline.stockAnalysis + "/api/ta/get/fenhuashu/emacd/day/" + val + symbol;
      kd_url = analysis_kline.stockAnalysis + "/api/ta/get/fenhuashu/ekd/day/" + val + symbol;
      rsi_url = analysis_kline.stockAnalysis + "/api/ta/get/fenhuashu/ersi/day/" + val + symbol;
    } else if (type == 'week') {
      macd_url = analysis_kline.stockAnalysis + "/api/ta/get/fenhuashu/emacd/week/" + val + symbol;
      kd_url = analysis_kline.stockAnalysis + "/api/ta/get/fenhuashu/ekd/week/" + val + symbol;
      rsi_url = analysis_kline.stockAnalysis + "/api/ta/get/fenhuashu/ersi/week/" + val + symbol;
    }
//MACD KD RSI 话术
    jQuery.ajax(
      {
        url: url_new,
        type: 'get',
        async: null,
        data: null,
        dataType: 'jsonp',
        callback: '',
        success: function (rs) {
          // debugger
          // MACD 话术
          if (rs) {
            if (data.TXTMACD.memo.length > 0) {
              if (type == 'day') {
                $('#macdHuashu_day' + sn).html(data.TXTMACD.memo);
              } else if (type == 'week') {
                $('#macdHuashu_week' + sn).html(rs.memo);
              }
            } else {
              if (type == 'day') {
                $('#macdHuashu_day' + sn).html("MACD指标暂无明显信号");
              } else if (type == 'week') {
                $('#macdHuashu_week' + sn).html("MACD指标暂无明显信号");
              }
            }
          }
          //KD 话术
          if (rs) {
            if (data.TXTKD.memo.length > 0) {
              if (type == 'day') {
                $('#kdHuashu_day' + sn).html(data.TXTKD.memo);
              } else if (type == 'week') {
                $('#kdHuashu_week' + sn).html(rs.memo);
              }
            } else {
              if (type == 'day') {
                $('#kdHuashu_day' + sn).html("KD指标暂无明显信号");
              } else if (type == 'week') {
                $('#kdHuashu_week' + sn).html("KD指标暂无明显信号");
              }
            }
          }
          //RSI 话术
          if (rs) {
            if (data.TXTRSI.memo.length > 0) {
              if (type == 'day') {
                $('#rsiHuashu_day' + sn).html(data.TXTRSI.memo);
              } else if (type == 'week') {
                $('#rsiHuashu_week' + sn).html(rs.memo);
              }
            } else {
              if (type == 'day') {
                $('#rsiHuashu_day' + sn).html("RSI指标暂无明显信号");
              } else if (type == 'week') {
                $('#rsiHuashu_week' + sn).html("RSI指标暂无明显信号");
              }
            }
          }
        }
      });


    /*   //MACD 话术
           jQuery.ajax(
               {
                   url: macd_url,
                   type: 'get',
                   async: null,
                   data: null,
                   dataType: 'json',
                   callback:'',
                   success: function(rs)
                   {
                       if(rs){
                           if(rs.memo.length>0){
                               if(type == 'day'){
                                   $('#macdHuashu_day'+sn).html(rs.memo);
                               }else if(type == 'week'){
                                   $('#macdHuashu_week'+sn).html(rs.memo);
                               }
                           }else{
                               if(type == 'day'){
                                   $('#macdHuashu_day'+sn).html("MACD指标暂无明显信号");
                               }else if(type == 'week'){
                                   $('#macdHuashu_week'+sn).html("MACD指标暂无明显信号");
                               }
                           }
                       }
                   }
               });
           //KD 话术
           jQuery.ajax(
               {
                   url: kd_url,
                   type: 'get',
                   async: null,
                   data: null,
                   dataType: 'json',
                   callback:'',
                   success: function(rs)
                   {
                       if(rs){
                           if(rs.memo.length>0){
                               if(type == 'day'){
                                   $('#kdHuashu_day'+sn).html(rs.memo);
                               }else if(type == 'week'){
                                   $('#kdHuashu_week'+sn).html(rs.memo);
                               }
                           }else{
                               if(type == 'day'){
                                   $('#kdHuashu_day'+sn).html("KD指标暂无明显信号");
                               }else if(type == 'week'){
                                   $('#kdHuashu_week'+sn).html("KD指标暂无明显信号");
                               }
                           }
                       }
                   }
               });
           //RSI 话术
           jQuery.ajax(
               {
                   url: rsi_url,
                   type: 'get',
                   async: null,
                   data: null,
                   dataType: 'json',
                   callback:'',
                   success: function(rs)
                   {
                       if(rs){
                           if(rs.memo.length>0){
                               if(type == 'day'){
                                   $('#rsiHuashu_day'+sn).html(rs.memo);
                               }else if(type == 'week'){
                                   $('#rsiHuashu_week'+sn).html(rs.memo);
                               }
                           }else{
                               if(type == 'day'){
                                   $('#rsiHuashu_day'+sn).html("RSI指标暂无明显信号");
                               }else if(type == 'week'){
                                   $('#rsiHuashu_week'+sn).html("RSI指标暂无明显信号");
                               }
                           }
                       }
                   }
               });*/
  },

  /**
   * 获取支撑线与压力线
   * 等于当前价取上一交易日的收盘价为基准来做判断
   * @param stockList  K线数据
   * @param peakList 波峰数据
   * @param troughList 波谷数据
   * @param lastPrice 当前价
   * @param nextPrice 上一交易日的收盘价
   */
  getUpDown: function (stockList, peakList, troughList, lastPrice, nextPrice) {
    var arr = [];
    for (var j = 0; j < peakList.length; j++) {
      if (Number(peakList[j].dt) >= Number(stockList[0].dt)) {
        var temp = {};
        temp.dt = peakList[j].dt;
        temp.math_abs_price = Math.abs((Number(peakList[j].price) - lastPrice));

        if (Number(peakList[j].price) > lastPrice) {
          temp.price0 = '+';
        } else if (Number(peakList[j].price) == lastPrice) {
          if (Number(peakList[j].price) >= nextPrice) {
            temp.price0 = '+';
          } else {
            temp.price0 = '-';
          }
        } else {
          temp.price0 = '-';
        }
        temp.price = Number(peakList[j].price);
        arr.push(temp)
      }

    }
    for (var j = 0; j < troughList.length; j++) {
      if (Number(troughList[j].dt) >= Number(stockList[0].dt)) {
        var temp = {};
        temp.dt = troughList[j].dt;
        temp.math_abs_price = Math.abs((Number(troughList[j].price) - lastPrice));
        if (Number(troughList[j].price) > lastPrice) {
          temp.price0 = '+';
        } else if (Number(troughList[j].price) == lastPrice) {
          if (Number(troughList[j].price) >= nextPrice) {
            temp.price0 = '+';
          } else {
            temp.price0 = '-';
          }
        } else {
          temp.price0 = '-';
        }
        temp.price = Number(troughList[j].price);
        arr.push(temp)
      }
    }
    var resArr = analysis_kline.getArrMin(arr);
    return resArr;
  },
  //取数组的最小值与第二小值
  getArrMin: function (arr) {
    var _arr = arr.sort(function (x, y) {
      return x.math_abs_price - y.math_abs_price;
    });// 升序排列
    //var _arr = arr.sort(function(x, y){  return y.price - x.price;});// 降序排列

    return _arr;

  },

  //获取初始页面MACD图表的浮框文案
  getFloadTxt: function (_buyData, _sellData, title) {
    var txt = '';
    if (_buyData[_buyData.length - 1][0] > _sellData[_sellData.length - 1][0]) {//绿色向下
      txt = '<span><b>' + chartTimeUtil.getTimeStr_m_d(_buyData[_buyData.length - 1][0]) + title + '金叉</b></span>';
    } else {
      txt = '<span><b>' + chartTimeUtil.getTimeStr_m_d(_buyData[_buyData.length - 1][0]) + title + '死叉</b></span>';
    }
    return txt;
  },
  /**
   * 技术分析macd接口
   * @param val
   * @param symbol
   * @param sn
   * @param type  区分 日K、周K类型
   */
  /* getMACD: function (val,symbol,sn,type){
         var url = '';
         if(type == 'day'){
             url = analysis_kline.stockAnalysis+"/api/ta/get/emacd/day/"+val+symbol;
         }else if(type == 'week'){
             url = analysis_kline.stockAnalysis+"/api/ta/get/emacd/week/"+val+symbol;
         }
         jQuery.ajax(
             {
                 url: url,
                 type: 'get',
                 async: null,
                 data: null,
                 dataType: 'json',
                 callback:'',
                 success: function(rs)
                 {
                     if(rs){
                         //有数据  用兆军接口
                         if(rs.signals.length>0){
                             var macdList = rs.signals;
                             var difData = [],//dif数据
                                 deaData = [],//dea数据
                                 macdData = [],//macd数据
                                 _buyData = [],//买入数据
                                 _sellData = [],//卖出数据
                                 buyData = [],//买入数据
                                 sellData = [],//卖出数据
                                 bldingData = [],//顶背离数据
                                 bldiData = [];//底背离数据
                             for(var k = 0;k<macdList.length;k++){
                                 //for(var k = macdList.length-100;k<macdList.length;k++){
                                 difData.push([
                                     chartTimeUtil.dataFormatter(macdList[k].dt),
                                     Number(macdList[k].diff)
                                 ]);
                                 deaData.push([
                                     chartTimeUtil.dataFormatter(macdList[k].dt),
                                     Number(macdList[k].dea),
                                     Number(macdList[k].macd),
                                     Number(macdList[k].diff),
                                     Number(macdList[k].b),
                                     Number(macdList[k].s),
                                     Number(macdList[k].blding),
                                     Number(macdList[k].bldi)
                                 ]);
                                 macdData.push([
                                     chartTimeUtil.dataFormatter(macdList[k].dt),
                                     Number(macdList[k].macd)
                                 ]);
                                 if(macdList[k].b == 1){
                                     _buyData.push([
                                         chartTimeUtil.dataFormatter(macdList[k].dt),
                                         Number(macdList[k].b),
                                         Number(macdList[k].macd),
                                         Number(macdList[k].diff),
                                         Number(macdList[k].dea)
                                     ]);
                                 }
                                 if(macdList[k].s == 1){
                                     _sellData.push([
                                         chartTimeUtil.dataFormatter(macdList[k].dt),
                                         Number(macdList[k].s),
                                         Number(macdList[k].macd),
                                         Number(macdList[k].diff),
                                         Number(macdList[k].dea)
                                     ]);
                                 }
                                 if(macdList[k].blding == 1){
                                     bldingData.push([
                                         chartTimeUtil.dataFormatter(macdList[k].dt),
                                         Number(macdList[k].blding),
                                         Number(macdList[k].macd),
                                         Number(macdList[k].diff),
                                         Number(macdList[k].dea)
                                     ]);
                                 }
                                 if(macdList[k].bldi == 1){
                                     bldiData.push([
                                         chartTimeUtil.dataFormatter(macdList[k].dt),
                                         Number(macdList[k].bldi),
                                         Number(macdList[k].macd),
                                         Number(macdList[k].diff),
                                         Number(macdList[k].dea)
                                     ]);
                                 }
                             }

                             if(type == 'day'){
                                 //MACD图表标题
                                 analysis_kline.getMacdTitle(type,sn,Number(difData[difData.length-1][1]).toFixed(2),Number(deaData[deaData.length-1][1]).toFixed(2),Number(macdData[macdData.length-1][1]).toFixed(2),chartTimeUtil.getTimeStr(difData[difData.length-1][0]));

                                 //MACD图表图例
                                 var legend_txt = '';
                                 if(_buyData.length>0 || _sellData.length>0){
                                     legend_txt += '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>';
                                 }
                                 if(bldingData.length > 0 || bldiData.length > 0){
                                     legend_txt += '<strong><b></b>/<b></b>股价和macd背离</strong>';
                                 }
                                 $('#macd_legend'+sn).html(legend_txt);

                                 //创建MACD图表
                                 analysis_kline.createMACDChart('container_macd'+sn,macdData,deaData,difData,_buyData,_sellData,sn,bldingData,bldiData);
                             }else if(type == 'week'){
                                 //MACD图表标题
                                 analysis_kline.getMacdTitle(type,sn,Number(difData[difData.length-1][1]).toFixed(2),Number(deaData[deaData.length-1][1]).toFixed(2),Number(macdData[macdData.length-1][1]).toFixed(2),chartTimeUtil.getTimeStr(difData[difData.length-1][0]));

                                 //MACD图表图例
                                 var legend_txt = '';
                                 if(_buyData.length>0 || _sellData.length>0){
                                     legend_txt += '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>';
                                 }
                                 if(bldingData.length > 0 || bldiData.length > 0){
                                     legend_txt += '<strong><b></b>/<b></b>股价和macd背离</strong>';
                                 }
                                 $('#macd_legend_week'+sn).html(legend_txt);

                                 //创建MACD图表
                                 analysis_kline.createMACDChart('container_macd_week'+sn,macdData,deaData,difData,_buyData,_sellData,sn,bldingData,bldiData);
                             }

                         }
                         else{
                             console.log("未返回macd数据");
                         }
                     }
                 },
                 error: function()
                 {
                     //console.log("error");
                 }
             });
     },*/
  /**
   * 技术分析Kd接口
   * @param val
   * @param symbol
   * @param sn
   * @param type  区分 日K、周K类型
   */
  /* getKD: function (val,symbol,sn,type){
         var url = '';
         if(type == 'day'){
             url = analysis_kline.stockAnalysis+"/api/ta/get/ekd/day/"+val+symbol;
         }else if(type == 'week'){
             url = analysis_kline.stockAnalysis+"/api/ta/get/ekd/week/"+val+symbol;
         }
         jQuery.ajax(
             {
                 url: url,
                 type: 'get',
                 async: null,
                 data: null,
                 dataType: 'json',
                 callback:'',
                 success: function(rs)
                 {
                     if(rs){
                         //有数据  用兆军接口
                         if(rs.signals.length>0){
                             var kdList = rs.signals;
                             var kData = [];//k数据
                             var dData = [];//d数据
                             var _buyData = [];//买入数据
                             var _sellData = [];//卖出数据
                             var buyData = [];//买入数据
                             var sellData = [];//卖出数据
                             for(var k = 0;k<kdList.length;k++){
                                 //for(var k = kdList.length-100;k<kdList.length;k++){
                                 kData.push([
                                     chartTimeUtil.dataFormatter(kdList[k].dt),//0
                                     Number(kdList[k].k),//1
                                     Number(kdList[k].k),//2
                                     Number(kdList[k].k),//3
                                     Number(kdList[k].b),//4
                                     Number(kdList[k].s),//5
                                     Number(kdList[k].blding),//6
                                     Number(kdList[k].bldi)//7
                                 ]);
                                 dData.push([
                                     chartTimeUtil.dataFormatter(kdList[k].dt),
                                     Number(kdList[k].d)
                                 ]);
                                 if(kdList[k].b == 1){
                                     _buyData.push([
                                         chartTimeUtil.dataFormatter(kdList[k].dt),
                                         Number(kdList[k].b),
                                         Number(kdList[k].k),
                                         Number(kdList[k].d)
                                     ]);
                                 }
                                 if(kdList[k].s == 1){
                                     _sellData.push([
                                         chartTimeUtil.dataFormatter(kdList[k].dt),
                                         Number(kdList[k].s),
                                         Number(kdList[k].k),
                                         Number(kdList[k].d)
                                     ]);
                                 }
                             }


                             if(type == 'day'){
                                 //KD图表标题
                                 analysis_kline.getKdTitle(type,sn,Number(kData[kData.length-1][1]).toFixed(2),Number(dData[dData.length-1][1]).toFixed(2),chartTimeUtil.getTimeStr(kData[kData.length-1][0]));

                                 //创建KD图表
                                 analysis_kline.createMACDChart('container_kd'+sn,[],kData,dData,_buyData,_sellData,sn);
                             }else if(type == 'week'){
                                 //KD图表标题
                                 analysis_kline.getKdTitle(type,sn,Number(kData[kData.length-1][1]).toFixed(2),Number(dData[dData.length-1][1]).toFixed(2),chartTimeUtil.getTimeStr(kData[kData.length-1][0]));

                                 //创建KD图表
                                 analysis_kline.createMACDChart('container_kd_week'+sn,[],kData,dData,_buyData,_sellData,sn);
                             }

                         }
                         else{
                             console.log("未返回Kd数据");
                         }
                     }
                 },
                 error: function()
                 {
                     //console.log("error");
                 }
             });
     },*/
  /**
   * 技术分析RSI接口
   * @param val
   * @param symbol
   * @param sn
   * @param type  区分 日K、周K类型
   */
  /*getRSI: function (val,symbol,sn,type){
        var url = '';
        if(type == 'day'){
            url = analysis_kline.stockAnalysis+"/api/ta/get/ersi/day/"+val+symbol;
        }else if(type == 'week'){
            url = analysis_kline.stockAnalysis+"/api/ta/get/ersi/week/"+val+symbol;
        }
        jQuery.ajax(
            {
                url: url,
                type: 'get',
                async: null,
                data: null,
                dataType: 'json',
                callback:'',
                success: function(rs)
                {
                    if(rs){
                        //有数据  用兆军接口
                        if(rs.signals.length>0){
                            var rsiList = rs.signals;
                            var rsi6Data = [];//k数据
                            var rsi12Data = [];//d数据
                            var _buyData = [];//买入数据
                            var _sellData = [];//卖出数据
                            for(var k = 0;k<rsiList.length;k++){
                                //for(var k = rsiList.length-100;k<rsiList.length;k++){
                                rsi6Data.push([
                                    chartTimeUtil.dataFormatter(rsiList[k].dt),//0
                                    Number(rsiList[k].rsi6),//1
                                    Number(rsiList[k].rsi6),//2
                                    Number(rsiList[k].rsi6),//3
                                    Number(rsiList[k].b),//4
                                    Number(rsiList[k].s),//5
                                    Number(rsiList[k].blding),//6
                                    Number(rsiList[k].bldi)//7
                                ]);
                                rsi12Data.push([
                                    chartTimeUtil.dataFormatter(rsiList[k].dt),
                                    Number(rsiList[k].rsi12)
                                ]);
                                if(rsiList[k].b == 1){
                                    _buyData.push([
                                        chartTimeUtil.dataFormatter(rsiList[k].dt),
                                        Number(rsiList[k].b),
                                        Number(rsiList[k].rsi6),
                                        Number(rsiList[k].rsi12)
                                    ]);
                                }
                                if(rsiList[k].s == 1){
                                    _sellData.push([
                                        chartTimeUtil.dataFormatter(rsiList[k].dt),
                                        Number(rsiList[k].s),
                                        Number(rsiList[k].rsi6),
                                        Number(rsiList[k].rsi12)
                                    ]);
                                }
                            }

                            if(type == 'day'){
                                //RSI图表标题
                                analysis_kline.getRsiTitle(type,sn,Number(rsi6Data[rsi6Data.length-1][1]).toFixed(2),Number(rsi12Data[rsi12Data.length-1][1]).toFixed(2),chartTimeUtil.getTimeStr(rsi6Data[rsi6Data.length-1][0]));

                                //创建RSI图表
                                analysis_kline.createMACDChart('container_rsi'+sn,[],rsi6Data,rsi12Data,_buyData,_sellData,sn);
                            }else if(type == 'week'){
                                //RSI图表标题
                                analysis_kline.getRsiTitle(type,sn,Number(rsi6Data[rsi6Data.length-1][1]).toFixed(2),Number(rsi12Data[rsi12Data.length-1][1]).toFixed(2),chartTimeUtil.getTimeStr(rsi6Data[rsi6Data.length-1][0]));

                                //创建RSI图表
                                analysis_kline.createMACDChart('container_rsi_week'+sn,[],rsi6Data,rsi12Data,_buyData,_sellData,sn);
                            }

                        }
                        else{
                            console.log("未返回Kd数据");
                        }
                    }
                },
                error: function()
                {
                    //console.log("error");
                }
            });
    },*/


  //技术分析条件选股固定问答
  getFix: function (question) {
    sendQuestion(question, null, undefined, false);
    jQuery.ajax({
      type: "get",
      url: HttpUrl + "/semantic-api-service/api/qa/fix",
      data: {
        predicateType: '条件选股',
        question: question,
        fundAccount: fundAccount,
        userId: userId,
        organization: appKey
      },
      timeout: 10000,
      success: function (json) {
        setAnswer(json, false, false);
      }
    });

  },

  /**
   * 关闭底部弹窗
   */
  closePopup: function () {
    setTimeout(function () {
      $(".pop_BottomToTop .box").slideUp(150);
      $(".pop_BottomToTop .box").removeClass("box_show").addClass("box_hide");
      $(".pop_BottomToTop").fadeOut();
      $('#bottomAnswerContainer').html('');
    }, 160);

    // if (h5Version && h5Version > 101) {
    if (useAppInput) {
      setTimeout(function () {
        hideInputAndShowTitleCover(appFrom, false)
      }, 500);
    }

    scrollToQuestion();
  },


  /*
     * 这个方法用来控制K线上的flags的显示情况，当afterSetExtremes时触发该方法,通过flags显示当前时间区间最高价和最低价
     * ohlcArray K线数据源
     * column    成交量
     * minTime  当前k线图上最小的时间点
     * maxTime  当前k线图上最大的时间点
     * chart  当前的highstock对象
     */
  showTips: function (ohlcArray, column, minTime, maxTime, chart) {
    chart.yAxis[0].removePlotLine('plot-line-1');
    chart.yAxis[0].removePlotLine('plot-line-2');
    chart.xAxis[0].removePlotLine('plot-line-x-3');

    chart.yAxis[1].removePlotLine('plot-line-3');
    chart.yAxis[1].removePlotLine('plot-line-4');

    //chart.showLoading();
    //定义当前时间区间中最低价的最小值，最高价的最大值 以及对应的时间
    var lowestPrice = ohlcArray[0][3], highestPrice = ohlcArray[0][2],
      array = [], highestArray = [], lowestArray = [],
      volumeArr = [],
      volumeMax;
    for (var i = 0; i <= ohlcArray.length - 1; i++) {
      if (ohlcArray[i][0] >= minTime && ohlcArray[i][0] <= maxTime) {
        array.push([
          ohlcArray[i][0],
          ohlcArray[i][2], //最高价
          ohlcArray[i][3] //最低价
        ])
      }
    }
    if (!array.length > 0) {
      return;
    }
    for (var i = 0; i <= ohlcArray.length - 1; i++) {
      if (lowestPrice > ohlcArray[i][3]) {
        lowestPrice = ohlcArray[i][3];
      }
      if (highestPrice < ohlcArray[i][2]) {
        highestPrice = ohlcArray[i][2]
      }
      /*if(highestPrice < ohlcArray[i][8]){
                highestPrice = ohlcArray[i][8]
            }
            if(highestPrice < ohlcArray[i][9]){
                highestPrice = ohlcArray[i][9]
            }
            if(highestPrice < ohlcArray[i][10]){
                highestPrice = ohlcArray[i][10]
            }
            if(highestPrice < ohlcArray[i][11]){
                highestPrice = ohlcArray[i][11]
            }*/
    }

    volumeArr = column.sort(function (x, y) {
      return y[1] - x[1];
    })[0];// 根据最高价降序排列
    volumeMax = volumeArr[1];

    //Y轴坐标自适应
    var n = (highestPrice - lowestPrice) / 4;
    var priceObj = analysis_kline.getArrMaxMin(ohlcArray);
    var val = Number(((priceObj.max - priceObj.min) / 14).toFixed(2));
    chart.yAxis[0].update({
      min: Number(lowestPrice - val),
      max: Number(Number(lowestPrice) + 5 * n),//Number(highestPrice+5),
      tickPositioner: function () {
        var n0 = (lowestPrice - val).toFixed(2);
        var n1 = Number(Number(lowestPrice) + n).toFixed(2);
        var n2 = Number(Number(lowestPrice) + 2 * n).toFixed(2);
        var n3 = Number(Number(lowestPrice) + 3 * n).toFixed(2);
        var n4 = Number(highestPrice).toFixed(2);
        var n5 = Number(Number(highestPrice) + n / 2).toFixed(2);
        var positions = [Number(n0), Number(n1), Number(n2), Number(n3), Number(n4), Number(n5)];
        //console.log(n0+"---------------=="+n1+"---==="+n2+"---==="+n3+"---==="+n4+"---==="+n5);
        return positions;
      }
    });
    //y轴最小值标示线
    chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
      value: Number(lowestPrice - val),
      width: 0.25,
      color: '#ccd6eb',
      id: 'plot-line-1'                  //标示线的id，在删除该标示线的时候需要该id标示
    });
    //y轴最大值标示线
    chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
      value: Number(Number(highestPrice) + n / 2),
      width: 0.25,
      color: '#ccd6eb',
      id: 'plot-line-2'                  //标示线的id，在删除该标示线的时候需要该id标示
    });
    //x轴最大值标示线
    chart.xAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
      value: ohlcArray[ohlcArray.length - 1][0],
      width: 0.25,
      color: '#ccd6eb',
      id: 'plot-line-x-3'                  //标示线的id，在删除该标示线的时候需要该id标示
    });
    //X轴坐标自适应
    chart.xAxis[0].update({
      tickPositioner: function () {
        var positions = [minTime, maxTime];
        return positions;
      }
    });

    chart.yAxis[1].update({
      min: 0,
      max: volumeMax,
      tickPositioner: function () {
        var n0 = 0;
        var n1 = volumeMax;
        var positions = [Number(n0), Number(n1)];
        return positions;
      }
    });
    chart.yAxis[1].addPlotLine({           //在y轴上增加标示线   y轴线
      value: 0,
      width: 0.25,
      color: '#ccd6eb',
      id: 'plot-line-3'                  //标示线的id，在删除该标示线的时候需要该id标示
    });
    chart.yAxis[1].addPlotLine({           //在y轴上增加标示线   y轴线
      value: volumeMax,
      width: 0.25,
      color: '#ccd6eb',
      id: 'plot-line-4'                  //标示线的id，在删除该标示线的时候需要该id标示
    });


  },
  /*
     * 这个方法用来控制K线上的flags的显示情况，当afterSetExtremes时触发该方法,通过flags显示当前时间区间最高价和最低价
     * difData   dif数据源  ci
     * deaData   dea 数据源 cci
     * macdData  macd数据源
     * minTime  当前k线图上最小的时间点
     * maxTime  当前k线图上最大的时间点
     * chart  当前的highstock对象
     */
  macd_showTips: function (difData, deaData, macdData, minTime, maxTime, chart) {

    //移除标示线
    if (chart.renderTo.id.indexOf("macd") > -1) {//macd  cci 图表
      chart.yAxis[0].removePlotLine('macd-plot-line-0');
    } else {//kd  rsi  图表
      chart.yAxis[0].removePlotLine('plot-line-20');
      chart.yAxis[0].removePlotLine('plot-line-50');
      chart.yAxis[0].removePlotLine('plot-line-80');
    }
    chart.yAxis[0].removePlotLine('plot-line-max');
    //macd y坐标的最大值与最小值
    var macdMax = difData[0][1], macdMin = difData[0][1];
    if (macdData.length > 0) {
      for (var i = 0; i < macdData.length; i++) {
        if (macdMax < macdData[i][1]) {
          macdMax = macdData[i][1];
        }
        if (macdMin > macdData[i][1]) {
          macdMin = macdData[i][1];
        }
      }
    }
    if (difData.length > 0) {
      for (var i = 0; i < difData.length; i++) {
        if (macdMax < difData[i][1]) {
          macdMax = difData[i][1];
        }
        if (macdMin > difData[i][1]) {
          macdMin = difData[i][1];
        }
      }
    }
    if (deaData.length > 0) {
      for (var i = 0; i < deaData.length; i++) {
        if (macdMax < deaData[i][1]) {
          macdMax = deaData[i][1];
        }
        if (macdMin > deaData[i][1]) {
          macdMin = deaData[i][1];
        }
      }
    }
    if (chart.renderTo.id.indexOf("macd") > -1) {//macd 图表
      //Y轴坐标自适应
      chart.yAxis[0].update({
        min: Number(macdMin - 0.01),
        max: Number(Number(macdMin + 0.02)),
        tickPositioner: function () {
          var n0 = (macdMin - 0.01).toFixed(2);
          var n1 = Number(Number(macdMin)).toFixed(2);
          var n2 = 0.00;
          var n3 = Number(Number(macdMax)).toFixed(2);
          var n4 = Number(Number(macdMax) + Number(macdMax / 3)).toFixed(2);
          var positions = [Number(n0), Number(n2), Number(n3), Number(n4)];
          //console.log(n0+"---------------=="+n1+"---==="+n2+"---==="+n3+"---==="+n4);
          return positions;
        }
      });
      //y轴零轴标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: 0,
        width: 0.25,
        color: '#ccd6eb',
        id: 'macd-plot-line-0'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
      //y轴最大值标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: Number((macdMax + macdMax / 3).toFixed(2)),
        width: 0.25,
        color: '#ccd6eb',
        id: 'plot-line-max'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
    } else if (chart.renderTo.id.indexOf("cci") > -1) {//cci 图表
      //Y轴坐标自适应
      chart.yAxis[0].update({
        min: Number(macdMin - 0.01),
        max: Number(Number(macdMin + 0.02)),
        tickPositioner: function () {
          var n0 = '', n1 = '', n2 = '', n3 = '', n4 = '';
          n0 = (macdMin - 1).toFixed(2);
          n1 = Number(Number(macdMin)).toFixed(2);
          n2 = 0.00;
          n3 = Number(Number(macdMax)).toFixed(2);
          n4 = Number(Number(macdMax) + Number(macdMax / 3)).toFixed(2);
          var positions = [Number(n0), Number(n1 / 2), Number(n2), Number(n3 / 2), Number(n3), Number(n4)];
          //console.log(n0+"---------------=="+n1+"---==="+n2+"---==="+n3+"---==="+n4);
          return positions;
        }
      });
      //y轴fu1标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: Number(Number(macdMin) / 2).toFixed(2),
        width: 0.25,
        color: '#ccd6eb',
        id: 'plot-line-20'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
      //y轴零轴标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: 0,
        width: 0.25,
        color: '#ccd6eb',
        id: 'macd-plot-line-0'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
      //y轴fu1标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: Number(Number(macdMax) / 2).toFixed(2),
        width: 0.25,
        color: '#ccd6eb',
        id: 'plot-line-20'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
      //y轴最大值标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: Number((macdMax + macdMax / 3).toFixed(2)),
        width: 0.25,
        color: '#ccd6eb',
        id: 'plot-line-max'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
    } else {//kd  rsi wr 图表
      //Y轴坐标自适应
      chart.yAxis[0].update({
        min: Number(macdMin - 0.01),
        max: Number(Number(macdMax) + Number(macdMax / 5)),
        tickPositioner: function () {
          var n0 = (macdMin - 0.01).toFixed(2);
          var n1 = Number(Number(macdMin)).toFixed(2);
          var n2 = 0.00;
          var n3 = Number(Number(macdMax)).toFixed(2);
          var n4 = Number(Number(macdMax) + Number(macdMax / 5)).toFixed(2);
          var positions = [0.00, 20.00, 50.00, 80.00, 100.00];
          //console.log(n0+"---------------=="+n1+"---==="+n2+"---==="+n3+"---==="+n4);
          return positions;
        }
      });
      //y轴最大值标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: 100,
        width: 0.25,
        color: '#ccd6eb',
        id: 'plot-line-max'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
      //y轴20标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: 20,
        width: 0.25,
        color: '#ccd6eb',
        id: 'plot-line-20'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
      //y轴50标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: 50,
        width: 0.25,
        color: '#ccd6eb',
        id: 'plot-line-50'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
      //y轴80标示线
      chart.yAxis[0].addPlotLine({           //在y轴上增加标示线   y轴线
        value: 80,
        width: 0.25,
        color: '#ccd6eb',
        id: 'plot-line-80'                  //标示线的id，在删除该标示线的时候需要该id标示
      });
    }
    //X轴坐标自适应
    chart.xAxis[0].update({
      tickPositioner: function () {
        var positions = [minTime, maxTime];
        return positions;
      }
    });
  },

  /**
   * create the chart  技术分析
   * @param divID 图表id
   * @param ohlc  K线数据源
   * @param column 成交量数据源
   * @param ma5 MA5数据源
   * @param ma10 MA10数据源
   * @param ma20 MA20数据源
   * @param ma60 MA60数据源
   * @param sn 随机数
   * @param type 类型 日K  周K
   * @param peak 波峰数据源
   * @param trough 波谷数据源
   * @param up 最后一根波峰直线
   * @param down 后一根波谷直线
   * @param vma5 成交量 5日均线
   * @param vma10 成交量 10日均线
   * @param macdblding 股价顶背离
   * @param macdbldi 股价底背离
   * @param bdmd 股价波段买点（短线决策）
   *
   * 1.3新增操盘线数据
   * @param zsyjx 自适应均线数值
   * @param zsyhong 自适应均线红色标记
   * @param zsylv 自适应均线绿色标记
   * @param zsyhong2lv 自适应均线红色转绿色
   * @param zsylv2hong 自适应均线绿色转红色
   * @returns {Highcharts.stockChart}
   */
  createKLineChart: function (divID, ohlc, column, ma5, ma10, ma20, ma60, sn, type, peak, trough, up, down, vma5, vma10, macdblding, macdbldi, bdmd, zsylv_total) {

    var peakColor = '#f61c1f',//红柱：#f61c1f  绿柱：#01b41b  黑色#000
      troughColor = '#01b41b';
    if (ohlc.length > 0) {
      if (ohlc[ohlc.length - 1][5] === "1") {//上升趋势
        // debugger
        peakColor = '#f61c1f';
        troughColor = '#f61c1f';
      }
      if (ohlc[ohlc.length - 1][6] === "1") {//下降趋势
        // debugger
        peakColor = '#01b41b';
        troughColor = '#01b41b';
      }
      if (ohlc[ohlc.length - 1][7] === "1") {//震荡趋势
        // debugger
        peakColor = '#000';
        troughColor = '#000';
      }
    }

    //支撑线upPoint  压力线downPoint
    //支撑线对应的值upPoint  压力线对应的值downPoint
    var upPoint = [], downPoint = [];
    if (up.length == 2) {
      if (up[0][0] < up[1][0]) {
        upPoint.push([up[0][0], up[0][1]])
      }
    }
    if (down.length == 2) {
      if (down[0][0] < down[1][0]) {
        downPoint.push([down[0][0], down[0][1]])
      }
    }

    var chartW = $('.content').width();
    //X轴显示的起始日期
    var startDate = ohlc[0][0];
    var lastDate = ohlc[ohlc.length - 1][0];
    //判断开盘涨停的情况，以便于控制柱形图的颜色
    for (var i = 0; i < ohlc.length; i++) {
      var zf = parseFloat((parseFloat(ohlc[i][3]) - parseFloat(ohlc[i][4])) / parseFloat(ohlc[i][4]) * 100);
      if (zf.toFixed(2) > 9.9) {
        ohlc[i][4] = parseFloat(ohlc[i][4]) + 0.01;
      }
    }
    //修改colum条的颜色（重写了源码方法6.0.2）
    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function () {
      var series = this,
        chart = this.chart,
        points = series.points,
        i = points.length;
      while (i--) {
        var candlePoint = chart.series[0].points[i];
        if (candlePoint) {
          if (candlePoint.open != undefined && candlePoint.close != undefined) {  //如果是K线图 改变矩形条颜色，否则不变
            var color = (candlePoint.open < candlePoint.close) ? '#DD2200' : '#33AA11';
            series.points[i].color = color;
          }
        }

      }
      originalDrawPoints.call(this);
    };


    var chart = new Highcharts.StockChart({
      chart: {
        //关闭平移  ok
        panning: true,
        pinchType: 'none',
        zoomType: 'none',
        renderTo: divID,
        spacingTop: 5,
        spacingLeft: 3,
        spacingRight: 0,
        spacingBottom: 0,
        width: chartW,
        events: {
          load: function () {
            analysis_kline.showTips(ohlc, column, ohlc[0][0], ohlc[ohlc.length - 1][0], this);
            //股价背离、波段买点（短线决策）
            analysis_kline.addKSignal(this, ohlc, macdblding, macdbldi, bdmd);
          },
          selection: function (event) {
            if (event.xAxis) {
              event.xAxis[0].axis.tickPositions = [Number(startDate), Number(lastDate)];
            }
          }
        }
      },
      loading: {
        labelStyle: {
          position: 'relative',
          top: '10em',
          zindex: 1000
        }
      },
      credits: {enabled: false},
      rangeSelector: {enabled: false},
      legend: {//图例
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemDistance: 10,
        symbolPadding: 3,
        symbolWidth: 10,
        itemMarginTop: 2,
        itemMarginBottom: 2,
        itemWidth: 80
      },
      yAxis: [
        {
          title: {
            enable: false
          },
          crosshair: true,
          height: '62%',
          lineWidth: 0.5,//Y轴边缘线条粗细
          gridLineColor: 'rgba(0,0,0,0)',
          gridLineWidth: 0.1,
          opposite: false,
          labels: {
            align: 'left',
            x: 0,
            formatter: function () {
              return this.value;
            }
          }
        }, {
          title: {
            enable: false
          },
          opposite: false,
          top: '80%',
          height: '15%',
          gridLineColor: 'rgba(0,0,0,0)',
          gridLineWidth: 0.1,
          lineWidth: 0.5,//轴线宽度
          lineColor: '#ccd6eb',//轴线宽度
          labels: {
            align: 'left',
            x: 0,
            formatter: function () {
              return '';
            }
          }
        }],
      xAxis: {//自定义X轴显示格式
        gridLineColor: 'rgba(0,0,0,0)',
        lineWidth: 0,//轴线宽度
        tickLength: 0,//刻度线长度
        crosshair: true,  // 同时启用竖直及水平准星线
        type: 'datetime',
        labels: {
          y: 5,
          formatter: function () {
            return Highcharts.dateFormat('%Y-%m-%d', this.value);
          }
        },
        tickPositioner: function () {
          var positions = [startDate, lastDate];
          return positions;
        },
        events: {
          afterSetExtremes: function (e) {
            var minTime = Highcharts.dateFormat("%Y-%m-%d", e.min);
            var maxTime = Highcharts.dateFormat("%Y-%m-%d", e.max);
            var chart = this.chart;
            analysis_kline.showTips(ohlc, column, e.min, e.max, chart);
          }
        }
      },
      title: {
        align: 'right',
        verticalAlign: 'top',
        useHTML: true,
        text: "<span style='font-family: 微软雅黑;font-size: 0.625em;font-weight: normal'>" + type + "</span>",
        floating: true
      },
      subtitle: {enabled: false},
      exporting: {enabled: false},
      plotOptions: {
        //修改蜡烛颜色
        candlestick: {
          color: '#33AA11',
          upColor: '#DD2200',
          lineColor: '#33AA11',
          upLineColor: '#DD2200',
          maker: {
            states: {
              hover: {
                enabled: false
              }
            }
          }
        },
        series: {
          states: {//去掉曲线和蜡烛上的hover事件
            hover: {
              enabled: false
            }
          },
          events: {
            legendItemClick: function (e) {
              return false; // 直接 return false 即可禁用图例点击事件
            }
          }/*,
                     line: {
                     dashstyle:'Dash',
                     connectNulls: true
                     }*/
        }
      },
      scrollbar: {enabled: false},
      navigator: {enabled: false},
      tooltip: {
        enabled: true,
        borderColor: 'rgba(0,0,0,0)',         // 边框颜色
        shadow: false,                 // 是否显示阴影
        animation: false,               // 是否启用动画效果
        useHTML: true,
        padding: 1,
        crosshairs: false,
        backgroundColor: '#fff',
        split: true,
        // headerFormat 和  footerFormat 是为了在外层加上  <div class="tooltip">， 方便添加样式
        headerFormat: '<div class="tooltip"><span style="font-size: 10px">{point.key}</span><br/>',
        footerFormat: '</div>',
        followTouchMove: true,
        formatter: function () {
          var tit = '',//week  day
            str = '';//悬浮框展示的文字
          if (divID.indexOf("week") !== -1) {
            tit = 'week';
          } else {
            tit = 'day';
          }
          //十字星出现时，  改变图例样式将图例向下移动
          var obj = $('#chart_legend_' + tit + sn).parent("span");
          $(obj)[0].setAttribute("style", "top:66%");

          for (var i = 0; i < ohlc.length; i++) {
            if (this.x == ohlc[i][0]) {
              if (ohlc[i][15] == '1' || ohlc[i][16] == '1' || ohlc[i][17] == '1') {
                $('#container_k_float_' + tit + sn).css("display", "block");
                if (ohlc[i][17] == '1') {//波段买点  短线决策
                  if (ohlc[i][5] == 1) {
                    str = chartTimeUtil.getTimeStr_m_d(ohlc[i][0]) + '上升趋势中<br>出现短线回调低点';
                  } else if (ohlc[i][7] == 1) {
                    str = chartTimeUtil.getTimeStr_m_d(ohlc[i][0]) + '震荡趋势中<br>出现短线回调低点';
                  } else {
                    $('#container_k_float_' + tit + sn).css("display", "none");
                  }
                } else if (ohlc[i][15] == '1') {//顶背离
                  str = '在' + chartTimeUtil.getTimeStr_m_d(ohlc[i][0]) + '的高点比上一个高点高但对应的<br>macd值没有同步新高,后期下跌概率加大.';
                } else if (ohlc[i][16] == '1') {//底背离
                  str = '在' + chartTimeUtil.getTimeStr_m_d(ohlc[i][0]) + '的低点比上一个低点低但对应的<br>macd值没有同步新低,后期上涨概率加大.';

                }

                $('#container_k_float_' + tit + sn).html('<b style="color: #fff; opacity: 1;">' + str + '</b>');
              } else if (ohlc[i][15] == 0 && ohlc[i][16] == 0 && ohlc[i][17] == 0) {
                $('#container_k_float_' + tit + sn).css("display", "none");
              }

              var ma5 = 0, ma10 = 0, ma20 = 0, ma60 = 0,
                vol = 0, vma5 = 0, vma10 = 0, price = 0, zsyjx = 0;
              ;
              price = ohlc[i][4].toFixed(2);
              ma5 = ohlc[i][8].toFixed(2);
              ma10 = ohlc[i][9].toFixed(2);
              ma20 = ohlc[i][10].toFixed(2);
              zsyjx = ohlc[i][18];
              ma60 = ohlc[i][11].toFixed(2);
              vol = analysis_kline.formatNumber(ohlc[i][12] / 100, 2);
              vma5 = analysis_kline.formatNumber(ohlc[i][13] / 100, 2);
              vma10 = analysis_kline.formatNumber(ohlc[i][14] / 100, 2);

              $('#chart_legend_' + tit + '_top' + sn).css("display", "block");
              $('#chart_legend_' + tit + '_top' + sn).html('<span>' + chartTimeUtil.getTimeStr(ohlc[i][0]) + '</span><span>' + price + '</span>');

              //获取K线图表的标题
              analysis_kline.getKDayTitle(tit, sn, ma5, ma10, ma20, ma60, zsyjx);

              //获取成交量图表的标题
              analysis_kline.getKDayVolTitle(tit, sn, vol, vma5, vma10);
            }
          }
        }
      },
      series: [
        {
          type: 'candlestick',
          dataGrouping: {enabled: false},
          name: 'K',
          data: ohlc,
          id: 'dataseries',
          showInLegend: false // 设置为 false 即为不显示在图例中
        }, {
          type: 'column',
          dataGrouping: {enabled: false},
          name: 'K-成交量',
          data: column,
          showInLegend: false,
          yAxis: 1,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          }
        }, {
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'MA5',
          data: ma5,
          color: '#dd113c', lineWidth: 0.5,
          showInLegend: false
        }, {
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'MA10',
          data: ma10,
          color: '#4479ef', lineWidth: 0.5,
          showInLegend: false
        }, {
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'MA20',
          data: ma20,
          color: '#ee60ff', lineWidth: 0.5,
          showInLegend: false
        }, {
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'MA60',
          data: ma60,
          color: '#eab537', lineWidth: 0.5,
          showInLegend: false
        }, {
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'VMA5',
          yAxis: 1,
          data: vma5,
          color: '#dd113c', lineWidth: 0.5,
          showInLegend: false
        }, {
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'VMA10',
          yAxis: 1,
          data: vma10,
          color: '#4479ef', lineWidth: 0.5,
          showInLegend: false
        }, {
          type: 'line',
          dataGrouping: {enabled: false},
          name: '波峰',
          data: peak,
          color: peakColor, lineWidth: 0.5, dashStyle: 'LongDash',
          showInLegend: false
        }, {
          type: 'line',
          dataGrouping: {enabled: false},
          name: '波谷',
          data: trough,
          color: troughColor, lineWidth: 0.5, dashStyle: 'LongDash',
          showInLegend: false
        }, {
          type: 'line',
          dataGrouping: {enabled: false},
          name: '最后一个波峰直线',
          data: up,
          color: '#01b41b', lineWidth: 0.5, dashStyle: 'LongDash',
          showInLegend: false
        }, {
          type: 'line',
          dataGrouping: {enabled: false},
          name: '最后一个波谷直线',
          data: down,
          color: '#f61c1f', lineWidth: 0.5, dashStyle: 'LongDash',
          showInLegend: false
        }, {
          type: 'line',
          dataGrouping: {enabled: false},
          name: '最后一个波峰点',
          data: upPoint,
          color: '#01b41b', lineWidth: 0.5, dashStyle: 'LongDash',
          showInLegend: false,
          dataLabels: { // 开启数据标签
            enabled: true,
            style: {
              color: '#666666',
              fontWeight: 'normal'
            }
          }
        }, {
          type: 'line',
          dataGrouping: {enabled: false},
          name: '最后一个波谷点',
          data: downPoint,
          color: '#f61c1f', lineWidth: 0.5, dashStyle: 'LongDash',
          showInLegend: false,
          dataLabels: { // 开启数据标签
            enabled: true,
            style: {
              color: '#666666',
              fontWeight: 'normal'
            },
            align: 'left',
            verticalAlign: 'bottom', y: 20
          }
        }]
    });
    return chart;
  },

  createKLineChart_c: function (divID, ohlc, column, ma5, ma10, ma20, ma60, sn, type, peak, trough, up, down, vma5, vma10, macdblding, macdbldi, bdmd, zsylv_total) {
    var peakColor = '#f61c1f',//红柱：#f61c1f  绿柱：#01b41b  黑色#000
      troughColor = '#01b41b';
    if (ohlc.length > 0) {
      if (ohlc[ohlc.length - 1][5] === "1") {//上升趋势
        // debugger
        peakColor = '#f61c1f';
        troughColor = '#f61c1f';
      }
      if (ohlc[ohlc.length - 1][6] === "1") {//下降趋势
        // debugger
        peakColor = '#01b41b';
        troughColor = '#01b41b';
      }
      if (ohlc[ohlc.length - 1][7] === "1") {//震荡趋势
        // debugger
        peakColor = '#000';
        troughColor = '#000';
      }
    }
    //支撑线upPoint  压力线downPoint
    //支撑线对应的值upPoint  压力线对应的值downPoint
    var upPoint = [], downPoint = [];
    if (up.length == 2) {
      if (up[0][0] < up[1][0]) {
        upPoint.push([up[0][0], up[0][1]])
      }
    }
    if (down.length == 2) {
      if (down[0][0] < down[1][0]) {
        downPoint.push([down[0][0], down[0][1]])
      }
    }

    var chartW = $('.content').width();
    //X轴显示的起始日期
    var startDate = ohlc[0][0];
    var lastDate = ohlc[ohlc.length - 1][0];
    //判断开盘涨停的情况，以便于控制柱形图的颜色
    for (var i = 0; i < ohlc.length; i++) {
      var zf = parseFloat((parseFloat(ohlc[i][3]) - parseFloat(ohlc[i][4])) / parseFloat(ohlc[i][4]) * 100);
      if (zf.toFixed(2) > 9.9) {
        ohlc[i][4] = parseFloat(ohlc[i][4]) + 0.01;
      }
    }
    //修改colum条的颜色（重写了源码方法6.0.2）
    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function () {
      var series = this,
        chart = this.chart,
        points = series.points,
        i = points.length;
      while (i--) {
        var candlePoint = chart.series[0].points[i];
        if (candlePoint) {
          if (candlePoint.open != undefined && candlePoint.close != undefined) {  //如果是K线图 改变矩形条颜色，否则不变
            var color = (candlePoint.open < candlePoint.close) ? '#DD2200' : '#33AA11';
            series.points[i].color = color;
          }
        }

      }
      originalDrawPoints.call(this);
    };
    var chart = new Highcharts.StockChart({
      chart: {
        //关闭平移  ok
        panning: true,
        pinchType: 'none',
        zoomType: 'none',
        renderTo: divID,
        spacingTop: 5,
        spacingLeft: 3,
        spacingRight: 0,
        spacingBottom: 0,
        width: chartW,
        events: {
          load: function () {
            analysis_kline.showTips(ohlc, column, ohlc[0][0], ohlc[ohlc.length - 1][0], this);
            //股价背离、波段买点（短线决策）
            // analysis_kline.addKSignal(this,ohlc,macdblding,macdbldi,bdmd);
          },
          selection: function (event) {
            if (event.xAxis) {
              event.xAxis[0].axis.tickPositions = [Number(startDate), Number(lastDate)];
            }
          }
        }
      },
      loading: {
        labelStyle: {
          position: 'relative',
          top: '10em',
          zindex: 1000
        }
      },
      credits: {enabled: false},
      rangeSelector: {enabled: false},
      legend: {//图例
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemDistance: 10,
        symbolPadding: 3,
        symbolWidth: 10,
        itemMarginTop: 2,
        itemMarginBottom: 2,
        itemWidth: 80
      },
      yAxis: [
        {
          title: {
            enable: false
          },
          crosshair: true,
          height: '62%',
          lineWidth: 0.5,//Y轴边缘线条粗细
          gridLineColor: 'rgba(0,0,0,0)',
          gridLineWidth: 0.1,
          opposite: false,
          labels: {
            align: 'left',
            x: 0,
            formatter: function () {
              return this.value;
            }
          }
        }, {
          title: {
            enable: false
          },
          opposite: false,
          top: '80%',
          height: '15%',
          gridLineColor: 'rgba(0,0,0,0)',
          gridLineWidth: 0.1,
          lineWidth: 0.5,//轴线宽度
          lineColor: '#ccd6eb',//轴线宽度
          labels: {
            align: 'left',
            x: 0,
            formatter: function () {
              return '';
            }
          }
        }],
      xAxis: {//自定义X轴显示格式
        gridLineColor: 'rgba(0,0,0,0)',
        lineWidth: 0,//轴线宽度
        tickLength: 0,//刻度线长度
        crosshair: true,  // 同时启用竖直及水平准星线
        type: 'datetime',
        labels: {
          y: 5,
          formatter: function () {
            return Highcharts.dateFormat('%Y-%m-%d', this.value);
          }
        },
        tickPositioner: function () {
          var positions = [startDate, lastDate];
          return positions;
        },
        events: {
          afterSetExtremes: function (e) {
            var minTime = Highcharts.dateFormat("%Y-%m-%d", e.min);
            var maxTime = Highcharts.dateFormat("%Y-%m-%d", e.max);
            var chart = this.chart;
            analysis_kline.showTips(ohlc, column, e.min, e.max, chart);
          }
        }
      },
      title: {
        align: 'right',
        verticalAlign: 'top',
        useHTML: true,
        text: "<span style='font-family: 微软雅黑;font-size: 0.625em;font-weight: normal'>" + type + "</span>",
        floating: true
      },
      subtitle: {enabled: false},
      exporting: {enabled: false},
      plotOptions: {
        //修改蜡烛颜色
        candlestick: {
          color: '#33AA11',
          upColor: '#DD2200',
          lineColor: '#33AA11',
          upLineColor: '#DD2200',
          maker: {
            states: {
              hover: {
                enabled: false
              }
            }
          }
        },
        series: {
          states: {//去掉曲线和蜡烛上的hover事件
            hover: {
              enabled: false
            }
          },
          events: {
            legendItemClick: function (e) {
              return false; // 直接 return false 即可禁用图例点击事件
            }
          }/*,
                     line: {
                     dashstyle:'Dash',
                     connectNulls: true
                     }*/
        }
      },
      scrollbar: {enabled: false},
      navigator: {enabled: false},
      tooltip: {
        enabled: true,
        borderColor: 'rgba(0,0,0,0)',         // 边框颜色
        shadow: false,                 // 是否显示阴影
        animation: false,               // 是否启用动画效果
        useHTML: true,
        padding: 1,
        crosshairs: false,
        backgroundColor: '#fff',
        split: true,
        // headerFormat 和  footerFormat 是为了在外层加上  <div class="tooltip">， 方便添加样式
        headerFormat: '<div class="tooltip"><span style="font-size: 10px">{point.key}</span><br/>',
        footerFormat: '</div>',
        followTouchMove: true,
        formatter: function () {
          var tit = '',//week  day
            str = '';//悬浮框展示的文字
          if (divID.indexOf("week") !== -1) {
            tit = 'week';
          } else {
            tit = 'day';
          }
          //十字星出现时，  改变图例样式将图例向下移动
          var obj = $('#chart_legend_' + tit + sn).parent("span");
          $(obj)[0].setAttribute("style", "top:66%");

          for (var i = 0; i < ohlc.length; i++) {
            if (this.x == ohlc[i][0]) {
              if (ohlc[i][15] == '1' || ohlc[i][16] == '1' || ohlc[i][17] == '1') {
                $('#container_k_float_' + tit + sn).css("display", "block");
                if (ohlc[i][17] == '1') {//波段买点  短线决策
                  if (ohlc[i][5] == 1) {
                    str = chartTimeUtil.getTimeStr_m_d(ohlc[i][0]) + '上升趋势中<br>出现短线回调低点';
                  } else if (ohlc[i][7] == 1) {
                    str = chartTimeUtil.getTimeStr_m_d(ohlc[i][0]) + '震荡趋势中<br>出现短线回调低点';
                  } else {
                    $('#container_k_float_' + tit + sn).css("display", "none");
                  }
                } else if (ohlc[i][15] == '1') {//顶背离
                  str = '在' + chartTimeUtil.getTimeStr_m_d(ohlc[i][0]) + '的高点比上一个高点高但对应的<br>macd值没有同步新高,后期下跌概率加大.';
                } else if (ohlc[i][16] == '1') {//底背离
                  str = '在' + chartTimeUtil.getTimeStr_m_d(ohlc[i][0]) + '的低点比上一个低点低但对应的<br>macd值没有同步新低,后期上涨概率加大.';

                }

                $('#container_k_float_' + tit + sn).html('<b style="color: #fff; opacity: 1;">' + str + '</b>');
              } else if (ohlc[i][15] == 0 && ohlc[i][16] == 0 && ohlc[i][17] == 0) {
                $('#container_k_float_' + tit + sn).css("display", "none");
              }

              var ma5 = 0, ma10 = 0, ma20 = 0, ma60 = 0,
                vol = 0, vma5 = 0, vma10 = 0, price = 0, zsyjx = 0;
              price = ohlc[i][4].toFixed(2);
              ma5 = ohlc[i][8].toFixed(2);
              ma10 = ohlc[i][9].toFixed(2);
              ma20 = ohlc[i][10].toFixed(2);
              ma60 = ohlc[i][11].toFixed(2);
              zsyjx = ohlc[i][18];
              vol = analysis_kline.formatNumber(ohlc[i][12] / 100, 2);
              vma5 = analysis_kline.formatNumber(ohlc[i][13] / 100, 2);
              vma10 = analysis_kline.formatNumber(ohlc[i][14] / 100, 2);
              $('#chart_legend_c_' + tit + '_top' + sn).css("display", "block");
              $('#chart_legend_c_' + tit + '_top' + sn).html('<span>' + chartTimeUtil.getTimeStr(ohlc[i][0]) + '</span><span>' + price + '</span>');
              //获取K线图表的标题
              analysis_kline.getKDayTitle(tit, sn, ma5, ma10, ma20, ma60, zsyjx);

              //获取成交量图表的标题
              analysis_kline.getKDayVolTitle(tit, sn, vol, vma5, vma10);
            }
          }
        }
      },
      series: [
        {
          type: 'candlestick',
          dataGrouping: {enabled: false},
          name: 'K',
          data: ohlc,
          id: 'dataseries',
          showInLegend: false // 设置为 false 即为不显示在图例中
        }, {
          type: 'column',
          dataGrouping: {enabled: false},
          name: 'K-成交量',
          data: column,
          showInLegend: false,
          yAxis: 1,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          }
        }, {
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'VMA5',
          yAxis: 1,
          data: vma5,
          color: '#dd113c', lineWidth: 0.5,
          showInLegend: false
        }, {
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'VMA10',
          yAxis: 1,
          data: vma10,
          color: '#4479ef', lineWidth: 0.5,
          showInLegend: false
        }]
    });
    //01b41b
    var color_lv = "#01b41b";
    var color_hong = '#f61c1f';
    var target = '0';
    for (var i = 0; i < zsylv_total.length; i++) {
      if (i != zsylv_total.length - 1) {
        zsylv_total[i].push(zsylv_total[i + 1][0]);
      }
      zsylv_total.forEach(function (item, index) {
        if (item.length > 1) {
          item.forEach(function (ite, idx) {
            if (ite[1] == target) {
              item.splice(idx, 1)
            }
          })
        }
      });
      if (zsylv_total[i][0][4] == 0 && zsylv_total[i][0][5] == 1) {
        chart.addSeries({
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'MA10',
          data: zsylv_total[i],
          color: color_lv,
          lineWidth: 1,
          showInLegend: false
        })
      } else {
        chart.addSeries({
          type: 'spline',
          dataGrouping: {enabled: false},
          name: 'MA10',
          data: zsylv_total[i],
          color: color_hong,
          lineWidth: 1,
          showInLegend: false
        })
      }

    }
    return chart;

  },

  //股价背离（顶背离是绿色，底背离是红色）、波段买点（短线决策）
  addKSignal: function (chart, ohlc, macdblding, macdbldi, bdmd) {
    var priceObj = analysis_kline.getArrMaxMin(ohlc);
    var val = Number(((priceObj.max - priceObj.min) / 14).toFixed(2));
    var macdbldingArr = [], macdbldiArr = [], bdmdArr = [];
    for (var i = 0; i < macdblding.length; i++) {
      var min = macdblding[i][1] + val, temp0 = [];
      temp0.push(macdblding[i][0]);
      temp0.push(min);
      macdbldingArr.push(temp0);
    }
    for (var i = 0; i < macdbldi.length; i++) {
      var max = macdbldi[i][1] - val, temp0 = [];
      temp0.push(macdbldi[i][0]);
      temp0.push(max);
      macdbldiArr.push(temp0);
    }
    for (var i = 0; i < bdmd.length; i++) {
      var max = bdmd[i][1] - val, temp0 = [];
      temp0.push(bdmd[i][0]);
      temp0.push(max);
      bdmdArr.push(temp0);
    }
    chart.addSeries({
      dataGrouping: {enabled: false},
      type: 'scatter',
      name: 'macd',
      data: bdmdArr,
      showInLegend: false,
      color: 'orange',
      marker: {symbol: 'url(/static/images/toUp.png)', width: 10, height: 7}
    });
    chart.addSeries({
      dataGrouping: {enabled: false},
      type: 'scatter',
      name: 'macd',
      data: macdbldingArr,
      showInLegend: false,
      color: 'green',
      marker: {symbol: 'url(/static/images/point_green.png)', width: 7, height: 7}
    });
    chart.addSeries({
      dataGrouping: {enabled: false},
      type: 'scatter',
      name: 'macd',
      data: macdbldiArr,
      showInLegend: false,
      color: 'red',
      marker: {symbol: 'url(/static/images/point_red.png)', width: 7, height: 7}
    });
  },

  //取数组的最大值与最小值
  getArrMaxMin: function (ohlcArray) {
    var array = [], lowestPrice = ohlcArray[0][3], highestPrice = ohlcArray[0][2];

    for (var i = 0; i <= ohlcArray.length - 1; i++) {
      if (lowestPrice > ohlcArray[i][3]) {
        lowestPrice = ohlcArray[i][3];
      }
      if (highestPrice < ohlcArray[i][2]) {
        highestPrice = ohlcArray[i][2]
      }
    }
    var obj = {};
    obj.min = lowestPrice;
    obj.max = highestPrice;
    return obj;

  },

  /**
   * create the chart  指标分析
   * divID:图表div id
   * MACD图表：data1:MACD,data2:DEA,data3:DIF ,data4:bug,data5:sell,data6:bldingData,data7:bldiData
   * KD图表：data1:[],data2:K,data3:D,data4:bug,data5:sell,data6:bldingData,data7:bldiData
   * RSI图表：data1:[],data2:rsi6,data3:rsi12,data4:bug,data5:sell,data6:bldingData,data7:bldiData
   * CCI图表：data1:[],data2:cci,data3:ci,data4:bug,data5:sell,data6:bldingData,data7:bldiData
   * sn 随机数
   */
  createMACDChart: function (divID, data1, data2, data3, data4, data5, sn, data6, data7) {
    /*        debugger*/
    var chartW = $('.content2').width();
    //X轴显示的起始日期
    var startDate = data3[0][0];
    var lastDate = data3[data3.length - 1][0];
    //修改colum条的颜色（重写了源码方法）
    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function () {
      var series = this,
        chart = this.chart,
        points = series.points,
        i = points.length;
      while (i--) {
        var candlePoint = chart.series[0].points[i];
        if (candlePoint.y != undefined) {
          var color = (candlePoint.y > 0) ? '#e8272a' : '#439d2a';//红绿
          candlePoint.color = color;
        }
      }
      originalDrawPoints.call(this);
    };
    var c = new Highcharts.StockChart({
      chart: {
        //关闭平移  ok
        panning: false,
        pinchType: 'none',
        zoomType: 'x',
        renderTo: divID,//'container_macd'+sn,
        spacingTop: 5,
        spacingLeft: 3,
        spacingRight: 0,
        spacingBottom: 0,
        width: chartW,
        events: {
          load: function () {
            analysis_kline.macd_showTips(data3, data2, data1, data3[0][0], data3[data3.length - 1][0], this);
            analysis_kline.addMacdSignal(this, data4, data5, data6, data7);
          },
          selection: function (event) {
            if (event.xAxis) {
              event.xAxis[0].axis.tickPositions = [Number(startDate), Number(lastDate)];
            }
          }
        }
      },
      loading: {
        labelStyle: {
          position: 'relative',
          top: '10em',
          zindex: 1000
        }
      },
      credits: {enabled: false},
      rangeSelector: {
        enabled: false,//隐藏日期选择器
        inputDateFormat: '%Y-%m-%d'  //设置右上角的日期格式
      },
      legend: {enabled: false},
      yAxis: {
        title: {enable: false},
        crosshair: true,
        opposite: false,
        height: '100%',
        gridLineColor: 'rgba(0,0,0,0)',
        gridLineWidth: 0.1,
        lineWidth: 0.5,
        labels: {
          align: 'left',
          x: 0,
          formatter: function () {
            return this.value.toFixed(2);
          }
        }
      },
      xAxis: {//自定义X轴显示格式
        gridLineColor: 'rgba(0,0,0,0)',
        type: 'datetime',
        lineWidth: 0.5,
        tickLength: 0,
        crosshair: true,
        labels: {
          formatter: function () {
            return Highcharts.dateFormat('%Y-%m-%d', this.value);
          }
        },
        tickPositioner: function () {
          var positions = [startDate, lastDate];
          return positions;
        },
        events: {
          afterSetExtremes: function (e) {
            var minTime = Highcharts.dateFormat("%Y-%m-%d", e.min);
            var maxTime = Highcharts.dateFormat("%Y-%m-%d", e.max);
            var chart = this.chart;
            analysis_kline.macd_showTips(data3, data2, data1, e.min, e.max, chart);
          }
        }
      },
      title: {enabled: false},
      subtitle: {enabled: false},
      exporting: {enabled: false},
      plotOptions: {
        series: {
          states: {//去掉曲线和蜡烛上的hover事件
            hover: {
              enabled: false
            }
          },
          events: {
            legendItemClick: function (e) {
              return false; // 直接 return false 即可禁用图例点击事件
            }
          },
          line: {
            connectNulls: true
          }
        }
      },
      scrollbar: {enabled: false},
      navigator: {enabled: false},
      tooltip: {
        enabled: true,
        borderColor: 'rgba(0,0,0,0)',         // 边框颜色
        shadow: false,                 // 是否显示阴影
        animation: false,               // 是否启用动画效果
        useHTML: true,
        padding: 1,
        backgroundColor: '#fff',
        formatter: function () {
          var title = '',//macd.kd.rsi
            tit = '';//week day
          var macd = 0, dif = 0, dea = 0;
          var k = 0, d = 0;
          var rsi6 = 0, rsi12 = 0;
          var wr6 = 0, wr10 = 0;
          var cci = 0, ci = 0;
          if (divID.indexOf("week") !== -1) {
            tit = 'week';
          } else {
            tit = 'day';
          }
          if (divID.indexOf("macd") > -1) {
            title = 'MACD';
            $('#macd_chart_float' + sn).hide();
            for (var i = 0; i < data3.length; i++) {
              if (this.x == data3[i][0]) {
                dif = data3[i][1];
                dea = data2[i][1];
                macd = data1[i][1];
              }
            }
            analysis_kline.getMacdTitle(tit, sn, dif, dea, macd, chartTimeUtil.getTimeStr(this.x));
          }
          if (divID.indexOf("kd") > -1) {
            title = 'KD';
            $('#kd_chart_float' + sn).hide();
            for (var i = 0; i < data2.length; i++) {
              if (this.x == data2[i][0]) {
                k = data2[i][1];
                d = data3[i][1];
              }
            }
            analysis_kline.getKdTitle(tit, sn, k, d, chartTimeUtil.getTimeStr(this.x));
          }
          if (divID.indexOf("rsi") > -1) {
            title = 'RSI';
            $('#rsi_chart_float' + sn).hide();
            for (var i = 0; i < data2.length; i++) {
              if (this.x == data2[i][0]) {
                rsi6 = data2[i][1];
                rsi12 = data3[i][1];
              }
            }
            analysis_kline.getRsiTitle(tit, sn, rsi6, rsi12, chartTimeUtil.getTimeStr(this.x));
          }
          if (divID.indexOf("wr") > -1) {
            title = 'WR';
            $('#wr_chart_float' + sn).hide();
            for (var i = 0; i < data2.length; i++) {
              if (this.x == data2[i][0]) {
                wr6 = data2[i][1];
                wr10 = data3[i][1];
              }
            }
            analysis_kline.getWrTitle(tit, sn, wr6, wr10, chartTimeUtil.getTimeStr(this.x));
          }
          if (divID.indexOf("cci") > -1) {
            title = 'CCI';
            $('#cci_chart_float' + sn).hide();
            for (var i = 0; i < data2.length; i++) {
              if (this.x == data2[i][0]) {
                cci = data2[i][1];
                ci = data3[i][1];
              }
            }
            analysis_kline.getCCiTitle(tit, sn, cci, ci, chartTimeUtil.getTimeStr(this.x));
          }

          var txt = '', temp = '';
          for (var i = 0; i < data2.length; i++) {
            if (this.x == data2[i][0]) {
              if (data2[i][4] == 1) {
                temp = '金叉';
              } else if (data2[i][5] == 1) {
                temp = '死叉';
              } else if (data2[i][6] == 1) {
                temp = '顶背离';
              } else if (data2[i][7] == 1) {
                temp = '底背离';
              }
              txt = analysis_kline.getChartFloat(chartTimeUtil.getTimeStr_m_d(data2[i][0]) + title + temp);

              if (data2[i][4] != 1 && data2[i][5] != 1 && data2[i][6] != 1 && data2[i][7] != 1) {
                txt = '<span style="background-color:red;z-index:9999;"></span>';
              }
            }
          }
          return txt;
        }
      },
      series: [
        {
          type: 'column',
          name: 'MACD',
          dataGrouping: {enabled: false},
          showInLegend: false,
          data: data1,
          pointPadding: 0.5
        }, {
          type: 'line',
          name: 'DEA',
          dataGrouping: {enabled: false},
          showInLegend: false,
          color: '#337edb',//蓝色
          data: data2,
          lineWidth: 1
        }, {
          type: 'line',
          name: 'DIF',
          dataGrouping: {enabled: false},
          showInLegend: false,
          color: '#ff7b00',//橙色
          data: data3,
          lineWidth: 1
        }]
    });
    return c;
  },
  render: function (chart, point, text) {
    chart.renderer.label(text + ': ' + point.y, point.plotX + chart.plotLeft - 20, point.plotY + chart.plotTop - 45, 'callout', point.plotX + chart.plotLeft, point.plotY + chart.plotTop)
      .css({
        color: '#FFFFFF',
        align: 'center'
      })
      .attr({
        fill: 'rgba(0, 0, 0, 0.75)',
        padding: 8,
        r: 5,
        zIndex: 6
      })
      .add();
  },
  //MACD信号  红色向上的买，绿色向下的卖
  addMacdSignal: function (chart, buyData, sellData, bldingData, bldiData) {

    var val = 0.1;
    if (chart.renderTo.id.indexOf("macd") !== -1) {
      val = 0.1;
      if (chart.yAxis[0].dataMax - 0 <= 0.1) {//判断图形与曲线之间的距离
        val = 0.03;
      }
    } else {
      val = 5;
    }
    var buyArr = [], sellArr = [], bldingArr = [], bldiArr = [];
    for (var i = 0; i < buyData.length; i++) {
      var min = buyData[i][3] - val, temp0 = [];
      temp0.push(buyData[i][0]);
      temp0.push(min);
      buyArr.push(temp0);
    }
    for (var i = 0; i < sellData.length; i++) {
      var max = sellData[i][3] + val, temp0 = [];
      temp0.push(sellData[i][0]);
      temp0.push(max);
      sellArr.push(temp0);
    }


    chart.addSeries({
      dataGrouping: {enabled: false},
      type: 'scatter',
      name: 'macd',
      data: buyArr,
      color: '#434348',
      marker: {symbol: 'url(/static/images/toUp.png)', width: 10, height: 7}
    });
    chart.addSeries({
      dataGrouping: {enabled: false},
      type: 'scatter',
      name: 'macd',
      data: sellArr,
      color: '#90ed7d',
      marker: {symbol: 'url(/static/images/toDown.png)', width: 10, height: 7}
    });
    if (chart.renderTo.id.indexOf("macd") !== -1) {
      for (var i = 0; i < bldingData.length; i++) {
        var max = bldingData[i][3] + val, temp0 = [];
        temp0.push(bldingData[i][0]);
        temp0.push(max);
        bldingArr.push(temp0);
      }
      for (var i = 0; i < bldiData.length; i++) {
        var max = bldiData[i][3] - val, temp0 = [];
        temp0.push(bldiData[i][0]);
        temp0.push(max);
        bldiArr.push(temp0);
      }

      chart.addSeries({
        dataGrouping: {enabled: false},
        type: 'scatter',
        name: 'macd',
        data: bldingArr,
        color: 'green',
        marker: {symbol: 'url(/static/images/point_green.png)', width: 7, height: 7}
      });
      chart.addSeries({
        dataGrouping: {enabled: false},
        type: 'scatter',
        name: 'macd',
        data: bldiArr,
        color: 'red',
        marker: {symbol: 'url(/static/images/point_red.png)', width: 7, height: 7}
      });
    }
  },

  /**
   * 成交量数据格式
   * @param value
   * @param fix  保留小数的位数
   * @returns {string}
   */
  formatNumber: function (value, fix) {
    var re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;//千分位 正则公式
    //保留小数的位数  只有曲线图保留整数
    if (fix != 0) {
      fix = 2;
    }
    fix = Number(fix);
    value = Number(value);
    if (!isNaN(value)) {
      var prefix = "";
      if (value < 0)
        prefix = "-";
      if (value === 0)
        return value.toFixed(fix);

      value = value.toFixed(fix);

      if (value > 10000 && value < 10000 * 10000)
        return prefix + (value / 10000).toFixed(fix) + '万手';
      else if (value > 10000 * 10000)
        return prefix + (value / 100000000).toFixed(fix) + '亿手';
      else
        return value.replace(re, "$1,") + '手';
    }
  }

};

/**
 * 文字格式化
 */
var getTXT = function (val) {
  if (val == 1) {
    return '买入';
  } else if (val == 2) {
    return '卖出';
  } else if (val == 0) {
    return '观望';
  } else {
    return '';
  }
};
//日期格式
var chartTimeUtil = {
  /**
   * @param number 数字
   * @return 小于10则返回前面加0的字符串，大于10则直接返回对应的字符串
   */
  getTwoNumber: function (number) {
    return String((number >= 10) ? number : ("0" + number));
  },
  /**
   * @param time 1970.1.1日起的毫秒数，
   * @return {string}  yyyy-mm-dd hh:mm:ss格式的字符串
   */
  getTimeStr_more0: function (time) {
    var date = new Date(time);
    return chartTimeUtil.getTimeStr(time) + " " + chartTimeUtil.getTwoNumber(date.getHours()) + ":" + chartTimeUtil.getTwoNumber(date.getMinutes()) + ":" + chartTimeUtil.getTwoNumber(date.getSeconds());
  },
  /**
   * @param time 1970.1.1日起的毫秒数，
   * @return {string}  yyyy-mm-dd hh:mm格式的字符串
   */
  getTimeStr_more: function (time) {
    var date = new Date(time);
    return chartTimeUtil.getTimeStr(time) + " " + chartTimeUtil.getTwoNumber(date.getHours()) + ":" + chartTimeUtil.getTwoNumber(date.getMinutes());
  },
  /**
   * @param time 1970.1.1日起的毫秒数
   * @return {string} YYYY-MM-DD格式的字符串
   */
  getTimeStr: function (time) {
    var date = new Date();
    if (time != undefined && time != "")
      date.setTime(time);
    var month = date.getMonth() + 1;
    var monthStr = chartTimeUtil.getTwoNumber(month);
    var day = date.getDate();
    var dayStr = chartTimeUtil.getTwoNumber(day);
    return date.getFullYear() + '-' + monthStr + '-' + dayStr;
  },
  /**
   * @param time 1970.1.1日起的毫秒数
   * @return {string} YYYY-MM-DD格式的字符串 没有时间显示--
   */
  getTimeStr2: function (time) {
    var date = new Date();
    if (time != undefined && time != "") {
      date.setTime(time);
      var month = date.getMonth() + 1;
      var monthStr = chartTimeUtil.getTwoNumber(month);
      var day = date.getDate();
      var dayStr = chartTimeUtil.getTwoNumber(day);
      return date.getFullYear() + '-' + monthStr + '-' + dayStr;
    } else {
      return '--';
    }
  },
  getTimeStr3: function (time) {
    var date = new Date();
    if (time != undefined && time != "")
      date.setTime(time);
    var month = date.getMonth() + 1;
    var monthStr = chartTimeUtil.getTwoNumber(month);
    var day = date.getDate();
    var dayStr = chartTimeUtil.getTwoNumber(day);
    return monthStr + '-' + dayStr;
  },

  /**
   * @param str 20180102
   * @return {Date} 毫秒数
   */
  dataFormatter: function (str) {
    var d = str.toString();

    var _y = Number(d.substr(0, 4));
    var _m = Number(d.substr(4, 2)) - 1;
    var _d = Number(d.substr(6, 2));

    var _date = Date.UTC(_y, _m, _d);//转换成Date.UTC(1970,  5, 20)格式[Date.UTC(1970,  9, 27), 0   ],
    return _date;
  },

  //年月日格式+小时分钟秒
  dataFormatter2: function (str, str1) {
    var d = str.toString();
    var e = str1.toString();

    var _y = Number(d.substr(0, 4));
    var _m = Number(d.substr(4, 2)) - 1;
    var _d = Number(d.substr(6, 2));

    var _h = Number(e.substr(0, 2));
    var _min = Number(e.substr(3, 2));
    var _s = Number(e.substr(6, 2));

    var _date = Date.UTC(_y, _m, _d, _h, _min);
    return _date;
  },
  /**
   * 判断所选时间(或者当前时间)是否在某一时间段
   */
  time_range: function (beginTime, endTime, nowTime) {
    var strb = beginTime.split(":");
    if (strb.length != 2) {
      return false;
    }

    var stre = endTime.split(":");
    if (stre.length != 2) {
      return false;
    }

    var strn = nowTime.split(":");
    if (stre.length != 2) {
      return false;
    }
    var b = new Date();
    var e = new Date();
    var n = new Date();

    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);
    n.setHours(strn[0]);
    n.setMinutes(strn[1]);

    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
      return true;
    } else {
      //alert ("当前时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在该时间范围内！");
      return false;
    }
  },
  /**
   * @param time 1970.1.1日起的毫秒数
   * @return {string} MM月DD日格式的字符串
   */
  getTimeStr_m_d: function (time) {
    var date = new Date();
    if (time != undefined && time != "")
      date.setTime(time);
    var month = date.getMonth() + 1;
    var monthStr = chartTimeUtil.getTwoNumber(month);
    var day = date.getDate();
    var dayStr = chartTimeUtil.getTwoNumber(day);
    return monthStr + '月' + dayStr + '日';
  }

};
