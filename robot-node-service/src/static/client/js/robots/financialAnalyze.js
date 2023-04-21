
/**
 * 财务分析
 * @param result
 * @param isPopup
 * @param showInteractiveView
 * @author zhaobo
 */
function financialAnalysis(result, isPopup, showInteractiveView)
{
    if(!isPopup)
        sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var property = getPropertyByEntity(result.questionAnalyse[0].entity);
    var marketType = property.marketType,
        stockCode = property.code;

    var chartId = generateRandomClassName('polygon');
    var randomNum = generateRandomClassName();

    // 提取周期
    var scores = result.data.scores || [];
    var period = [];
    for(var i=0; i<scores.length; i++)
    {
        period.push(scores[i].endDate);
    }

    // 话术
    var description = result.data.description;
    var tableContainerId = generateRandomClassName('tableContainerId');

    // 底部链接
    var tagLink =
        '<ul class="tlBox_link">'+
            '<li onclick="stockRelatedIndustryAnalysis(\''+randomNum+'\')">查看同行业比较</li>'+
            '<li onclick="stockMoreFinancialIndex(\''+randomNum+'\')">查看更多财务指标</li>'+
        '</ul>';

    // 所属行业
    var industry = result.data.induSortName || '';
    var industryCode = result.data.induSortCode || '';
    // private static final String ZHENGQUAN_INDU_CODE = "S4901";证券
    // private static final String YINHANG_INDU_CODE = "S4801";银行
    // private static final String BAOXIAN_INDU_CODE = "S4902";保险

    // 银行，证券，保险三大行业在主要指标选项卡中额外多展示一个指标tab
    var tagExtraTabForMainIndex = '';
    var tagExtraTabContentForMainIndex = '';
    // 三大行业为专项指标，其它行业运营能力，财务分析
    var tagOperationTabForAnalysis = '';
    var tagOperationTabContentForAnalysis = '';
    // 蜘蛛图用的字段名称
    var fieldCategories = ['profitScore', 'growupScore', 'operationScore', 'debtScore', 'cashScore'];
    // 蜘蛛图展示名称
    var xCategories = ['盈利', '成长', '运营', '偿债', '现金流'];
    // 财务分析指标类型
    var tabType = 'operation';
    // 财务分析指标中图的数量
    var chartCount = 3;

    if (['S4901', 'S4801', 'S4902'].indexOf(industryCode) !== -1) {
        // 替换为专项指标用的字段，及中文名称
        fieldCategories.splice(2, 1, 'specialScore');
        xCategories.splice(2, 1, '专项指标<br/>（'+industry+'）');
        tagExtraTabForMainIndex =
            '<li tabType="specialTable" onclick="mainIndexSubTabClick(event, \''+randomNum+'\')">'+
                '<span>'+industry+'专项指标<b></b></span>'+
            '</li>';
        // 子内容不同
        var tagTabs = '';
        if (industryCode === 'S4801') { //银行
            tabType = 'yinhangSpec';
            chartCount = 3;
            tagTabs =
                '<li indexType="capiAdeRatio" class="on" onclick="indexSubTabClick(event, \'specialTable\', \''+randomNum+'\')">资本充足率</li>'+
                '<li indexType="nplRatio" onclick="indexSubTabClick(event, \'specialTable\', \''+randomNum+'\')">不良贷款率</li>'+
                '<li indexType="netCapital" onclick="indexSubTabClick(event, \'specialTable\', \''+randomNum+'\')">资本净额</li>';
        } else if (industryCode === 'S4901') { //证券
            tabType = 'zhengquanSpec';
            chartCount = 1;
            tagTabs =
                '<li indexType="netCapitalVal" class="on" onclick="indexSubTabClick(event, \'specialTable\', \''+randomNum+'\')">净资本</li>';

        } else if (industryCode === 'S4902') { //保险
            tabType = 'baoxianSpec';
            chartCount = 2;
            tagTabs =
                '<li indexType="lossRatioProperty" class="on" onclick="indexSubTabClick(event, \'specialTable\', \''+randomNum+'\')">赔付率(产险)</li>'+
                '<li indexType="intrinsicValueLife" onclick="indexSubTabClick(event, \'specialTable\', \''+randomNum+'\')">内含价值(寿险)</li>';
                // '<li indexType="insurPremUnearned" onclick="indexSubTabClick(event, \'specialTable\', \''+randomNum+'\')">已赚保费</li>' ;
        }
        tagExtraTabContentForMainIndex =
            '<div id="'+('specialTable'+randomNum)+'" dataLoad="false" marketType="'+marketType+'" stockCode="'+stockCode+'" period="year" class="item" style="min-height: 380px">'+
                '<ul id="'+('specialTable_ul'+randomNum)+'" class="box_label box_label2">'+
                    tagTabs+
                '</ul>'+

                '<ul class="chartTag">'+
                    '<li>'+
                    '</li>'+
                    '<li>'+
                        '<a id="'+('specialTable_curPeriod'+randomNum)+'" onclick="setPeriodVisible(event, \'specialTable\', \''+randomNum+'\')">年报<i class="icon-arrow2_B_small"></i></a>'+
                        // 下拉框
                        '<ul id="'+('specialTable_period'+randomNum)+'" class="ddList">'+
                            '<li onclick="periodClick(event, \'specialTable\', \''+randomNum+'\')">全部</li>'+
                            '<li onclick="periodClick(event, \'specialTable\', \''+randomNum+'\')" class="on">年报</li>'+
                            '<li onclick="periodClick(event, \'specialTable\', \''+randomNum+'\')">中报</li>'+
                            '<li onclick="periodClick(event, \'specialTable\', \''+randomNum+'\')">一季报</li>'+
                            '<li onclick="periodClick(event, \'specialTable\', \''+randomNum+'\')">三季报</li>'+
                            '<b></b>'+
                        '</ul>'+
                    '</li>'+
                '</ul>'+

                '<div id="'+('specialTable_chart'+randomNum)+'" class="box_chart02">'+
                '</div>'+
                '<div id="'+('specialTable_list'+randomNum)+'" class="list_chartTag">'+
                '</div>'+
            '</div>';
    } else {
    }

    // 图表话术
    var tagChartNhuashu = '';
    for (var c=0; c<chartCount; c++) {
        tagChartNhuashu +=
            '<ul class="tab TAB1" onclick="financialAnalysisSubTabClick(event, \''+marketType+'\', \''+stockCode+'\', \''+tabType+(c>0?c+1:'')+'\', \''+randomNum+'\')">'+
                '<li class="on">季度</li>'+
                '<li>年度</li>'+
            '</ul>'+
            '<div >'+
                '<div class="chart" style="min-height: 250px;">'+
                    '<div id="'+tabType+(c>0?c+1:'')+'_season_'+randomNum+'" dataLoad="false" class="chartContainer"></div>'+
                    '<div id="'+tabType+(c>0?c+1:'')+'_year_'+randomNum+'" dataLoad="false" class="chartContainer" style="display: none"></div>'+
                '</div>'+
                '<div class="tBox box_bgGray">'+
                '</div>'+
            '</div>'
    }

    tagOperationTabForAnalysis =
        '<li tabType="'+tabType+'" marketType="'+marketType+'" stockCode="'+stockCode+'" onclick="financialAnalysisTabClick(event, \''+randomNum+'\')">'+
            '<span>'+(['S4901', 'S4801', 'S4902'].indexOf(industryCode) !== -1?industry+'专项指标':'运营能力')+'<b></b></span>'+
        '</li>';
    tagOperationTabContentForAnalysis =
        // 运营能力
        '<div id="'+(tabType+randomNum)+'" class="item">'+
            '<h5>'+description[2]+'</h5>'+
            tagChartNhuashu+
            '<h6 id="'+(tabType+'Date'+randomNum)+'" class="note t_gray" style=" text-align: left; margin: 0.875rem 0 -0.25rem;"></h6>'+
        '</div>';

    var tagBody =
        '<div class="box_finAnalysis2">'+
            '<ul id="'+('stock'+randomNum)+'" marketType="'+marketType+'" stockCode="'+stockCode+'" stockName="'+property.name+'" class="stock2" style="display: '+(isPopup?'none':'')+'">'+
            '</ul>'+

            // 所属题材
            '<div class="subMatter">'+
                '所属行业：<b>'+result.data.induSortName+'</b>'+
            '</div>'+

            // 头部
            '<ul class="comprehensive">'+
                '<li>'+
                    '<h3>'+result.data.totalScore+'<span>综合评分</span></h3>'+
                    '<h6>打败了'+formatNumber(result.data.beatStocksPercent*100)+'%的股票'+
                        '<div class="dottedLine"></div>'+
                    '</h6>'+
                    '<h5>'+
                        '<span>行业排名:</span>'+
                        '<em><b>'+(result.data.induRank||'--')+'</b>/'+(result.data.induSecNum||'--')+'</em>'+
                    '</h5>'+
                    '<h5>'+
                        '<span>市场排名:</span>'+
                        '<em><b>'+(result.data.allStockRank||'--')+'</b>/'+(result.data.allStockNum||'--')+'</em>'+
                    '</h5>'+
                '</li>'+
                '<li>'+
                    '<div class="chartTag">'+
                        '<b><i></i></b><span>'+getQuarterLabel(period[0], 'zh', true)+'</span>'+
                        '<b><i></i></b><span>'+(period.length>1?getQuarterLabel(period[1], 'zh', true):'')+'</span>'+
                    '</div>'+
                    // 综评图表
                    '<div id="'+chartId+'"></div>'+
                '</li>'+
            '</ul>'+

            // 标签
            '<ul class="TAB5">'+
                '<li class="on" onclick="marginSubTabClick2(event,\''+tableContainerId+'\', \''+randomNum+'\')"><b><i></i></b><div>主要指标</div><b><i></i></b></li>'+
                '<li onclick="marginSubTabClick2(event,\''+tableContainerId+'\', \''+randomNum+'\')"><b><i></i></b><div>财务分析</div><b><i></i></b></li>'+
            '</ul>'+

            '<div id="'+tableContainerId+'" class="content content2">'+
                '<div id="'+('mainIndex_container'+randomNum)+'" class="item show">'+
                    // 主要指标
                    '<div class="TAB2 TAB2_scroll">'+
                        '<div class="scroll">'+
                            '<ul>'+
                                '<li tabType="mainIndex" class="on" onclick="mainIndexSubTabClick(event, \''+randomNum+'\')">'+
                                    '<span>主要指标<b></b></span>'+
                                '</li>'+
                                '<li tabType="profitTable" onclick="mainIndexSubTabClick(event, \''+randomNum+'\')">'+
                                    '<span>利润表<b></b></span>'+
                                '</li>'+
                                '<li tabType="assetDebtTable" onclick="mainIndexSubTabClick(event, \''+randomNum+'\')">'+
                                    '<span>资产负债表<b></b></span>'+
                                '</li>'+
                                '<li tabType="cashFlowTable" onclick="mainIndexSubTabClick(event, \''+randomNum+'\')">'+
                                    '<span>现金流量表<b></b></span>'+
                                '</li>'+
                                tagExtraTabForMainIndex+
                            '</ul>'+
                        '</div>'+
                        '<div class="bottom"></div>'+
                    '</div>'+

                    // 子主要指标
                    '<div id="'+('mainIndex'+randomNum)+'" dataLoad="false" marketType="'+marketType+'" stockCode="'+stockCode+'" period="year" class="item show">'+
                        '<ul id="'+('mainIndex_ul'+randomNum)+'" class="box_label">'+
                            '<li indexType="waaRoe" class="on" onclick="indexSubTabClick(event, \'mainIndex\', \''+randomNum+'\')">ROE</li>'+
                            '<li indexType="roic" onclick="indexSubTabClick(event, \'mainIndex\', \''+randomNum+'\')">ROIC</li>'+
                            '<li indexType="epsBasic" onclick="indexSubTabClick(event, \'mainIndex\', \''+randomNum+'\')">每股收益</li>'+
                            '<li indexType="sFaBps" onclick="indexSubTabClick(event, \'mainIndex\', \''+randomNum+'\')">每股净资产</li>'+
                            '<li indexType="grossRev" onclick="indexSubTabClick(event, \'mainIndex\', \''+randomNum+'\')">毛利润</li>'+
                            '<li indexType="sfaOcfps" onclick="indexSubTabClick(event, \'mainIndex\', \''+randomNum+'\')">每股现金流</li>'+
                            '<li indexType="sFaUndistributedps" onclick="indexSubTabClick(event, \'mainIndex\', \''+randomNum+'\')">每股未分配</li>'+
                            '<li indexType="sFaSurpluscapitalps" onclick="indexSubTabClick(event, \'mainIndex\', \''+randomNum+'\')">每股公积金</li>'+
                        '</ul>'+

                        '<ul class="chartTag">'+
                            '<li>'+
                            '</li>'+
                            '<li>'+
                                '<a id="'+('mainIndex_curPeriod'+randomNum)+'" onclick="setPeriodVisible(event, \'mainIndex\', \''+randomNum+'\')">年报<i class="icon-arrow2_B_small"></i></a>'+
                                // 下拉框
                                '<ul id="'+('mainIndex_period'+randomNum)+'" class="ddList">'+
                                    '<li onclick="periodClick(event, \'mainIndex\', \''+randomNum+'\')">全部</li>'+
                                    '<li onclick="periodClick(event, \'mainIndex\', \''+randomNum+'\')" class="on">年报</li>'+
                                    '<li onclick="periodClick(event, \'mainIndex\', \''+randomNum+'\')">中报</li>'+
                                    '<li onclick="periodClick(event, \'mainIndex\', \''+randomNum+'\')">一季报</li>'+
                                    '<li onclick="periodClick(event, \'mainIndex\', \''+randomNum+'\')">三季报</li>'+
                                    '<b></b>'+
                                '</ul>'+
                            '</li>'+
                        '</ul>'+

                        '<div id="'+('mainIndex_chart'+randomNum)+'" class="box_chart02">'+
                            //     柱：色 #4479ef，宽 12px，
                            //     柱上文字：色 #4479ef，字号 12px, 行高 13px, 字距柱顶4px
                            //     同比（黄色）：#eab537
                            //     点：6*6px
                        '</div>'+
                        '<div id="'+('mainIndex_list'+randomNum)+'" class="list_chartTag">'+
                        '</div>'+
                    '</div>'+

                    // 利润表
                    '<div id="'+('profitTable'+randomNum)+'" dataLoad="false" marketType="'+marketType+'" stockCode="'+stockCode+'" period="year" class="item" style="min-height: 380px">'+
                        '<ul id="'+('profitTable_ul'+randomNum)+'" class="box_label">'+
                            '<li indexType="netProfit" class="on" onclick="indexSubTabClick(event, \'profitTable\', \''+randomNum+'\')">归属净利润</li>'+
                            '<li indexType="totOperRev" onclick="indexSubTabClick(event, \'profitTable\', \''+randomNum+'\')">营业收入</li>'+
                            '<li indexType="operProfit" onclick="indexSubTabClick(event, \'profitTable\', \''+randomNum+'\')">营业利润</li>'+
                        '</ul>'+

                        '<ul class="chartTag">'+
                            '<li>'+
                            '</li>'+
                            '<li>'+
                                '<a id="'+('profitTable_curPeriod'+randomNum)+'" onclick="setPeriodVisible(event, \'profitTable\', \''+randomNum+'\')">年报<i class="icon-arrow2_B_small"></i></a>'+
                                // 下拉框
                                '<ul id="'+('profitTable_period'+randomNum)+'" class="ddList">'+
                                    '<li onclick="periodClick(event, \'profitTable\', \''+randomNum+'\')">全部</li>'+
                                    '<li onclick="periodClick(event, \'profitTable\', \''+randomNum+'\')" class="on">年报</li>'+
                                    '<li onclick="periodClick(event, \'profitTable\', \''+randomNum+'\')">中报</li>'+
                                    '<li onclick="periodClick(event, \'profitTable\', \''+randomNum+'\')">一季报</li>'+
                                    '<li onclick="periodClick(event, \'profitTable\', \''+randomNum+'\')">三季报</li>'+
                                    '<b></b>'+
                                '</ul>'+
                            '</li>'+
                        '</ul>'+

                        '<div id="'+('profitTable_chart'+randomNum)+'" class="box_chart02">'+
                        '</div>'+
                        '<div id="'+('profitTable_list'+randomNum)+'" class="list_chartTag">'+
                        '</div>'+
                    '</div>'+

                    // 资产负债表
                    '<div id="'+('assetDebtTable'+randomNum)+'" dataLoad="false" marketType="'+marketType+'" stockCode="'+stockCode+'" period="year" class="item" style="min-height: 380px">'+
                        '<ul id="'+('assetDebtTable_ul'+randomNum)+'" class="box_label">'+
                            '<li indexType="balanceSheet" class="on" style="display: none" onclick="indexSubTabClick(event, \'assetDebtTable\', \''+randomNum+'\')">111</li>'+
                        '</ul>'+

                        '<ul class="chartTag">'+
                            '<li>'+
                            '</li>'+
                            '<li>'+
                                '<a id="'+('assetDebtTable_curPeriod'+randomNum)+'" onclick="setPeriodVisible(event, \'assetDebtTable\', \''+randomNum+'\')">年报<i class="icon-arrow2_B_small"></i></a>'+
                                // 下拉框
                                '<ul id="'+('assetDebtTable_period'+randomNum)+'" class="ddList">'+
                                    '<li onclick="periodClick(event, \'assetDebtTable\', \''+randomNum+'\')">全部</li>'+
                                    '<li onclick="periodClick(event, \'assetDebtTable\', \''+randomNum+'\')" class="on">年报</li>'+
                                    '<li onclick="periodClick(event, \'assetDebtTable\', \''+randomNum+'\')">中报</li>'+
                                    '<li onclick="periodClick(event, \'assetDebtTable\', \''+randomNum+'\')">一季报</li>'+
                                    '<li onclick="periodClick(event, \'assetDebtTable\', \''+randomNum+'\')">三季报</li>'+
                                    '<b></b>'+
                                '</ul>'+
                            '</li>'+
                        '</ul>'+

                        '<div id="'+('assetDebtTable_chart'+randomNum)+'" class="box_chart02">'+
                        '</div>'+
                        '<div id="'+('assetDebtTable_list'+randomNum)+'" class="list_chartTag list_chartTag2">'+
                        '</div>'+
                    '</div>'+

                    // 现金流量表
                    '<div id="'+('cashFlowTable'+randomNum)+'" dataLoad="false" marketType="'+marketType+'" stockCode="'+stockCode+'" period="year" class="item" style="min-height: 380px">'+
                        '<ul id="'+('cashFlowTable_ul'+randomNum)+'" class="box_label">'+
                            '<li indexType="netCashFlowsOperAct" class="on" onclick="indexSubTabClick(event, \'cashFlowTable\', \''+randomNum+'\')">经营现金流</li>'+
                            '<li indexType="netCashFlowsInvAct" onclick="indexSubTabClick(event, \'cashFlowTable\', \''+randomNum+'\')">投资现金流</li>'+
                            '<li indexType="netCashFlowsFncAct" onclick="indexSubTabClick(event, \'cashFlowTable\', \''+randomNum+'\')">融资现金流</li>'+
                        '</ul>'+

                        '<ul class="chartTag">'+
                            '<li>'+
                            '</li>'+
                            '<li>'+
                                '<a id="'+('cashFlowTable_curPeriod'+randomNum)+'" onclick="setPeriodVisible(event, \'cashFlowTable\', \''+randomNum+'\')">年报<i class="icon-arrow2_B_small"></i></a>'+
                                // 下拉框
                                '<ul id="'+('cashFlowTable_period'+randomNum)+'" class="ddList">'+
                                    '<li onclick="periodClick(event, \'cashFlowTable\', \''+randomNum+'\')">全部</li>'+
                                    '<li onclick="periodClick(event, \'cashFlowTable\', \''+randomNum+'\')" class="on">年报</li>'+
                                    '<li onclick="periodClick(event, \'cashFlowTable\', \''+randomNum+'\')">中报</li>'+
                                    '<li onclick="periodClick(event, \'cashFlowTable\', \''+randomNum+'\')">一季报</li>'+
                                    '<li onclick="periodClick(event, \'cashFlowTable\', \''+randomNum+'\')">三季报</li>'+
                                    '<b></b>'+
                                '</ul>'+
                            '</li>'+
                        '</ul>'+

                        '<div id="'+('cashFlowTable_chart'+randomNum)+'" class="box_chart02">'+
                        '</div>'+
                        '<div id="'+('cashFlowTable_list'+randomNum)+'" class="list_chartTag">'+
                        '</div>'+
                    '</div>'+

                    // 专项指标
                    tagExtraTabContentForMainIndex+
                '</div>'+

                '<div class="item" style="min-height: 400px">' +
                    '<div class="TAB2 TAB2_scroll">'+
                        '<div id="tabContainer'+randomNum+'" class="scroll">'+
                            '<ul>'+
                                '<li class="on" tabType="profit" marketType="'+marketType+'" stockCode="'+stockCode+'" onclick="financialAnalysisTabClick(event, \''+randomNum+'\')">'+
                                    '<span>盈利能力<b></b></span>'+
                                '</li>'+
                                '<li tabType="growup" marketType="'+marketType+'" stockCode="'+stockCode+'" onclick="financialAnalysisTabClick(event, \''+randomNum+'\')">'+
                                    '<span>成长能力<b></b></span>'+
                                '</li>'+
                                // 运营能力
                                tagOperationTabForAnalysis+
                                '<li tabType="debt" marketType="'+marketType+'" stockCode="'+stockCode+'" onclick="financialAnalysisTabClick(event, \''+randomNum+'\')">'+
                                    '<span>偿债能力<b></b></span>'+
                                '</li>'+
                                '<li tabType="cash" marketType="'+marketType+'" stockCode="'+stockCode+'" onclick="financialAnalysisTabClick(event, \''+randomNum+'\')">'+
                                    '<span>现金流<b></b></span>'+
                                '</li>'+
                            '</ul>'+
                        '</div>'+
                        '<div class="bottom"></div>'+
                    '</div>'+

                    // 基本面
                    '<div id="'+('financialTab'+randomNum)+'">'+
                        // 盈利能力
                        '<div id="'+('profit'+randomNum)+'" class="item">'+
                            '<h5>'+description[0]+'</h5>'+
                            '<ul class="tab TAB1" onclick="financialAnalysisSubTabClick(event, \''+marketType+'\', \''+stockCode+'\', \'profit\', \''+randomNum+'\')">'+
                                '<li class="on">季度</li>'+
                                '<li>年度</li>'+
                            '</ul>'+
                            '<div>'+
                                '<div class="chart" style="min-height: 250px;">'+
                                    '<div id="profit_season_'+randomNum+'" dataLoad="false" class="chartContainer"></div>'+
                                    '<div id="profit_year_'+randomNum+'" dataLoad="false" class="chartContainer" style="display: none"></div>'+
                                '</div>'+
                                '<div class="tBox box_bgGray">'+
                                    // '<h5><b>毛利率：</b>40.2%，业内排名前X，行业均值18.9%，核心产品市场竞争力及获利能力较强；</h5>'+
                                '</div>'+
                            '</div>'+
                            '<ul class="tab TAB1" onclick="financialAnalysisSubTabClick(event, \''+marketType+'\', \''+stockCode+'\', \'profit2\', \''+randomNum+'\')">'+
                                '<li class="on">季度</li>'+
                                '<li>年度</li>'+
                            '</ul>'+
                            '<div>'+
                                '<div class="chart" style="min-height: 250px;">'+
                                    '<div id="profit2_season_'+randomNum+'" dataLoad="false" class="chartContainer"></div>'+
                                    '<div id="profit2_year_'+randomNum+'" dataLoad="false" class="chartContainer" style="display: none"></div>'+
                                '</div>'+
                                '<div class="tBox box_bgGray">'+
                                '</div>'+
                            '</div>'+
                            '<h6 id="'+('profitDate'+randomNum)+'" class="note t_gray" style=" text-align: left; margin: 0.875rem 0 -0.25rem;"></h6>'+
                        '</div>'+

                        // 成长能力
                        '<div id="'+('growup'+randomNum)+'" class="item">'+
                            '<h5>'+description[1]+'</h5>'+
                            '<ul class="tab TAB1" onclick="financialAnalysisSubTabClick(event, \''+marketType+'\', \''+stockCode+'\', \'growup\', \''+randomNum+'\')">'+
                                '<li class="on">季度</li>'+
                                '<li>年度</li>'+
                            '</ul>'+
                            '<div>'+
                                '<div class="chart" style="min-height: 250px;">'+
                                    '<div id="growup_season_'+randomNum+'" dataLoad="false" class="chartContainer"></div>'+
                                    '<div id="growup_year_'+randomNum+'" dataLoad="false" class="chartContainer" style="display: none"></div>'+
                                '</div>'+
                                '<div class="tBox box_bgGray">'+
                                '</div>'+
                            '</div>'+
                            '<h6 id="'+('growupDate'+randomNum)+'" class="note t_gray" style=" text-align: left; margin: 0.875rem 0 -0.25rem;"></h6>'+
                        '</div>'+

                        // 运营能力
                        tagOperationTabContentForAnalysis+

                        // 偿债能力
                        '<div id="'+('debt'+randomNum)+'" class="item">'+
                            '<h5>'+description[3]+'</h5>'+
                            '<ul class="tab TAB1" onclick="financialAnalysisSubTabClick(event, \''+marketType+'\', \''+stockCode+'\', \'debt\', \''+randomNum+'\')">'+
                                '<li class="on">季度</li>'+
                                '<li>年度</li>'+
                            '</ul>'+
                            '<div>'+
                                '<div class="chart" style="min-height: 250px;">'+
                                    '<div id="debt_season_'+randomNum+'" dataLoad="false" class="chartContainer"></div>'+
                                    '<div id="debt_year_'+randomNum+'" dataLoad="false" class="chartContainer" style="display: none"></div>'+
                                '</div>'+
                                '<div class="tBox  box_bgGray">'+
                                '</div>'+
                            '</div>'+
                            '<ul class="tab TAB1" onclick="financialAnalysisSubTabClick(event, \''+marketType+'\', \''+stockCode+'\', \'debt2\', \''+randomNum+'\')">'+
                                '<li class="on">季度</li>'+
                                '<li>年度</li>'+
                            '</ul>'+
                            '<div>'+
                                '<div class="chart" style="min-height: 250px;">'+
                                    '<div id="debt2_season_'+randomNum+'" dataLoad="false" class="chartContainer"></div>'+
                                    '<div id="debt2_year_'+randomNum+'" dataLoad="false" class="chartContainer" style="display: none"></div>'+
                                '</div>'+
                                '<div class="tBox box_bgGray">'+
                                '</div>'+
                            '</div>'+
                            '<h6 id="'+('debtDate'+randomNum)+'" class="note t_gray" style=" text-align: left; margin: 0.875rem 0 -0.25rem;"></h6>'+
                        '</div>'+

                        // 现金流
                        '<div id="'+('cash'+randomNum)+'" class="item">'+
                            '<h5>'+description[4]+'</h5>'+
                            '<ul class="tab TAB1" onclick="financialAnalysisSubTabClick(event, \''+marketType+'\', \''+stockCode+'\', \'cash\', \''+randomNum+'\')">'+
                                '<li class="on">季度</li>'+
                                '<li>年度</li>'+
                            '</ul>'+
                            '<div>'+
                                '<div class="chart" style="min-height: 250px;">'+
                                    '<div id="cash_season_'+randomNum+'" dataLoad="false" class="chartContainer"></div>'+
                                    '<div id="cash_year_'+randomNum+'" dataLoad="false" class="chartContainer" style="display: none"></div>'+
                                '</div>'+
                                '<div class="tBox box_bgGray">'+
                                '</div>'+
                            '</div>'+
                            '<div>'+
                                '<div class="chart" style="min-height: 250px;">'+
                                    '<div id="cash2_year_'+randomNum+'" dataLoad="false" class="chartContainer"></div>'+
                                '</div>'+
                                '<div class="tBox box_bgGray">'+
                                '</div>'+
                            '</div>'+
                            '<div>'+
                                '<div class="chart" style="min-height: 250px;">'+
                                    '<div id="cash3_year_'+randomNum+'" dataLoad="false" class="chartContainer"></div>'+
                                '</div>'+
                                '<div class="tBox box_bgGray">'+
                                '</div>'+
                            '</div>'+
                            '<h6 id="'+('cashDate'+randomNum)+'" class="note t_gray" style=" text-align: left; margin: 0.875rem 0 -0.25rem;"></h6>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            tagLink+
        '</div>';

    var temp = '';
    if(isPopup){
        temp = tagBody;
        appendAnswerToPopup(temp);
    }
    else{
        temp = '<div class="bd"><div class="mb">'+tagBody+getRatingLabel(result, showInteractiveView)+'</div></div>';
        appendAnswer(temp, '', result.qId);
        scrollToQuestion();
        getQuestionTabs(result);

        // 取报价
        getStockQuota(marketType+stockCode, 'stock'+randomNum);
    }

    // 蜘蛛图
    var chart = new PolygonChart(result.data.totalScore);
    chart.fieldCategories = fieldCategories;
    chart.xCategories = xCategories;
    chart.initialize(chartId, scores.reverse());

    // 取默认Tab展示的第一个图表数据
    var param = {
        marType: marketType,
        secCode: stockCode,
        financeIndex: 'waaRoe',
        financeQuarter: 'year',
        tabType: 'mainIndex',
        randomNum: randomNum
    };
    updateMainIndexData(param)

    // 取默认Tab展示的第一个图表数据
    // var params = {
    //     marType: marketType,
    //     secCode: stockCode,
    //     statType: 'mainIndex',
    //     type: 'quarter'
    // };
    // financialAnalysisPartInfo(params, function (result) {
    //     // console.log(result)
    //     var list = result.data.mainIndexList || [];
    //     var len = list.length;
    //     var item = {};
    //     var c1 = '<li></li>',
    //         c2 = '<li>'+getQuarterLabel(result.data.mainIndexDate)+'</li>',
    //         c3 = '<li>同比变化</li>',
    //         c4 = '<li>排名</li>';
    //     for(var j = 0; j<len; j++)
    //     {
    //         item = list[j];
    //         c1 += '<li>'+item.one+'</li>';
    //
    //         var value = item.two;
    //         if(item.two){
    //             // 不同指标的单位不同
    //             if(['每股收益', '每股净资产', '每股公积金', '每股未分配利润', '每股经营现金流', '存货周转天数'].indexOf(item.one) > -1){
    //                 item.two = item.two.toFixed(2);
    //             }
    //             else if(['营业总收入', '毛利润', '归属净利润'].indexOf(item.one) > -1){
    //                 item.two = formatAmount(item.two);
    //             }
    //             else if(['重要客户集中度', '商誉占净资产比例', '毛利率', '净利率', 'ROE', 'ROIC', '政府补贴占净利润比例', '应收账款占比'].indexOf(item.one) > -1){
    //                 item.two = item.two.toFixed(2) + '%';
    //             }else{
    //                 item.two = item.two.toFixed(2);
    //             }
    //         }else{
    //             item.two = '--';
    //         }
    //         c2 += '<li class="'+(value<0?'t_red':'')+'">'+item.two+'</li>';
    //
    //         value = item.three;
    //         if(item.three)
    //             item.three = item.three.toFixed(2) + '%';
    //         else
    //             item.three = '--';
    //
    //         c3 += '<li class="'+(value<0?'t_red':'')+'">'+item.three+'</li>';
    //
    //         c4 += '<li>'+(item.four || '--')+'</li>';
    //     }
    //
    //     var w=window.innerWidth
    //         || document.documentElement.clientWidth
    //         || document.body.clientWidth;
    //     var tagArrow = '';
    //     if(w < 570)
    //         tagArrow = '<i class="icon-arrow_shape_left"></i>';
    //
    //     var tagBody =
    //         '<h6 class="note">指标单位：元</h6>'+
    //         '<div class="box_conStock lBox_outAnalysis">'+
    //             tagArrow+
    //             '<div class="outAnalysis_hd">'+
    //                 '<ul>'+
    //                     c1+
    //                 '</ul>'+
    //             '</div>'+
    //             '<div class="conStock" onscroll="tableScrollHandler(event)">'+
    //                 '<div class="box">'+
    //                     '<ul>'+
    //                         c2 +
    //                     '</ul>'+
    //                     '<ul>'+
    //                         c3 +
    //                     '</ul>'+
    //                     '<ul>'+
    //                         c4 +
    //                     '</ul>'+
    //                 '</div>'+
    //             '</div>'+
    //         '</div>'+
    //         '<h6 class="note" style=" margin: 0.875rem 0 -0.25rem;">报告期：'+generateDate(result.data.displayDate)+'</h6>';
    //
    //     $('#mainIndex'+randomNum).html(tagBody);
    // })
}

