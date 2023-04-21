import config from "../../config";
import commonUtil from "../../questionView/utils/commonUtil";
let ejs = require("ejs");


module.exports = {

    renderTemp(req, res, next, result, params) {
        let frameId = req.query.frameId;
        let sn = (new Date()).getTime();

        let dataArr = result.data || [];

        //根据数值大小加less样式
        function addLess(stockLeft, stockRight, keyVlaue) {
            let Flag = keyVlaue + 'Flag';
            if (stockLeft[keyVlaue] && stockRight[keyVlaue]) {
                if (stockLeft[keyVlaue] - stockRight[keyVlaue] > 0) {
                    stockRight[Flag] = 'less'
                } else if (stockLeft[keyVlaue] - stockRight[keyVlaue] < 0) {
                    stockLeft[Flag] = 'less';
                }
            } else if (stockLeft[keyVlaue] && !stockRight[keyVlaue]) {
                stockRight[Flag] = 'less'
            } else if (stockRight[keyVlaue] && !stockLeft[keyVlaue]) {
                stockLeft[Flag] = 'less'
            }
        }

        //计算样式百分比
        function stylePer(stockLeft, stockRight, keyVlaue) {
            let per = keyVlaue + 'Per';
            let stockLeftAbs, stockRightAbs;
            if (stockLeft[keyVlaue] && stockRight[keyVlaue]) {
                if (stockLeft[keyVlaue] < 0 && stockRight[keyVlaue] < 0) {
                    stockLeftAbs = Math.abs(stockLeft[keyVlaue]);
                    stockRightAbs = Math.abs(stockRight[keyVlaue]);
                    stockRight[per] = (stockLeftAbs / (stockLeftAbs + stockRightAbs)) * 100 + "%";
                    stockLeft[per] = (stockRightAbs / (stockLeftAbs + stockRightAbs)) * 100 + "%";
                } else if (stockLeft[keyVlaue] > 0 && stockRight[keyVlaue] < 0) {
                    stockLeft[per] = '100%';
                    stockRight[per] = '0%';
                } else if (stockLeft[keyVlaue] < 0 && stockRight[keyVlaue] > 0) {
                    stockRight[per] = '100%';
                    stockLeft[per] = '0%';
                } else if (stockLeft[keyVlaue] - (stockRight[keyVlaue]) !== 0) {
                    stockLeft[per] = (stockLeft[keyVlaue] / (stockLeft[keyVlaue] + stockRight[keyVlaue])) * 100 + "%";
                    stockRight[per] = (stockRight[keyVlaue] / (stockLeft[keyVlaue] + stockRight[keyVlaue])) * 100 + "%";
                } else {
                    stockLeft[per] = '50%';
                    stockRight[per] = '50%';
                }
            } else if (stockLeft[keyVlaue] && !stockRight[keyVlaue]) {
                stockLeft[per] = "100%"
            } else if (stockRight[keyVlaue] && !stockLeft[keyVlaue]) {
                stockRight[per] = "100%"
            }

        }

        let arr = ['sFaYoynetprofit', 'totalValue', 'pe', 'pb'];
        for (let i = 0, l = arr.length; i < l; i++) {
            stylePer(dataArr[0], dataArr[1], arr[i]);
            addLess(dataArr[0], dataArr[1], arr[i]);
        }

        function stockGener(stock) {
            let name = '<li>' + stock.stockName + '</li>';
            let text = '';
            let arr = ['sFaYoynetprofit', 'totalValue', 'pe', 'pb'];
            for (let i = 0, l = arr.length; i < l; i++) {
                let flag = arr[i] + 'Flag';
                let per = arr[i] + 'Per';
                let svalue = arr[i];
                let trueVlaue = stock[svalue];
                if (arr[i] == 'sFaYoynetprofit') {
                    trueVlaue ? trueVlaue = trueVlaue.toFixed(2) + '%' : trueVlaue = "--";
                }
                if (arr[i] == 'totalValue') {
                    trueVlaue ? trueVlaue = commonUtil.changeMoney(trueVlaue) : '--'
                }
                trueVlaue ? '' : trueVlaue = '--';
                text += '<li class="' + stock[flag] + '"><div class="bar"><i></i><b style="width:' + stock[per] + '"></b><span>' + trueVlaue + '</span></div></li>';
            }
            return '<ul>' + name + text + '</ul>';
        }

        let stockLeft = stockGener(dataArr[0]);
        let stockRight = stockGener(dataArr[1]);
        // let mathRandom = new Date().getTime() + (Math.random() * 1000).toFixed(0);
        let chartContainerId = commonUtil.generateRandomClassName('');
        let middle = '<ul><li><i></i></li><li>净利润<br>增长率</li><li>总市值</li><li>市盈率</li><li>市净率</li></ul>';

        let tagBody =
            '<div class="box_contrast">' +
            '<div class="contrast">' +
            stockLeft + middle + stockRight +
            '</div>' +
            '<div id="compareId' + chartContainerId + '" class="mb_tab tab_contrast" id=""></div>' +
            '</div>';

        // let temp ='<div class="md_left_v2"><div class="bd"><div class="mb">'+ tagBody +getRatingLabel(result, showInteractiveView) +'</div></div></div>';

        //初始化图表
        // stockComparision.init(dataArr[0].market, dataArr[0].stockCode, dataArr[1].market, dataArr[1].stockCode, mathRandom);



        let needJson = req.query.d === "j";
        let renderData = {
            sn: sn,
            info: result,
            data: tagBody,
            noSource: req.query.noSource,
            preAnswer: result.preAnswerContent,
            frameId: frameId,
            dataArr: dataArr,
            params: params,
            chartContainerId: chartContainerId,
            host: config[process.env.NODE_ENV].host,
            config: config[process.env.NODE_ENV].resource,
            apiUrl: config[process.env.NODE_ENV].semanticApiService
        };

        ejs.renderFile("./src/questionView/stockCompare.ejs", renderData, function (err, str) {
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

        // res.render("stockCompare",
        //     {
        //         sn:sn,
        //         info:result,
        //         data:tagBody,
        //         noSource:req.query.noSource,
        //         preAnswer:result.preAnswerContent,
        //         frameId:frameId,
        //         dataArr:dataArr,
        //         params:params,
        //         chartContainerId:chartContainerId,
        //         host:config[process.env.NODE_ENV].host,
        //         config:config[process.env.NODE_ENV].resource,
        //         apiUrl: config[process.env.NODE_ENV].semanticApiService
        //     })
    }
};