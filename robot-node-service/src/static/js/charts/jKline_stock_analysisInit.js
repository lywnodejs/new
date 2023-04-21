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
var analysis_klineInit = {
    HttpUrl:'/robot/semantic/',
    TechnichalAnalysis: '/robot/semantic/TechnichalAnalysis/',
    /**
     * 加载页面
     * @param sn
     * @param from  fromAPP fromPDF 智能小E（appEzt、appZscf、appJftg、''）
     * @param symbol
     * @param chartTabIndex
     * @param type  谓语分类
     * @param source  百度统计来源
     * @param isPopup 技术分析是否为弹框
     * @returns {string}
     */
    getTarget: function(sn,from,symbol,chartTabIndex,type,source,isPopup){
        chartTabIndex = chartTabIndex==null ? 1 : chartTabIndex;
        symbol = symbol==null ? 'sh600600' : symbol;
        /**
         * 指数类的显示九大区域
         * 例如  深成指
         */
        if(type === '指数综评'){
            chartTabIndex = 1;
        }
        var str_qz = symbol.toString().substr(0,2);
        var str_symbol = symbol.toString().substr(2,6);
        var temp = '',
            askE='',//问小e;
            stockDetail='';//个股详情页按钮  原生，显示;H5隐藏

        if(from === 'fromAPP'){//原生嵌套
            /*analysis_kline.HttpUrl = 'http://robot.rxhui.com/robot/semantic/';
             analysis_kline.stockAnalysis = 'http://10.0.0.59:9000';*/
            analysis_klineInit.HttpUrl = '/robot/semantic/';
            analysis_klineInit.stockAnalysis = '/stockAnalysis';
            askE = '<a onclick="analysis_klineInit.askE(\'' + str_symbol + '\',\'' + source + '\')">问小e</a>';
            stockDetail='<div class="icon" onclick="analysis_kline.showDetail(\'' + str_symbol + '\',\'' + source + '\')"><i class="icon-arrow_closed"></i></div>';
        }else {//小E嵌套
            analysis_klineInit.HttpUrl = '/robot/semantic/';
            analysis_klineInit.stockAnalysis = '/stockAnalysis';
            askE = '';
            if(from === 'appEzt'){//E智通
                stockDetail='<div class="icon" onclick="analysis_kline.showDetail(\'' + str_symbol + '\',\'' + source + '\')"><i class="icon-arrow_closed"></i></div>';
            }else{//紫薯财富  H5
                stockDetail='';
            }
        }
        var tabLi0Class = '',
            tabLi1Class = '',
            isItem0Show = '',
            isItem1Show = '',
            item0Class ='',//趋势分析的显示隐藏
            item1Class = '';//区域分析的显示隐藏

        if(chartTabIndex == 0){
            tabLi0Class = 'on';
            item0Class = 'style="display: block"';
            isItem0Show = 'show';
        }else{
            tabLi0Class = '';
            item0Class = 'style="display: none"';
            isItem0Show = '';
        }
        if(chartTabIndex == 1 && isPopup==""){
            tabLi1Class = 'on';
            item1Class = 'style="display: block"';
            isItem1Show = 'show';
        }else if(chartTabIndex == 1 && isPopup==true){
            tabLi0Class = 'on';
            item0Class = 'style="display: block"';
            isItem0Show = 'show';
        }else{
            tabLi1Class = '';
            item1Class = 'style="display: none"';
            isItem1Show = '';
        }
        temp +='<div class="box_analysis_1_2">'+<!-- box_analysis_1_2    start -->
            '<ul class="stock2">'+<!-- 标头title    start -->
            '<li id="title' + sn + '"></li>'+
            '<li>'+stockDetail+'<div id="val' + sn + '"></div></li>'+
            '</ul>';<!-- 标头title    end -->

        if(type === '指数综评'){
            temp +='<ul class="tab TAB1" style="display: none">'+<!-- 趋势分析、区域分析Tab切  start -->
                '<li class="'+tabLi0Class+'" id="tab_li_0' + sn + '" onclick="analysis_klineInit.changTab(\'0\',\'' + sn + '\',\'' + source + '\')">趋势分析</li>'+
                '<li class="'+tabLi1Class+'" id="tab_li_1' + sn + '" onclick="analysis_klineInit.changTab(\'1\',\'' + sn + '\',\'' + source + '\')">形态信号</li>'+
                '</ul>';
        }else{
            temp +='<ul class="tab TAB1">'+<!-- 趋势分析、区域分析Tab切  start -->
                '<li class="'+tabLi0Class+'" id="tab_li_0' + sn + '" onclick="analysis_klineInit.changTab(\'0\',\'' + sn + '\',\'' + source + '\')">趋势分析</li>'+
                '<li class="'+tabLi1Class+'" id="tab_li_1' + sn + '" onclick="analysis_klineInit.changTab(\'1\',\'' + sn + '\',\'' + source + '\')">形态信号</li>'+
                '</ul>';
        }

        temp +='<div class="content">'+<!-- content start -->
            '<div class="item '+isItem0Show+'" id="item_0' + sn + '" '+item0Class+'>';<!-- 趋势分析 item  start-->

        if(isPopup){
            temp += '<h5 class="hd">'+
                '<span>趋势量能</span>'+
                // '<a><span>趋势体系说明</span></a>'+
                '</h5>';
        }else{
            temp += '<h5 class="hd">'+
                '<span>趋势量能</span>'+
                '<a onclick="analysis_kline.openPop_introduction()"><span>趋势体系说明</span><i class="icon-arrow_closed"></i></a>'+
                // '<a style="display: none"><span>趋势体系说明</span></a>'+
                '</h5>';
        }

        temp += '<div class="tab TAB2">'+<!-- 中短期/长期tab  start-->
            '<ul>'+
            '<li class="on" id="tab_li_0_0' + sn + '" onclick="analysis_klineInit.changTab(\'2\',\'' + sn + '\',\'' + source + '\')">'+
            '<span>中短期<b></b></span>'+
            '</li>'+
            '<li id="tab_li_0_1' + sn + '" onclick="analysis_klineInit.changTab(\'3\',\'' + sn + '\',\'' + source + '\')">'+
            '<span>长期<b></b></span>'+
            '</li>'+
            '</ul>'+
            '<div class="bottom"></div>'+
            '</div>'+<!-- 中短期/长期tab  end-->

            '<div class="content">'+
            '<div class="item show" id="item_0_0' + sn + '">'+<!-- 中短期 start-->
            '<div class="box_bgGray" id="day_huashu_jia' + sn + '">'+

            '</div>'+
            '<div class="box_bgGray" id="day_huashu_liang' + sn + '">'+

            '</div>'+
            '<div class="tab TAB3">'+<!-- 波段决策/操盘线tab  start-->
            '<ul>'+
            '<li class="on" id="tab_li_0_0_0' + sn + '" onclick="analysis_klineInit.changTab(\'4\',\'' + sn + '\',\'' + source + '\')">'+
            '<span>波段决策<b></b></span>'+
            '</li>'+
            '<li id="tab_li_0_0_1' + sn + '" onclick="analysis_klineInit.changTab(\'5\',\'' + sn + '\',\'' + source + '\')">'+
            '<span>操盘线<b></b></span>'+
            '</li>'+
            '</ul>'+
            '<div class="bottom"></div>'+
            '</div>'+<!-- 中短期/长期tab  end-->

            '<div class="box_chart01 dis_none '+isItem0Show+'" id = "item_0_0_0' + sn + '">'+
            '<span class="chart_note" id="chart_legend_day_top' + sn + '"  style="display: none"></span>'+
            '<span class="chart_note" id="chart_note_day' + sn + '"></span>'+
            '<div id="container_k' + sn + '" style="position:relative; height:280px !important;"></div>'+
            '<div class="csshub-loading" id="loading_neymar' + sn + '" style="position:absolute; height:40px!important;top: 50%;margin-top: -20px;left: 50%;margin-left: -20px;">' +
            '<div></div>'+
            '<div></div>'+
            '<div></div>'+
            '<div></div>'+
            '<div></div>'+
            '</div>'+
            '<span id="container_k_float_day' + sn + '" style="display:none !important;background-color: #000; opacity: 0.7; -moz-border-radius: 0.125rem; -webkit-border-radius: 0.125rem; border-radius: 0.125rem; -moz-box-shadow: 0 0 0.5rem #4c4c4c; -webkit-box-shadow: 0 0 0.5rem #4c4c4c; box-shadow: 0 0 0.5rem #4c4c4c; display: inline-block; font-size: 0.75rem; font-weight: 500; line-height: 1.688rem; height: 3.376rem; padding: 0 0.625rem;position:absolute;top: 85px;left: 3px"> </span><br>'+
            '<span class="chart_note2" >'+
            '<span id="chart_legend_day' + sn + '"></span>'+
            '<span id="chart_note_vol_day' + sn + '"></span>'+
            '</span>'+
            '</div>'+
            '<div class="box_chart01 dis_none " id="item_0_0_1' + sn + '">'+
            '<span class="chart_note" id="chart_legend_c_day_top' + sn + '"  style="display: none"></span>'+
            '<span style="display: inline-block" class="chart_note" id="chart_note_day_c' + sn + '"></span>'+
            '<span style="display: inline-block" class="chart_note" id="chart_note_day_wenhao' + sn + '"></span>'+
            '<span style="display: inline-block" class="chart_note" id="chart_note_day_zsyjx' + sn + '"></span>'+
            '<div id="container_k_c' + sn + '" style="position:relative; height:280px !important;"></div>'+
            '<span id="container_k_float_day' + sn + '" style="display:none !important;background-color: #000; opacity: 0.7; -moz-border-radius: 0.125rem; -webkit-border-radius: 0.125rem; border-radius: 0.125rem; -moz-box-shadow: 0 0 0.5rem #4c4c4c; -webkit-box-shadow: 0 0 0.5rem #4c4c4c; box-shadow: 0 0 0.5rem #4c4c4c; display: inline-block; font-size: 0.75rem; font-weight: 500; line-height: 1.688rem; height: 3.376rem; padding: 0 0.625rem;position:absolute;top: 85px;left: 3px"> </span><br>'+
            '<span class="chart_note2" >'+
            '<span id="chart_legend_day' + sn + '"></span>'+
            '<span style="display: inline-block" id="chart_note_vol_day_c' + sn + '"></span>'+
            '</span>'+
            '</div>'+

            '<h5 class="hd">'+
            '<span>指标分析（日K）</span>'+
            '</h5>'+

            '<ul class="blinds_kdj">'+
            '<li class="on">'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'0\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="macdHuashu_day' + sn + '"></h4>'+
            '<i class="icon-arrow_closed2"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="macd_title' + sn + '"></span>'+
            '<div id="container_macd' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="macd_legend' + sn + '">'+
            //'<strong><b></b>金叉</strong><strong><b></b>死叉</strong><strong><b></b>/<b></b>股价和macd背离</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'MACD指标说明' + '\')">MACD指标说明</h5>'+
            '<h6>1.DIFF与DIEA均为正值，及都在零轴线以上时，大势属多头市场，DIFF向上突破DEA，可作买入信号；</h6>'+
            '<h6>2.DIFF与DEA均为负值，即都在零轴线以下时，大势属空头市场，DIFF向下跌破DEA，可作卖出信号；</h6>'+
            '<h6>3.DEA在盘整局面时失误率较高，但如果配合RSI及KDJ指标可适当弥补缺点。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '<li>'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'1\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="kdHuashu_day' + sn + '"></h4>'+
            '<i class="icon-arrow_open"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="kd_title' + sn + '"></span>'+
            '<div id="container_kd' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="kd_legend' + sn + '">'+
            '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'KD指标说明' + '\')">KD指标说明</h5>'+
            '<h6>1. KD的取值范围都是0～100：80以上为超买区，20以下为超卖区，其余为徘徊区；</h6>'+
            '<h6>2. K上穿D是金叉，为买入信号，结合超卖区（20以下）的位置，越低可能性越大；</h6>'+
            '<h6>3. K下穿D是死叉，为卖出信号，结合超买区（20以下）的位置，越高可能性越大。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '<li>'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'2\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="rsiHuashu_day' + sn + '"></h4>'+
            '<i class="icon-arrow_open"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="rsi_title' + sn + '"></span>'+
            '<div id="container_rsi' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="rsi_legend' + sn + '">'+
            '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'RSI指标说明' + '\')">RSI指标说明</h5>'+
            '<h6>1. 0≤RSI≤100,RSI=50为强势市场与弱势市场分界点。通常设RSI>80为超买区，市势回挡的机会增加；RSI<20为超卖区，市势反弹的机会增加；</h6>'+
            '<h6>2、短期RSI线在低位向上突破长期RSI线，买入信号；</h6>'+
            '<h6>3、短期RSI线在高位向下突破长期RSI线，卖出信号。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '<li>'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'3\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="wrHuashu_day' + sn + '"></h4>'+
            '<i class="icon-arrow_open"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="wr_title' + sn + '"></span>'+
            '<div id="container_wr' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="wr_legend' + sn + '">'+
            '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'WR指标说明' + '\')">WR指标说明</h5>'+
            '<h6>1、指标以50视为股价转强；低于50视为股价转弱；</h6>'+
            '<h6>2、当指标高于20后再度向下跌破20卖出；低于80后再度向上突破80买进；</h6>'+
            '<h6>3、当wr连续触顶3-4次，股价向下反转机率大；连续触底3-4次，股价向上反转机率大。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '<li>'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'4\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="cciHuashu_day' + sn + '"></h4>'+
            '<i class="icon-arrow_open"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="cci_title' + sn + '"></span>'+
            '<div id="container_cci' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="cci_legend' + sn + '">'+
            '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'CCI指标说明' + '\')">CCI指标说明</h5>'+
            '<h6>1. 当CCI曲线向上突破﹢100线而进入非常态区间时，表明股价开始进入强势状态；</h6>'+
            '<h6>2、当CCI曲线在﹢100线以上的非常态区间,在远离﹢100线的地方开始掉头向下时，表明股价的强势状态将难以维持，是股价比较强的转势信号；</h6>'+
            '<h6>3、当CCI曲线向下突破﹣100线而进入另一个非常态区间时，表明股价的弱势状态已经形成，投资者应以持币观望为主；</h6>'+
            '<h6>4、当CCI曲线向下突破﹣100线而进入另一个非常态区间，如果CCI曲线在超卖区运行了相当长的一段时间后开始掉头向上，表明股价的短期底部初步找到。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '</ul>'+
            '</div>'+<!-- 中短期 end-->
            '<div class="item" id="item_0_1' + sn + '">'+<!-- 长期 start-->

            '<div class="box_bgGray" id="week_huashu_jia' + sn + '">'+
            '<div class="hd_gl_white hd_gl_blue">'+
            '<b></b><span>价</span><b></b>'+
            '</div>'+
            '<h5></h5>'+
            '</div>'+
            '<div class="box_bgGray" id="week_huashu_liang' + sn + '">'+
            '<div class="hd_gl_white hd_gl_blue">'+
            '<b></b><span>量</span><b></b>'+
            '</div>'+
            '<h5></h5>'+
            '</div>'+
            '<div class="tab TAB4">'+<!-- 波段决策/操盘线tab  start-->
            '<ul>'+
            '<li class="on" id="tab_li_0_0_2' + sn + '" onclick="analysis_klineInit.changTab(\'6\',\'' + sn + '\',\'' + source + '\')">'+
            '<span>波段决策<b></b></span>'+
            '</li>'+
            '<li id="tab_li_0_0_3' + sn + '" onclick="analysis_klineInit.changTab(\'7\',\'' + sn + '\',\'' + source + '\')">'+
            '<span>操盘线<b></b></span>'+
            '</li>'+
            '</ul>'+
            '<div class="bottom"></div>'+
            '</div>'+<!-- 波段决策/操盘线tab  end-->
            '<div class="box_chart01 dis_none '+isItem0Show+'" id = "item_0_0_2' + sn + '">'+
            '<span class="chart_note" id="chart_legend_week_top' + sn + '"  style="display: none"></span>'+
            '<span class="chart_note" id="chart_note_week' + sn + '"></span>'+
            '<div id="container_k_week' + sn + '" style="position:relative; height:280px !important;"></div>'+
            '<span id="container_k_float_week' + sn + '" style="display:none !important;background-color: #000; opacity: 0.7; -moz-border-radius: 0.125rem; -webkit-border-radius: 0.125rem; border-radius: 0.125rem; -moz-box-shadow: 0 0 0.5rem #4c4c4c; -webkit-box-shadow: 0 0 0.5rem #4c4c4c; box-shadow: 0 0 0.5rem #4c4c4c; display: inline-block; font-size: 0.75rem; font-weight: 500; line-height: 1.688rem; height: 3.376rem; padding: 0 0.625rem;position:absolute;top: 85px;left: 50px"> </span><br>'+
            '<span class="chart_note2">'+
            '<span id="chart_legend_week' + sn + '"></span>'+
            '<span id="chart_note_vol_week' + sn + '"></span>'+
            '</span>'+
            '</div>'+
            '<div class="box_chart01 dis_none"  id="item_0_0_3' + sn + '" >'+
            '<span class="chart_note" id="chart_legend_c_week_top' + sn + '"  style="display: none"></span>'+
            '<span style="display: inline-block" class="chart_note" id="chart_note_week_c' + sn + '"></span>'+
            '<span style="display: inline-block" class="chart_note" id="chart_note_week_wenhao' + sn + '"></span>'+
            '<span style="display: inline-block" class="chart_note" id="chart_note_week_zsyjx' + sn + '"></span>'+
            '<div id="container_k_week_c' + sn + '" style="position:relative; height:280px !important;"></div>'+
            '<span id="container_k_float_week' + sn + '" style="display:none !important;background-color: #000; opacity: 0.7; -moz-border-radius: 0.125rem; -webkit-border-radius: 0.125rem; border-radius: 0.125rem; -moz-box-shadow: 0 0 0.5rem #4c4c4c; -webkit-box-shadow: 0 0 0.5rem #4c4c4c; box-shadow: 0 0 0.5rem #4c4c4c; display: inline-block; font-size: 0.75rem; font-weight: 500; line-height: 1.688rem; height: 3.376rem; padding: 0 0.625rem;position:absolute;top: 85px;left: 50px"> </span><br>'+
            '<span class="chart_note2">'+
            '<span id="chart_legend_day' + sn + '"></span>'+
            '<span id="chart_note_vol_week_c' + sn + '"></span>'+
            '</span>'+
            '</div>'+
            '<h5 class="hd">'+
            '<span>指标分析（周K）</span>'+
            '</h5>'+

            '<ul class="blinds_kdj">'+
            '<li class="on">'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'0\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="macdHuashu_week' + sn + '"></h4>'+
            '<i class="icon-arrow_closed2"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="macd_title_week' + sn + '"></span>'+
            '<div id="container_macd_week' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="macd_legend_week' + sn + '">'+
            //'<strong><b></b>金叉</strong><strong><b></b>死叉</strong><strong><b></b>/<b></b>股价和macd背离</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'MACD指标说明' + '\')">MACD指标说明</h5>'+
            '<h6>1.DIFF与DIEA均为正值，及都在零轴线以上时，大势属多头市场，DIFF向上突破DEA，可作买入信号；</h6>'+
            '<h6>2.DIFF与DEA均为负值，即都在零轴线以下时，大势属空头市场，DIFF向下跌破DEA，可作卖出信号；</h6>'+
            '<h6>3.DEA在盘整局面时失误率较高，但如果配合RSI及KDJ指标可适当弥补缺点。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '<li>'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'1\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="kdHuashu_week' + sn + '"></h4>'+
            '<i class="icon-arrow_open"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="kd_title_week' + sn + '"></span>'+
            '<div id="container_kd_week' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="kd_legend_week' + sn + '">'+
            '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'KD指标说明' + '\')">KD指标说明</h5>'+
            '<h6>1. KD的取值范围都是0～100：80以上为超买区，20以下为超卖区，其余为徘徊区；</h6>'+
            '<h6>2. K上穿D是金叉，为买入信号，结合超卖区（20以下）的位置，越低可能性越大；</h6>'+
            '<h6>3. K下穿D是死叉，为卖出信号，结合超买区（20以下）的位置，越高可能性越大。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '<li>'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'2\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="rsiHuashu_week' + sn + '"></h4>'+
            '<i class="icon-arrow_open"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="rsi_title_week' + sn + '"></span>'+
            '<div id="container_rsi_week' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="rsi_legend_week' + sn + '">'+
            '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'RSI指标说明' + '\')">RSI指标说明</h5>'+
            '<h6>1. 0≤RSI≤100,RSI=50为强势市场与弱势市场分界点。通常设RSI>80为超买区，市势回挡的机会增加；RSI<20为超卖区，市势反弹的机会增加；</h6>'+
            '<h6>2、短期RSI线在低位向上突破长期RSI线，买入信号；</h6>'+
            '<h6>3、短期RSI线在高位向下突破长期RSI线，卖出信号。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '<li>'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'3\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="wrHuashu_week' + sn + '"></h4>'+
            '<i class="icon-arrow_open"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="wr_title_week' + sn + '"></span>'+
            '<div id="container_wr_week' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="wr_legend_week' + sn + '">'+
            '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'WR指标说明' + '\')">WR指标说明</h5>'+
            '<h6>1、指标以50视为股价转强；低于50视为股价转弱；</h6>'+
            '<h6>2、当指标高于20后再度向下跌破20卖出；低于80后再度向上突破80买进；</h6>'+
            '<h6>3、当wr连续触顶3-4次，股价向下反转机率大；连续触底3-4次，股价向上反转机率大。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '<li>'+
            '<div class="title" id="opentitle' + sn + '" onclick="analysis_kline.openTitle(this,\'3\',\'' + sn + '\',\'' + source + '\',\'robot_e\')">'+
            '<h4 id="cciHuashu_week' + sn + '"></h4>'+
            '<i class="icon-arrow_open"></i>'+
            '</div>'+
            '<div class="box">'+
            '<span class="chart_note" id="cci_title_week' + sn + '"></span>'+
            '<div id="container_cci_week' + sn + '" style="height: 150px;"></div>' +
            '<span class="chart_note3" id="cci_legend_week' + sn + '">'+
            '<strong><b></b>金叉</strong><strong><b></b>死叉</strong>'+
            '</span>'+
            '<div class="box_explain">'+
            '<h5 style="color: #5b79e9;" onclick="freeQuestion(\'' + 'CCI指标说明' + '\')">CCI指标说明</h5>'+
            '<h6>1. 当CCI曲线向上突破﹢100线而进入非常态区间时，表明股价开始进入强势状态；</h6>'+
            '<h6>2、当CCI曲线在﹢100线以上的非常态区间,在远离﹢100线的地方开始掉头向下时，表明股价的强势状态将难以维持，是股价比较强的转势信号；</h6>'+
            '<h6>3、当CCI曲线向下突破﹣100线而进入另一个非常态区间时，表明股价的弱势状态已经形成，投资者应以持币观望为主；</h6>'+
            '<h6>4、当CCI曲线向下突破﹣100线而进入另一个非常态区间，如果CCI曲线在超卖区运行了相当长的一段时间后开始掉头向上，表明股价的短期底部初步找到。</h6>'+
            '</div>'+
            '</div>'+
            '</li>'+
            '</ul>'+
            '</div>'+<!-- 长期 end-->


            '</div>'+

            '<h5 class="hd">'+<!--形态信号   start-->
            '<span>选股策略</span>'+
            '</h5>'+
            '<ul class="tlBox_link">'+
            '<li onclick="analysis_kline.getFix(\'近3日均线多头排列的个股\',\'' + sn + '\',\'' + source + '\',\'' + isPopup + '\',\'robot_e\')">近3日均线多头排列的个股</li>'+
            '<li onclick="analysis_kline.getFix(\'近3日macd底背离的个股\',\'' + sn + '\',\'' + source + '\',\'' + isPopup + '\',\'robot_e\')">近3日macd底背离的个股</li>'+
            '<li onclick="analysis_kline.getFix(\'近3日macd金叉的个股有哪些\',\'' + sn + '\',\'' + source + '\',\'' + isPopup + '\',\'robot_e\')">近3日macd金叉的个股有哪些</li>'+
            '<li onclick="analysis_kline.getFix(\'近3日kdj超卖，kdj金叉的股票\',\'' + sn + '\',\'' + source + '\',\'' + isPopup + '\',\'robot_e\')">近3日kdj超卖，kdj金叉的股票</li>'+
            '<li onclick="analysis_kline.getFix(\'近3日rsi超卖，rsi金叉的股票\',\'' + sn + '\',\'' + source + '\',\'' + isPopup + '\',\'robot_e\')">近3日rsi超卖，rsi金叉的股票</li>'+
            '</ul>'+
            '</div>'+<!-- 趋势分析 item  end-->




            '<div class="item '+isItem1Show+'" id="item_1' + sn + '" '+item1Class+'>'+<!--区域分析   start-->
            '<div class="bd">'+<!--形态信号    start-->
            '<div class="sumUp_InsRating" id="resReport' + sn + '">'+
            '</div>'+
            '</div>'+<!--形态信号    end-->



            '<div style="display:none">'+
            '<div class="box_bRed box_bRed01" id="legend' + sn + '"><li>操作建议：由<b>【买入】</b>转为<b>【卖出】</b></li></div>' +
            '<div id="report' + sn + '" class="box_stoDay t_red"></div>' +
            '<div class="box_chart01">' +//chart_box
            '<div class="box" style="position:relative; height:320px !important;">' +//box
            '<div id="MACD' + sn + '" style=" width:100%; font-size:0.875em; height:1.333em; position:absolute; z-index:101; left:0; top:180px;"></div>' +
            '<div style="height:100%;">' +//div
            '<div id="container' + sn + '" class="box_chart01" style="height: 300px; position:absolute; z-index:100;"></div>' +
            '</div>' +//div
            '</div>' +//box
            '</div>' +//chart_box
            '<h5 id="explain_9area' + sn + '"></h5>'+
            '<div class="box_timeLine">' +//<!-- 时间轴 -->
            '<a class="openList_xdy' + sn + '" onclick="kline_9area.openList(\'' + sn + '\',\'' + source + '\')">历史建议<i class="icon-arrow_shape_down"></i></a>' +
            '<div class="timeLine" id="timeLine' + sn + '"></div>' +
            '</div>'+
            '</div>'+
            '</div>'+<!--区域分析   end-->


            '</div>'+<!-- content end -->
            '</div>';<!-- box_analysis_1_2    end -->
        return temp;
    },

    /**
     * 初始化调用接口
     * @param symbol
     * @param sn
     * @param from  fromAPP fromPDF 智能小E（appEzt、appZscf、appJftg、''）
     * @param chartTabIndex
     * @param type  谓语分类
     * @param isPopup 技术分析是否为弹框
     * @returns {string}
     */
    init:function(symbol,sn,from,chartTabIndex,type,isPopup,url) {
        symbol = symbol==null ? 'sh600600' : symbol;//sh603903
        var str_qz = symbol.toString().substr(0,2);
        var str_symbol = symbol.toString().substr(2,6);
        if(str_symbol){
            if(from != 'fromAPP'){
                //标头
                analysis_klineInit.getPrice(symbol,function (result) {
                    analysis_klineInit.getBaseInfo(result,sn,str_qz,str_symbol,sn,isPopup,url);
                });
            }


            analysis_klineInit.getSignal(symbol,sn);

            if(from !== 'fromAPP'){
                kline_9area.init(symbol,sn,from);
            }
        }
    },

    /**
     * 趋势分析与区域分析的tab 切换  index=0  index=1
     * 中短期、长期tab切换  index=2  index=3
     * @param index
     * @param sn
     * @param source
     */
    changTab:function (index,sn,source){
        if(index == 0){
            $('#tab_li_0'+sn).removeClass("on").addClass("on");
            $('#tab_li_1'+sn).removeClass("on");
            $('#item_0'+sn).removeClass("show").addClass("show");
            $('#item_1'+sn).removeClass("show");
            $('#item_0'+sn).show();
            $('#item_1'+sn).hide();
            baiduTrackEvent('趋势分析','click',source);
        }
        if(index == 1){
            $('#tab_li_0'+sn).removeClass("on");
            $('#tab_li_1'+sn).removeClass("on").addClass("on");
            $('#item_0'+sn).removeClass("show");
            $('#item_1'+sn).removeClass("show").addClass("show");
            $('#item_0'+sn).hide();
            $('#item_1'+sn).show();
            //baiduTrackEvent('区域分析','click',source);
            baiduTrackEvent('形态信号','click',source);
        }

        if(index == 2){
            $('#tab_li_0_0'+sn).removeClass("on").addClass("on");
            $('#tab_li_0_1'+sn).removeClass("on");
            $('#item_0_0'+sn).removeClass("show").addClass("show");
            $('#item_0_1'+sn).removeClass("show");
            $('#item_0_0'+sn).show();
            $('#item_0_1'+sn).hide();
            baiduTrackEvent('中短期','click',source);
        }
        if(index == 3){
            $('#tab_li_0_0'+sn).removeClass("on");
            $('#tab_li_0_1'+sn).removeClass("on").addClass("on");
            $('#item_0_0'+sn).removeClass("show");
            $('#item_0_1'+sn).removeClass("show").addClass("show");
            $('#item_0_0'+sn).hide();
            $('#item_0_1'+sn).show();
            baiduTrackEvent('长期','click',source);
        }
        if(index == 4){
            $('#tab_li_0_0_0'+sn).removeClass("on").addClass("on");
            $('#tab_li_0_0_1'+sn).removeClass("on");
            $('#item_0_0_0'+sn).removeClass("show").addClass("show");
            $('#item_0_0_1'+sn).removeClass("show");
            $('#item_0_0_0'+sn).show();
            $('#item_0_0_1'+sn).hide();
            baiduTrackEvent('波段决策','click',source);
        }
        if(index == 5){
            $('#tab_li_0_0_0'+sn).removeClass("on");
            $('#tab_li_0_0_1'+sn).removeClass("on").addClass("on");
            $('#item_0_0_0'+sn).removeClass("show");
            $('#item_0_0_1'+sn).removeClass("show").addClass("show");
            $('#item_0_0_0'+sn).hide();
            $('#item_0_0_1'+sn).show();
            baiduTrackEvent('操盘线','click',source);
        }
        if(index == 6){
            $('#tab_li_0_0_2'+sn).removeClass("on").addClass("on");
            $('#tab_li_0_0_3'+sn).removeClass("on");
            $('#item_0_0_2'+sn).removeClass("show").addClass("show");
            $('#item_0_0_3'+sn).removeClass("show");
            $('#item_0_0_2'+sn).show();
            $('#item_0_0_3'+sn).hide();
            baiduTrackEvent('波段决策','click',source);
        }
        if(index == 7){
            $('#tab_li_0_0_2'+sn).removeClass("on");
            $('#tab_li_0_0_3'+sn).removeClass("on").addClass("on");
            $('#item_0_0_2'+sn).removeClass("show");
            $('#item_0_0_3'+sn).removeClass("show").addClass("show");
            $('#item_0_0_2'+sn).hide();
            $('#item_0_0_3'+sn).show();
            baiduTrackEvent('操盘线','click',source);
        }
    },
    //原生 问小E
    askE:function (symbol,source) {

        baiduTrackEvent('个股详情页','click',source);
    },

    /**
     * 取股票报价
     * @param symbol
     * @param success
     * @param error
     */
    getPrice:function(symbol, success, error){
        $.ajax({
            type: "get",
            url: "/hangqing-service/json/getPrice",
            data: {
                symbol: symbol,
                userId: ''
            },
            dataType: "jsonp",
            jsonp: "callback",
            success: success,
            error: error
        });
    },
    //形态信号列表
    getSignal:function(symbol,sn){
        $.ajax({
            type: "get",
            url: analysis_klineInit.HttpUrl + "semantic-api-service/semantic/content/search",
            // url: "/riskNotices/semantic/content/search",
            //url: "http://semantic-api-service:31001/semantic/content/search",
            data: {
                entityTypes:'股票',
                entities:symbol,
                dimensions:'个股技术分析/相似形态',
                timeField:'publishAt',
                startAt:0,
                endAt:new Date().getTime(),
                maxRanking:3,
                minEntityScore:200,
                cp:1,
                ps:10

            },
            dataType: 'json',
            callback:'',
            success: function(rs)
            {
                if(rs){
                    console.log(sn);
                    var temp = '';
                    var list = rs.data.list || [];
                    for(var i = 0;i<list.length;i++){
                        var item = list[i];
                        console.log(item);
                        temp += '<ul class="resReport" >'+
                            '<li class="box_show">'+
                            '<div class="hd2">'+
                            '<div>'+item.signalType+'</div>'+
                            '<div>'+timeUtil.getTimeStr_more0(item.publishAt)+'</div>'+
                            '</div>'+
                            '<h5 class="show_row5 show_all">'+item.messageDisp+'</h5>'+
                            '</li>'+
                            '</ul>';

                    }
                    if(list.length ==0){
                        temp = '<ul style="text-align: center;color:#666666;height: 80px;padding-top: 40px;font-size: 13px"  >近一个月暂无信号数据<ul/>'
                    }
                    $('#resReport'+sn).html(temp);
                }
            },
            error: function()
            {
                //console.log("error");
            }
        });
    },

    //技术分析基本信息
    getBaseInfo: function (result,sn,str_qz,str_symbol,sn,isPopup,url){
        /**
         * 股票名称 代码
         */
        var newPrice = '--',
            zf = 0,
            stockName = '--',
            stockCode = '--',
            tradeAt = '--',
            zd = 0;

        stockName = result.stkName;
        stockCode = result.stkCode;
        newPrice = result.newPrice.toFixed(2);
        zd = result.change;
        zd = zd.toFixed(2);
        zf = result.rise.toFixed(2);//涨幅

        if(zf > 0){
            zf = '+'+zf;
            $('#val'+sn).removeClass("t_red").removeClass("t_green").addClass("t_red");
        }else if(zf < 0){
            $('#val'+sn).removeClass("t_red").removeClass("t_green").addClass("t_green");
        }else{
            $('#val'+sn).removeClass("t_red").removeClass("t_green");
        }
        var tradeAt = timeUtil.getTimeStr_more0(result.time*1000);
        $('#title'+sn).html('<h4>'+stockName+'<span class="num">'+stockCode+'</span></h4><h6>'+tradeAt+'</h6>');
        $('#val'+sn).html('<h3>'+newPrice+'</h3><h6>'+zd+'　'+zf+'%</h6>');


        //中短期日K线数据
        analysis_klineInit.getKLineData(str_qz,str_symbol,sn,isPopup,'day',newPrice,url);
    },

    //接口合并后拿到数据
    getKLineData: function (val, symbol, sn, isPopup, type, lastPrice,url) {
        if(url){
            analysis_kline.TechnichalAnalysis = '/robot/semantic/TechnichalAnalysis/';
        }
        var url_new = analysis_kline.TechnichalAnalysis+"/technichal/analysis/"+val+"/"+symbol;

        jQuery.ajax(
            {
                url: url_new,
                type: 'get',
                async: null,
                data: null,
                dataType: 'json',
                callback:'',
                success: function(rs)
                {
                    if(rs){
                        analysis_klineInit.creatKineDataChart(val,symbol,sn,isPopup,'day',lastPrice,rs);
                        //长期数据
                        setTimeout(function () {
                            //长期周K线数据
                            analysis_klineInit.creatKineDataChart(val,symbol,sn,isPopup,'week',lastPrice,rs);
                        }, 500);
                    }
                },
                error: function()
                {
                    //console.log("error");
                }
            });
    },

    creatKineDataChart:function(val,symbol,sn,isPopup,type,lastPrice,rs){
        if(type=='day'){
            //有数据  用兆军接口 data.detail.EQUSHI.signals
            if(rs.data.detail.DAY_EQUSHI.signals.length>0){
                /**
                 * K线数据组
                 */
                    //var stockList = rs.signals.slice(rs.signals.length-132,rs.signals.length);
                var stockList = rs.data.detail.DAY_EQUSHI.signals;
                var ohlc = [],//蜡烛图数据
                    column = [],//柱形图数据

                    peak = [],//波峰数据
                    trough = [],//波谷数据

                    up = [],//上升趋势 红色
                    down = [],//下降趋势 绿色

                    ma5 = [],ma10 = [],ma20 = [],ma60 = [],//K线均线

                    vma5 = [],vma10=[],//成交量均线

                    macdblding = [],//股价顶背离
                    macdbldi=[],//股价底背离
                    bdmd=[],//股价波段买点（短线决策）
                    zsyhong=[],
                    zsylv=[],
                    zsylv_total=[],
                    zsyjx=[],//自适应均线（操盘线）
                    zsyhong2lv=[],//自适应均线（操盘线）
                    zsylv2hong=[];//自适应均线（操盘线）

                var peakList = rs.data.detail.DAY_EQUSHI.peak;
                var troughList = rs.data.detail.DAY_EQUSHI.trough;

                var nextPrice = stockList[stockList.length-2].c;//上一交易日的收盘价


                //获取支撑线与压力线
                //等于当前价取上一交易日的收盘价为基准来做判断
                var arr = analysis_kline.getUpDown(stockList,peakList,troughList,lastPrice,nextPrice);
                //低于当前价位是支撑线（红色），高于当前价位的线是压力线（绿色）
                //两个点都是高于当前价位的，只给最近的一条
                if(arr.length > 0){
                    if(arr.length == 1){
                        if(arr[0].price0 == "+"){
                            up.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                        }else if(arr[0].price0 == "-"){
                            down.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                        }

                    }else if(arr.length >= 2){
                        if(arr[0].price0 == '+' && arr[1].price0 == '+'){
                            up.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                            up.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[0].price)
                            ]);
                        }else if(arr[0].price0 == '-' && arr[1].price0 == '-'){
                            down.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                            down.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[0].price)
                            ]);
                        }else if(arr[0].price0 == '+' &&  arr[1].price0 == '-'){
                            up.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                            down.push([
                                timeUtil.dataFormatter(arr[1].dt),//0
                                Number(arr[1].price)
                            ]);
                            up.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[0].price)
                            ]);
                            down.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[1].price)
                            ]);
                        }else if(arr[0].price0 == '-' &&  arr[1].price0 == '+'){
                            down.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                            up.push([
                                timeUtil.dataFormatter(arr[1].dt),//0
                                Number(arr[1].price)
                            ]);
                            up.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[1].price)
                            ]);
                            down.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[0].price)
                            ]);
                        }
                    }
                }

                if(peakList.length>0){
                    //波峰
                    if(peakList.length == 2){
                        var len = peakList.length;
                        if(Number(peakList[1].dt) >= Number(stockList[0].dt)){
                            for(var j = 0;j<len;j++){
                                peak.push([
                                    timeUtil.dataFormatter(peakList[j].dt),//0
                                    Number(peakList[j].price)
                                ]);

                            }
                        }
                    }
                }
                if(troughList.length>0){
                    //波谷
                    if(troughList.length == 2){
                        var len = troughList.length;
                        if(Number(troughList[1].dt) >= Number(stockList[0].dt)){
                            for(var j = 0;j<len;j++){
                                trough.push([
                                    timeUtil.dataFormatter(troughList[j].dt),
                                    Number(troughList[j].price)
                                ]);
                            }
                        }
                    }
                }


                if(stockList.length>0){
                    var len = stockList.length;
                    // var zsylv_total = [];
                    var num_nor='';
                    for(var j = 0;j<len;j++){
                        ohlc.push([
                            timeUtil.dataFormatter(stockList[j].dt),//0
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
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].v)
                        ]);
                        ma5.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].ma.ma5)
                        ]);
                        ma10.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].ma.ma10)
                        ]);
                        ma20.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].ma.ma20)
                        ]);
                        ma60.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].ma.ma60)
                        ]);
                        vma5.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].vma5)
                        ]);
                        vma10.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].vma10)
                        ]);
                        zsyjx.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            stockList[j].zsyjx.zsyjx
                        ]);
                        if(stockList[j].zsyjx.zsylv != num_nor){
                            zsylv_total.push([]);
                        }
                        zsylv_total[zsylv_total.length-1].push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].zsyjx.zsyjx),
                            Number(stockList[j].zsyjx.zsyhong2lv),
                            Number(stockList[j].zsyjx.zsylv2hong),
                            Number(stockList[j].zsyjx.zsyhong),
                            Number(stockList[j].zsyjx.zsylv)
                        ]);
                        num_nor = stockList[j].zsyjx.zsylv;
                        if(stockList[j].macdblding == 1){
                            macdblding.push([
                                timeUtil.dataFormatter(stockList[j].dt),
                                Number(stockList[j].h)
                            ]);
                        }
                        if(stockList[j].macdbldi == 1){
                            macdbldi.push([
                                timeUtil.dataFormatter(stockList[j].dt),
                                Number(stockList[j].l)
                            ]);
                        }
                        //波段买点在下跌趋势下的情况屏蔽，只展示在上升和震荡趋势下的情况
                        if(stockList[j].up === "1" || stockList[j].mid === "1"){
                            // debugger
                            if(stockList[j].bdmd == 1){
                                bdmd.push([
                                    timeUtil.dataFormatter(stockList[j].dt),
                                    Number(stockList[j].l)
                                ]);
                            }
                        }
                    }
                }else{
                    console.log("未返回K线数据");
                }

                peak = peak.reverse();
                trough = trough.reverse();

                //获取K线图表的图例
                var chart_legend_txt = '',chart_note_day_wenhao = '';
                if(peak.length>0 || trough.length>0 || up.length>0 || down.length > 0 ){
                    chart_legend_txt += '<strong class="s1"><em class="t_red">-</em>/<em class="t_green">-</em>支撑压力</strong>';
                }
                if(macdblding.length>0 || macdbldi.length>0 ){
                    chart_legend_txt += '<strong class="s2"><b></b>/<b></b>股价macd背离</strong>';
                }
                if(isPopup){
                    chart_note_day_wenhao += '<a style="color: #333;margin-left: 16px;"></a>';
                    if(bdmd.length>0){
                        chart_legend_txt += '<strong class="s3"><b></b>决策点</strong>';
                    }
                }else{
                    chart_note_day_wenhao += '<a onclick="analysis_kline.openPop_expma()" style="color: #333;margin-left: .5rem;"><i class="icon-help2" style="margin-left: .25rem;color: #a1a2a8"></i></a>';
                    if(bdmd.length>0){
                        chart_legend_txt += '<strong class="s3" onclick="analysis_kline.openPop_juece()"><b></b>决策点<a><i class="icon-help2"></i></a></strong>';
                    }
                }

                if(type == 'day'){
                    //获取K线图表的图例
                    $('#chart_legend_day'+sn).html(chart_legend_txt);
                    $('#chart_note_day_wenhao'+sn).html(chart_note_day_wenhao);
                    //获取K线图表的标题
                    analysis_kline.getKDayTitle('day',sn,ma5[ma5.length-1][1],ma10[ma10.length-1][1],ma20[ma20.length-1][1],ma60[ma60.length-1][1],zsyjx[zsyjx.length-1][1]);

                    //获取K线图表--成交量的标题
                    analysis_kline.getKDayVolTitle('day',sn,analysis_kline.formatNumber(column[column.length-1][1]/100,2),analysis_kline.formatNumber(vma5[vma5.length-1][1]/100,2),analysis_kline.formatNumber(vma10[vma10.length-1][1]/100,2));

                    analysis_kline.createKLineChart ('container_k'+sn,ohlc,column,ma5,ma10,ma20,ma60,sn,'日K',peak,trough,up,down,vma5,vma10,macdblding,macdbldi,bdmd,zsylv_total);

                    //操盘线图表
                    analysis_kline.createKLineChart_c ('container_k_c'+sn,ohlc,column,ma5,ma10,ma20,ma60,sn,'日K',peak,trough,up,down,vma5,vma10,macdblding,macdbldi,bdmd,zsylv_total);

                    analysis_kline.getKCTitle(type,sn,timeUtil.getTimeStr3(zsylv_total[zsylv_total.length-1][0][0]),zsylv_total[zsylv_total.length-1][0][2],zsylv_total[zsylv_total.length-1][0][3]);

                }
            }
            else{
                console.log("未返回技术分析数据");
            }
            if(rs.data.detail.DAY_TXTQUSHI.memo.length>0){
                var txt = '<div class="hd_gl_white hd_gl_blue">'+
                    '<b></b><span>价</span><b></b>'+
                    '</div>'+
                    '<h5>'+rs.data.detail.DAY_TXTQUSHI.memo+'</h5>';
                if(type == 'day'){
                    $('#day_huashu_jia'+sn).html(txt);
                }else if(type == 'week'){
                    $('#week_huashu_jia'+sn).html(txt);
                }
                // 播放语音
                playVoiceAnswerLite(rs.data.detail.DAY_TXTQUSHI.memo)
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
            if(rs.data.detail.DAY_TXTQUSHIVOL.memo.length>0){
                var txt = '<div class="hd_gl_white hd_gl_blue">'+
                    '<b></b><span>量</span><b></b>'+
                    '</div>'+
                    '<h5>'+rs.data.detail.DAY_TXTQUSHIVOL.memo+'</h5>';
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

            //MACD KD RSI 话术
            // MACD 话术
            if(rs.data.detail.DAY_TXTMACD.memo.length>0){
                if(type == 'day'){
                    $('#macdHuashu_day'+sn).html(rs.data.detail.DAY_TXTMACD.memo);
                }else if(type == 'week'){
                    $('#macdHuashu_week'+sn).html(rs.memo);
                }
            }else{
                if(type == 'day'){
                    $('#macdHuashu_day'+sn).html("MACD指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#macdHuashu_week'+sn).html("MACD指标暂无明显信号。");
                }
            }
            // KD 话术
            if(rs.data.detail.DAY_TXTKD.memo.length>0){
                if(type == 'day'){
                    $('#kdHuashu_day'+sn).html(rs.data.detail.DAY_TXTKD.memo);
                }else if(type == 'week'){
                    $('#kdHuashu_week'+sn).html(rs.memo);
                }
            }else{
                if(type == 'day'){
                    $('#kdHuashu_day'+sn).html("KD指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#kdHuashu_week'+sn).html("KD指标暂无明显信号。");
                }
            }
            // RSI 话术
            if(rs.data.detail.DAY_TXTRSI.memo.length>0){
                if(type == 'day'){
                    $('#rsiHuashu_day'+sn).html(rs.data.detail.DAY_TXTRSI.memo);
                }else if(type == 'week'){
                    $('#rsiHuashu_week'+sn).html(rs.memo);
                }
            }else{
                if(type == 'day'){
                    $('#rsiHuashu_day'+sn).html("RSI指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#rsiHuashu_week'+sn).html("RSI指标暂无明显信号。");
                }
            }
            // wr 话术
            if(rs.data.detail.DAY_TXTWR.memo.length>0){
                if(type == 'day'){
                    $('#wrHuashu_day'+sn).html(rs.data.detail.DAY_TXTWR.memo);
                }else if(type == 'week'){
                    $('#wrHuashu_week'+sn).html(rs.memo);
                }
            }else{
                if(type == 'day'){
                    $('#wrHuashu_day'+sn).html("WR指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#wrHuashu_week'+sn).html("WR指标暂无明显信号。");
                }
            }
            // cci 话术
            if(rs.data.detail.DAY_TXTCCI.memo.length>0){
                if(type == 'day'){
                    $('#cciHuashu_day'+sn).html(rs.data.detail.DAY_TXTCCI.memo);
                }else if(type == 'week'){
                    $('#cciHuashu_week'+sn).html(rs.memo);
                }
            }else{
                if(type == 'day'){
                    $('#cciHuashu_day'+sn).html("CCI指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#cciHuashu_week'+sn).html("CCI指标暂无明显信号。");
                }
            }
            // MACD Kd  RSI 三个图标
            // MACD有数据  用兆军接口 data.detail.EMACD.signals
            if(rs.data.detail.DAY_EMACD.signals.length>0){
                var macdList = rs.data.detail.DAY_EMACD.signals;
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
                        timeUtil.dataFormatter(macdList[k].dt),
                        Number(macdList[k].diff)
                    ]);
                    deaData.push([
                        timeUtil.dataFormatter(macdList[k].dt),
                        Number(macdList[k].dea),
                        Number(macdList[k].macd),
                        Number(macdList[k].diff),
                        Number(macdList[k].b),
                        Number(macdList[k].s),
                        Number(macdList[k].blding),
                        Number(macdList[k].bldi)
                    ]);
                    macdData.push([
                        timeUtil.dataFormatter(macdList[k].dt),
                        Number(macdList[k].macd)
                    ]);
                    if(macdList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(macdList[k].dt),
                            Number(macdList[k].b),
                            Number(macdList[k].macd),
                            Number(macdList[k].diff),
                            Number(macdList[k].dea)
                        ]);
                    }
                    if(macdList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(macdList[k].dt),
                            Number(macdList[k].s),
                            Number(macdList[k].macd),
                            Number(macdList[k].diff),
                            Number(macdList[k].dea)
                        ]);
                    }
                    if(macdList[k].blding == 1){
                        bldingData.push([
                            timeUtil.dataFormatter(macdList[k].dt),
                            Number(macdList[k].blding),
                            Number(macdList[k].macd),
                            Number(macdList[k].diff),
                            Number(macdList[k].dea)
                        ]);
                    }
                    if(macdList[k].bldi == 1){
                        bldiData.push([
                            timeUtil.dataFormatter(macdList[k].dt),
                            Number(macdList[k].bldi),
                            Number(macdList[k].macd),
                            Number(macdList[k].diff),
                            Number(macdList[k].dea)
                        ]);
                    }
                }

                if(type == 'day'){
                    //MACD图表标题
                    analysis_kline.getMacdTitle(type,sn,Number(difData[difData.length-1][1]).toFixed(2),Number(deaData[deaData.length-1][1]).toFixed(2),Number(macdData[macdData.length-1][1]).toFixed(2),timeUtil.getTimeStr(difData[difData.length-1][0]));

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
                    analysis_kline.getMacdTitle(type,sn,Number(difData[difData.length-1][1]).toFixed(2),Number(deaData[deaData.length-1][1]).toFixed(2),Number(macdData[macdData.length-1][1]).toFixed(2),timeUtil.getTimeStr(difData[difData.length-1][0]));

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
            //Kd有数据  用兆军接口
            if(rs.data.detail.DAY_EKD.signals.length>0){
                var kdList = rs.data.detail.DAY_EKD.signals;
                var kData = [];//k数据
                var dData = [];//d数据
                var _buyData = [];//买入数据
                var _sellData = [];//卖出数据
                var buyData = [];//买入数据
                var sellData = [];//卖出数据
                for(var k = 0;k<kdList.length;k++){
                    //for(var k = kdList.length-100;k<kdList.length;k++){
                    kData.push([
                        timeUtil.dataFormatter(kdList[k].dt),//0
                        Number(kdList[k].k),//1
                        Number(kdList[k].k),//2
                        Number(kdList[k].k),//3
                        Number(kdList[k].b),//4
                        Number(kdList[k].s),//5
                        Number(kdList[k].blding),//6
                        Number(kdList[k].bldi)//7
                    ]);
                    dData.push([
                        timeUtil.dataFormatter(kdList[k].dt),
                        Number(kdList[k].d)
                    ]);
                    if(kdList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(kdList[k].dt),
                            Number(kdList[k].b),
                            Number(kdList[k].k),
                            Number(kdList[k].d)
                        ]);
                    }
                    if(kdList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(kdList[k].dt),
                            Number(kdList[k].s),
                            Number(kdList[k].k),
                            Number(kdList[k].d)
                        ]);
                    }
                }


                if(type == 'day'){
                    //KD图表标题
                    analysis_kline.getKdTitle(type,sn,Number(kData[kData.length-1][1]).toFixed(2),Number(dData[dData.length-1][1]).toFixed(2),timeUtil.getTimeStr(kData[kData.length-1][0]));

                    //创建KD图表
                    analysis_kline.createMACDChart('container_kd'+sn,[],kData,dData,_buyData,_sellData,sn);
                }else if(type == 'week'){
                    //KD图表标题
                    analysis_kline.getKdTitle(type,sn,Number(kData[kData.length-1][1]).toFixed(2),Number(dData[dData.length-1][1]).toFixed(2),timeUtil.getTimeStr(kData[kData.length-1][0]));

                    //创建KD图表
                    analysis_kline.createMACDChart('container_kd_week'+sn,[],kData,dData,_buyData,_sellData,sn);
                }

            }
            else{
                console.log("未返回Kd数据");
            }
            //RSI有数据  用兆军接口
            if(rs.data.detail.DAY_ERSI.signals.length>0){
                var rsiList = rs.data.detail.DAY_ERSI.signals;
                var rsi6Data = [];//k数据
                var rsi12Data = [];//d数据
                var _buyData = [];//买入数据
                var _sellData = [];//卖出数据
                for(var k = 0;k<rsiList.length;k++){
                    //for(var k = rsiList.length-100;k<rsiList.length;k++){
                    rsi6Data.push([
                        timeUtil.dataFormatter(rsiList[k].dt),//0
                        Number(rsiList[k].rsi6),//1
                        Number(rsiList[k].rsi6),//2
                        Number(rsiList[k].rsi6),//3
                        Number(rsiList[k].b),//4
                        Number(rsiList[k].s),//5
                        Number(rsiList[k].blding),//6
                        Number(rsiList[k].bldi)//7
                    ]);
                    rsi12Data.push([
                        timeUtil.dataFormatter(rsiList[k].dt),
                        Number(rsiList[k].rsi12)
                    ]);
                    if(rsiList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(rsiList[k].dt),
                            Number(rsiList[k].b),
                            Number(rsiList[k].rsi6),
                            Number(rsiList[k].rsi12)
                        ]);
                    }
                    if(rsiList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(rsiList[k].dt),
                            Number(rsiList[k].s),
                            Number(rsiList[k].rsi6),
                            Number(rsiList[k].rsi12)
                        ]);
                    }
                }

                if(type == 'day'){
                    //RSI图表标题
                    analysis_kline.getRsiTitle(type,sn,Number(rsi6Data[rsi6Data.length-1][1]).toFixed(2),Number(rsi12Data[rsi12Data.length-1][1]).toFixed(2),timeUtil.getTimeStr(rsi6Data[rsi6Data.length-1][0]));

                    //创建RSI图表
                    analysis_kline.createMACDChart('container_rsi'+sn,[],rsi6Data,rsi12Data,_buyData,_sellData,sn);
                }else if(type == 'week'){
                    //RSI图表标题
                    analysis_kline.getRsiTitle(type,sn,Number(rsi6Data[rsi6Data.length-1][1]).toFixed(2),Number(rsi12Data[rsi12Data.length-1][1]).toFixed(2),timeUtil.getTimeStr(rsi6Data[rsi6Data.length-1][0]));

                    //创建RSI图表
                    analysis_kline.createMACDChart('container_rsi_week'+sn,[],rsi6Data,rsi12Data,_buyData,_sellData,sn);
                }

            }
            else{
                console.log("未返回RSI数据");
            }

            // WR有数据  用兆军接口
            if(rs.data.detail.DAY_EWR.signals.length>0){
                var wrList = rs.data.detail.DAY_EWR.signals;
                var wr6Data = [];//wr1数据
                var wr10Data = [];//wr2数据
                var _buyData = [];//买入数据
                var _sellData = [];//卖出数据
                for(var k = 0;k<wrList.length;k++){
                    wr6Data.push([
                        timeUtil.dataFormatter(wrList[k].dt),//0
                        Number(wrList[k].wr1),//1
                        Number(wrList[k].wr1),//2
                        Number(wrList[k].wr1),//3
                        Number(wrList[k].b),//4
                        Number(wrList[k].s),//5
                        Number(wrList[k].blding),//6
                        Number(wrList[k].bldi)//7
                    ]);
                    wr10Data.push([
                        timeUtil.dataFormatter(wrList[k].dt),
                        Number(wrList[k].wr2)
                    ]);
                    if(wrList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(wrList[k].dt),
                            Number(wrList[k].b),
                            Number(wrList[k].wr1),
                            Number(wrList[k].wr2)
                        ]);
                    }
                    if(wrList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(wrList[k].dt),
                            Number(wrList[k].s),
                            Number(wrList[k].wr1),
                            Number(wrList[k].wr2)
                        ]);
                    }
                }

                if(type == 'day'){
                    //RSI图表标题
                    analysis_kline.getWrTitle(type,sn,Number(wr6Data[wr6Data.length-1][1]).toFixed(2),Number(wr10Data[wr10Data.length-1][1]).toFixed(2),timeUtil.getTimeStr(wr6Data[wr6Data.length-1][0]));

                    //创建WR图表
                    analysis_kline.createMACDChart('container_wr'+sn,[],wr6Data,wr10Data,_buyData,_sellData,sn);
                }else if(type == 'week'){
                    //WR图表标题
                    analysis_kline.getWrTitle(type,sn,Number(wr6Data[wr6Data.length-1][1]).toFixed(2),Number(wr10Data[wr10Data.length-1][1]).toFixed(2),timeUtil.getTimeStr(wr6Data[wr6Data.length-1][0]));

                    //创建WR图表
                    analysis_kline.createMACDChart('container_wr_week'+sn,[],wr6Data,wr10Data,_buyData,_sellData,sn);
                }

            }
            else{
                console.log("未返回RSI数据");
            }

            //CCI 有数据  用兆军接口
            if(rs.data.detail.DAY_ECCI.signals.length>0){
                var cciList = rs.data.detail.DAY_ECCI.signals;
                var cciData = [];//cci k数据
                var ciData = [];//ci d数据
                var _buyData = [];//买入数据
                var _sellData = [];//卖出数据
                var buyData = [];//买入数据
                var sellData = [];//卖出数据
                for(var k = 0;k<cciList.length;k++){
                    //for(var k = kdList.length-100;k<kdList.length;k++){
                    cciData.push([
                        timeUtil.dataFormatter(cciList[k].dt),//0
                        Number(cciList[k].cci),//1
                        Number(cciList[k].cci),//2
                        Number(cciList[k].cci),//3
                        Number(cciList[k].b),//4
                        Number(cciList[k].s),//5
                        Number(cciList[k].blding),//6
                        Number(cciList[k].bldi)//7
                    ]);
                    ciData.push([
                        timeUtil.dataFormatter(cciList[k].dt),
                        Number(cciList[k].ci)
                    ]);
                    if(cciList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(cciList[k].dt),
                            Number(cciList[k].b),
                            Number(cciList[k].cci),
                            Number(cciList[k].ci)
                        ]);
                    }
                    if(cciList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(cciList[k].dt),
                            Number(cciList[k].s),
                            Number(cciList[k].cci),
                            Number(cciList[k].ci)
                        ]);
                    }
                }


                if(type == 'day'){
                    //KD图表标题
                    analysis_kline.getCCiTitle(type,sn,Number(cciData[cciData.length-1][1]).toFixed(2),Number(ciData[ciData.length-1][1]).toFixed(2),timeUtil.getTimeStr(cciData[cciData.length-1][0]));

                    //创建KD图表
                    analysis_kline.createMACDChart('container_cci'+sn,[],cciData,ciData,_buyData,_sellData,sn);
                }else if(type == 'week'){
                    //KD图表标题
                    analysis_kline.getCCiTitle(type,sn,Number(cciData[cciData.length-1][1]).toFixed(2),Number(ciData[ciData.length-1][1]).toFixed(2),timeUtil.getTimeStr(cciData[cciData.length-1][0]));

                    //创建KD图表
                    analysis_kline.createMACDChart('container_cci_week'+sn,[],cciData,ciData,_buyData,_sellData,sn);
                }

            }
        }
        if(type=='week'){
            //有数据  用兆军接口 data.detail.EQUSHI.signals
            if(rs.data.detail.WEEK_EQUSHI.signals.length>0){
                /**
                 * K线数据组
                 */
                    //var stockList = rs.signals.slice(rs.signals.length-132,rs.signals.length);
                var stockList = rs.data.detail.WEEK_EQUSHI.signals;
                var ohlc = [],//蜡烛图数据
                    column = [],//柱形图数据

                    peak = [],//波峰数据
                    trough = [],//波谷数据

                    up = [],//上升趋势 红色
                    down = [],//下降趋势 绿色

                    ma5 = [],ma10 = [],ma20 = [],ma60 = [],//K线均线

                    vma5 = [],vma10=[],//成交量均线

                    macdblding = [],//股价顶背离
                    macdbldi=[],//股价底背离
                    bdmd=[],//股价波段买点（短线决策）
                    zsyhong=[],
                    zsylv_total=[],
                    zsylv=[],
                    zsyjx=[],//自适应均线
                    zsyhong2lv=[],//自适应均线红色转绿色
                    zsylv2hong=[];//自适应均线绿色转红色



                var peakList = rs.data.detail.WEEK_EQUSHI.peak;
                var troughList = rs.data.detail.WEEK_EQUSHI.trough;

                var nextPrice = stockList[stockList.length-2].c;//上一交易日的收盘价


                //获取支撑线与压力线
                //等于当前价取上一交易日的收盘价为基准来做判断
                var arr = analysis_kline.getUpDown(stockList,peakList,troughList,lastPrice,nextPrice);
                //低于当前价位是支撑线（红色），高于当前价位的线是压力线（绿色）
                //两个点都是高于当前价位的，只给最近的一条
                if(arr.length > 0){
                    if(arr.length == 1){
                        if(arr[0].price0 == "+"){
                            up.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                        }else if(arr[0].price0 == "-"){
                            down.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                        }

                    }else if(arr.length >= 2){
                        if(arr[0].price0 == '+' && arr[1].price0 == '+'){
                            up.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                            up.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[0].price)
                            ]);
                        }else if(arr[0].price0 == '-' && arr[1].price0 == '-'){
                            down.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                            down.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[0].price)
                            ]);
                        }else if(arr[0].price0 == '+' &&  arr[1].price0 == '-'){
                            up.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                            down.push([
                                timeUtil.dataFormatter(arr[1].dt),//0
                                Number(arr[1].price)
                            ]);
                            up.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[0].price)
                            ]);
                            down.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[1].price)
                            ]);
                        }else if(arr[0].price0 == '-' &&  arr[1].price0 == '+'){
                            down.push([
                                timeUtil.dataFormatter(arr[0].dt),//0
                                Number(arr[0].price)
                            ]);
                            up.push([
                                timeUtil.dataFormatter(arr[1].dt),//0
                                Number(arr[1].price)
                            ]);
                            up.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[1].price)
                            ]);
                            down.push([
                                timeUtil.dataFormatter(stockList[stockList.length-1].dt),//0
                                Number(arr[0].price)
                            ]);
                        }
                    }
                }

                if(peakList.length>0){
                    //波峰
                    if(peakList.length == 2){
                        var len = peakList.length;
                        if(Number(peakList[1].dt) >= Number(stockList[0].dt)){
                            for(var j = 0;j<len;j++){
                                peak.push([
                                    timeUtil.dataFormatter(peakList[j].dt),//0
                                    Number(peakList[j].price)
                                ]);

                            }
                        }
                    }
                }
                if(troughList.length>0){
                    //波谷
                    if(troughList.length == 2){
                        var len = troughList.length;
                        if(Number(troughList[1].dt) >= Number(stockList[0].dt)){
                            for(var j = 0;j<len;j++){
                                trough.push([
                                    timeUtil.dataFormatter(troughList[j].dt),
                                    Number(troughList[j].price)
                                ]);
                            }
                        }
                    }
                }


                if(stockList.length>0){
                    var len = stockList.length;
                    var num_nor='';
                    for(var j = 0;j<len;j++){
                        ohlc.push([
                            timeUtil.dataFormatter(stockList[j].dt),//0
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
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].v)
                        ]);
                        ma5.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].ma.ma5)
                        ]);
                        ma10.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].ma.ma10)
                        ]);
                        ma20.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].ma.ma20)
                        ]);
                        ma60.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].ma.ma60)
                        ]);
                        vma5.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].vma5)
                        ]);
                        vma10.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].vma10)
                        ]);
                        zsyjx.push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            stockList[j].zsyjx.zsyjx
                        ]);
                        if(stockList[j].zsyjx.zsylv != num_nor){
                            zsylv_total.push([]);
                        }
                        zsylv_total[zsylv_total.length-1].push([
                            timeUtil.dataFormatter(stockList[j].dt),
                            Number(stockList[j].zsyjx.zsyjx),
                            Number(stockList[j].zsyjx.zsyhong2lv),
                            Number(stockList[j].zsyjx.zsylv2hong),
                            Number(stockList[j].zsyjx.zsyhong),
                            Number(stockList[j].zsyjx.zsylv)
                        ]);
                        num_nor = stockList[j].zsyjx.zsylv;
                        if(stockList[j].macdblding == 1){
                            macdblding.push([
                                timeUtil.dataFormatter(stockList[j].dt),
                                Number(stockList[j].h)
                            ]);
                        }
                        if(stockList[j].macdbldi == 1){
                            macdbldi.push([
                                timeUtil.dataFormatter(stockList[j].dt),
                                Number(stockList[j].l)
                            ]);
                        }
                        //波段买点在下跌趋势下的情况屏蔽，只展示在上升和震荡趋势下的情况
                        if(stockList[j].up === "1" || stockList[j].mid === "1"){
                            if(stockList[j].bdmd == 1 ){
                                bdmd.push([
                                    timeUtil.dataFormatter(stockList[j].dt),
                                    Number(stockList[j].l)
                                ]);
                            }
                        }
                    }
                }else{
                    console.log("未返回K线数据");
                }

                peak = peak.reverse();
                trough = trough.reverse();

                //获取K线图表的图例
                var chart_legend_txt = '' ,chart_note_week_wenhao = '';
                if(peak.length>0 || trough.length>0 || up.length>0 || down.length > 0 ){
                    chart_legend_txt += '<strong class="s1"><em class="t_red">-</em>/<em class="t_green">-</em>支撑压力</strong>';
                }
                if(macdblding.length>0 || macdbldi.length>0 ){
                    chart_legend_txt += '<strong class="s2"><b></b>/<b></b>股价macd背离</strong>';
                }
                if(isPopup){
                    chart_note_week_wenhao += '<a style="color: #333;margin-left: 16px;"></a>';
                    if(bdmd.length>0){
                        chart_legend_txt += '<strong class="s3"><b></b>决策点</strong>';
                    }
                }else{
                    chart_note_week_wenhao += '<a onclick="analysis_kline.openPop_expma()" style="color: #333;margin-left: .5rem"><i class="icon-help2" style="margin-left: .25rem;color: #a1a2a8"></i></a>';
                    if(bdmd.length>0){
                        chart_legend_txt += '<strong class="s3" onclick="analysis_kline.openPop_juece()"><b></b>决策点<a><i class="icon-help2"></i></a></strong>';
                    }
                }
                if(type == 'week'){
                    //获取K线图表的图例
                    $('#chart_legend_week'+sn).html(chart_legend_txt);
                    $('#chart_note_week_wenhao'+sn).html(chart_note_week_wenhao);
                    //获取K线图表的标题
                    analysis_kline.getKDayTitle('week',sn,ma5[ma5.length-1][1],ma10[ma10.length-1][1],ma20[ma20.length-1][1],ma60[ma60.length-1][1],zsyjx[zsyjx.length-1][1]);

                    //获取K线图表--成交量的标题
                    analysis_kline.getKDayVolTitle('week',sn,analysis_kline.formatNumber(column[column.length-1][1]/100,2),analysis_kline.formatNumber(vma5[vma5.length-1][1]/100,2),analysis_kline.formatNumber(vma10[vma10.length-1][1]/100,2));

                    analysis_kline.createKLineChart ('container_k_week'+sn,ohlc,column,ma5,ma10,ma20,ma60,sn,'周K',peak,trough,up,down,vma5,vma10,macdblding,macdbldi,bdmd,zsylv_total);

                    analysis_kline.createKLineChart_c ('container_k_week_c'+sn,ohlc,column,ma5,ma10,ma20,ma60,sn,'周K',peak,trough,up,down,vma5,vma10,macdblding,macdbldi,bdmd,zsylv_total);

                    analysis_kline.getKCTitle(type,sn,timeUtil.getTimeStr3(zsylv_total[zsylv_total.length-1][0][0]),zsylv_total[zsylv_total.length-1][0][2],zsylv_total[zsylv_total.length-1][0][3]);
                }
            }
            else{
                console.log("未返回技术分析数据");
            }
            if(rs.data.detail.WEEK_TXTQUSHI.memo.length>0){
                var txt = '<div class="hd_gl_white hd_gl_blue">'+
                    '<b></b><span>价</span><b></b>'+
                    '</div>'+
                    '<h5>'+rs.data.detail.WEEK_TXTQUSHI.memo+'</h5>';
                if(type == 'day'){
                    $('#day_huashu_jia'+sn).html(txt);
                }else if(type == 'week'){
                    $('#week_huashu_jia'+sn).html(txt);
                }
                // 播放语音
                // playVoiceAnswerLite(rs.data.detail.WEEK_TXTQUSHI.memo)
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

            //MACD KD RSI 话术
            // MACD 话术
            if(rs.data.detail.WEEK_TXTMACD.memo.length>0){
                if(type == 'day'){
                    $('#macdHuashu_day'+sn).html("");
                }else if(type == 'week'){
                    $('#macdHuashu_week'+sn).html(rs.data.detail.WEEK_TXTMACD.memo);
                }
            }else{
                if(type == 'day'){
                    $('#macdHuashu_day'+sn).html("MACD指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#macdHuashu_week'+sn).html("MACD指标暂无明显信号。");
                }
            }
            // KD 话术
            if(rs.data.detail.WEEK_TXTKD.memo.length>0){
                if(type == 'day'){
                    $('#kdHuashu_day'+sn).html(rs.data.detail.WEEK_TXTKD.memo);
                }else if(type == 'week'){
                    $('#kdHuashu_week'+sn).html(rs.data.detail.WEEK_TXTKD.memo);
                }
            }else{
                if(type == 'day'){
                    $('#kdHuashu_day'+sn).html("KD指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#kdHuashu_week'+sn).html("KD指标暂无明显信号。");
                }
            }
            // RSI 话术
            if(rs.data.detail.WEEK_TXTRSI.memo.length>0){
                if(type == 'day'){
                    $('#rsiHuashu_day'+sn).html("");
                }else if(type == 'week'){
                    $('#rsiHuashu_week'+sn).html(rs.data.detail.WEEK_TXTRSI.memo);
                }
            }else{
                if(type == 'day'){
                    $('#rsiHuashu_day'+sn).html("RSI指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#rsiHuashu_week'+sn).html("RSI指标暂无明显信号。");
                }
            }
            // wr 话术
            if(rs.data.detail.WEEK_TXTWR.memo.length>0){
                if(type == 'day'){
                    $('#wrHuashu_week'+sn).html(rs.memo);
                }else if(type == 'week'){
                    $('#wrHuashu_week'+sn).html(rs.data.detail.WEEK_TXTWR.memo);
                }
            }else{
                if(type == 'day'){
                    $('#wrHuashu_day'+sn).html("WR指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#wrHuashu_week'+sn).html("WR指标暂无明显信号。");
                }
            }

            // cci 话术
            if(rs.data.detail.WEEK_TXTCCI.memo.length>0){
                if(type == 'day'){
                    $('#cciHuashu_week'+sn).html(rs.memo);
                }else if(type == 'week'){
                    $('#cciHuashu_week'+sn).html(rs.data.detail.WEEK_TXTCCI.memo);
                }
            }else{
                if(type == 'day'){
                    $('#cciHuashu_day'+sn).html("CCI指标暂无明显信号。");
                }else if(type == 'week'){
                    $('#cciHuashu_week'+sn).html("CCI指标暂无明显信号。");
                }
            }

            if(rs.data.detail.WEEK_TXTQUSHIVOL.memo.length>0){
                var txt = '<div class="hd_gl_white hd_gl_blue">'+
                    '<b></b><span>量</span><b></b>'+
                    '</div>'+
                    '<h5>'+rs.data.detail.WEEK_TXTQUSHIVOL.memo+'</h5>';
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
            // MACD Kd  RSI 三个图标
            // MACD有数据  用兆军接口 data.detail.EMACD.signals
            if(rs.data.detail.WEEK_EMACD.signals.length>0){
                var macdList = rs.data.detail.WEEK_EMACD.signals;
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
                        timeUtil.dataFormatter(macdList[k].dt),
                        Number(macdList[k].diff)
                    ]);
                    deaData.push([
                        timeUtil.dataFormatter(macdList[k].dt),
                        Number(macdList[k].dea),
                        Number(macdList[k].macd),
                        Number(macdList[k].diff),
                        Number(macdList[k].b),
                        Number(macdList[k].s),
                        Number(macdList[k].blding),
                        Number(macdList[k].bldi)
                    ]);
                    macdData.push([
                        timeUtil.dataFormatter(macdList[k].dt),
                        Number(macdList[k].macd)
                    ]);
                    if(macdList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(macdList[k].dt),
                            Number(macdList[k].b),
                            Number(macdList[k].macd),
                            Number(macdList[k].diff),
                            Number(macdList[k].dea)
                        ]);
                    }
                    if(macdList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(macdList[k].dt),
                            Number(macdList[k].s),
                            Number(macdList[k].macd),
                            Number(macdList[k].diff),
                            Number(macdList[k].dea)
                        ]);
                    }
                    if(macdList[k].blding == 1){
                        bldingData.push([
                            timeUtil.dataFormatter(macdList[k].dt),
                            Number(macdList[k].blding),
                            Number(macdList[k].macd),
                            Number(macdList[k].diff),
                            Number(macdList[k].dea)
                        ]);
                    }
                    if(macdList[k].bldi == 1){
                        bldiData.push([
                            timeUtil.dataFormatter(macdList[k].dt),
                            Number(macdList[k].bldi),
                            Number(macdList[k].macd),
                            Number(macdList[k].diff),
                            Number(macdList[k].dea)
                        ]);
                    }
                }

                if(type == 'day'){
                    //MACD图表标题
                    analysis_kline.getMacdTitle(type,sn,Number(difData[difData.length-1][1]).toFixed(2),Number(deaData[deaData.length-1][1]).toFixed(2),Number(macdData[macdData.length-1][1]).toFixed(2),timeUtil.getTimeStr(difData[difData.length-1][0]));

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
                    analysis_kline.getMacdTitle(type,sn,Number(difData[difData.length-1][1]).toFixed(2),Number(deaData[deaData.length-1][1]).toFixed(2),Number(macdData[macdData.length-1][1]).toFixed(2),timeUtil.getTimeStr(difData[difData.length-1][0]));

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
            //Kd有数据  用兆军接口
            if(rs.data.detail.WEEK_EKD.signals.length>0){
                var kdList = rs.data.detail.WEEK_EKD.signals;
                var kData = [];//k数据
                var dData = [];//d数据
                var _buyData = [];//买入数据
                var _sellData = [];//卖出数据
                var buyData = [];//买入数据
                var sellData = [];//卖出数据
                for(var k = 0;k<kdList.length;k++){
                    //for(var k = kdList.length-100;k<kdList.length;k++){
                    kData.push([
                        timeUtil.dataFormatter(kdList[k].dt),//0
                        Number(kdList[k].k),//1
                        Number(kdList[k].k),//2
                        Number(kdList[k].k),//3
                        Number(kdList[k].b),//4
                        Number(kdList[k].s),//5
                        Number(kdList[k].blding),//6
                        Number(kdList[k].bldi)//7
                    ]);
                    dData.push([
                        timeUtil.dataFormatter(kdList[k].dt),
                        Number(kdList[k].d)
                    ]);
                    if(kdList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(kdList[k].dt),
                            Number(kdList[k].b),
                            Number(kdList[k].k),
                            Number(kdList[k].d)
                        ]);
                    }
                    if(kdList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(kdList[k].dt),
                            Number(kdList[k].s),
                            Number(kdList[k].k),
                            Number(kdList[k].d)
                        ]);
                    }
                }


                if(type == 'day'){
                    //KD图表标题
                    analysis_kline.getKdTitle(type,sn,Number(kData[kData.length-1][1]).toFixed(2),Number(dData[dData.length-1][1]).toFixed(2),timeUtil.getTimeStr(kData[kData.length-1][0]));

                    //创建KD图表
                    analysis_kline.createMACDChart('container_kd'+sn,[],kData,dData,_buyData,_sellData,sn);
                }else if(type == 'week'){
                    //KD图表标题
                    analysis_kline.getKdTitle(type,sn,Number(kData[kData.length-1][1]).toFixed(2),Number(dData[dData.length-1][1]).toFixed(2),timeUtil.getTimeStr(kData[kData.length-1][0]));

                    //创建KD图表
                    analysis_kline.createMACDChart('container_kd_week'+sn,[],kData,dData,_buyData,_sellData,sn);
                }

            }
            else{
                console.log("未返回Kd数据");
            }
            //RSI有数据  用兆军接口
            if(rs.data.detail.WEEK_ERSI.signals.length>0){
                var rsiList = rs.data.detail.WEEK_ERSI.signals;
                var rsi6Data = [];//k数据
                var rsi12Data = [];//d数据
                var _buyData = [];//买入数据
                var _sellData = [];//卖出数据
                for(var k = 0;k<rsiList.length;k++){
                    //for(var k = rsiList.length-100;k<rsiList.length;k++){
                    rsi6Data.push([
                        timeUtil.dataFormatter(rsiList[k].dt),//0
                        Number(rsiList[k].rsi6),//1
                        Number(rsiList[k].rsi6),//2
                        Number(rsiList[k].rsi6),//3
                        Number(rsiList[k].b),//4
                        Number(rsiList[k].s),//5
                        Number(rsiList[k].blding),//6
                        Number(rsiList[k].bldi)//7
                    ]);
                    rsi12Data.push([
                        timeUtil.dataFormatter(rsiList[k].dt),
                        Number(rsiList[k].rsi12)
                    ]);
                    if(rsiList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(rsiList[k].dt),
                            Number(rsiList[k].b),
                            Number(rsiList[k].rsi6),
                            Number(rsiList[k].rsi12)
                        ]);
                    }
                    if(rsiList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(rsiList[k].dt),
                            Number(rsiList[k].s),
                            Number(rsiList[k].rsi6),
                            Number(rsiList[k].rsi12)
                        ]);
                    }
                }

                if(type == 'day'){
                    //RSI图表标题
                    analysis_kline.getRsiTitle(type,sn,Number(rsi6Data[rsi6Data.length-1][1]).toFixed(2),Number(rsi12Data[rsi12Data.length-1][1]).toFixed(2),timeUtil.getTimeStr(rsi6Data[rsi6Data.length-1][0]));

                    //创建RSI图表
                    analysis_kline.createMACDChart('container_rsi'+sn,[],rsi6Data,rsi12Data,_buyData,_sellData,sn);
                }else if(type == 'week'){
                    //RSI图表标题
                    analysis_kline.getRsiTitle(type,sn,Number(rsi6Data[rsi6Data.length-1][1]).toFixed(2),Number(rsi12Data[rsi12Data.length-1][1]).toFixed(2),timeUtil.getTimeStr(rsi6Data[rsi6Data.length-1][0]));

                    //创建RSI图表
                    analysis_kline.createMACDChart('container_rsi_week'+sn,[],rsi6Data,rsi12Data,_buyData,_sellData,sn);
                }

            }
            else{
                console.log("未返回RSI数据");
            }
            // WR有数据  用兆军接口
            if(rs.data.detail.WEEK_EWR.signals.length>0){
                var wrList = rs.data.detail.WEEK_EWR.signals;
                var wr6Data = [];//wr1数据
                var wr10Data = [];//wr2数据
                var _buyData = [];//买入数据
                var _sellData = [];//卖出数据
                for(var k = 0;k<wrList.length;k++){
                    wr6Data.push([
                        timeUtil.dataFormatter(wrList[k].dt),//0
                        Number(wrList[k].wr1),//1
                        Number(wrList[k].wr1),//2
                        Number(wrList[k].wr1),//3
                        Number(wrList[k].b),//4
                        Number(wrList[k].s),//5
                        Number(wrList[k].blding),//6
                        Number(wrList[k].bldi)//7
                    ]);
                    wr10Data.push([
                        timeUtil.dataFormatter(wrList[k].dt),
                        Number(wrList[k].wr2)
                    ]);
                    if(wrList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(wrList[k].dt),
                            Number(wrList[k].b),
                            Number(wrList[k].wr1),
                            Number(wrList[k].wr2)
                        ]);
                    }
                    if(wrList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(wrList[k].dt),
                            Number(wrList[k].s),
                            Number(wrList[k].wr1),
                            Number(wrList[k].wr2)
                        ]);
                    }
                }

                if(type == 'day'){
                    //RSI图表标题
                    analysis_kline.getWrTitle(type,sn,Number(wr6Data[wr6Data.length-1][1]).toFixed(2),Number(wr10Data[wr10Data.length-1][1]).toFixed(2),timeUtil.getTimeStr(wr6Data[wr6Data.length-1][0]));

                    //创建WR图表
                    analysis_kline.createMACDChart('container_wr'+sn,[],wr6Data,wr10Data,_buyData,_sellData,sn);
                }else if(type == 'week'){
                    //WR图表标题
                    analysis_kline.getWrTitle(type,sn,Number(wr6Data[wr6Data.length-1][1]).toFixed(2),Number(wr10Data[wr10Data.length-1][1]).toFixed(2),timeUtil.getTimeStr(wr6Data[wr6Data.length-1][0]));

                    //创建WR图表
                    analysis_kline.createMACDChart('container_wr_week'+sn,[],wr6Data,wr10Data,_buyData,_sellData,sn);
                }

            }

            //CCI 有数据  用兆军接口
            if(rs.data.detail.WEEK_ECCI.signals.length>0){
                var cciList = rs.data.detail.WEEK_ECCI.signals;
                var cciData = [];//cci k数据
                var ciData = [];//ci d数据
                var _buyData = [];//买入数据
                var _sellData = [];//卖出数据
                var buyData = [];//买入数据
                var sellData = [];//卖出数据
                for(var k = 0;k<cciList.length;k++){
                    //for(var k = kdList.length-100;k<kdList.length;k++){
                    cciData.push([
                        timeUtil.dataFormatter(cciList[k].dt),//0
                        Number(cciList[k].cci),//1
                        Number(cciList[k].cci),//2
                        Number(cciList[k].cci),//3
                        Number(cciList[k].b),//4
                        Number(cciList[k].s),//5
                        Number(cciList[k].blding),//6
                        Number(cciList[k].bldi)//7
                    ]);
                    ciData.push([
                        timeUtil.dataFormatter(cciList[k].dt),
                        Number(cciList[k].ci)
                    ]);
                    if(cciList[k].b == 1){
                        _buyData.push([
                            timeUtil.dataFormatter(cciList[k].dt),
                            Number(cciList[k].b),
                            Number(cciList[k].cci),
                            Number(cciList[k].ci)
                        ]);
                    }
                    if(cciList[k].s == 1){
                        _sellData.push([
                            timeUtil.dataFormatter(cciList[k].dt),
                            Number(cciList[k].s),
                            Number(cciList[k].cci),
                            Number(cciList[k].ci)
                        ]);
                    }
                }


                if(type == 'day'){
                    //KD图表标题
                    analysis_kline.getCCiTitle(type,sn,Number(cciData[cciData.length-1][1]).toFixed(2),Number(ciData[ciData.length-1][1]).toFixed(2),timeUtil.getTimeStr(cciData[cciData.length-1][0]));

                    //创建KD图表
                    analysis_kline.createMACDChart('container_cci'+sn,[],cciData,ciData,_buyData,_sellData,sn);
                }else if(type == 'week'){
                    //KD图表标题
                    analysis_kline.getCCiTitle(type,sn,Number(cciData[cciData.length-1][1]).toFixed(2),Number(ciData[ciData.length-1][1]).toFixed(2),timeUtil.getTimeStr(cciData[cciData.length-1][0]));

                    //创建KD图表
                    analysis_kline.createMACDChart('container_cci_week'+sn,[],cciData,ciData,_buyData,_sellData,sn);
                }

            }
        }
    }

};