// 查看行业分析
function stockRelatedIndustryAnalysis(randomNum) {
    var stock = $('#stock'+randomNum);
    requestFixedAnswer({
        subjectCode: stock.attr('stockCode'),
        subjectType: '股票',
        subjectName: stock.attr('stockName'),
        subjectMarket: stock.attr('marketType'),
        predicateType: '同行数据对比'
    }, stock.attr('stockName')+'同行数据对比', stock.attr('marketType'), true);
    closePopup();
    scrollToQuestion();
}

// 查看财务分析
function stockFinancialAnalysis(randomNum) {
    var stock = $('#stock'+randomNum);
    requestFixedAnswer({
        subjectCode: stock.attr('stockCode'),
        subjectType: '股票',
        subjectName: stock.attr('stockName'),
        subjectMarket: stock.attr('marketType'),
        predicateType: '财务分析'
    }, stock.attr('stockName')+'财务分析', stock.attr('marketType'), true);
    closePopup();
    scrollToQuestion();
}

// 查看更多财务指标
function stockMoreFinancialIndex(randomNum) {
    var stock = $('#stock'+randomNum);
    requestFixedAnswer({
        subjectCode: stock.attr('stockCode'),
        subjectType: '股票',
        subjectName: stock.attr('stockName'),
        subjectMarket: stock.attr('marketType'),
        predicateType: '财务数据是'
    }, stock.attr('stockName')+'财务数据', stock.attr('marketType'), true);
    closePopup();
    scrollToQuestion();
}

