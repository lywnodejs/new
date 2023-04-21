import config from "../../config";
import commonUtil from "../../questionView/utils/commonUtil";
import timeUtil from "../../questionView/utils/timeUtil";
let ejs = require("ejs");


module.exports = {

    renderTemp(req, res, next, result, params) {
        let frameId = req.query.frameId;
        let sn = (new Date()).getTime();
        let isPopup = req.query.ispop ? true : false;

        let items = result.data;
        let temp = "";
        let property = result.questionAnalyse[0].entity[0].property;
        let boxClass = commonUtil.generateRandomClassName('sumUp_finance2');
        if (!isPopup) {
            temp += "<div class='sumUp_finance2 " + boxClass + "'>";
            temp += '<div class="stock">' +
                '<div>' + property.name + '<span class="num">' + property.code + '</span></div>' +
                '<div class="num t_red"></div>' +
                '</div>'
        } else {
            temp += "<div class='sumUp_finance2'>";
        }

        //蓝底白字
        temp += '<div class="box_bgBlue">' +
            '<b>' + items[0].conclusion + '</b></div>';

        //时间
        temp += '<div class="box_fix"> <div class="nav"><ul>';

        let year, date;

        for (let i = 0; i < 4; i++) {
            year = timeUtil.formatTime(items[i].endAt, 'year');
            date = timeUtil.formatTime(items[i].endAt, 'date');
            let li = '<li onclick="changeFinaTabs(this,\'' + result.answerResultType + '\')">';
            if (i === 0) {
                li = '<li class="on" onclick="changeFinaTabs(this,\'' + result.answerResultType + '\')">'
            }
            temp += li +
                '<h5>' + year + '</h5>' +
                '<h6>' + date + '</h6>' +
                '<b></b>' +
                '</li>';
            year -= 1
        }

        temp += "</ul>" +
            "<div class='bottom'></div>" +
            "</div>" +
            "<div class='content'>" +
            "<ol>" +
            "<li></li>" +
            "<li>财务数据</li>" +
            "<li>行业排名</li>" +
            "</ol>" +
            "</div></div>"; //box_fix结束

        // 内容
        temp += setFinanceCont(result); //box_con结束
        // temp += "</div>"; //content_ul结束
        if (!isPopup) {
            // temp += getRatingLabel(result, showInteractiveView);
        }


        console.log(1111111)

        let needJson = req.query.d === "j";
        let renderData = {
            sn: sn,
            data: temp,
            ispop: isPopup,
            info: result,
            params: params,
            preAnswer: result.preAnswerContent,
            noSource: req.query.noSource,
            frameId: frameId,
            host: config[process.env.NODE_ENV].host,
            config: config[process.env.NODE_ENV].resource
        };

        ejs.renderFile("./src/questionView/financialIndex.ejs", renderData, function (err, str) {
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

        // res.render("financialIndex",
        //     {
        //         sn:sn,
        //         data:temp,
        //         ispop:isPopup,
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

function setFinanceCont(result) {
    let items = {};
    let dimensions = [];
    let temp = '';
    console.log(result)
    temp += '<div class="content_ul">';

    for (let i = 0; i < 4; i++) {
        if (i === 0) {
            temp += '<div class="box_con show">'
        } else {
            temp += '<div class="box_con">'
        }

        if (!result.data[i]) {
            dimensions = [
                { "indicators": [{ "name": "市销率" }, { "name": "净资产收益率" }, { "name": "加权平均成本" }, { "name": "投资回报率" }, { "name": "每股现金流" }], "name": "关键指标" },
                { "indicators": [{ "name": "总资产收益率" }, { "name": "毛利率" }, { "name": "净利率" }], "name": "盈利能力" },
                { "indicators": [{ "name": "营业收入同比增长" }, { "name": "净利润同比增长" }], "name": "成长能力" },
                { "indicators": [{ "name": "资产负债率" }, { "name": "流动负债/总负债" }, { "name": "流动比率" }, { "name": "速动比率" }], "name": "偿债能力" },
                { "indicators": [{ "name": "总资产周转率" }, { "name": "存货周转率" }, { "name": "应收账款周转天数" }], "name": "运营能力" }];
        } else {
            items = result.data[i];
            dimensions = items.dimensions
        }

        for (let cont = 0; cont < dimensions.length; cont++) {

            let levelHtml = '';
            //设置不同水平下的标签
            if (cont !== 0 && result.data) {
                levelHtml = setLevel(cont, dimensions[cont].level)
            }
            temp += '<h6>' + dimensions[cont].name + levelHtml + '</h6>';

            let indicators = dimensions[cont].indicators;

            for (let dimen = 0; dimen < indicators.length; dimen++) {

                temp += '<ul>' +
                    '<li>' + indicators[dimen].name + '</li>';
                if (!result.data[i]) {
                    temp += '<li>--</li>' +
                        '<li>--<em>/</em><span>--</span></li>'
                } else {
                    temp += '<li>' + indicators[dimen].valueToDisplay + '</li>' +
                        '<li>' + (indicators[dimen].rank ? indicators[dimen].rank : '--') + '<em>/</em><span>' + items.comTotal + '</span></li>'
                }
                temp += '</ul>'
            }

        }
        temp += '</div>'
    }

    temp += '</div>';
    return temp;
}

function setLevel(cont, level) {
    let levelCla = '';
    if (cont === 1) {
        levelCla = 'icon-ir_yl' + level
    } else if (cont === 2) {
        levelCla = 'icon-ir_cz' + level
    } else if (cont === 3) {
        if (level < 4) {
            levelCla = 'icon-ir_nl' + level
        } else {
            levelCla = 'icon-ir_zwfx' + level
        }
    } else if (cont === 4) {
        levelCla = 'icon-ir_nl' + level
    }
    return '<i class="' + levelCla + '"></i>'
}