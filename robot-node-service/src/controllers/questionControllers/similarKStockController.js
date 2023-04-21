//相似K线

import config from "../../config";
import commonUtil from "../../questionView/utils/commonUtil";
let ejs = require("ejs");

module.exports = {
    renderTemp(req, res, next, result, params) {
        let frameId = req.query.frameId;
        let sn = (new Date()).getTime();
        // if (ifAnswerType) {
        //     let word = result.hasOwnProperty('words') ? result.words + result.preAnswerContent : result.preAnswerContent;
        //     sendPreAnswerContent(word);
        // }

        let stockList = [];
        if (result.data)
            stockList = result.data;

        if (stockList.length === 0) {
            // sendPreAnswerContent('该股行情数据较少，暂无相似匹配');
            return;
        }

        let tagStockList = '';
        let tempArr = [];
        //循环股票列表
        stockList.forEach(function (item, index) {
            let randomId = commonUtil.generateRandomClassName('similarK');
            // let kline = smallKLine.getTarget(randomId);
            tagStockList +=
                '<div class="box_bd on" onclick="nodeQuestion(\'' + (item.stockName ? item.stockName.replace(/\s+/g, '') : '') + '\')">' +
                '<div class="linkTop_half"></div> ' +
                '<ul>' +
                '<li>' +
                '<p>' + (item.stockName ? item.stockName : '') + '</p>' +
                '<h6>' + (item.stockCode ? item.stockCode : '') + '</h6>' +
                '</li>' +
                '<li>' +
                // '<h6>'+(item.startAt?changeTime(item.startAt):'')+'-'+(item.endAt?changeTime(item.endAt):'')+'</h6>'+
                '</li>' +
                '<li>' +
                '<p>' + (item.similar ? item.similar.toFixed(2) : '') + '%</p>' +
                '</li>' +
                '</ul>' +
                '<div id="' + randomId + '" class="box_img" style="margin-bottom: 0;"></div>' +
                '</div>';
            tempArr.push(randomId);
        });

        let tag =
            '<div class="box_show_ol">' +
            '<ol>' +
            '<li>股票名称</li>' +
            '<li></li>' +
            '<li>相似度</li>' +
            '</ol>' +
            tagStockList +
            '</div>';

        // let temp = "<div class='bd'><div class='mb'>" + tag;
        // if (ifAnswerType) {
        //     temp += getRatingLabel(result);
        // }
        // temp += "</div></div>";



        let needJson = req.query.d === "j";
        let renderData = {
            sn: sn,
            data: tag,
            info: result,
            noSource: req.query.noSource,
            preAnswer: result.preAnswerContent,
            stockList: stockList,
            tempArr: tempArr,
            frameId: frameId,
            params: params,
            host: config[process.env.NODE_ENV].host,
            config: config[process.env.NODE_ENV].resource,
            quotaUrl: "/api/stock/kline"
        };

        ejs.renderFile("./src/questionView/similarKStock.ejs", renderData, function (err, str) {
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

        // res.render("similarKStock",
        //     {
        //         sn:sn,
        //         data:tag,
        //         info:result,
        //         noSource:req.query.noSource,
        //         preAnswer:result.preAnswerContent,
        //         stockList:stockList,
        //         tempArr:tempArr,
        //         frameId:frameId,
        //         params:params,
        //         host:config[process.env.NODE_ENV].host,
        //         config:config[process.env.NODE_ENV].resource,
        //         quotaUrl: "/api/stock/kline"
        //     })
    }
};