/**
 * 财务分析 一级tab 切换
 * @param event
 * @param tableContainerId
 */
function marginSubTabClick2(event, tableContainerId, randomNum) {
    // console.log($(event.currentTarget).index())
    var curTarget = $(event.currentTarget);
    var index = curTarget.index();
    curTarget.addClass('on').siblings().removeClass('on');
    $('#'+tableContainerId).find('> div').eq(index).addClass('show').siblings().removeClass('show');
    if (index === 1) {
        $('#tabContainer'+randomNum).find('li.on').eq(0).click()
    }
}
// 主要指标内部tab切换
function mainIndexSubTabClick(event, randomNum) {
    // 当前点击对象
    var curTarget = $(event.currentTarget);
    // tab选中，其它同级元素隐藏
    curTarget.attr('class', 'on').siblings().attr('class', '');
    var index = curTarget.index();
    var tabType = curTarget.attr('tabType');
    $('#mainIndex_container'+randomNum).find('> div').eq(index+1).addClass('show').siblings().removeClass('show');

    // 主要指标对象
    var tagMainIndex = $('#'+tabType+randomNum);
    var dataLoad = tagMainIndex.attr('dataLoad');
    // 当前选中的指标
    var tagIndex = $('#'+tabType+'_ul'+randomNum).find('li.on');
    if (dataLoad === 'false') {
        var param = {
            marType: tagMainIndex.attr('marketType'),
            secCode: tagMainIndex.attr('stockCode'),
            financeIndex: tagIndex.attr('indexType'),
            financeQuarter: tagMainIndex.attr('period'),
            tabType: tabType,
            randomNum: randomNum
        };
        updateMainIndexData(param);
    }
}
// 主要指标内部 子Tab点击
function indexSubTabClick(event, tabType, randomNum) {
    // console.log(event)
    // 当前点击对象
    var curTarget = $(event.currentTarget);
    if (curTarget.hasClass('on')) {
        return;
    }
    // tab选中，其它同级元素隐藏
    curTarget.attr('class', 'on').siblings().attr('class', '');
    // 当前指标(英文)
    var indexType = curTarget.attr('indexType');
    // console.log(indexType)
    // 主要指标对象
    var tagMainIndex = $('#'+tabType+randomNum);
    // 更新指标的周期
    var period = tagMainIndex.attr('period');

    // 当前选中的指标
    var tagIndex = $('#'+tabType+'_ul'+randomNum).find('li.on');
    var param = {
        marType: tagMainIndex.attr('marketType'),
        secCode: tagMainIndex.attr('stockCode'),
        financeIndex: indexType || tagIndex.attr('indexType'),
        financeQuarter: period,
        tabType: tabType,
        randomNum: randomNum
    };
    updateMainIndexData(param);
}
// 周期列表是否可见
function setPeriodVisible(event, tabType, randomNum) {
    // console.log(event)
    $('#'+tabType+'_period'+randomNum).toggleClass('show');
}
// 周期选择
function periodClick(event, tabType, randomNum) {
    // console.log(event.currentTarget)
    // 当前点击对象
    var curTarget = $(event.currentTarget);
    // tab选中，其它同级元素隐藏
    curTarget.attr('class', 'on').siblings().attr('class', '');
    // 取点击的中文文本
    var zh = curTarget.text();
    // 中文转换为对应的周期
    var period = getPeriodByZh(zh);
    // 当前选中的指标
    var tagIndex = $('#'+tabType+'_ul'+randomNum).find('li.on');
    // console.log(tagIndex.attr('indexType'), period)
    // 显示或隐藏周期列表
    $('#'+tabType+'_period'+randomNum).toggleClass('show');
    // console.log($('#'+tabType+'_curPeriod'+randomNum))
    // 更新当前选中周期中文
    $('#'+tabType+'_curPeriod'+randomNum).html(zh+'<i class="icon-arrow2_B_small"></i>');
    // 主要指标对象
    var tagMainIndex = $('#'+tabType+randomNum);
    // 更新指标的周期
    tagMainIndex.attr('period', period);

    var param = {
        marType: tagMainIndex.attr('marketType'),
        secCode: tagMainIndex.attr('stockCode'),
        financeIndex: tagIndex.attr('indexType'),
        financeQuarter: period,
        tabType: tabType,
        randomNum: randomNum
    };
    updateMainIndexData(param);
}

