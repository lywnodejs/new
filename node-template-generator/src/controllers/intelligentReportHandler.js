import commonUtil from "../utils/commonUtil";
import config from '../config';
import robotHandler from './robotHandler';
import reportSearchHandler from './reportSearchHandler';
import format from "../utils/format";
import dateUtil from "../utils/date-util";


import {
    autoReportIndustryService,
    reportCompositeService,
    semanticApiService,
    financialStatementService,
    aiApiService,
    metadataDimDwService,
    dwDbService,
    searchTemplateService, semanticDatacenterServic,
    marketPredictionService,
} from "../service";
import middleGroundConfig from "../libs/middleGroundConfig";
import _ from "underscore";
import financialDataUtil from "../utils/financialDataUtil";
import util from "../utils/com-util"
import handlerUtil from "../utils/handlerUtil"

function getDisplayType(displayIndex) {
    let displayType = 0;//默认不选择


    if (displayIndex && displayIndex.setIndexShowType === 1 && displayIndex.setIndexShowFlag === 0) {
        displayType = 1;//任意指标为空且显示（后端已做下方处理，但是代码保留）
    }

    if (displayIndex && displayIndex.setIndexShowType === 1 && displayIndex.setIndexShowFlag === 1) {
        displayType = 2;//任意指标为空且不显示
    }

    if (displayIndex && displayIndex.setIndexShowType === 2 && displayIndex.setIndexShowFlag === 0) {
        displayType = 3;//所有指标为空且显示
    }

    if (displayIndex && displayIndex.setIndexShowType === 2 && displayIndex.setIndexShowFlag === 1) {
        displayType = 4;//所有指标为空且不显示
    }
    return displayType;
}


