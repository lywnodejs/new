
import config from '../../config';
import commonUtil from '../../questionView/utils/commonUtil';
import timeUtil from "../../questionView/utils/timeUtil";
let logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
    renderTemp(req, res, next, result, params) {
        let frameId = req.query.frameId;
        let sn = (new Date()).getTime();
        let isPopup = false;
        let showInteractiveView = false;

        //条件选股中用
        let stockConditions = ['市盈率', '市净率', '涨跌幅', '换手率', '振幅', '股价', '总市值', '成交额',
            '成交量', '流通市值', '量比', '委比', '日主力资金', '每股净收益', '发行价', '历史最高价', '历史最低价',
            '质押比例', '质押占总股本比例', '预警线估值', '平仓线估值', '累计涨跌幅', '每股净收益'];

        //有答案
        let tagStockCol = '', //股票名称列
            labelConditions = '', //当前筛选条件展示
            tagConditionCol = '', //筛选条件列
            arrConditions = []; //筛选条件li数组

        let showExtraTitle = false;
        let colCount = 0; //要展示的列数
        //筛选条件
        let conditions = result.data.conditions ? result.data.conditions : [];
        //计算筛选条件的数量，及提取出条件名称来
        conditions.forEach(function (item, index) {
            labelConditions += '<b>' + commonUtil.truncateString(item, 10) + '</b>';
            //用来判断一共有几个条件
            arrConditions.push('');
            //如果存在此条件，则标题需要展示额外的说明
            if (item.indexOf('日主力资金') !== -1 || item.indexOf('连涨') !== -1 || item.indexOf('连跌') !== -1 || item.indexOf('新高') !== -1)
                showExtraTitle = true;
            //股价与涨幅条件不展示，不计入列数
            if (item.indexOf('日涨跌幅') !== -1)
                colCount++;
            else if (item.indexOf('涨跌幅') === -1 && item.indexOf('跌幅') === -1 && item.indexOf('股价') === -1 && item.indexOf('现价') === -1) {
                colCount++;
            }

            //注意：此条件名称，包含3列，因此要特别处理，当条件名称变更时，此处要相应改动！
            if (item.indexOf('股价进入质押预警区') !== -1) {
                arrConditions.push('');
                arrConditions.push('');
                colCount += 2;
            }

            if (item.indexOf('市净率') !== -1 || item.indexOf('跌破每股净资产') !== -1 || item.indexOf('破净') !== -1) {
                arrConditions.push('');
                colCount++;
            }

            //注意：此条件对应的结果列数不固定！
            if (item.indexOf("风险提示") !== -1) {
                let tempCount = 0;
                if (result.data.stocks && result.data.stocks[0].conditionValue.length > 0)
                    tempCount = result.data.stocks[0].conditionValue.length;
                for (let t = 0; t < tempCount; t++) {
                    arrConditions.push('');
                }
                colCount += tempCount;
            }
        });

        //如果只有两列，那么需要加此样式
        let extraCls = '';
        if (colCount === 0)
            extraCls = 'ul_1';

        //主列表循环
        let totalCount = result.data.totalCount;
        let len = result.data.stocks ? result.data.stocks.length : 0;
        let tagPrice = ''; //最新价列标签
        let newPrice = '',
            raise = '';
        let item;
        let stockName = '';
        let maxColLen = 0;
        let hideClass = commonUtil.generateRandomClassName('hide');
        for (let i = 0; i < len; i++) {
            item = result.data.stocks[i];

            //如未传股票名称那么从行情数据中取
            if (item.stockName)
                stockName = item.stockName;
            else
                stockName = item.quotation.name;

            //股票列，弹窗中的股票名称不可点击
            if (isPopup)
                tagStockCol += '<li>';
            else
                tagStockCol += '<li class="' + (i >= 5 ? hideClass : '') + '" style="display: ' + (i >= 5 ? 'none' : '') + ';" onclick="nodeQuestion(\'' + stockName.replace(/s+/g, "") + '\')">';

            tagStockCol +=
                '<p>' + stockName + '</p>' +
                '<h6>' + item.stockCode + '</h6>' +
                '</li>';

            //最新价
            newPrice = (item.quotation.newprice / 10000).toFixed(2);
            raise = (item.quotation.raise / 10000).toFixed(2);

            let cls = 't_gray';
            if (raise > 0)
                cls = 't_red';
            else if (raise < 0)
                cls = 't_green';

            //停牌股判断
            if (item.quotation.isStop === 1) {
                cls = 't_gray';
                raise = '停牌';
            }

            tagPrice += '<li class="' + cls + '">' +
                '<p>' + newPrice + '</p>' +
                '<h6>' + raise + (isNaN(raise) ? '' : '%') + '</h6>' +
                '</li>';

            //最多的列一般在第一条
            maxColLen = result.data.stocks[0].conditionValue.length;
            let cLen = Math.max(maxColLen, item.conditionValue.length);
            //其他列，只拼li部分
            for (let j = 0; j < cLen; j++) {
                let condition;
                if (j >= item.conditionValue.length) {
                    arrConditions[j] += '<li>--</li>';
                    continue;
                } else {
                    condition = item.conditionValue[j]
                }

                //条件是个object
                for (let type in condition) {
                    //此两列不展示
                    if (type === '涨跌幅' || type === '股价')
                        continue;

                    let colValue = condition[type];
                    let unit = ''; //单位

                    //数字列单位，列表头用
                    if (stockConditions.indexOf(type) !== -1) {
                        if (['涨跌幅', '换手率', '振幅', '委比'].indexOf(type) !== -1) {
                            unit = '%';
                        }
                        else if (type === '成交量') {
                            unit = '(手)';
                        }
                        else if (['每股净收益'].indexOf(type) !== -1) {
                            unit = '(元)';
                        }
                    }

                    //只第一条拼列标题
                    if (i === 0) {
                        arrConditions[j] = '<li>' + type + unit + '</li>';
                    }

                    if (type === '股份数量')
                        colValue /= 10e3;

                    //列的值
                    if (type === '公告日期')
                        colValue = timeUtil.getTimeStr(colValue);
                    //格式化数字列，某些列不处理
                    else if (!isNaN(colValue) && type !== '连涨天数' && type !== '连跌天数' && type !== '每股现金流' && type !== '每股净资产')
                        colValue = commonUtil.formatNumber(colValue);

                    //某些列的值加上单位
                    if (type === '质押比例' || type === '质押占总股本比例' || type === '累计涨跌幅')
                        colValue += '%';
                    else if (type === '预警线估值' || type === '平仓线估值' || type === '每股净资产')
                        colValue += '元';

                    //拼条件
                    if (colValue.length > 7 && isNaN(condition[type])) {
                        arrConditions[j] += '<li onclick="showMoreWord(\'' + colValue + '\')">' + truncateString(colValue, 7) + '</li>';
                    } else {
                        if (type === '所属热点')
                            arrConditions[j] += '<li onclick="getRelatedReason(\'' + item.stockCode + '\',\'' + stockName + '\',\'' + item.marketType + '\',\'' + colValue + '\')"><div class="box_display">' + colValue + '<span>[关联原因]</span></div></li>';
                        else
                            arrConditions[j] += '<li>' + colValue + '</li>';
                    }
                }
            }
        }

        //包装其他列的条件
        for (let i = 0; i < arrConditions.length; i++) {
            if (arrConditions[i].length > 0)
                tagConditionCol += '<ul class="' + extraCls + '">' + arrConditions[i] + '</ul>';
        }

        //随机ID
        let conditionsId = commonUtil.generateRandomClassName('conditionsId');
        let keepConditionsId = commonUtil.generateRandomClassName('keepConditionsId');
        let moreId = commonUtil.generateRandomClassName('moreId');

        //以下项在弹窗中不展示
        let tagKeepPick = ''; //继续筛选
        let tagMore = ''; //查看更多
        let txtKeepPick = ''; // 继续筛选

        if (!isPopup) {
            // if((appKey === 'appEzt' && appFrom === 'android' && checkVersion('1.3.8', appVersion))
            //     || (appKey === 'appEzt' && appFrom === 'ios' && checkVersion('1.9.20', appVersion))
            //     || appKey === 'appTopC'){
            //     txtKeepPick = '重新筛选';
            // }

            if(result.data.conditions){
                tagKeepPick = '<div class="box_condition">' +
                '<h5>筛选结果(' + totalCount + ')</h5>' +
                '<a id="' + keepConditionsId + '" class="a_condition" onclick="showConditionBox(\'' + result.data.conditions.join('，') + '\',\'' + showInteractiveView + '\')"><span>' + txtKeepPick + '</span><i style="display: none" class="icon-screen"></i></a>' +
                  '</div>';
            }



            if (len > 5)
                tagMore = '<div id="' + moreId + '" class="box_load box_conStock_more" onclick=toolsUtil.showMoreArticle("' + hideClass + '","' + moreId + '",5)>' +
                    '<a>查看更多</a>' +
                    '</div>';
        }

        //交易时间
        let timeStr = '';
        if (timeUtil.isInTradeTime(result.data.updateAt))
            timeStr = '更新于' + timeUtil.changeTimeForHour(result.data.updateAt);
        else
            timeStr = '更新于' + timeUtil.timeChange(result.data.updateAt);

        //X日资金时展示
        if (showExtraTitle)
            timeStr += '，股票停牌不计入数据统计';

        //是否展示箭头
        let tagArrow = '';
        if (colCount > 1)
            tagArrow = '<i class="icon-arrow_shape_left"></i>';

        //主标签
        let tagBody =
            '<h6 class="date">' + timeStr + '</h6>' +
            '<div class="box_condition">' +
            '<h5 class="box_L">选股条件：</h5>' +
            '<div id="' + conditionsId + '" class="box_R">' +
            labelConditions +
            '</div>' +
            '</div>' +
            tagKeepPick +

            // <!-- 表格 -->
            '<div class="box_conStock">' +
            tagArrow +
            '<div class="conStock_hd">' +
            '<ul>' +
            '<li>股票名称</li>' +
            tagStockCol +
            '</ul>' +
            '</div>' +
            '<div class="conStock" style="overflow-x: ' + (colCount > 1 ? "scroll" : "hidden") + '">' +
            '<div class="box">' +
            '<ul class="num ' + extraCls + '">' +
            '<li>最新价</li>' +
            tagPrice +
            '</ul>' +
            tagConditionCol +
            '</div>' +
            '</div>' +
            '</div>' +

            // <!--加载更多-->
            tagMore;



        let needJson = req.query.d === "j";
        let renderData = {
            sn: sn,
            data: tagBody,
            info: result,
            params: params,
            preAnswer: result.preAnswerContent,
            noSource: req.query.noSource,
            frameId: frameId,
            host: config[process.env.NODE_ENV].host,
            config: config[process.env.NODE_ENV].resource
        };

        ejs.renderFile("./src/questionView/pickStockByCondition.ejs", renderData, function (err, str) {
            if (needJson) {
                res.send({
                    info: result,
                    content: str
                })
            } else {
                res.set('Content-Type', 'text/html');
                res.send(str);
            }
        });

        // res.render("pickStockByCondition",
        //     {
        //         sn:sn,
        //         data:tagBody,
        //         info:result,
        //         params:params,
        //         preAnswer:result.preAnswerContent,
        //         noSource:req.query.noSource,
        //         frameId:frameId,
        //         host:config[process.env.NODE_ENV].host,
        //         config:config[process.env.NODE_ENV].resource
        //     })
    }
};