// 更新主要指标图表及列表数据
function updateMainIndexData(param) {
    financialAnalysisMainIndex(param, function (result) {
        // console.log(result)
        $('#'+param.tabType+param.randomNum).attr('dataLoad', true);
        var option = getOptionByIndex(param.financeIndex);
        var params = {
            containerId: param.tabType+'_chart'+param.randomNum,
            unit: '',
            colors: ['#5e98f4', '#eab537', '#ed665a'],
            dateQuarter: true,
            showDataLabels: true,
            yAxisVisible: false,
            xAxisVisible: false,
            valueDecimals: 2,
            series: [
                {name: option.name+'('+option.unit+')', field: 'disPlayValueOne', type: 'column', tooltip: {valueSuffix: option.unit}, data: []},
                {name: '同比', field: 'disPlayValueTwo', type: 'spline', yAxis:1, tooltip: {valueSuffix: '%'}, data: []}
            ],
            // 双Y轴
            // yAxis: [{
            //     title: {
            //         text: ''
            //     },
            //     // lineWidth: 1,
            //     labels: {
            //         align: 'right',
            //         x: 0,
            //         y: -2,
            //         // reserveSpace: false,  // 轴标签不占用空间
            //         format: '{value:.0f}'
            //     },
            //     visible: this.yAxisVisible
            // },
            //     {
            //         title: {
            //             text: ''
            //         },
            //         // lineWidth: 1,
            //         labels: {
            //             align: 'right',
            //             x: 0,
            //             y: -2,
            //             // reserveSpace: false,  // 轴标签不占用空间
            //             format: '{value:.0f}'
            //         },
            //         opposite: true,
            //         visible: this.yAxisVisible
            //     }]
        };

        var list = result.data || [];
        // 资产负责额外处理
        if (param.financeIndex === 'balanceSheet') {
            var maxNum = 0;
            list.forEach(function (value) {
                maxNum = Math.max(maxNum, value.disPlayValueOne, value.disPlayValueTwo);
            });
            if (maxNum > 1e12) {
                option.dividedBy = 1e12;
                option.unit = '万亿';
            }
            params.series = [
                {name: '总资产'+'('+option.unit+')', field: 'disPlayValueOne', type: 'column', tooltip: {valueSuffix: option.unit+'元'}, data: []},
                {name: '总负债'+'('+option.unit+')', field: 'disPlayValueTwo', type: 'column', tooltip: {valueSuffix: option.unit+'元'}, data: []},
                {name: '负债率', field: 'disPlayValueThree', type: 'spline', yAxis:1, tooltip: {valueSuffix: '%'}, data: []}
            ];
            params.colors = ['#5e98f4', '#ed665a', '#eab537'];
        }

        // 列表标签
        var tagList = [];
        for (var j=0; j<=params.series.length; j++) {
            if (j === 0)
                tagList.push('<li></li>');
            else
                tagList.push('<li><b></b></li>');
        }

        list = list.reverse();
        var categories = [];
        list.forEach(function (item, index) {
            var dateStr = item.reportQuarter;
            if(params.dateQuarter)
                dateStr = getQuarterLabel(item.reportQuarter, 'zh2', true).replace(' ', '');
            categories.push(dateStr);

            // 图表用
            for(var p in params.series)
            {
                var fieldValue = list[index][params.series[p].field]+0;
                if (fieldValue && params.series[p].name !== '同比' && params.series[p].name !== '负债率')
                    fieldValue /= option.dividedBy;
                params.series[p].data.push(fieldValue);
            }

            // 列表用
            for (var m in tagList) {
                var n = parseInt(m);
                var value;
                if (n === 0)
                    tagList[n] += '<li>'+dateStr+'</li>';
                else if (n === 1) {
                    value = item.disPlayValueOne;
                    if (param.financeIndex === 'balanceSheet') {
                        value = formatAmount(value);
                    } else {
                        value = isNaN(value) ? value : value/option.dividedBy;
                        value = (value?value.toFixed(2) + option.unit.replace('亿元','亿'):'--')
                    }
                    tagList[n] += '<li>'+value+'</li>';
                }
                else if (n === 2) {
                    value = item.disPlayValueTwo;
                    if (param.financeIndex === 'balanceSheet') {
                        value = formatAmount(value);
                        tagList[n] += '<li>'+value+'</li>';
                    } else {
                        value = !isNaN(value) ?value.toFixed(2) + '%':'--'
                        tagList[n] += '<li class="'+getClsByNumber(item.disPlayValueTwo)+'">'+value+'</li>';
                    }
                }
                else if (n === 3) {
                    value = item.disPlayValueThree;
                    value = !isNaN(value)?value.toFixed(2) + '%':'--';
                    tagList[n] += '<li class="'+getClsByNumber(item.disPlayValueThree)+'">'+value+'</li>';
                }
            }
        });

        for (var x in tagList) {
            tagList[x] = '<ul>'+tagList[x]+'</ul>';
        }
        $('#'+param.tabType+'_list'+param.randomNum).html(tagList.join(''));

        var baseChart = new BaseChart();
        baseChart.categories = categories;
        for(var p in params){
            baseChart[p] = params[p];
        }
        baseChart.initialize();
    })
}