let reportHandler = {
    async chartHandler(data) {
        let info = {};
        let templateType = "";
        let symbol = data.symbol;//个股股票
        let index = data.index;//指数股票
        let industry = data.industry;//行业
        let startAt = data.startAt;//开始时间
        let endAt = data.endAt;//结束时间
        let relevantPeople = data.relevantPeople;//结束时间
        let areaKeys = data.areaKeys;//地域实体
        let conditionParams = data.conditionParams;
        let requestParams = data.queryParams;
        let handlerType = 0;

        if (commonUtil.stringIsEmpty(conditionParams) || commonUtil.stringIsEmpty(requestParams)) {
            return {
                code: -1,
                message: "请求参数不全!"
            }
        }


        switch (parseInt(conditionParams.chartType)) {
            case 1://表格
                templateType = "table";
                handlerType = 0;
                break;
            case 2://线状图
                templateType = "lineGraph";
                handlerType = 1;
                break;
            case 3://柱状图
                templateType = "histogram";
                handlerType = 1;
                break;
            case 6://k线图
                templateType = "klineChart";
                handlerType = 2;
                break;
            case 7://混合图
                templateType = "splineAndColumn";
                handlerType = 1;
                break;
            case 4://饼状图
                templateType = "pie";
                handlerType = 3;
                break;
        }

        conditionParams.indicatorOrders = conditionParams.indicators;
        conditionParams.indicators = requestParams.indicators;
        if (commonUtil.stringIsNotEmpty(requestParams.entities)) {
            requestParams.entities = requestParams.entities.split(',');
        }
        if (commonUtil.stringIsNotEmpty(requestParams.index)) {
            requestParams.index = requestParams.index.split(',');
        }
        // if (commonUtil.stringIsNotEmpty(requestParams.industry)) {
        //     requestParams.industry = requestParams.industry.split(',');
        // }


        if (conditionParams.categoryType === 1 || (conditionParams.categoryType === 5 && conditionParams.dynamicParams.timeRound)) {
            if (commonUtil.stringIsNotEmpty(startAt) || commonUtil.stringIsNotEmpty(endAt)) {
                switch (conditionParams.paramsType) {
                    case 0:
                        requestParams.deadline = endAt;
                        break;
                    case 1:
                        requestParams.startAt = startAt;
                        requestParams.endAt = endAt;
                        delete requestParams.timeInterval;
                        delete requestParams.timeSeries;
                        break;
                    case 2:
                        break;
                }
            }
        } else if (commonUtil.stringIsNotEmpty(endAt) && (conditionParams.paramsType === 1 || (conditionParams.categoryType === 2 && conditionParams.paramsType === 0))) {
            delete requestParams.timeInterval;
            delete requestParams.startAt;
            delete requestParams.endAt;
            requestParams.timeSeries = [];
            requestParams.timeSeries.push(endAt);
        }


        //isDefaultStock ------true表示传的是默认值false表示用户输入的
        if (conditionParams.isDefaultStock && commonUtil.stringIsNotEmpty(symbol)) {
            requestParams.entities = [];
            requestParams.entities = symbol.split(',');
        }

        if (conditionParams.isDefaultIndex && commonUtil.stringIsNotEmpty(index)) {
            requestParams.index = [];
            requestParams.index = index.split(',');
        }

        if (conditionParams.isDefaultIndustry && commonUtil.stringIsNotEmpty(industry)) {
            requestParams.industry = [];
            requestParams.industry = industry.split(',');
        }

        if (!conditionParams.relevantPeopleFlag && commonUtil.stringIsNotEmpty(relevantPeople)) {
            requestParams.relevantPeople = "";
            requestParams.relevantPeople = relevantPeople;
        }

        if (!conditionParams.isDefaultRegion && commonUtil.stringIsNotEmpty(areaKeys)) {
            requestParams.area = [];
            requestParams.area = areaKeys.split(',');
        }
        console.log("入参：" + JSON.stringify(requestParams));
        //请求接口返回数据
        info = await reportCompositeService.getAnalysisData(requestParams);



        console.log("出参：" + JSON.stringify(info));

        if (commonUtil.stringIsEmpty(info) || info.message.code === -1 || commonUtil.isNoData(info)) {
            return {
                code: -1,
                message: "接口返回数据出错",
                templateType: templateType,
            }
        } else {
            info = info.data;
        }

        let displayIndex = conditionParams.setIndexData;
        let displayType = getDisplayType(displayIndex);

        let isDataEmpty = commonUtil.stringIsEmpty(info);// true 无数据 false 有数据
        let isEmptyIndicator = (!isDataEmpty && info.emptyIndicator.length > 0);// true 有指标为空 false 无指标为空或者无数据


        if ((displayType === 2 && !isDataEmpty && isEmptyIndicator) || (displayType === 2 && isDataEmpty)) {
            templateType = "text";
            info = displayIndex.replateContent;
            if (commonUtil.stringIsEmpty(displayIndex.replateContent)) {
                return {
                    code: -1,
                    message: "暂无数据!",
                    templateType: templateType,
                }
            }
        } else if (displayType === 4 && isDataEmpty) {
            templateType = "text";
            info = displayIndex.replateContent;
            if (commonUtil.stringIsEmpty(displayIndex.replateContent)) {
                return {
                    code: -1,
                    message: "暂无数据!",
                    templateType: templateType,
                }
            }
        } else if ((displayType === 3 && isDataEmpty) || isDataEmpty) {
            return {code: -1, message: "暂无数据!", templateType: templateType}
        } else {
            switch (handlerType) {
                case 0:
                    if (info.dataType === 1) { // 合并
                        info = commonUtil.tabHandler2(displayType, info, data);
                    } else if (info.dataType === 2) { // 十大股东类型
                        if (conditionParams.simlerItemMergeVal == '1') {
                            info.rowspan = 'true'; // 是否合并
                        }
                        info = commonUtil.tabHandler3(displayType, info, data);
                    } else {  // 0 默认表格
                        info = commonUtil.tabHandler(displayType, info, data);
                    }
                    break;
                case 1:
                    info = commonUtil.splineAndColumnHandler(displayType, config[process.env.NODE_ENV].host, info, data);
                    info.linePhotoDbTypeVal = conditionParams.linePhotoDbTypeVal;//线图是否启用百分比对图
                    break;
                case 2:
                    info = commonUtil.klineChartHandler(displayType, info, conditionParams);
                    break;
                case 3:
                    info = commonUtil.pieHandler(displayType, info, conditionParams);
                    break;
            }
        }

        let params = handlerUtil.getTemplateConfig(templateType);

        if (params.code === -1) {
            return params;
        }

        let result = {
            code: 0,
            message: "success",
            info: info,
            templateType: templateType,
            conditionParams: conditionParams,
            requestParams: requestParams,
            params: params
        };

        return result;
    },
    async speechHandler(data) {
        let symbol = data.symbol;//股票
        let relevantPeople = data.relevantPeople;
        let index = data.index;//指数
        let startAt = data.startAt;//开始时间
        let endAt = data.endAt;//结束时间
        let conditionParams = data.conditionParams;
        let requestParams = data.queryParams;

        let displayIndex = conditionParams.setIndexData;

        let templateType = "speechTemplate";
        if (symbol != undefined) {
            for (let i = 0; i < requestParams.length; i++) {
                if (!requestParams[i].stockFlag) {
                    requestParams[i].entities = [symbol];
                }
            }
        }
        if (relevantPeople != undefined) {
            for (let i = 0; i < requestParams.length; i++) {
                requestParams[i].relevantPeople = relevantPeople;
            }
        }
        if (index != undefined) {
            for (let i = 0; i < requestParams.length; i++) {
                if (!requestParams[i].stockIndexFlag) {
                    requestParams[i].index = [index];
                }
            }
        }
        if (startAt != undefined) {
            for (let i = 0; i < requestParams.length; i++) {
                if (requestParams[i].noTime) {
                    requestParams[i].startAt = startAt;
                }
            }
        }
        if (endAt != undefined) {//任意时间时
            for (let i = 0; i < requestParams.length; i++) {
                if (requestParams[i].timeRangeType == 0) {
                    requestParams[i].timeSeries = [endAt];
                    //delete requestParams[i].timeSeries;
                } else if (requestParams[i].timeRangeType == 1) {
                    requestParams[i].deadline = endAt;
                }
                if (requestParams[i].noTime) {
                    requestParams[i].endAt = endAt;
                }
            }
        }
        // if (endAt != undefined) {//近一段时间时
        //     for (let i = 0; i < requestParams.length; i++) {
        //         if (requestParams[i].timeRangeType === 1) {
        //             requestParams[i].deadline = endAt;
        //         }
        //     }
        // }

        console.log("入参：" + JSON.stringify(requestParams));
        let info = await reportCompositeService.getSpeechData(requestParams);
        console.log(info)
        let infoData = info;
        let displayType = getDisplayType(displayIndex);


        if (displayType === 4 && Object.keys(info.data).length === 0) {
            let isSpecialHandlingFlag = false;
            for (let i = 0; i < conditionParams.selectedIndexList.length; i++) {
                let item = conditionParams.selectedIndexList[i];

                if (item.specialHandlingFlag && item.specialHandlingFlag === 101) {
                    isSpecialHandlingFlag = true;
                }
            }

            if (!isSpecialHandlingFlag) {
                templateType = "text";
                info = displayIndex.replateContent;

                if (commonUtil.stringIsEmpty(displayIndex.replateContent)) {
                    return {
                        code: -1,
                        message: "暂无数据!",
                        templateType: templateType,
                    }
                }
            }
        } else if (displayType === 3 && Object.keys(info.data).length === 0) {
            // templateType = "text";
            // info = "";
        } else if (displayType === 2 && Object.keys(info.data).length !== requestParams.length) {
            templateType = "text";
            info = displayIndex.replateContent;

            if (commonUtil.stringIsEmpty(displayIndex.replateContent)) {
                return {
                    code: -1,
                    message: "暂无数据!",
                    templateType: templateType,
                }
            }
        } else if (displayType === 1) {
            info.displayType = 1;
        }

        let params = handlerUtil.getTemplateConfig(templateType);

        if (params.code === -1) {
            return params;
        }
        //组装数组，用于时间格式区分
        timeChangeType(conditionParams.selectedIndexList);
        function timeChangeType (arr) {
            var res = [];
            let data = info.data;
            for (var i = 0; i<arr.length; i++) {
                if (arr[i].changeIndexTimeType) {
                    res.push({index: arr[i].correlationIndexVal, type: arr[i].changeIndexTimeType})
                }
            }
            for (let j = 0; j < res.length; j++) {
                data[res[j].index][0].trade_dt = commonUtil.changeIndexTimeTypeWay(res[j].type,data[res[j].index][0].trade_dt);
            }
        }

        //指标控制
        let cArr = conditionParams.indexControlList || [];
        let hideNum = 0;
        if (cArr.length > 0) {
            hideNum = cArr.pop()[0]
            apiNumberListWay(cArr, hideNum) || [];
        }

        function absNumber(num) {
            return Math.abs(num);
        }

        function apiNumberListWay(cList, hideNum) {//得到包含接口返回值得数组，根据类型做相应的数值对比
            let resLastNum = [];
            if (cList.length > 0) {

                //对比数组中最后一组的指标
                let lastArr = cList[cList.length - 1];
                let lastArrRes = []
                if (lastArr.length > 1) {
                    for (let i = 0; i < lastArr.length; i++) {
                        if (info.data[lastArr[i]]) {
                            lastArrRes.push({
                                id: lastArr[i],
                                number: info.data[lastArr[i]][0].indicatorValue,
                            })
                        }
                    }
                }
                //将结果按照从小到大排序
                for (let e = 0; e < lastArrRes.length; e++) {
                    for (let t = 0; t < lastArrRes.length; t++) {
                        if (lastArrRes[e].number < lastArrRes[t].number) {
                            var h = '';
                            h = lastArrRes[t]
                            lastArrRes[t] = lastArrRes[e]
                            lastArrRes[e] = h
                        }
                    }
                }
                //得到需要隐藏的数组
                let needHideList = lastArrRes.splice(0, hideNum) || []
                cList.pop()
                let readyList = [];
                if (needHideList.length > 0) {
                    for (let n = 0; n < needHideList.length; n++) {
                        for (let l = 0; l < cList.length; l++) {
                            for (let v = 0; v < cList[l].length; v++) {
                                if (needHideList[n].id === cList[l][v]) {
                                    readyList.push(cList[l])
                                }
                            }
                        }
                    }
                }
                //将数据组装到一个数组
                let lrArr = []
                for (let g = 0; g < readyList.length; g++) {
                    for (let p = 0; p < readyList[g].length; p++) {
                        lrArr.push(readyList[g][p])
                    }
                }

                //删除数据中的绝对值最小的n组
                if (lrArr && lrArr.length > 0) {
                    for (let a = 0; a < lrArr.length; a++) {
                        if (info.data && info.data[lrArr[a]]) {
                            info.data[lrArr[a]][0].indicatorValue = '';
                        }
                        for (let i = 0; i < conditionParams.selectedIndexList.length; i++) {
                            if (conditionParams.selectedIndexList[i] && conditionParams.selectedIndexList[i].text) {
                                if (lrArr[a] === conditionParams.selectedIndexList[i].index) {
                                    conditionParams.selectedIndexList.splice(i, 1)
                                }
                            }
                        }
                    }
                }
            }
        }

        //指标控制规则二
        let ruleData = conditionParams.ruleDataCon || {};
        let ruleDataTwo = ruleData.ruleDataTwo || [];
        if (ruleDataTwo.length > 0) {
            let data = info && info.data || {};
            let lastArr = []
            ruleDataTwo.map(item => {
                if (data[item[0]][0].indicatorValue == item[1]) {
                    data[item[0]][0].indicatorValue = '';
                }
            })
        }
        //指标控制规则三
        let ruleDataThree =ruleData.ruleDataThree || [];
        let ruleDataThreeFlag = false;
        if (ruleDataThree.length > 0) {
            let data = info && info.data || {};
            let ruleThreeArr = []
            ruleDataThree.map(item => {
                if (item[2] === '小于') {
                    if (data[item[0]][0].indicatorValue < item[1]) {
                        ruleDataThreeFlag = true;
                    }
                }
                if (item[2] === '小于等于') {
                    if (data[item[0]][0].indicatorValue <= item[1]) {
                        ruleDataThreeFlag = true;
                    }
                }
                if (item[2] === '大于') {
                    if (data[item[0]][0].indicatorValue > item[1]) {
                        ruleDataThreeFlag = true;
                    }
                }
                if (item[2] === '大于等于') {
                    if (data[item[0]][0].indicatorValue >= item[1]) {
                        ruleDataThreeFlag = true;
                    }
                }

            })
            if (ruleDataThreeFlag && JSON.stringify(data) != "{}") {
                // for (let key in data) {
                //     data[key][0].indicatorValue = null;

                // }

                info = '';
            }
        }
        //自定义计量单位
        let selectedIndexList = data.conditionParams.selectedIndexList;
        addUnitSelfWay(selectedIndexList)
        function addUnitSelfWay(list) {
            let unitList = []
            for (let i = 0; i<list.length; i++) {
                if (list[i].addUnitSelfList && list[i].addUnitSelfList.length >0) {
                    let obj = list[i]
                    if (JSON.stringify(info.data) === '{}') {
                        return;
                    }
                    let number = info.data[obj.timeIndex][0].indicatorValue
                    let unitList = obj.addUnitSelfList;
                    let unit = null;
                    for (let j = 0; j<unitList.length; j++) {
                        let start = unitList[j].start;
                        let end = unitList[j].end;
                        let unitVal = unitList[j].unitVal;
                        if (start === '' && end !== '') {
                            unit = unitVal;
                        }
                        if (start !== '' && end === '') {
                            unit = unitVal;
                            break;
                        }
                        if (start === '' && end === '') {
                            unit = unitVal;
                            break;
                        }
                        if (number >= start && number < end ) {
                            unit = unitVal
                        }
                    }
                    if (unit) {
                        obj.jlVlaueFlag = true;
                        if (unit.length === 1 && unit.indexOf('亿') === -1) {
                        } else { //单位不是第一个的时候
                            if (unit.indexOf('千') !== -1 && unit.length === 2) { //单位千
                                info.data[obj.timeIndex][0].indicatorValue = (number/1000).toFixed(2)
                            }
                            if (unit.indexOf('万') !== -1 && unit.length === 2) { //单位万
                                info.data[obj.timeIndex][0].indicatorValue = (number/10000).toFixed(2)
                            }
                            if (unit.indexOf('百万') !== -1) { //单位百万
                                info.data[obj.timeIndex][0].indicatorValue = (number/(10000*100)).toFixed(2)
                            }
                            if (unit.indexOf('千万') !== -1) { //单位千万
                                info.data[obj.timeIndex][0].indicatorValue = (number/(10000*1000)).toFixed(2)
                            }
                            if (unit.indexOf('亿') !== -1) { //单位亿
                                info.data[obj.timeIndex][0].indicatorValue = (number/(10000*10000)).toFixed(2)
                            }
                            obj.countUnit = unit;
                        }
                    } 
                }
            }

        }
        let code = code;

        if (!info || !info.data || JSON.stringify(info.data) == "{}") {
            code = -1;
        }
        let result = {
            code: code,
            message: "",
            info: info,
            params: params,
            conditionParams: conditionParams,
            commonUtil: commonUtil
        };
        //console.log(JSON.stringify(result));
        return result;
    },


    /**
     * 定期报告内容搜索
     * */
    async knowledgeGraphHandler(data) {
        let symbol = data.symbol;//股票
        let startAt = data.startAt;//开始时间
        let endAt = data.endAt;//结束时间

        let template = "knowAtlas";

        let params = handlerUtil.getTemplateConfig(template);


        params.showtext = data.showtext || false;
        params.showtitle = data.showtitle || false;
        params.color = data.color || false;
        params.input = data.input || '锂电池';
        params.disName = data.disName || data.input;
        params.admin = data.admin || 'rxhui';
        params.entityType = data.entityType || '';

        if (symbol) {
            params.input = symbol;
        }
        if (params.code === -1) {
            return params;
        }
        let paramData = {
            entityName: params.input,
            entityType: params.entityType,
        }

        let info = await semanticApiService.know(paramData);
        var chartData = {
            tooltip: {
                show: false
            },
            series: [{
                itemStyle: {
                    normal: {
                        label: {
                            position: 'top',
                            show: true,
                            textStyle: {
                                color: '#000000',
                                fontFamily: 'DINAlternate-Bold'
                            }
                        },
                        nodeStyle: {
                            brushType: 'both',
                            borderColor: 'rgba(255,215,0,0.4)',
                            borderWidth: 1
                        },
                        linkStyle: {
                            color: 'source',
                            curveness: 0,
                            type: "solid"
                        }
                    },

                },
                force: {
                    initLayout: 'force',//初始布局
                    edgeLength: 5,
                    repulsion: 20,
                    gravity: 0.2,
                    layoutAnimation: false
                },
                edgeLabel: {
                    show: false,
                },
                //形状
                // symbol:'arrow',
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',//取值none,circular,force
                roam: false,//可以拖动
                draggable: false,
                useWorker: false,
                minRadius: 15,
                maxRadius: 25,
                animation: false,
                // gravity: 0.1,
                // scaling: 3.1,
                zoom: 2.6,
                nodes: [],
                links: [],
            }]
        };
        var colorblack = {
            '治理结构': ['#606980', '#606980'],
            '董事': ['#873c65', '#873c65'],
            '高管': ['#745ca4', '#745ca4'],
            '十大股东': ['#816558', '#816558'],
            '指数': ['#c95e64', '#c95e64'],
            '上游产业': ['#3980c4', '#3980c4'],
            '下游产业': ['#de9246', '#de9246'],
            '产品': ['#de9246', '#de9246'],
            '概念': ['#57a4aa', '#57a4aa'],
            '上游产品': ['#3980c4', '#3980c4'],
            '下游产品': ['#de9246', '#de9246'],
            '公司': ['#c95e64', '#c95e64'],
            '产品cp': ['#b87032', '#ebb271'],
            '上游产业cp': ['#26609e', '#5e9dd1'],
            '下游产业cp': ['#b87032', '#ebb271'],
            '概念gn': ['#3d7d85', '#7bb6b8'],
            '公司st': ['#a3454c', '#d68788'],
            '指数zsgn': ['#a3454c', '#d68788'],
            '上游产品cp': ['#26609e', '#5e9dd1'],
            '下游产品cp': ['#b87032', '#ebb271'],
            '董事nr': ['#612648', '#945977'],
            '高管nr': ['#52407d', '#917fb0'],
            '十大股东nr': ['#5c433a', '#8f8078'],
            '十大股东nt': ['#5c433a', '#8f8078'],
            '关联产业': ['#f7f113', '#f7f60a'],
            '关联产业cp': ['#c5d44d', '#8d9f32'],
            'nr': ['#5c433a', '#5c433a'],
            'gn': ['#3d7d85', '#7bb6b8'],
            'zsgn': ['#a3454c', '#d68788'],
            'cp': ['#b87032', '#ebb271'],
            'st': ['#a3454c', '#d68788'],
        };
        var element = [];
        if (info.data && info.data.relations.length !== 0) {
            var text = info.data.entity.disName;
            if (info.data.relations['公司产品关系_关联产业'] && info.data.relations['公司产品关系_关联产业'].length !== 0) {
                var txt = '';
                for (var l = 0; l < info.data.relations['公司产品关系_关联产业'].length; l++) {
                    txt += info.data.relations['公司产品关系_关联产业'][l].disName + '、';
                }
                txt = txt.substr(0, txt.length - 1) + '。';
                element.push({text: text + '的核心业务涉及到的产业生态包括：' + txt, type: 'content'})
            }
            if (info.data.relations['公司上游产品_上游产业'] && info.data.relations['公司上游产品_上游产业'].length !== 0) {
                var txt = '';
                for (var l = 0; l < info.data.relations['公司上游产品_上游产业'].length; l++) {
                    txt += info.data.relations['公司上游产品_上游产业'][l].disName + '、';
                }
                txt = txt.substr(0, txt.length - 1) + '。';
                element.push({text: '上游产业为：' + txt, type: 'content'});
            }
            if (info.data.relations['公司下游产品_下游产业'] && info.data.relations['公司下游产品_下游产业'].length !== 0) {
                var txt = '';
                for (var l = 0; l < info.data.relations['公司下游产品_下游产业'].length; l++) {
                    txt += info.data.relations['公司下游产品_下游产业'][l].disName + '、';
                }
                txt = txt.substr(0, txt.length - 1) + '。';
                element.push({text: '下游产业为：' + txt, type: 'content'});
            }
            var global_index = 1;
            var randomRgbColor = function (k) { //随机生成RGB颜色
                if (k && colorblack[k]) {
                    return colorblack[k][1];
                }
                var r = Math.floor(Math.random() * 256); //随机生成256以内r值
                var g = Math.floor(Math.random() * 256); //随机生成256以内g值
                var b = Math.floor(Math.random() * 256); //随机生成256以内b值
                return `rgb(${r},${g},${b})`; //返回rgb(r,g,b)格式颜色
            }
            var handlerData = function (res, targetId, dataname) {
                if (!targetId) {
                    targetId = 0;
                }
                var disName = dataname;
                var links = [];
                var nodes = [];

                if (targetId === 0) {
                    var color3 = 'rgb(39,46,64)'
                    nodes.unshift({
                        id: 0,
                        category: 0,
                        name: disName,
                        type: false,
                        symbolSize: 15,
                        itemStyle: {
                            color: color3
                        }
                    })
                }
                var offA = true;
                var zlId = null;
                for (var k in res) {
                    if (res[k].length !== 0) {
                        if (k === '公司十大股东_公司' || k === '公司董事_董事' || k === '公司高管_高管' || k === '公司董事_董事' || k === '公司高管_高管' || k === '公司十大股东_十大股东') {
                            if (offA) {
                                offA = false;
                                zlId = global_index++;
                                nodes.push({
                                    id: zlId,
                                    name: '治理结构',
                                    value: '治理结构',
                                    type: false,
                                    symbolSize: 10,
                                    itemStyle: {
                                        color: randomRgbColor('治理结构')
                                    }
                                });
                                links.push({
                                    source: zlId,
                                    target: targetId,
                                    lineLabel: '治理结构'
                                });
                            }
                            var id2 = global_index++;
                            var name = k.split('_')[1];
                            nodes.push({
                                id: id2,
                                name: name,
                                value: name,
                                type: k,
                                symbolSize: 8,
                                itemStyle: {
                                    color: randomRgbColor(name)
                                }
                            });
                            links.push({
                                source: id2,
                                target: zlId,
                                lineLabel: name
                            });
                        } else {
                            var id = global_index++;
                            var name = k.split('_')[1];
                            nodes.push({
                                id: id,
                                name: name,
                                value: name,
                                type: false,
                                symbolSize: 10,
                                itemStyle: {
                                    color: randomRgbColor(name)
                                }
                            });
                            links.push({
                                source: id,
                                target: targetId,
                                lineLabel: name
                            });
                            for (var l = 0; l < res[k].length; l++) {
                                if (l >= 10) {
                                    continue
                                }
                                var id2 = global_index++;
                                var item = res[k][l];
                                nodes.push({
                                    id: id2,
                                    name: item.disName,
                                    value: item.name,
                                    type: item.type,
                                    symbolSize: 8,
                                    itemStyle: {
                                        color: randomRgbColor(name + item.type)
                                    }
                                });
                                links.push({
                                    source: id2,
                                    target: id,
                                    lineLabel: item.disName
                                });
                            }
                        }
                    }
                }

                var obj = {
                    nodes: nodes,
                    links: links
                }
                // console.log(data);
                return obj;
            }
            var dataItem = handlerData(info.data.relations, false, info.data.entity.disName);
            chartData.series[0].nodes = dataItem.nodes;
            chartData.series[0].links = dataItem.links;
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil,
            textData: element,
            chartData: chartData
        };
        // console.log(JSON.stringify(result));
        return result;
    },


    /**
     * 行业研报
     * @param data
     * @returns {Promise<*>}
     */
    async industryHandler(data) {
        let industry = data.industry;//行业
        let industryName = data.industryName;//行业

        if (commonUtil.stringIsNotEmpty(industryName)) {
            data.q = industryName;
        } else if (commonUtil.stringIsNotEmpty(industry) && !data.isDefaultIndustry) {
            data.q = industry;
        }
        let info = "";
        let template = "";
        let isNoData = false;
        if (data.dataTypes === "INTRODUCTION") {//"行业简介"
            template = "autoReportDetail";
            info = await autoReportIndustryService.getTrade(data);
            isNoData = info.data.intro == null || info.data.intro == undefined || info.data.intro.length == 0;
        } else if (data.dataTypes === "UPSTREAM") {//"上游行业"
            template = "autoReportDetailUpStream";
            info = await autoReportIndustryService.getTrade(data);
            isNoData = info.data.upStream == null || info.data.upStream == undefined || info.data.upStream.length == 0;
        } else if (data.dataTypes === "DOWNSTREAM") {//"下游行业"
            template = "autoReportDetailDownStream";
            info = await autoReportIndustryService.getTrade(data);
            isNoData = info.data.downStream == null || info.data.downStream == undefined || info.data.downStream.length == 0;
        } else if (data.dataTypes === "INDUSTRY_MARKET_SIZE") {//"行业市场规模"
            template = "autoReportIndustryMarketSize";
            info = await autoReportIndustryService.getIndustryTrend(data, 'INDUSTRY_MARKET_SIZE');
            isNoData = info.data.length == 0;
        } else if (data.dataTypes === "INDUSTRY_PROFITABILITY_ANALYSIS") {//"行业成本和盈亏分析"
            template = "autoReportIndustryProfitabilityAnalysis";
            info = await autoReportIndustryService.getIndustryTrend(data, 'INDUSTRY_PROFITABILITY_ANALYSIS');
            isNoData = info.data.length == 0;
        } else if (data.dataTypes === "PRODUCT_PRICE") {//"行业内产品价格"
            template = "autoReportIndustryProductPrice";
            info = await autoReportIndustryService.getIndustryTrend(data, 'PRODUCT_PRICE');
            isNoData = info.data.length == 0;
        } else if (data.dataTypes === "INDUSTRY_TREND") {//"行业发展趋势"
            template = "autoReportIndustryTrend";
            info = await autoReportIndustryService.getIndustryTrend(data, 'INDUSTRY_TREND');
            isNoData = info.data.length == 0;
        } else if (data.dataTypes === "INDUSTRY_FOCUS") {//"行业竞争格局"
            template = "autoReportIndustryFocus";
            info = await autoReportIndustryService.getIndustryTrend(data, 'INDUSTRY_FOCUS');
            isNoData = info.data.length == 0;
        } else if (data.dataTypes === "COMPANY_INFO") {//"国内上市公司"
            template = "autoReportCompanyList";
            info = await autoReportIndustryService.getTrade(data);
            isNoData = info.data.companyInfoList == null || info.data.companyInfoList == undefined || info.data.companyInfoList.length == 0;
        } else if (data.dataTypes === "INDUSTRY_INVESTMENT_ADVICE") {//"行业投资建议"
            template = "autoReportIndustryInvestmentAdvice";
            info = await autoReportIndustryService.getIndustryTrend(data, 'INDUSTRY_INVESTMENT_ADVICE');
            isNoData = info.data.length == 0;
        } else if (data.dataTypes === "INDUSTRY_RECOMMEND_STOCK") {//"行业个股推荐"
            template = "autoReportIndustryRecommendStock";
            info = await autoReportIndustryService.getIndustryTrend(data, 'INDUSTRY_RECOMMEND_STOCK');
            isNoData = info.data.length == 0;
        } else if (data.dataTypes === "INDUSTRY_LEADING_ANALYSIS") {//"行业龙头分析"
            template = "autoReportIndustryLeadingAnalysis";
            info = await autoReportIndustryService.getIndustryTrend(data, 'INDUSTRY_LEADING_ANALYSIS');
            isNoData = info.data.length == 0;
        } else if (data.dataTypes === "EXTERNAL_ENVIRONMENT") {//行业外部环境
            template = "autoReportIndustryExternalEnvironment";
            info = await autoReportIndustryService.getIndustryTrend(data, 'EXTERNAL_ENVIRONMENT');
            isNoData = info.data.length == 0;
        } else if (data.dataTypes === "INDUSTRY_CAPACITY") {//行业产能
            template = "autoReportIndustryCapacity";
            info = await autoReportIndustryService.getIndustryTrend(data, 'INDUSTRY_CAPACITY');
            isNoData = info.data.length == 0;
        }

        let params = handlerUtil.getTemplateConfig(template);

        if (params.code === -1) {
            return params;
        }
        if (isNoData) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            params: params,
            commonUtil: commonUtil,
            templateType: template
        };
        return result;
    },


    /**
     * 事件数据
     * @param data
     * @returns {Promise<*>}
     */

    async eventHandler(data,res) {
        let reqParams = {};
        reqParams.facetFields = "ners";
        reqParams.direction = "desc";
        reqParams.cp = data.searchParams.cp;
        reqParams.ps = data.searchParams.ps;
        reqParams.expend = true;
        let info = await semanticApiService.getinforamtionEvent(reqParams);
        info.inNoData = commonUtil.isNoData(info);

        if (!info.inNoData) {
            var idsList = [];
            for (let i = 0; i < info.data.list.length; i++) {
                var item = info.data.list[i];
                var infoIds = item.infoIds;
                var temp = [];
                if (infoIds.length > 2) {
                    info.data.list[i].showMore = true;
                    temp = infoIds.slice(0, 2);
                } else {
                    info.data.list[i].showMore = false;
                    temp = infoIds;
                }
                idsList = idsList.concat(temp)

                // info.data.list[i].infos = infoIds;
            }
            idsList = idsList.join(",");
            var datas = {
                ids: idsList,
                ps: 20
            }
            let infoRes = await semanticApiService.getinforamtionEventRelated(datas);
            for (let i = 0; i < info.data.list.length; i++) {
                var item = info.data.list[i];
                item.infos = [];
                for (let j = 0; j < infoRes.data.length; j++) {
                    for (let z = 0; z < item.infoIds.length; z++) {
                        if (item.infoIds[z] == infoRes.data[j].id) {
                            item.infos.push(infoRes.data[j]);
                        }
                    }
                }
            }
            // info.data.list[i].infos = infoRes.data;
        }
        // informationEvent

        let template = "informationEvent";
        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        // res.send(info)
        // info = await semanticApiService.getinforamtionEvent(params.reqParams);
        // res.redirect(config[process.env.NODE_ENV].host + '/api/template?type=informationEvent&d=j&facetFields=ners&orderBy=&direction=desc&cp=1&ps='+data.searchParams.ps+'&ners=&begin=&end=&expend=true&content=')
        if (info.data.list.length == 0) {
            if (data.searchParams.hasOwnProperty('setIndexData')) {
                let showData = data.searchParams.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                }

            } else {
                return {code: -1, message: "暂无数据!", templateType: params.templateType}
            }
        }

        let result = {
            code: 0,
            message: "success",
            info: info,
            params: params
        };
        return result;
    },


    async searchInfoHandler(data,res,type) {

        let reqData = {};
        // console.log(data.searchParams)
        reqData.title2stocks = data.searchParams.stocks;
        let stocks = data.searchParams.stocks;
        let defaultStock = true;
        reqData.title2stocks = "000001";

        // reqData.person = data.searchParams.person;

        // reqData.person = data.searchParams.person;




        //接收模版参数
        if(stocks && stocks.length > 0){
            reqData.title2stocks = stocks[0].baseName.slice(2, 8);
            if(data.searchParams.radio == "2"){
                reqData.title2stocks = "";
                reqData.person = "";
                reqData.industries = stocks[0].baseName;
            }
            defaultStock = false;
        }

        if (data.symbol && !data.searchParams.isDefaultStock) {
            defaultStock = false;
            reqData.title2stocks = data.symbol.slice(2, 8);
        }
        console.log('2222')
        console.log(data.searchParams.stocks[0])
        if (data.searchParams.stocks.length > 0) {
            reqData.name = data.searchParams.stocks[0].disName;
        }
        if (data.searchParams.stocks.length > 0) {
            reqData.stockCode = data.searchParams.stocks[0].code;
        }

        //接收动参
        if (data.industry && data.searchParams.radio == "2" && !data.searchParams.isDefaultStock) {
            reqData.title2stocks = "";
            reqData.industries = data.industry;
            reqData.person = "";
            defaultStock = false;
        }



        if(data.searchParams.dataTypes == 'NEWS,GREAT_WISDOM_DATA'){
            if(data.searchParams.checkedCities && data.searchParams.checkedCities.length == 2){
                reqData.attitude = "";
            }else if(data.searchParams.checkedCities){
                reqData.attitude = data.searchParams.checkedCities[0];
            }
            if(reqData.attitude == "正面"){
                reqData.attitude = "利多";
            }
            if(reqData.attitude == "负面"){
                reqData.attitude = "利空";
            }
        }

        if(data.searchParams.radio != "2"){
            if (data.relevantPeople) {
                reqData.stocks = reqData.title2stocks;
                delete reqData["title2stocks"];
                reqData.person = data.relevantPeople;
                reqData.onlyHighLight = 'persons';
                // reqData.content = data.relevantPeople;
                // reqData.title = data.relevantPeople;
                if(defaultStock){
                    reqData.stocks = "";
                }

            }
            if(data.searchParams.person){
                reqData.person = data.searchParams.person;
                reqData.onlyHighLight = 'persons';
                reqData.stocks = reqData.title2stocks;
                delete reqData["title2stocks"];
                // reqData.content = data.searchParams.person
                // reqData.title = data.searchParams.person
                if(defaultStock){
                    reqData.stocks = "";
                }
            }
        }

        // reqData.innerAnd = data.searchParams.keyType;
        reqData.cp = data.searchParams.cp;
        reqData.ps = data.searchParams.ps;
        reqData.dataTypes = data.searchParams.dataTypes;
        reqData.orderBy = data.searchParams.orderBy;
        reqData.direction = data.searchParams.direction;
        reqData.begin = data.searchParams.startAt;
        reqData.end = data.searchParams.endAt;
        reqData.plainHighlightedFieldName = "title,content";

        if(type == 1){
            reqData.title2stocks = reqData.stocks;
            reqData.attitude = "利空,利多";
            reqData.dataTypes = 'NEWS,GREAT_WISDOM_DATA';
            delete reqData["title2stocks"];
            delete reqData["stocks"]
        }

        let info = await semanticApiService.getInfomationMes(reqData);
        if(info.data){
            info.data.showRed = reqData.content;
        }

        let template = "bigSearch";
        if(type == 1){
            template = "bigSearchEvent";
        }

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        // let htmlJson = await searchTemplateService.getTemplateSearch(data.searchParams);
        // if (data.d) {
        //     htmlJson.chartId = data.chartId;
        // }

        if (info.data.list.length == 0) {
            if (data.searchParams.hasOwnProperty('setIndexData')) {
                let showData = data.searchParams.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                }

            } else {
                return {code: -1, message: "暂无数据!", templateType: params.templateType}
            }
        }


        if(typeof(info) == "object"){
            var person = '',
            stockCode = '',
                name = '';
            if (reqData.person) {
                person = reqData.person
            }
            if (reqData.stockCode) {
                stockCode = reqData.stockCode;
            }
            if (reqData.name) {
                name = reqData.name;
            }
            info.highLight = person + ',' + stockCode + ',' + name;
        }

        let result = {
            code: 0,
            message: "success",
            info: info,
            params: params
        };
        return result;
    },
    /**
     * 大搜索
     * @param data
     * @returns {Promise<*>}
     */
    async searchHandler(data,res) {
        let result;
        if (data.d) {
            data.searchParams.d = "j";
        }
        if(data.searchParams.id == "2005"){
            result = await this.eventHandler(data,res);
        } else if (data.searchParams.id == "2006") {
            result = await this.searchInfoHandler(data,res,1)
        } else if (data.searchParams.id == "2007") {
            result = await this.marketPredictionData(data,res);
        }else{
            result = await this.searchInfoHandler(data,res)
        }

        return result;
    },


    /**
     * 其他组件
     * */
    async noticeSearchHandler(data) {

        let reqParam = {};

        if (data.isDefaultStock) {
            let stocks = data.stocks;
            reqParam.marType = stocks.marType;
            reqParam.secCode = stocks.code;
        } else if (data.hasOwnProperty('symbol')) {
            reqParam.marType = data.symbol.substring(0, 2);
            reqParam.secCode = data.symbol.substring(2, data.symbol.length);
        } else {
            reqParam.marType = 'sz';
            reqParam.secCode = '000001';
        }
        if (data.hasOwnProperty('person')) {
            if (commonUtil.stringIsNotEmpty(data.person)) {
                reqParam.concernHuman = data.person;
            } else if (data.hasOwnProperty('relevantPeople')) {
                reqParam.concernHuman = data.relevantPeople;
            }else {
                reqParam.concernHuman = '';
            }
        }
        let time = '';
        if (data.id == 5001 || data.id == 5002 || data.id == 5004) {
            reqParam.keyWords = data.title.split(/[,，]/);
            reqParam.condition = data.keyType == '2' ? 'OR' : 'AND';


            switch (data.timeRangeType) {
                case 0://任意时间
                    //有动参时取用，无动参默认'近一月'
                    if (commonUtil.stringIsNotEmpty(data.startAt) && commonUtil.stringIsNotEmpty(data.endAt)) {
                        reqParam.startAt = data.startAt;
                        reqParam.endAt = data.endAt;
                        let start = commonUtil.formateDate(data.startAt);
                        let end = commonUtil.formateDate(data.endAt);
                        time = start + '至' + end;
                    } else {
                        reqParam.timeInterval = '近一月';
                        time = reqParam.timeInterval;
                    }
                    break;
                case 1://近一段区间
                    reqParam.timeInterval = data.timeInterval;
                    time = reqParam.timeInterval;
                    //有动参时取用，无动参时默认当前时间
                    if (data.hasOwnProperty('endAt')) {
                        reqParam.deadLine = data.endAt;
                    }
                    break;
                case 2://自定义区间
                    reqParam.startAt = data.startAt;
                    reqParam.endAt = data.endAt;
                    let start = commonUtil.formateDate(data.startAt);
                    let end = commonUtil.formateDate(data.endAt);
                    time = start + '至' + end;
                    break;
            }
        } else if (data.id == 5006) {
            if (data.hasOwnProperty('endAt')) {
                reqParam.pointTime = data.endAt;
            } else {
                let time;
                if (data.hasOwnProperty('timeSeries')) {
                    time = data.timeSeries;
                    if (time.length > 0) {
                        reqParam.pointTime = time[0];
                    } else {
                        let now = new Date();
                        let month = now.getMonth().toString();
                        let day = now.getDate().toString();
                        if (month.length == 1) {
                            month = '0' + month;
                        }
                        if (day.length == 1) {
                            day = '0' + day;
                        }
                        reqParam.pointTime = now.getFullYear().toString() + month + day;
                    }
                }
            }
        }

        reqParam.cp = data.cp;
        reqParam.ps = data.ps;

        let info = "";
        let template = "";
        let a = [];
        let detailDes = '';


        switch (data.id) {
            case 5001:
                //公告
                template = "informationListView";
                info = await semanticDatacenterServic.getStockNoticeSearch(reqParam);
                a = [];
                a.push('title,annTitle');
                a.push('date,pubDate');
                a.push('pageId,id');
                a.push('pageUrl,annUrl');
                info = this.transferInfoParams(a, info);
                if (data.styleType == 2 && data.title.length > 0) {
                    for (let i = 0; i < reqParam.keyWords.length; i++) {
                        let keyWords = reqParam.keyWords[i];
                        detailDes += (i == reqParam.keyWords.length - 1) ? (keyWords + '事项') : (keyWords + '、');
                    }
                }
                break;
            case 5002:
                //董事会监事会投票
                template = 'otherBoardVote';
                // console.log(data)
                if(data.voteType){
                    if(data.voteType == "1"){
                        reqParam.recoResult = 1;
                    }else if(data.voteType == "2"){
                        reqParam.recoResult = 0;
                    }
                }



                if(data.searchType == "0"){
                  reqParam.minAffirmativeVotes = 0;
                  //反对
                }else if(data.searchType == "2"){
                  reqParam.minAgainstVotes = 0;
                  //反对
                }else if(data.searchType == "3"){
                  //弃权
                  reqParam.minAbstentionVotes = 0;
                }else{
                  reqParam.minAgainstVotes = 0;
                  reqParam.minAbstentionVotes = 0;
                }
                
                // console.log(data)
                if(reqParam["timeInterval"]){
                    var date = dateUtil.getDateParams(1,reqParam);
                    reqParam.startAt = date.startAt;
                    reqParam.endAt = date.endAt;

                    // reqParam.startAt = dateUtil.timeFormatToMillion(reqParam.startAt);
                    // reqParam.endAt = dateUtil.timeFormatToMillion(reqParam.endAt);
                }

                if(data.selectedEntities && data.selectedEntities.length>0){
                    reqParam.orgKeys = data.selectedEntities[0].orgKey;
                }
                // reqParam.orgKeys = data;
                reqParam.condition = data.voteType == '2' ? 'OR' : 'AND';
                delete reqParam["marType"]
                delete reqParam["secCode"]

                info = await dwDbService.getProposalVoteSearch(reqParam);
                // info = await semanticDatacenterServic.getProposalVoteSearch(reqParam);
                console.log(info)
                break;
            case 5004:
                //司法纠纷
                template = "informationListView";
                a = []
                if (data.hasOwnProperty('radioType')) {
                    let radioType = data.radioType;
                    if (radioType.indexOf('全部') != -1) {
                        detailDes += '民事、失信人及刑事诉讼'
                    } else {
                        if (radioType.indexOf('民事') != -1) {
                            detailDes += '民事';
                            a.push('1')
                        }
                        if (radioType.indexOf('失信人') != -1) {
                            detailDes += detailDes.length > 0 ? '、失信人' : '失信人';
                            a.push('3')
                        }
                        if (radioType.indexOf('刑事') != -1) {
                            detailDes += detailDes.length > 0 ? '及刑事' : '刑事';
                            a.push('2')
                        }
                        if (detailDes.length > 0) {
                            detailDes += '诉讼';
                        }
                    }
                }
                reqParam.judicialType = a
                info = await semanticDatacenterServic.getStockJudicialDispute(reqParam);
                info.host = config[process.env.NODE_ENV].host;
                a = [];
                a.push('title,caseTitle');
                a.push('date,entryDate');
                a.push('pageId,caseId');
                info = this.transferInfoParams(a, info);

                break;
            case 5006:
                //参控股公司

                template = 'ParticipateHoldingCompany';
                info = await semanticDatacenterServic.getStockShareHoldSearch(reqParam);
                break;
        }

        let params = handlerUtil.getTemplateConfig(template);

        if (params.code === -1) {
            return params;
        }
        if (info.message.code != 0) {
            return {code: -1, message: info.message, templateType: params.templateType}
        }
        if (info.data.length == 0) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        } else {
            if (data.id == 5001 || data.id == 5004) {
                if (data.styleType == 2) {
                    info.summary = detailDes.length > 0 ? (time + '，公司涉及' + info.data.length.toString() + '条' + detailDes) : '--';
                } else {
                    info.summary = '';
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil,
            templateType: template
        };
        return result;
    },

    /**
     * 定期报告内容搜索
     * */
    async reportExtractHandler(data) {
        let reqParam = {};

        if (data.id == 5003) {
            //一致行动人
            if (data.isDefaltStock) {
                let stocks = data.stocks;
                reqParam.marType = stocks.marType;
                reqParam.secCode = stocks.code;
            } else if (data.hasOwnProperty('symbol')) {
                reqParam.marType = data.symbol.substring(0, 2);
                reqParam.secCode = data.symbol.substring(2, data.symbol.length);
            } else {
                reqParam.marType = 'sz';
                reqParam.secCode = '000001';
            }
        } else {
            //定期报告搜索
            if (data.isDefaltStock) {
                let stocks = data.stocks;
                reqParam.stocks = stocks.code;
            } else if (data.hasOwnProperty('symbol')) {
                reqParam.stocks = data.symbol.substring(2, data.symbol.length);
            } else {
                let stock = data.stocks;
                if (stock.hasOwnProperty('code')) {
                    reqParam.stocks = stock.code;
                } else {
                    reqParam.stocks = '000001';
                }
            }
        }

        switch (data.timeRangeType) {
            case 0://任意时间
                //有动参时取用，无动参默认'近一月'
                if (commonUtil.stringIsNotEmpty(data.startAt) && commonUtil.stringIsNotEmpty(data.endAt)) {
                    reqParam.startAt = data.startAt;
                    reqParam.endAt = data.endAt;
                } else if (data.id == 5003) {
                    reqParam.timeInterval = '近一月';
                } else {
                    reqParam.timeInterval = '近一年';
                }
                break;
            case 1://近一段区间
                reqParam.timeInterval = data.timeInterval;
                //有动参时取用，无动参时默认当前时间
                if (data.hasOwnProperty('endAt') && data.id == 5003) {
                    reqParam.deadLine = data.endAt;
                }
                break;
            case 2://自定义区间
                reqParam.startAt = data.startAt;
                reqParam.endAt = data.endAt;
                break;
        }
        reqParam.cp = data.cp;
        reqParam.ps = data.ps;

        let template = "paragraphView";
        let info = '';
        let type = '';
        switch (data.id) {
            case 4001:
                //主要产品
                type = 'ANNCOM_PRO';
                break;
            case 4002:
                // 渠道网点
                type = 'ANNENG_CHA';
                break;
            case 4003:
                // 分支机构（证券）
                type = 'ANNSEC_BRA';
                break;
            case 5003:
                //一致行动人
                info = await semanticDatacenterServic.getStocPersonsActingInConcert(reqParam);
                break;
            case 4004:
                // 主动管理资产（证券）
                type = 'ANNSEC_ASS';
                break;
            case 4005:
                // 创新业务（证券）
                type = 'ANNSEC_CRE';
                break;
            // case 4006:
            //     // 移动端交易情况（证券、保险）
            //     type = '';
            //     break;
            case 4007:
                // 营业网点（银行、证券）
                type = 'ANNBAN_BRA';
                break;
            case 4008:
                // 客户数量（银行）
                type = 'ANNBAN_CUS';
                break;
            case 4009:
                // 增值税率
                type = 'ANNTAX_RAT';
                break;
            case 4010:
                // 税收优惠
                type = 'ANNTAX_DIS';
                break;
            case 4011:
                // 市场规模
                type = 'ANNMAR_SCA';
                break;
            case 4012:
                // 项目数量及资产规模（信托）
                type = 'ANNTRU_ASS';
                break;
            case 4013:
                // 研发能力（计算机、通讯）
                type = 'ANNCMP_CPY';
                break;
            case 4015:
                // 市占率
                type = 'ANNMAR_HOLD';
                break;
        }
        if (type.length > 0) {
            info = await semanticApiService.getPeriodicReport(type, reqParam);
            //处理添加报告来源
            if (info.hasOwnProperty('data')) {
                let data = info.data
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    if (commonUtil.stringIsNotEmpty(item.title)) {
                        let title = item.title;
                        //去除标题中括号及内容
                        if (item.title.indexOf('（') != -1 && item.title.indexOf('）') != -1) {
                            title = title.replace(/\（.*?\）/g, '');
                        }
                        if (item.title.indexOf('(') != -1 && item.title.indexOf(')') != -1) {
                            title = title.replace(/\(.*?\)/g, '');
                        }
                        info.data[i].text = item.text + '\n' + '（' + title + '）';
                    }
                }
            }
        }
        info.ps = data.ps;

        let params = handlerUtil.getTemplateConfig(template);

        if (params.code === -1) {
            return params;
        }
        if (!info.hasOwnProperty('data')) {
            return {code: -1, message: info.message, templateType: params.templateType}
        }
        if (info.data.length == 0) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }

        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.id,
            params: params,
            commonUtil: commonUtil,
            templateType: template
        };
        return result;
    },
    // 财务周期组件
    async financialStatementHandler(data) {
        var dataFuture = data.dataFuture;// 预测时间
        var today = new Date();
        var year = today.getFullYear();
        var symbol = data.symbol;
        var secCode = util.stringIsNotEmpty(symbol) ? symbol.substr(2) : "002424";
        var marketType = util.stringIsNotEmpty(symbol) ? symbol.slice(0, 2) : 'sz';
        var interfaceType = data.dataTableType;
        var param = {
            cp: 1,
            ps: 100,
            timeField: 'createAt',
            secCode: secCode,
            endDate: '20171231,20181231',
            orderBy: 'endDate',
            direction: 'asc'
        };
        var  date = dateUtil.getDateParams(data.timeRangeType,data);
        var startYear = date.startAt.substr(0,4);
        var endYear = date.endAt.substr(0,4);
        if (interfaceType != "comFinaceIndicatorQ") {
            param.statementType = '408001000';
            var endDate ="";
            var start = startYear;
            while (start <=  endYear){
                endDate += start +"1231"
                if(start < endYear){
                  endDate += ','
                }
                start++
            }
            param.endDate = endDate;
        } else {  // 单季度
            param.endDate = "";
            param.timeField = "endDate";
            dataFuture = 0;
            var  date = dateUtil.getDateParams(data.timeRangeType,data);
            param.startAt = date.startAt;
            param.endAt = date.endAt;
        }

        var info;
        if (interfaceType != "financialRatios") { //
            info = await financialStatementService.getFinancialStatementByType(param, interfaceType);
        } else {
            info = await semanticApiService.apiFinanceAnalysis({ //财务比率
                stockCode: secCode,
                marketType: marketType,
                financeQuarter: 'year',
                cache: true,
                randomNum: new Date().getTime()
            });
        }
        var params = handlerUtil.getTemplateConfig("financeCycle");
        var result = {
            params: params,
        };
        var dataList = [];

        if (interfaceType != "financialRatios") {
            if (info && info.message && info.message.code == 0 &&
                info.data && info.data.list && info.data.list.length > 0) {
                dataList = info.data.list;
            }
            var latestYear = 0 ;
            for (var index in dataList){
              var endDate = dataList[index].endDate;
              var endYear = Number(String(endDate).slice(0, 4));
              latestYear = Math.max(endYear,latestYear);
            }
            if(latestYear == 0){
               latestYear = Number(startYear) -1;
            }
            for (var i = 1; i <= dataFuture; i++) {
                dataList.push({endDate: (latestYear + i) + 'E', isE: true});
            }
            var dataRule = financialDataUtil.getDataRuleByType(interfaceType);
            result.info = financialDataUtil.generateDataByRule(dataList, dataRule)
        } else {
            if (info && info.message && info.message.code == 0 &&
                info.data && info.data.length > 0) {
                dataList = info.data;
            }
            var len = dataList.length;
            var temp = [];
            for (var i = 0; i < len; i++) {
                var item = dataList[i];
                if (financialDataUtil.getUsedFinancia(item.indicatorName)) {
                    temp.push(item);
                }
            }
            dataList = temp;
            var len = dataList.length;
            var list = [];
            var latestYear = 0;
            for (var i = 1; i < len; i++) {
                var item = dataList[i];
                var lis = [item.indicatorName];
                var first = ["年成长率"];
                var lisLen = item.data ? item.data.length : 0;
                for (var j = lisLen - 1; j >= 0; j--) {
                    var itemChild = item.data[j];
                    var reportQuarter = itemChild.reportQuarter;
                    if (reportQuarter) {
                      var reportYear = String(reportQuarter).slice(0, 4);
                      var reportStart = String(date.startAt).slice(0, 4);
                      if(Number(reportStart) > Number(reportYear)){
                        console.log("start:" + reportStart);
                        console.log("reportYear:" + reportYear);
                        continue;
                      }
                        first.push(reportYear);
                        if(i==1){
                          latestYear = Math.max(reportYear,latestYear);
                        }

                    }
                    var rate = itemChild.disPlayValueOne;
                    if (rate) {
                        rate = rate.toFixed(2);
                    }
                    if (item.indicatorName.indexOf("%") != -1) {
                        rate += "%";
                    }
                    if (item.indicatorName != "偿债能力(分)" && item.indicatorName != "成长能力(分)") {
                        lis.push(rate);
                    } else {
                        rate = "";
                        lis[0] = item.indicatorName.replace("(分)", "");
                        lis.push(rate);
                    }

                }
                if (i == 1) {
                    if(latestYear == 0){
                        latestYear = Number(startYear) - 1;
                    }
                    year = latestYear +1;
                    for (var p = 0; p < dataFuture; p++) {
                        first.push((year + p) + 'E');
                    }
                    for (var p = 0; p < dataFuture; p++) {
                        lis.push("");
                    }
                    list.push(first);
                    list.push(lis);
                } else {
                    list.push(lis);
                    for (var p = 0; p < dataFuture; p++) {
                        lis.push("");
                    }
                }
            }

            result.info = list;
        }

        return result;
    },


    //知识库
    async getKnowledgelibHandler(data) {
        let knowledgeTypes;
        let entityLeftTypeId;
        let entityLeftIds
        if(data.searchParams){
            knowledgeTypes = data.searchParams.knowledgeTypes;
            entityLeftTypeId = data.searchParams.entityLeftTypeId;
            entityLeftIds = data.searchParams.entityLeftIds;
        }
        if(data.knowledgeTypes){
            knowledgeTypes = data.knowledgeTypes;
        }
        if(data.entityLeftTypeId){
            entityLeftTypeId = data.entityLeftTypeId;
        }
        if(data.entityLeftIds){
            entityLeftIds = data.entityLeftIds;
        }
        let reqparams = {
            orderBy:'publishAt',
            knowledgeTypes: knowledgeTypes,
            entityLeftTypeId:entityLeftTypeId,
            entityLeftIds: entityLeftIds,
            direction: 'DESC',
            deleteFlag: 0,
            cp:1,
            ps:data.ps || 10
        }
        let info = await aiApiService.getknowledge(reqparams);

        let template = "knowledge";


        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },
    //情感分析数据
    async sentimentAnalysisDate(data) {
        let knowledgeTypes;
        let entityLeftTypeId;
        let entityLeftIds
        if(data.searchParams){
            knowledgeTypes = data.searchParams.knowledgeTypes;
            entityLeftTypeId = data.searchParams.entityLeftTypeId;
            entityLeftIds = data.searchParams.entityLeftIds;
        }
        if(data.knowledgeTypes){
            knowledgeTypes = data.knowledgeTypes;
        }
        if(data.entityLeftTypeId){
            entityLeftTypeId = data.entityLeftTypeId;
        }
        if(data.entityLeftIds){
            entityLeftIds = data.entityLeftIds;
        }
        let reqparams = {
            orderBy:'publishAt',
            knowledgeTypes: knowledgeTypes,
            entityLeftTypeId:entityLeftTypeId,
            entityLeftIds: entityLeftIds,
            direction: 'DESC',
            deleteFlag: 0,
            cp:1,
            ps:data.ps || 10
        }
        let info = await aiApiService.getknowledge(reqparams);

        let template = "knowledge";


        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },
    //市场预测数据
    async marketPredictionData(data) {
        let knowledgeTypes;
        let entityLeftTypeId;
        let entityLeftIds
        if(data.searchParams){
            knowledgeTypes = data.searchParams.knowledgeTypes;
            entityLeftTypeId = data.searchParams.entityLeftTypeId;
            entityLeftIds = data.searchParams.entityLeftIds;
        }
        if(data.knowledgeTypes){
            knowledgeTypes = data.knowledgeTypes;
        }
        if(data.entityLeftTypeId){
            entityLeftTypeId = data.entityLeftTypeId;
        }
        if(data.entityLeftIds){
            entityLeftIds = data.entityLeftIds;
        }
        let reqparams = {
            orderBy:'publishAt',
            knowledgeTypes: knowledgeTypes,
            entityLeftTypeId:entityLeftTypeId,
            entityLeftIds: entityLeftIds,
            direction: 'DESC',
            deleteFlag: 0,
            cp:1,
            ps:data.ps || 10
        }
        let info = await marketPredictionService.getlist();
        info.host = config[process.env.NODE_ENV].host;

        let template = "marketPredictionView";


        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 业务组件-股票指数对比
     * */
    async contrastStockHandler(data) {
        let info = '';
        let symbol = "sz000001";
        if (data.symbol) {
            symbol = data.symbol;
        }
        if (data.stocks) {
            symbol = data.stocks.marType + data.stocks.code;
        }

        let param = {
            symbol: symbol,
            d: data.g,
            chartId: data.dataBaseId,
        }
        info = await searchTemplateService.getContrastStockData(param);

        let categories = info && info.data && info.data.categories || [];
        let series = info && info.data && info.data.series || [];
        let stockData = [];//单独存放股票的数值
        let indexData = [];//单独存放股票的数值
        let tableData = [];//用于存放表格数据

        info.data = []; //用于渲染图表


        series.map(item => {
            if (item.name.indexOf('沪深300') !== -1) {//指数类型数据
                indexData = item.data;
                returnIndexDate(categories, item.data);
            } else {
                stockData = item.data;
                returnIndexDate(categories, item.data)
            }
        })

        //表格数据准备
        //绝对表现计算
        let jdShowDate = jdDataWay(stockData) || []; //股票绝对值
        let jdLast = jdDataWay(indexData); //指数值
        let xdShowDate = [];
        for (let j = 0; j < jdShowDate.length; j++) {
            let c = (Number(jdShowDate[j]) - Number(jdLast[j])).toFixed(2) + "%";
            xdShowDate.push(c);
        }

        function jdDataWay(data) {
            var res;
            let len = data.length;
            var initData = data[len - 1];

            var oneData = ((initData - data[data.length - 22]) / data[data.length - 22] * 100).toFixed(2);
            var sixData = ((initData - data[data.length - 132]) / data[data.length - 132] * 100).toFixed(2);
            var twfData = ((initData - data[0]) / data[0] * 100).toFixed(2);
            res = [oneData, sixData, twfData];
            return res
        }

        function formatPersent(values) {
            for (var i = 0; i < values.length; i++) {
                values[i] = values[i] + "%";
            }
        }

        function returnIndexDate(date, data) {
            let oneKeyObj = [];
            if (data.length > 0) {
                for (let i = 0; i < date.length; i++) {
                    let k = date[i];
                    var year = k.substring(0, 4);
                    var mon = k.substring(4, 6);
                    var day = k.substring(6, 8);
                    var res = year + '-' + mon + '-' + day;
                    oneKeyObj.push([new Date(res).getTime(), data[i]])
                }
                info.data.push(oneKeyObj);
            }
        }

        tableData.push(['项目', '近1月', '近6月', '近1年']);
        formatPersent(jdShowDate);
        jdShowDate.unshift('绝对表现');
        xdShowDate.unshift('相对表现');
        tableData.push(jdShowDate);
        tableData.push(xdShowDate);
        info.tableData = tableData; //用于渲染表格
        info.showTable = data.chartOrTabelType == 1 || data.chartOrTabelType == 2;//显示类型
        info.showChart = data.chartOrTabelType == 0 || data.chartOrTabelType == 2;//显示类型

        let template = 'contrastStock';
        let params = handlerUtil.getTemplateConfig(template);
        let result = {
            code: 0,
            message: "success",
            info: info,
            stock: series,
            dataType: '',
            params: params,
            commonUtil: commonUtil,
            templateType: ''
        };
        return result;
    },

    /**
     * 业务组件-竞品数据对比
     * */
    async competingProducts(data,res){
        let symbol = "";
        if (data.symbol) {
            symbol = data.symbol;
        } else if(data.stocks && data.stocks.length >0){
            symbol = data.stocks[0].baseName;
        }else{
            symbol = "sz000001"
        }

        var marType = symbol.slice(0,2);
        var secCode = symbol.slice(2,symbol.length);
        var limit = data.ps?data.ps:5;
        var induType = 'sw2';

        if(data.compareType == "1"){
            induType = 'sw2';
        }else if(data.compareType == "2"){
            induType = 'sw3';
        }else if(data.compareType == "3"){
            induType = 'csrc2';
        }

        let param = {
            marType: marType,
            secCode: secCode,
            limit:limit,
            filterIndi:'市值',
            induType:induType,
            orderDirect:'DESC'
        }
        var stockList = await  metadataDimDwService.getDailyIndicatorBySymbol(param);

        if(stockList.length == 0){
            stockList = ["000001"]
        }
        var dataSourceId = data.compareContent;

        var symbolArray = [];
        var addedSelf = false;
        if(stockList.data && stockList.data.length >0){
            stockList = stockList.data;
            for(var i =0; i<stockList.length;i++){
                var stock = stockList[i];
                var stockSymbol = stock.marType + stock.secCode
                if(stock.secCode == secCode){
                    addedSelf = true;
                }else{
                    symbolArray.push(stockSymbol);
                }
            }
        }

        if(data.radioType.indexOf("公司") != -1){
            symbolArray.push(symbol);
        }

        var symbols = symbolArray.join(',');
        var endAt = data.endAt ? data.endAt: format.formatTime(new Date(), 'yyyyMMdd')
        // var srcPage = req.header.host +
        var srcPage = "?chartId="+ dataSourceId
          +"&symbol=" + symbols+ "&startAt="+data.startAt+"&endAt=" + endAt +"&tag=" +data.tag+"&parentId=" + data.parentId;
        if(util.arrayISNotEmpty(data.dateStyle)){
            srcPage += "&d=" + data.dateStyle;
        }



        res.redirect(srcPage)
        // res.redirect("")
    },



  /**
   * 业务组件-行业内财务指标对比
   * */
    async financeIndustryHandler(data,res){
      let symbol = "";
      if (data.symbol) {
        symbol = data.symbol;
      } else if(data.stocks && data.stocks.length >0){
        symbol = data.stocks[0].baseName;
      }else{
        symbol = "sz000001"
      }
      var marType = symbol.slice(0,2);
      var secCode = symbol.slice(2,symbol.length);
      var limit = data.dataNum?data.dataNum:5
      let param = {
        marType: marType,
        secCode: secCode,
        limit:limit,
        filterIndi:'市值',
        induType:'sw2',
        orderDirect:'DESC'
      }
      var stockList = await  metadataDimDwService.getDailyIndicatorBySymbol(param);
      var dataSourceId = await  semanticDatacenterServic.getDataTemplateByBusiness({
        busiType:"financeIndustry",
        typeId:data.dataTableType
        })
      var symbolArray = [];
      var addedSelf = false;
      if(stockList.data && stockList.data.length >0){
        stockList = stockList.data;
        for(var i =0; i<stockList.length;i++){
          var stock = stockList[i];
          var stockSymbol = stock.marType + stock.secCode;
          symbolArray.push(stockSymbol);
          if(stockSymbol == symbol){
            addedSelf = true;
          }
        }
      }
      if(!addedSelf){
        symbolArray.push(symbol);
      }
      if(dataSourceId.data && dataSourceId.data.length >0){
        dataSourceId = dataSourceId.data[0].templateId;
      } else {
        dataSourceId = '659';
      }
      var symbols = symbolArray.join(',');
      var endAt = data.endAt ? data.endAt: format.formatTime(new Date(), 'yyyyMMdd')
     // var srcPage = req.header.host +
      var srcPage = "?chartId="+ dataSourceId
        +"&symbol=" + symbols+ "&startAt="+data.startAt+"&endAt=" + endAt +"&tag=" +data.tag+"&parentId=" + data.parentId;
      if(util.arrayISNotEmpty(data.dateStyle)){
        srcPage += "&d=" + data.dateStyle;
      }
      res.redirect(srcPage)
    },
    async getTemplateType(data, templateType,res) {
        //判断是不是需要转换为JsonObject
        if (!(typeof (data) == "object" && Object.prototype.toString.call(data).toLowerCase() == "[object object]" && !data.length)) {
            data = JSON.parse(data);
        }



        let resultInfo = {};

        switch (templateType) {
            case "chart":
                resultInfo = await reportHandler.chartHandler(data);
                break;
            case "speech":
                resultInfo = await reportHandler.speechHandler(data);
                break;
            case "research"://可变现资产
                resultInfo = await reportSearchHandler.researchHandler(data);
                break;
            case "industry":
                resultInfo = await reportHandler.industryHandler(data);
                break;
            case "robotChart":
                resultInfo = await robotHandler.robotChartHandler(data);
                break;
            case "robotAnalys":
                resultInfo = await robotHandler.robotAnalysHandler(data);
                break;
            case "dataIs": //数据是
                resultInfo = await robotHandler.robotAnalysHandler(data);
                break;
            case "focus":
                resultInfo = await robotHandler.robotAnalysHandler(data);
                break;
            case "search":
                resultInfo = await reportHandler.searchHandler(data,res);
                break;
            case "noticeSearch":
                if(data.id == "5001" || data.id == "5004" || data.id == "5006"){
                    resultInfo = await reportHandler.noticeSearchHandler(data);
                }else{
                    resultInfo = await reportSearchHandler.researchHandler(data);
                }
                break;
            case "boardVote":
                resultInfo = await reportHandler.noticeSearchHandler(data);
                break;
            case "reportExtract":
                resultInfo = await reportHandler.reportExtractHandler(data);
                break;
            case "knowledgeGraph":
                resultInfo = await reportHandler.knowledgeGraphHandler(data);
                break;
            case "financialStatement":
                resultInfo = await reportHandler.financialStatementHandler(data);
                break;
            case "financeContrast":
                resultInfo = await reportHandler.contrastStockHandler(data);
                break;
            case "financeIndustry":
                resultInfo = await reportHandler.financeIndustryHandler(data,res);
                break;
            case "competingProducts":
                resultInfo = await reportHandler.competingProducts(data,res);
                break;
            case "knowledgeLib":
                resultInfo = await reportHandler.getKnowledgelibHandler(data);
                break;
            default:
                break;

        }

        return resultInfo;
    },

    transferInfoParams: function (params, info) {
        if (!info.hasOwnProperty('data')) {
            return info;
        }
        let list = info.data;
        if (list.length == 0) {
            return info;
        }
        if (params.length == 0) {
            return info;
        }
        // params内结构['newP,oldP','newP,oldP'...]
        for (let i = 0; i < params.length; i++) {
            let param = params[i];
            let arr = param.split(',');
            let newP = arr[0];
            let oldP = arr[1];
            for (let j = 0; j < list.length; j++) {
                info.data[j][newP] = info.data[j][oldP];
            }
        }
        return info;
    }

};

export default reportHandler;