//盈利能力等一级tab点击
function financialAnalysisTabClick(event, randomNum) {
    // console.log(event.currentTarget)
    var curTarget = $(event.currentTarget || event.target);
    var tabType = curTarget.attr('tabType');
    // tab选中，其它同级元素隐藏
    curTarget.attr('class', 'on').siblings().attr('class', '');
    // tab关联div展示，其它的隐藏
    $('#'+tabType+randomNum).show().siblings().hide();

    // 点击时如果tab没有完全展示，那么滚动一下
    var tabContainer = $('#tabContainer'+randomNum)[0];
    if(tabType === 'cash' || tabType === 'debt'){
        tabContainer.scrollLeft = tabContainer.scrollWidth - tabContainer.clientWidth;
    }else if(tabType === 'growup' || tabType === 'profit'){
        tabContainer.scrollLeft = 0;
    }

    // 取当前点击Tab默认展示的第一个图表数据
    var marketType = curTarget.attr('marketType');
    var stockCode = curTarget.attr('stockCode');
    var dataLoad = $('#'+tabType+'_season_'+randomNum).attr('dataLoad');
    if(dataLoad === 'false'){
        var params = {
            marType: marketType,
            secCode: stockCode,
            statType: tabType,
            type: 'quarter'
        };
        financialAnalysisPartInfo(params, function (result) {
            setFinancialChartData(tabType+'_season_'+randomNum, tabType, result);

            // 话术
            var description = [];
            if(result && result.data)
                description = result.data.description || [];
            var tag = '';
            for(var i=0; i<description.length; i++){
                tag +='<h5>'+description[i]+'</h5>';
            }

            var tbox = $('#'+tabType+randomNum).find('.tBox');
            tbox.eq(0).html(tag);
            if (tabType === 'operation' || tabType === 'debt' || tabType === 'profit' || tabType === 'yinhangSpec' || tabType === 'baoxianSpec') {
                // tbox.eq(1).html('<h5>'+result.data.descriptionDebtOperation+'</h5>');
                var tag2 = getDescriptionTag(result.data.descriptionTwo || []);
                if (tag2)
                    tbox.eq(1).html(tag2);

                var tag3 = getDescriptionTag(result.data.descriptionThree || []);
                if (tag3)
                    tbox.eq(2).html(tag3);
            }

            $('#'+tabType+'Date'+randomNum).html('诊断数据依赖于个股与业内其它公司对比；</br>当前数据报告期：'+generateDate(result.data.displayDate))
        });

        // 现金流因为季度与年度同时展示，所以需要另取一次年度的数据
        if (tabType === 'cash') {
            var params2 = {
                marType: marketType,
                secCode: stockCode,
                statType: tabType,
                type: 'year'
            };
            financialAnalysisPartInfo(params2, function (result) {
                setFinancialChartData(tabType+'_year_'+randomNum, tabType, result);

                var tbox = $('#'+tabType+randomNum).find('.tBox');
                // tbox.eq(1).html('<h5>'+result.data.descriptionDebtOperation+'</h5>');
                // tbox.eq(2).html('<h5>'+result.data.descriptionThreeOperation+'</h5>');
                var tag2 = getDescriptionTag(result.data.descriptionTwo || []);
                if (tag2)
                    tbox.eq(1).html(tag2);

                var tag3 = getDescriptionTag(result.data.descriptionThree || []);
                if (tag3)
                    tbox.eq(2).html(tag3);
            })
        }
    }
}
function getDescriptionTag(tempArray) {
    var tag = '';
    for(var i=0; i<tempArray.length; i++){
        tag +='<h5>'+tempArray[i]+'</h5>';
    }
    return tag;
}
//年度，季度二级tab点击
function financialAnalysisSubTabClick(event, marketType, stockCode, tabType, randomNum) {
    var target = $(event.target);
    var className = event.target.className;
    if(className !== 'on'){
        var text = target.html();
        // 设置选中点击tab样式，同级隐藏
        target.addClass('on').siblings().removeClass('on');

        var seasonId = tabType+'_season_'+randomNum;
        var yearId = tabType+'_year_'+randomNum;
        // 记下选择图表容器ID，数据返回后使用
        var containerId = '';
        var type = '';
        if(text === '季度'){
            containerId = seasonId;
            $('#'+seasonId).show();
            $('#'+yearId).hide();
            type = 'quarter';
        }else if(text === '年度'){
            containerId = yearId;
            $('#'+seasonId).hide();
            $('#'+yearId).show();
            type = 'year';
        }

        // 有属性里取下看图表的数据是否已经加载
        var chartContainer = $('#'+containerId);
        var dataLoad = chartContainer.attr('dataLoad');
        if(dataLoad === 'false'){
            chartContainer.attr('dataLoad', 'loading');
            //取点击的子tab对应的图表数据
            var params = {
                marType: marketType,
                secCode: stockCode,
                statType: tabType.replace('2', '').replace('3', ''),
                type: type
            };
            financialAnalysisPartInfo(params, function (result) {
                setFinancialChartData(containerId, tabType, result);
            })
        }
    }
}
// 设置图表数据
function setFinancialChartData(containerId, tabType, result) {
    tabType = tabType.replace('2', '').replace('3', '');

    // 拼图表容器Id，并设置标签属性为已取到数据
    var ids = containerId.split('_');
    var chartId = [tabType,ids[1],ids[2]].join('_');
    var chartId2 = [tabType+2,ids[1],ids[2]].join('_');
    var chartId3 = [tabType+3,ids[1],ids[2]].join('_');
    $('#'+chartId).attr('dataLoad', 'true');
    if(tabType === 'profit' || tabType === 'operation' || tabType === 'debt' || tabType === 'cash' || tabType === 'yinhangSpec' || tabType === 'baoxianSpec') {
        $('#'+chartId2).attr('dataLoad', 'true');
        if (tabType === 'cash' || tabType === 'operation' || tabType === 'yinhangSpec') {
            $('#'+chartId3).attr('dataLoad', 'true');
        }
    }

    // 构造图表行，列数据
    var categories = []; // X
    var series = []; // Y
    var series2 = []; // Y  chart2
    var series3 = []; // Y  chart3
    var unit = '%';
    var unit2 = '%';
    var unit3 = '%';

    var profit = [{name:'毛利率', field: 'sFaGrossprofitmargin', data: []},
                {name:'净利率', field: 'sFaNetprofitmargin', data: []}];
    var profit2 = [{name:'ROE', field: 'roe', data: []}];

    var cash = [{name:'经营活动现金流占比净利润', field: 'netCashFlowsOperAct', data: []}];
    var cash2 = [{name:'现金再投资比率', field: 'cashReRatio', data: []}];
    var cash3 = [{name:'现金流量允当比率', field: 'cashAdequacyRatio', data: []}];

    var growup = [{name:'净利润同比增长率', field: 'sFaYoynetprofit', data: []},
                {name:'营业收入同比增长率', field: 'sFaYoyTr', data: []},
                {name:'可持续增长率', field: 'sgr', data: []}];

    var operation = [{name:'营业周期', field: 'sFaTurndays', data: []},
                {name:'存货周转天数', field: 'sFaInvturndays', data: []}];
    var operation2 = [{name:'总资产周转率', field: 'sFaAssetsturn', data: []},
                    {name:'流动资产周转率', field: 'sFaCaturn', data: []},
                    {name:'固定资产周转率', field: 'sFaFaturn', data: []}];
    var operation3 = [{name:'应收账款周转率', field: 'sFaArturn', data: []}];

    var debt = [{name:'流动比率', field: 'sFaCurrent', data: []},
                {name:'速动比率', field: 'sFaQuick', data: []}];
    var debt2 = [{name:'资产负债率', field: 'sFaDebttoassets', data: []}];

    if(tabType === 'profit'){
        series = profit;
        series2 = profit2;
    }
    else if(tabType === 'cash'){
        series = cash;
        series2 = cash2;
        series3 = cash3;
        unit = '%';
    }
    else if(tabType === 'growup'){
        series = growup;
    }
    else if(tabType === 'operation'){
        series = operation;
        series2 = operation2;
        series3 = operation3;
        unit = '天';
        unit2 = '次';
        unit3 = '次';
    }
    else if(tabType === 'debt'){
        series = debt;
        series2 = debt2;
        unit = '倍';
        unit2 = '%';
    }
    else if(tabType === 'yinhangSpec'){
        series = [{name:'资本充足率', field: 'capiAdeRatio', data: []}];
        series2 = [{name:'不良贷款率', field: 'nplRatio', data: []}];
        series3 = [{name:'资本净额', field: 'netCapital', data: []}];
        unit3 = '亿';
    }
    else if(tabType === 'baoxianSpec'){
        // series = [{name:'内含价值', field: 'sFaAssetsturn', data: []}];
        series = [{name:'赔付率(产险)', field: 'lossRatioProperty', data: []}];
        series2 = [{name:'内含价值(寿险)', field: 'intrinsicValueLife', data: []}];
        unit2 = '亿';
    }
    else if(tabType === 'zhengquanSpec'){
        series = [{name:'净资本', field: 'netCapitalVal', data: []}];
        unit = '亿';
    }

    var list = [];
    if(result && result.data)
        list = result.data.statInfos.reverse() || [];

    // 遍历出X，Y轴的数据
    for(var i=0; i<list.length; i++){
        categories.push(getQuarterLabel(list[i].quarterYear, 'en'));
        var field, value;
        for(var p in series)
        {
            field = series[p].field;
            value = list[i][field] || null;
            if (field === 'netCapital' || field === 'netCapitalVal') {
                value = value ? value/1e8 : value;
            }
            series[p].data.push(value);
        }

        // 第二个图表
        if(tabType === 'profit' || tabType === 'operation' || tabType === 'debt' || tabType === 'cash' || tabType === 'yinhangSpec' || tabType === 'baoxianSpec'){
            for(p in series2)
            {
                field = series2[p].field;
                value = list[i][field] || null;
                if (field === 'intrinsicValueLife') {
                    value = value ? value/1e8 : value;
                }
                series2[p].data.push(value);
            }
            // 第三个图表
            if (tabType === 'cash' || tabType === 'operation' || tabType === 'yinhangSpec') {
                for(p in series3)
                {
                    field = series3[p].field;
                    value = list[i][field] || null;
                    if (field === 'netCapital' || field === 'netCapitalVal') {
                        value = value ? value/1e8 : value;
                    }
                    series3[p].data.push(value);
                }
            }
        }
    }

    // 赋值给图表，现金流使用柱状图改为折线图
    var chart;
    // if(containerId.split('_')[0] === 'cash')
    //     chart = new LineChart();
    // else
        chart = new LineChart();
    chart.initialize(chartId, categories, series, unit);

    // 有两个图表
    if(tabType === 'profit' || tabType === 'operation' || tabType === 'debt' || (tabType === 'cash' && ids[1] !== 'season') || tabType === 'yinhangSpec' || tabType === 'baoxianSpec'){
        var chart2 = new LineChart();
        chart2.initialize(chartId2, categories, series2, unit2);
        // 有三个图表
        if (tabType === 'cash' || tabType === 'operation' || tabType === 'yinhangSpec') {
            var chart3 = new LineChart();
            chart3.initialize(chartId3, categories, series3, unit3);
        }
    }
}

/**
 * 财务主要指标
 * @param result
 * @param isPopup
 * @param showInteractiveView
 * @author zhaobo
 */
function financialMainIndex(result, isPopup, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var property = getPropertyByEntity(result.questionAnalyse[0].entity);
    var marketType = property.marketType,
      stockCode = property.code;
    var randomNum = generateRandomClassName();

    var tagBody =
        '<div class="box_UP_indexChange">'+
            '<ul id="stock'+randomNum+'" marketType="'+marketType+'" stockCode="'+stockCode+'" stockName="'+property.name+'" class="stock2">'+
            '</ul>'+

            '<div id="list'+randomNum+'" class="box_conStock lBox_UP_indexChange" style="display: none">'+
                '<i class="icon-arrow_shape_left"></i>'+
                '<b></b>'+
                '<div class="conStock_hd">'+
                    '<ul id="indicatorName'+randomNum+'" class=" box_label2">'+
                        // <!--
                        //     li样式
                        //     标题栏：li标签加样式名：li_hd
                        //     两行：li标签加样式名：li_line2
                        // -->
                        '<li>'+
                            '<a id="'+('financialMainIndex_curPeriod'+randomNum)+'" onclick="setPeriodVisible(event, \'financialMainIndex\', \''+randomNum+'\')">年报<i class="icon-arrow2_B_small"></i></a>'+

                            // <!-- 下拉框 -->
                            '<ul id="'+('financialMainIndex_period'+randomNum)+'" onclick="periodClick2(event, \'financialMainIndex\', \''+randomNum+'\')" class="ddList">'+
                                '<li>全部</li>'+
                                '<li class="on">年报</li>'+
                                '<li>中报</li>'+
                                '<li>一季报</li>'+
                                '<li>三季报</li>'+
                                '<b></b>'+
                            '</ul>'+

                            // <!--
                            //     i标签
                            //     未选状态样式名：icon-select_no
                            //     已选状态样式名：icon-select
                            // -->
                            '<a class="radio_yoy" onclick="setYoyVisible(event, \''+randomNum+'\')"><i id="yoy'+randomNum+'" class="icon-select"></i>看同比</a>'+
                        '</li>'+
                        // '<li class="li_hd">每股指标</li>'+
                    '</ul>'+
                '</div>'+
                '<div id="con'+randomNum+'" class="conStock">'+
                    '<div id="quarter'+randomNum+'" class="box">'+
                    '</div>'+
                '</div>'+
            '</div>'+

            '<ul class="tlBox_link">'+
                '<li onclick="stockFinancialAnalysis(\''+randomNum+'\')">查看财务分析</li>'+
                '<li onclick="stockRelatedIndustryAnalysis(\''+randomNum+'\')">查看同行业比较</li>'+
            '</ul>'+
        '</div>';

    var temp = '<div class="bd"><div class="mb">'+tagBody+getRatingLabel(result)+'</div></div>';
    appendAnswer(temp, '', result.qId);
    scrollToQuestion();
    getQuestionTabs(result);

    // 取报价
    getStockQuota(marketType+stockCode, 'stock'+randomNum);

    var params = {
        marketType: marketType,
        stockCode: stockCode,
        financeQuarter: 'year',
        cache: true,
        randomNum: randomNum
    };
    updateFinanceReport(params);
}
// 看同比
function setYoyVisible(event, randomNum) {
    // 当前点击对象
    var curTarget = $(event.currentTarget);
    var icon = curTarget.children()[0];
    var className = icon.className;
    if (className === 'icon-select') {
      icon.className = 'icon-select_no';
    }
    else {
      icon.className = 'icon-select';
    }
    $('.yoy_ul_'+randomNum).toggleClass('hide');
}
// 周期选择
function periodClick2(event, tabType, randomNum) {
    // console.log(event.target)
    // 当前点击对象
    var curTarget = $(event.target);
    // tab选中，其它同级元素隐藏
    curTarget.attr('class', 'on').siblings().attr('class', '');
    // 取点击的中文文本
    var zh = curTarget.text();
    // 中文转换为对应的周期
    var period = getPeriodByZh(zh);
    // 当前选中的指标
    // console.log(tagIndex.attr('indexType'), period)
    // 显示或隐藏周期列表
    $('#'+tabType+'_period'+randomNum).toggleClass('show');
    // console.log($('#'+tabType+'_curPeriod'+randomNum))
    // 更新当前选中周期中文
    $('#'+tabType+'_curPeriod'+randomNum).html(zh+'<i class="icon-arrow2_B_small"></i>');

    var stock = $('#stock'+randomNum);
    var params = {
        marketType: stock.attr('marketType'),
        stockCode: stock.attr('stockCode'),
        financeQuarter: period,
        cache: true,
        randomNum: randomNum
    };
    updateFinanceReport(params);
}
// 更新报告期数据
function updateFinanceReport(params) {
    financeReport(params, function (result) {
        // console.log(result)
        $('#list'+params.randomNum).show();

        var list = result.data || [];

        // 指标名称列
        var tagName = '';
        // 所有的报告期
        var allQuarter = [];
        var tagList = [];
        // 此步骤提取所有的报告期，同时拼好名称列，报告期、同比列的头部（包含每股指标）
        list.forEach(function (value) {
            var cls = '';
            if (value.indicatorType === 1 || value.indicatorType === 3) // 带底色
                cls = 'li_hd';
            else if (value.indicatorType === 2) // 两行
                cls = 'li_line2';

            if (value.indicatorType === 0 || value.indicatorType === 2) {
                var indicatorName = value.indicatorName;
                if (indicatorName.indexOf('(') !== -1)
                    indicatorName = indicatorName.substring(0, indicatorName.indexOf('('));
                tagName += '<li class="'+cls+'" onclick="indicatorNameClick(\''+indicatorName+'\')">'+value.indicatorName+'<i class="icon-arrow2_R_small" style="color:#a1a2a8 !important"></i></li>';
            } else {
                tagName += '<li class="'+cls+'">'+value.indicatorName+'</li>';
            }

            var data = value.data || [];
            data.forEach(function (item) {
                if (item && allQuarter.indexOf(item.reportQuarter) === -1) {
                    allQuarter.push(item.reportQuarter);
                    tagList.push('<li style="font-size: 0.75rem">'+getQuarterLabel(item.reportQuarter,'zh2')+'</li>');
                    tagList.push('<li style="font-size: 0.75rem">同比</li>');
                    // tagList.push('<li style="font-size: 0.75rem">'+getQuarterLabel(item.reportQuarter,'zh2')+'</li><li class="li_hd"></li>');
                    // tagList.push('<li style="font-size: 0.75rem">同比</li><li class="li_hd"></li>');
                }
            })
        });

        // 循环拼数据
        list.forEach(function (value, qindex) {
            // 样式
            var cls = '';
            if (value.indicatorType === 1 || value.indicatorType === 3)
                cls = 'li_hd';
            else if (value.indicatorType === 2)
                cls = 'li_line2';

            var j = 0;
            var dataList = value.data || [];
            if (dataList.length === 0 || value.indicatorType === 3) {
                var text = value.indicatorType === 3 ? '' : '--';
                // 处理某个指标的data返回为空数组的情况，循环报告期数组的长度给该指标拼一个空标签占位！
                allQuarter.forEach(function (value1, index1) {
                    tagList[index1+j] +='<li class="'+cls+'">'+text+'</li>';
                    tagList[index1+j+1] +='<li class="'+cls+'">'+text+'</li>';
                    j++;
                })
            } else {
                dataList.forEach(function (item, index) {
                    var value1 = '';
                    if (value.indicatorType === 1)
                        value1 = item.disPlayValueOne || '--';
                    else
                        value1 = formatNumber(item?item.disPlayValueOne:'--');

                    // 同比正红负绿
                    var value2Cls = '';
                    var value2 = item ? item.disPlayValueTwo : 0;
                    if (value2 > 0)
                        value2Cls = ' t_red';
                    else if (value2 < 0)
                        value2Cls = ' t_green';

                    tagList[index+j] +='<li class="'+cls+'">'+value1+'</li>';
                    tagList[index+j+1] +='<li class="'+cls+value2Cls+'">'+(!isNaN(value2) ? value2.toFixed(2)+'%':'--')+'</li>';
                    j++
                })
            }
        });

        // 是否看同比
        var yoyEnabled = $('#yoy'+params.randomNum).attr('class') === 'icon-select';
        // 给每列前后加标签，同比列额外加样式用来控制显示隐藏
        tagList.forEach(function (value, index) {
            var id = '';
            var cls = '';
            if (index % 2 === 1) {
                id = 'yoy_ul_'+params.randomNum;
                cls = yoyEnabled ? '' : ' hide';
            }

            tagList[index] = '<ul class="num '+id+cls+'">' + value + '</ul>';
        });
        // console.log(tagList)

        // 各报告期数据列
        $('#quarter'+params.randomNum).html(tagList.join(''));

        var nameContainer = $('#indicatorName'+params.randomNum);
        // 指标名称列只拼一次
        if (nameContainer.children().length === 1) {
            nameContainer.append(tagName)
        }

        $('#con'+params.randomNum).scrollLeft(0);
    });
}
// 指标点击：回答基础知识
function indicatorNameClick(name) {
    // console.log(name)
    if (!name)
        return;
    requestFixedAnswer({
        question: name,
        predicateType: '基础知识'
    }, name, '', true);
}

/**
 * 行业数据对比
 * @param result
 * @param isPopup
 * @param showInteractiveView
 * @author zhaobo
 */
function companyIndustryCompare(result, isPopup, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var property = getPropertyByEntity(result.questionAnalyse[0].entity);
    var marketType = property.marketType,
        stockCode = property.code;
    var randomNum = generateRandomClassName();

    var industryCode = result.data.induSortCode || '';
    // 所属行业
    var industry = result.data.induSortName || '';

    var tagSpecialTab = '',
        tagSpecialContent = '';

    var tagOperationTab =
            '<li tabType="operation" onclick="industryCompareSubTabClick(event, \''+randomNum+'\')">'+
                '<span>运营能力<b></b></span>'+
            '</li>';

    var tagOperationTabContent =
            '<div id="operation'+randomNum+'" dataLoad="false" class="item">'+
                '<ul id="operation_ul'+randomNum+'" class="box_label box_label2" onclick="indexSubTabClick2(event, \'operation\', \''+randomNum+'\')">'+
                    '<li indexType="sFaAssetsturn" class="on">总资产周转率</li>'+
                    '<li indexType="sFaTurndays">营业周期</li>'+
                    '<li indexType="sFaInvturndays">存货周转天数</li>'+
                    '<li indexType="sFaArturn">应收账款周转率</li>'+
                '</ul>'+

                '<div id="operation_chart'+randomNum+'" class="tlBox_indComparison">'+
                '</div>'+
            '</div>';

    var tabType = '';
    if (['S4901', 'S4801', 'S4902'].indexOf(industryCode) !== -1) {
        tagOperationTab = '';
        tagOperationTabContent = '';
        // 银行
        if (industryCode === 'S4801') { //银行
            tabType = 'yinhangSpec';
            tagSpecialContent =
                '<div id="'+tabType+randomNum+'" dataLoad="false" class="item">'+
                    '<ul id="'+tabType+'_ul'+randomNum+'" class="box_label box_label2" onclick="indexSubTabClick2(event, \''+tabType+'\', \''+randomNum+'\')">'+
                        '<li indexType="capiAdeRatio" class="on">资本充足率</li>'+
                        '<li indexType="nplRatio">不良贷款率</li>'+
                        '<li indexType="netCapital">资本净额</li>'+
                        '<li indexType="loanDepoRatio">存贷比率</li>'+ ///
                    '</ul>'+

                    '<div id="'+tabType+'_chart'+randomNum+'" class="tlBox_indComparison">'+
                    '</div>'+
                '</div>';
        } else if (industryCode === 'S4902') { //保险
            tabType = 'zhengquanSpec';
            tagSpecialContent =
                '<div id="'+tabType+randomNum+'" dataLoad="false" class="item">'+
                    '<ul id="'+tabType+'_ul'+randomNum+'" class="box_label box_label2" onclick="indexSubTabClick2(event, \''+tabType+'\', \''+randomNum+'\')">'+
                        // '<li indexType="sFaAssetsturn" class="on">内含价值</li>'+
                        '<li indexType="lossRatioProperty" class="on">赔付率(产险)</li>'+
                        '<li indexType="intrinsicValueLife">内含价值(寿险)</li>'+
                        '<li indexType="insurPremUnearned">已赚保费</li>'+ ///
                    '</ul>'+

                    '<div id="'+tabType+'_chart'+randomNum+'" class="tlBox_indComparison">'+
                    '</div>'+
                '</div>';
        } else if (industryCode === 'S4901') { //证券
            tabType = 'baoxianSpec';
            tagSpecialContent =
                '<div id="'+tabType+randomNum+'" dataLoad="false" class="item">'+
                    '<ul id="'+tabType+'_ul'+randomNum+'" class="box_label box_label2" onclick="indexSubTabClick2(event, \''+tabType+'\', \''+randomNum+'\')">'+
                        '<li indexType="netCapitalVal" class="on">净资本</li>'+
                    '</ul>'+

                    '<div id="'+tabType+'_chart'+randomNum+'" class="tlBox_indComparison">'+
                    '</div>'+
                '</div>';
        }
        tagSpecialTab =
            '<li tabType="'+tabType+'" onclick="industryCompareSubTabClick(event, \''+randomNum+'\')">'+
                '<span>'+industry+'专项指标<b></b></span>'+
            '</li>';
    }

    // 底部链接
    var tagLink =
        '<ul class="tlBox_link box_topLine">'+
            '<li onclick="stockFinancialAnalysis(\''+randomNum+'\')">查看财务分析</li>'+
            '<li onclick="stockMoreFinancialIndex(\''+randomNum+'\')">查看更多财务指标</li>'+
        '</ul>';

    var tagBody =
        '<div class="box_indComparison">'+
            '<ul id="stock'+randomNum+'" marketType="'+marketType+'" stockCode="'+stockCode+'" stockName="'+property.name+'" class="stock2">'+
            '</ul>'+

            '<h6 id="industry'+randomNum+'" class="box_bgBlueGray">'+
                // '所在的<b>电子制造</b>行业中排第<b>9</b>，共<b>102</b>家公司。'+
            '</h6>'+

            '<div class="TAB2 TAB2_scroll">'+
                '<div id="tabContainer'+randomNum+'" class="scroll">'+
                    '<ul>'+
                        '<li tabType="companySize" class="on" onclick="industryCompareSubTabClick(event, \''+randomNum+'\')">'+
                            '<span>公司规模<b></b></span>'+
                        '</li>'+
                        tagSpecialTab+
                        '<li tabType="profit" onclick="industryCompareSubTabClick(event, \''+randomNum+'\')">'+
                            '<span>盈利能力<b></b></span>'+
                        '</li>'+
                        '<li tabType="cash" onclick="industryCompareSubTabClick(event, \''+randomNum+'\')">'+
                            '<span>现金流<b></b></span>'+
                        '</li>'+
                        '<li tabType="debt" onclick="industryCompareSubTabClick(event, \''+randomNum+'\')">'+
                            '<span>偿债能力<b></b></span>'+
                        '</li>'+
                        // 运营能力
                        tagOperationTab+
                        '<li tabType="growup" onclick="industryCompareSubTabClick(event, \''+randomNum+'\')">'+
                            '<span>成长能力<b></b></span>'+
                        '</li>'+
                    '</ul>'+
                '</div>'+
                '<div class="bottom"></div>'+
            '</div>'+

            '<div id="industryCompare'+randomNum+'" class="content" style="min-height: 360px"> '+
                // 公司规模
                '<div id="companySize'+randomNum+'" dataLoad="false" class="item show">'+
                    '<ul id="companySize_ul'+randomNum+'" class="box_label box_label2" onclick="indexSubTabClick2(event, \'companySize\', \''+randomNum+'\')">'+
                        '<li indexType="marValue" class="on">总市值</li>'+
                        '<li indexType="floatMarValue">流通市值</li>'+
                    '</ul>'+

                    // '<ul class="chartTag">'+
                    //     '<li>'+
                    //         '<a id="'+('companySize_curPeriod'+randomNum)+'" onclick="setPeriodVisible(event, \'companySize\', \''+randomNum+'\')">全部<i class="icon-arrow2_B_small"></i></a>'+
                    //         // 下拉框
                    //         '<ul id="'+('companySize_period'+randomNum)+'" class="ddList" onclick="periodClick3(event, \'companySize\', \''+randomNum+'\')">'+
                    //             '<li class="on">全部</li>'+
                    //             '<li>年报</li>'+
                    //             '<li>中报</li>'+
                    //             '<li>一季报</li>'+
                    //             '<li>三季报</li>'+
                    //             '<b></b>'+
                    //         '</ul>'+
                    //     '</li>'+
                    // '</ul>'+

                    '<div id="companySize_chart'+randomNum+'" class="tlBox_indComparison">'+
                    '</div>'+
                '</div>'+

                // 专项指标
                tagSpecialContent+

                // 盈利能力
                '<div id="profit'+randomNum+'" dataLoad="false" class="item">'+
                    '<ul id="profit_ul'+randomNum+'" class="box_label" onclick="indexSubTabClick2(event, \'profit\', \''+randomNum+'\')">'+
                        '<li indexType="sFaGrossprofitmargin" class="on">毛利率</li>'+
                        '<li indexType="sFaNetprofitmargin">净利率</li>'+
                        '<li indexType="sFaRoa">ROA</li>'+
                        '<li indexType="waaRoe">ROE</li>'+
                        '<li indexType="roic">ROIC</li>'+
                        '<li indexType="epsBasic">EPS</li>'+
                        '<li indexType="sFaOptogr">营业利润率</li>'+
                        '<li indexType="operExpenseRatio">营业费用率</li>'+
                    '</ul>'+

                    '<div id="profit_chart'+randomNum+'" class="tlBox_indComparison">'+
                    '</div>'+
                '</div>'+

                // 现金流
                '<div id="cash'+randomNum+'" dataLoad="false" class="item">'+
                    '<ul id="cash_ul'+randomNum+'" class="box_label box_label2" onclick="indexSubTabClick2(event, \'cash\', \''+randomNum+'\')">'+
                        '<li indexType="sFaOcftoprofit" class="on">经营现金流/净利润</li>'+
                        '<li indexType="freeCashFlow">自由现金流</li>'+
                        '<li indexType="cashReRatio">现金再投资比率</li>'+
                        '<li indexType="cashAdequacyRatio">现金流量允当比率</li>'+
                        // '<li indexType="netCashFlowsInvAct">投资现金流</li>'+
                        // '<li indexType="netCashFlowsFncAct">融资现金流</li>'+
                    '</ul>'+

                    '<div id="cash_chart'+randomNum+'" class="tlBox_indComparison">'+
                    '</div>'+
                '</div>'+

                // 偿债能力
                '<div id="debt'+randomNum+'" dataLoad="false" class="item">'+
                    '<ul id="debt_ul'+randomNum+'" class="box_label box_label2" onclick="indexSubTabClick2(event, \'debt\', \''+randomNum+'\')">'+
                        '<li indexType="sFaCurrent" class="on">流动比率</li>'+
                        '<li indexType="sFaQuick">速动比率</li>'+
                        '<li indexType="sFaDebttoassets">资产负债率</li>'+
                        '<li indexType="sFaCurrentdebttodebt">流动负债率</li>'+
                    '</ul>'+

                    '<div id="debt_chart'+randomNum+'" class="tlBox_indComparison">'+
                    '</div>'+
                '</div>'+

                // 运营能力
                tagOperationTabContent+

                // 成长能力
                '<div id="growup'+randomNum+'" dataLoad="false" class="item">'+
                    '<ul id="growup_ul'+randomNum+'" class="box_label box_label2" onclick="indexSubTabClick2(event, \'growup\', \''+randomNum+'\')">'+
                        '<li indexType="sFaYoynetprofit" class="on">净利润同比增长率</li>'+
                        '<li indexType="sFaYoyTr">营业收入同比增长率</li>'+
                        '<li indexType="sgr">可持续增长率</li>'+
                        '<li indexType="sFaYoyEquity">净资本增长率</li>'+
                    '</ul>'+

                    '<div id="growup_chart'+randomNum+'" class="tlBox_indComparison">'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<h6 class="t_gray">诊断数据依赖于个股与业内其它公司对比；</br>当前数据报告期：'+generateDate(result.data.displayDate)+'</h6>'+
            tagLink+
        '</div>';

    var temp = '<div class="bd"><div class="mb">'+tagBody+getRatingLabel(result)+'</div></div>';
    appendAnswer(temp, '', result.qId);
    scrollToQuestion();
    getQuestionTabs(result);

    // 取报价
    getStockQuota(marketType+stockCode, 'stock'+randomNum);

    // 取图表数据
    var params = {
        marketType: marketType,
        stockCode: stockCode,
        indicatorName: 'marValue',
        cache: true,
        tabType: 'companySize',
        randomNum: randomNum
    };
    updateIndexChart(params);
}
// tab切换：公司规模，盈利能力...
function industryCompareSubTabClick(event, randomNum) {
    // console.log(event)
    // 当前点击对象
    var curTarget = $(event.currentTarget);
    // tab选中，其它同级元素隐藏
    curTarget.attr('class', 'on').siblings().attr('class', '');
    // tab索引
    var index = curTarget.index();
    $('#industryCompare'+randomNum).find('> div').eq(index).addClass('show').siblings().removeClass('show');

    var tabType = curTarget.attr('tabType');
    // 点击时如果tab没有完全展示，那么滚动一下
    var tabContainer = $('#tabContainer'+randomNum)[0];
    if(tabType === 'operation' || tabType === 'growup'){
        tabContainer.scrollLeft = tabContainer.scrollWidth - tabContainer.clientWidth;
        // console.log(tabContainer.scrollWidth, tabContainer.clientWidth)
    }else if(tabType === 'companySize' || tabType === 'profit'){
        tabContainer.scrollLeft = 0;
    }

    // 主要指标对象
    var stock = $('#stock'+randomNum);
    var container = $('#'+tabType+randomNum);
    var dataLoad = container.attr('dataLoad');
    // 当前选中的指标
    var tagIndex = $('#'+tabType+'_ul'+randomNum).find('li.on');
    if (dataLoad === 'false') {
        var param = {
            marketType: stock.attr('marketType'),
            stockCode: stock.attr('stockCode'),
            indicatorName: tagIndex.attr('indexType'),
            cache: true,
            tabType: tabType,
            randomNum: randomNum
        };
        updateIndexChart(param);
    }
}
// 指标内部子Tab点击：总市值，毛利率...
function indexSubTabClick2(event, tabType, randomNum) {
    // console.log(event.target.tagName)
    var tagName = event.target.tagName;
    if (tagName === 'UL')
        return;
    // 当前点击对象
    var curTarget = $(event.target);
    // 当前如果为高亮选中状态则不再查询数据
    if (curTarget.hasClass('on')) {
        return;
    }
    // tab选中，其它同级元素隐藏
    curTarget.attr('class', 'on').siblings().attr('class', '');
    // 当前指标(英文)
    var indexType = curTarget.attr('indexType');
    // console.log(indexType)
    var stock = $('#stock'+randomNum);
    // 当前选中的指标
    var tagIndex = $('#'+tabType+'_ul'+randomNum).find('li.on');
    var param = {
        marketType: stock.attr('marketType'),
        stockCode: stock.attr('stockCode'),
        indicatorName: indexType || tagIndex.attr('indexType'),
        tabType: tabType,
        cache: true,
        randomNum: randomNum
    };
    updateIndexChart(param);
}
// 更新柱图数据列表
function updateIndexChart(params) {
    financeInduCompare(params, function (result) {
        // console.log(result)
        // 话术
        var industry = result.data ? result.data.induSortName : '';
        var nums = result.data ? result.data.induSecNum : '';
        if (industry) {
            var tagIndustry = '所在的<b>'+(industry || '')+'</b>行业，共<b>'+(nums || '')+'</b>家公司。';
            $('#industry'+params.randomNum).html(tagIndustry);
        }

        var chartContainer = $('#'+params.tabType+'_chart'+params.randomNum);
        var list = [];
        if (result.data && result.data.data && result.data.data.length>0) {
            list = result.data.data;
        } else {
            chartContainer.html('<div class="nodata" style="padding-top: 5rem;"><img src="/static/images/nodata-min.png"></div>');
            $('#'+params.tabType+params.randomNum).attr('dataLoad', true);
            return;
        }

        // 行业均值
        var induAvgValue = result.data.induAvgValue;
        // 选出最大值
        var maxValue = 0;
        maxValue = induAvgValue ? Math.max(induAvgValue, maxValue) : 0;
        list.forEach(function (value) {
            maxValue = Math.max(value.indicatorValue||0, maxValue);
        });

        // 指标的配置项
        var option = getOptionByIndex(params.indicatorName);
        var barWidthPercent = induAvgValue ? Math.max(induAvgValue/maxValue*100, 1) : 0;
        var tagList =
            '<ul>'+
                '<li></li>'+
                '<li>行业均值</li>'+
                '<li><b style="width: '+barWidthPercent+'%"></b></li>'+
                '<li>'+formatNumber(induAvgValue/option.dividedBy)+option.unit+'</li>'+
            '</ul>';

        var i=0;
        list.forEach(function (value, index) {
            // 当前股票标红
            var cls = '';
            if (value.stockCode === params.stockCode)
                cls = 'on';
            barWidthPercent = Math.max(value.indicatorValue/maxValue*100, 1);
            tagList +=
                '<ul class="'+cls+'">'+
                    '<li>'+value.induRank+'</li>'+
                    '<li>'+value.stockName+'</li>'+
                    '<li><b style="width: '+barWidthPercent+'%"></b></li>'+
                    '<li>'+formatNumber(value.indicatorValue/option.dividedBy)+option.unit+'</li>'+
                '</ul>';
            if (value.indicatorValue !== undefined) {
                i++
            }
        });

        if (i === 0) {
            chartContainer.html('<div class="nodata" style="padding-top: 5rem;"><img src="/static/images/nodata-min.png"></div>');
        } else {
            chartContainer.html(tagList);
        }
        $('#'+params.tabType+params.randomNum).attr('dataLoad', true);
    })
}

// 财务风险
function financialRisk(result, showInteractiveView) {
    sendPreAnswerContent(result.preAnswerContent, '', '', result.qId);

    var list = result.data || [];
    var col1 = ''; // 存储第一列的html tag
    var arrCol = ['','','','','','']; // 存储其余列的html tag，空字符串的数量要跟除固定列外的列数一样
    var arrColName = ['sFaInterestdebt','monetaryCap','netAssetsToday','debtAssetRate','moneAssetRate','sPledgeRatio']; // 其余列字段

    // 分页展示时，需要先隐藏多余的条数，此处需要先为每一列生成一个随机的类名
    var arrHideCls = []; //隐藏类
    if(list.length>5){
        // 循环的次数为所有列的数量
        for(var m=0; m<7; m++){
            arrHideCls.push(generateRandomClassName('hide'));
        }
    }

    for (var i=0; i<list.length; i++){
        // 第一列，即固定列
        col1 += '<li class="'+(i>3?arrHideCls[0]:'')+'" style="height: 1.5rem;display: '+(i>3?'none':'')+'">'+list[i].endDate+'</li>';

        // 其余列
        for(var j=0; j<arrCol.length; j++){
            // 处理为null字段
            var value = list[i][arrColName[j]] || '--';

            // 格式化
            if(['sFaInterestdebt', 'monetaryCap', 'netAssetsToday'].indexOf(arrColName[j]) !== -1)
                value = value !== '--' ? formatNumber(value) : value;
            else if(['debtAssetRate','moneAssetRate','sPledgeRatio'].indexOf(arrColName[j]) !== -1)
                value = value !== '--' ? (value.toFixed(2)+'%') : value;

            arrCol[j] += '<li class="'+(i>3?arrHideCls[j+1]:'')+'" style="height: 1.5rem; padding: 0.5rem 0;display: '+(i>3?'none':'')+'">'+value+'</li>';
        }
    }

    var tagBody =
        '<div class="box_conStock" style="margin: -1rem;">'+
            '<i class="icon-arrow_shape_left"></i>'+
            '<b></b>'+
            '<div class="conStock_hd">'+
                '<ul>'+
                    '<li>报告期</li>'+
                    col1+
                '</ul>'+
            '</div>'+
            '<div class="conStock" onscroll="tableScrollHandler(event)">'+
                '<div class="box">'+
                    '<ul>'+
                        '<li>带息债务</li>'+
                        arrCol[0]+
                    '</ul>'+
                    '<ul style="width: calc(25vw);">'+
                        '<li>货币资金</li>'+
                        arrCol[1]+
                    '</ul>'+
                    '<ul style="width: calc(25vw);">'+
                        '<li>净资产</i></li>'+
                        arrCol[2]+
                    '</ul>'+
                    '<ul style="width: calc(40vw);">'+
                        '<li>带息债务与净资产比例</i></li>'+
                        arrCol[3]+
                    '</ul>'+
                    '<ul style="width: calc(40vw);">'+
                        '<li>货币资金与净资产比例</i></li>'+
                        arrCol[4]+
                    '</ul>'+
                    '<ul style="width: calc(40vw);">'+
                        '<li>控股股东质押比例</i></li>'+
                        arrCol[5]+
                    '</ul>'+
                '</div>'+
            '</div>'+
        '</div>';

    //加载更多
    var btnMore = '';
    if (list.length > 4) {
        var moreId = generateRandomClassName('moreId');
        btnMore =
            '<div id="' + moreId + '">' +
                '<div class="box_load" onclick="showMoreListItem(\'' + arrHideCls.join('|') + '\', \'' + moreId + '\', \'' + 4 + '\')">' +
                    '<a>查看更多</a>' +
                '</div>' +
            '</div>';
    }

    var temp = '<div class="bd"><div class="mb">'+tagBody+btnMore+generateGuideQuestionList(result.guidanceQuestions) + getRatingLabel(result,showInteractiveView)+'</div></div>';
    appendAnswer(temp, '', result.qId);
    getQuestionTabs(result);
    scrollToQuestion();
}
