var commonUtil = {
    /**
     * 处理k线的时间方法
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

    //处理小于0.00001的数值加"%"
    addPerForMin: function (hldAmount, hldPercent) {
        console.log(hldPercent);
        return hldAmount ? (hldPercent ? (hldPercent >= 0.01 ? hldPercent.toFixed(2) + "%" : '<0.01%') : '<0.01%') : '--';
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
    /**
     * 生成随机class名
     * @param classNamePrefix 前缀
     */
    generateRandomClassName: function (classNamePrefix) {
        return (classNamePrefix || '') + (Math.random() * 1e8).toFixed(0)
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
     * 格式化数字
     * @param value
     * @param precision 小数点精度
     * @param fixSmallNumber 是否格式化小于1万的数， 默认值为：true
     * @returns {*}
     */
    formatNumber: function (value, precision, fixSmallNumber) {
        if (value && !isNaN(value)) {
            if (precision === undefined || precision === '' || precision === null)
                precision = 2;

            if (fixSmallNumber === undefined)
                fixSmallNumber = true;

            var prefix = '';
            if (value < 0) {
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
            return value === 0 ? value.toFixed(2) : '--';
        }
    },

    getPatentRevel: function (value) {
        if (value == 1) {
            return '较高';
        } else if (value == 2) {
            return '一般';
        } else if (value == 3) {
            return '较低';
        }
    },
    getPatentRevelCommon: function (value) {
        if (value == 1) {
            return '看好该企业创造价值能力。';
        } else if (value == 2) {
            return '该企业创造价值能力一般。';
        } else if (value == 3) {
            return '不看好该企业创造价值能力。';
        }
    },

    /**
     *  从entity中取出股票代码
     * @param entity
     * @param returnMarketType 是否返回市场代码
     */
    getSymbolByEntity: function (entity, returnMarketType) {
        var symbol = '';
        for (var i = 0; i < entity.length; i++) {
            if (entity[i].type === '股票' || entity[i].type === '指数') {
                var marketType = '';
                if (returnMarketType !== false)
                    marketType = entity[i].property.marketType;
                symbol = marketType + entity[i].property.code;
                break;
            }
        }
        return symbol;
    },

    //日期格式转换
    changeTimeForMin: function (nS) {
        if (!nS || isNaN(nS))
            return '';
        var date = new Date(parseInt(nS));
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        return Y + M + D + h + m;
    },

    //小数点保存后两位
    fixed2: function (num) {
        return (!isNaN(num) && num !== '') ? num.toFixed(2) : '--';
    },


    //返回代符号的小数点保存后两位
    fixedSign2: function (num) {
        let sign = num > 0 ? '+' : ''
        return (!isNaN(num) && num !== '') ? (sign + num.toFixed(2)) : '--';
    },

    /**
     * 判断object里是否有值，以及值是否为空
     * @param obj
     */
    checkObjectIsNull: function (obj) {
        var flag = false;
        for (var p in obj) {
            if (obj[p]) {
                flag = true;
                break;
            }
        }
        return flag;
    },

    //
    //日期格式转换
    changeTime: function (nS, suffix) {
        if (!nS || isNaN(nS))
            return '';

        if (!suffix)
            suffix = '-';

        var date = new Date(parseInt(nS));
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        // h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':';
        // m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
        // s = date.getSeconds();
        return Y + suffix + M + suffix + D;
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

    /**
     * 格式化成交额
     * @param value
     * @returns {*}
     */
    formatAmount: function (value) {
        if (!isNaN(value)) {
            if (value < 10000)
                return value.toFixed(2) + '元';
            else if (value < 10e7)
                return (value / 10000).toFixed(2) + '万';
            else
                return (value / 10e7).toFixed(2) + '亿';
        } else {
            return value;
        }
    },
    /**
     * 标红关键字
     * @param sourceText
     * @param keywords
     */
    highlightText: function (sourceText, keywords) {
        if (!sourceText)
            return '';

        if (!keywords)
            return sourceText;

        keywords.forEach(function (item) {
            sourceText = sourceText.replace(eval('/' + item + '/g'), '<s class="t_red">' + item + '</s>');
        });
        return sourceText;
    },

    /**
     * 格式化20170801为2017-08-01
     * @param date
     * @returns {string}
     */
    generateDate: function (date) {
        var temp = date;
        if (date) {
            date = date.toString();
            if (date.length === 8)
                temp = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);
        }
        else
            temp = '--';
        return date ? temp : '--';
    },

    //资金单位变更
    changeMoney(money) {
        var flag = 0;
        money = String(money);
        if (money.indexOf(".") != -1) {
            money = money.split(".")[0];
        }
        if (money.indexOf("-") != -1) {
            money = money.replace("-", "");
            flag = 1;
        }
        if (money.length > 8) {
            money = money.slice(0, money.length - 8) + "." + money.slice(money.length - 8, money.length - 6) + "亿";
        }
        else {
            money = money.slice(0, money.length - 4) + "." + money.slice(money.length - 4, money.length - 2) + "万";
        }
        if (flag == 1) {
            return "-" + money;
        } else {
            return money;
        }

    },

    /**
     * 从entity中取出property属性
     * @param entity
     * @returns {string}
     */
    getPropertyByEntity(entity) {
        var property = '';
        for (var i = 0; i < entity.length; i++) {
            if (entity[i].type === '股票' || entity[i].type === '指数') {
                property = entity[i].property;
                break;
            }
        }
        return property;
    },


    // 加单位 unit string
    valueUnit(value, unit) {
        if (!isNaN(value)) {
            var prefix = "";
            if (value < 0)
                prefix = "-";

            if (value === 0)
                return value;

            value = Math.abs(value);

            if (value < 10e3)
                return prefix + value.toFixed(2) + unit;
            else if (value < 10e7)
                return prefix + (value / 10e3).toFixed(2) + '万' + unit;
            else
                return prefix + (value / 10e7).toFixed(2) + '亿' + unit;
        } else {
            return value || '--';
        }
    },

    /**
     * 截断字符
     * @param str 要截取的字符串
     * @param len 要展示的长度
     * @returns {*}
     */
    truncateString(str, len) {
        let temp = str;
        if (!len)
            len = 100;

        if (str) {
            if (str.length <= len)
                temp = str;
            else
                temp = str.substr(0, len) + '...';
        }
        return temp;
    },

      /**
       * 一般报价的文字颜色
       * @param num
       * @returns {string}
       */
    getClsByNumber:function(num) {
        var txtCls = '';
        if (num > 0)
        txtCls = 't_red';
        else if (num < 0)
        txtCls = 't_green';
        return txtCls;
    },

    /**
    * 计算百分比
    * @param num1
    * @param num2
    * @returns {number}
    */
    getPercentage:function(num1, num2) {
        var flag = 0;
        if (num2 === 0)
        return flag;
        return num1 / num2 * 100;
    },

    //资金单位变更
    getPreAnswer:function(appKey) {
        if(appKey == "guoxin"){
            return false;
        }
        return true;
    },

    // 判断是否为PC端
    isPC: function (userAgent) {
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgent.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },

    /**
     * 返回评价的HTML标签行
     * @param result 每个回答的spanId
     * @param showInteractiveView
     * @returns {string}
     */
    getRatingLabel:function(result,  appKey) {
        console.log(appKey)
        let showInteractiveView = commonUtil.isInteractiveView(result.answerResultType,appKey)
        if(appKey === 'guoxin')
            return '';
        var upId = commonUtil.generateRandomClassName('up');
        var downId = commonUtil.generateRandomClassName('down');
        var temp = '<div class="box_appraisal">';
        var stockInfo = {};
        if (showInteractiveView) {
            if (result.questionAnalyse[0].hasOwnProperty('entity') && result.questionAnalyse[0].entity.length > 0) {
                stockInfo = result.questionAnalyse[0].entity[0].property;
            }
            var hideClass = commonUtil.generateRandomClassName('');
            var questionAnalyse = result.questionAnalyse[0];
            var stockList = [];
            if (questionAnalyse.hasOwnProperty(('entity'))) {
                stockList = questionAnalyse.entity;
            }
            var entityContent = 0;
            stockList.forEach(function (item, index) {
                if (item.type == '股票') {
                    entityContent += 1;
                }
            });
            temp += '<ul>';
            if (appKey !== 'appTopC' && result.hasOwnProperty('properties') && entityContent <= 1) {
                if (result.properties.hasOwnProperty('optional')) {
                    if (result.properties.optional == "del") {
                        temp += "<li  class='deleteOptional" + hideClass + "' onclick=\"clearOptionalGo('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-reduce'></i><span>删自选</span></li>";
                        temp += "<li style='display:none;' class='addOptional" + hideClass + "' onclick=\"addOptional('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-plus'></i><span>加自选</span></li>";
                    } else {
                        temp += "<li style='display:none;' class='deleteOptional" + hideClass + "' onclick=\"clearOptionalGo('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-reduce'></i><span>删自选</span></li>";
                        temp += "<li class='addOptional" + hideClass + "' onclick=\"addOptional('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-plus'></i><span>加自选</span></li>";
                    }
                }
                if (result.properties.hasOwnProperty('warning')) {
                    if (result.properties.warning == "del") {
                        temp += "<li  class='deleteWarning" + hideClass + "'  onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-warning_ok'></i><span>预警</span></li>";
                        temp += "<li style='display:none;' class='addWarning" + hideClass + "'  onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-warning'></i><span>预警</span></li>";
                    } else {
                        temp += "<li style='display:none;' class='deleteWarning" + hideClass + "'  onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-warning_ok'></i><span>预警</span></li>";
                        temp += "<li class='addWarning" + hideClass + "'  onclick=\"warningGoApp('" + stockInfo.code + "','" + stockInfo.name + "','" + stockInfo.marketType + "','" + hideClass + "')\"><i class='icon-warning'></i><span>预警</span></li>";
                    }
                }
            }
            temp += '</ul>';
        }
        temp += '<a><i id="' + upId + '" class="icon-good" onclick=toolsUtil.ratingAnswer("' + result.spanId + '","' + 2 + '","' + upId + '")></i><span></span></a>' +
          '<a><i id="' + downId + '" class="icon-bad" onclick=toolsUtil.ratingAnswer("' + result.spanId + '","' + 1 + '","' + downId + '")></i><span></span></a>' +
          '</div>';
        return temp;
    },

    /**
     * 版本比较，如果currentVersion>=minVersion返回true，否则返回false
     * @param minVersion
     * @param currentVersion
     */
    checkVersion: function (minVersion, currentVersion) {
        var flag = false;

        if (!minVersion || !currentVersion)
            return flag;

        if (minVersion === currentVersion) {
            flag = true;
        }
        else {
            var arrMin = minVersion.split('.');
            var arrCurrent = currentVersion.split('.');
            var len = arrMin.length;
            for (var i = 0; i < len && i < arrCurrent.length; i++) {
                if (parseInt(arrCurrent[i]) > parseInt(arrMin[i])) {
                    flag = true;
                    break;
                } else if (parseInt(arrCurrent[i]) < parseInt(arrMin[i])) {
                    flag = false;
                    break;
                }
            }
        }

        return flag;
    },

    getQuarterLabel: function(value, type, shortYear) {
        var en = {
            '00': '',
            '03': 'Q1',
            '06': 'Q2',
            '09': 'Q3',
            '12': 'Q4'
        };

        var zh = {
            '00': '',
            '03': '一季报',
            '06': '二季报',
            '09': '三季报',
            '12': '四季报'
        };

        var season = {
            '00': '',
            '03': '年第一季度',
            '06': '年第二季度',
            '09': '年第三季度',
            '12': '年第四季度'
        };

        var zh2 = {
            '00': '',
            '03': ' 一季报',
            '06': ' 中报',
            '09': ' 三季报',
            '12': ' 年报'
        };

        var quarter = en;
        if(type === 'zh')
            quarter = zh;
        if(type === 'zh2')
            quarter = zh2;
        else if(type === 'season')
            quarter = season;

        var month = '00';
        var year = '';
        var str = value.toString();
        year = str.substr(shortYear?2:0, shortYear?2:4);
        if(str.length > 4)
            month = str.substr(4, 2);

        return year+quarter[month];
    },

    /**
     * 根据答案分类判断平台/APP/版本以确定是否展示与原生交互的界面
     * @param answerType 答案分类名称
     * @param requestParams appKey
     * @returns {boolean} 是否展示true|false
     */
    isInteractiveView:function(answerType, requestParams) {
        let appKey = requestParams.appKey;
        let appFrom = requestParams.appFrom;
        let appVersion = requestParams.appVersion;

        var flag = false;
        if (!answerType)
            return flag;

        var version;
        switch (answerType) {
            case "主动推送":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '事件影响':
                break;

            case "推荐列表":
                break;

            case "高管简介":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "行业推荐":
                break;

            case "概念":
            case "概念股":
            case "热点":
            case "热点成分股":
                break;

            case "个股所属板块":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "股票推荐":
                break;

            case "所属题材":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "经营分析":
            case "业绩简评":
          // case "业绩预告":
            case "投资建议":
            case "搜索回答":
            case "估值评级":
            case "行业综评":
            case "行业":
            case "行业个股推荐":
            case '专家个股观点':
            case '专家行业观点':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '基础知识':
                break;

            case "公司主营":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appXgw": "7.0.0",
                        "appTopC": "1.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "指数技术分析":
            case "技术分析":
            case "指数":
            case "上证指数综合评价":
            case "指数综评":
                break;
            case "个股技术分析":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;
            case '股东列表':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '分红配股':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "开盘价":
            case "收盘价":
            case "现价":
            case "最高价":
            case "最低价":
            case "涨跌幅":
            case "成交量":
            case "成交额":
            case "换手率":
            case "振幅":
            case "总市值":
            case "流通市值":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "市盈率":
            case "市净率":
            case "市销率":
            case "权益利润率":
            case "加权平均成本":
            case "投资回报率":
            case "每股现金流":
            case "总资产收益率":
            case "毛利率":
            case "营业收入同比增长":
            case "净利润增长率":
            case "净资产收益率":
            case "资产负债率":
            case "流动负债率":
            case "流动比率":
            case "速动比率":
            case "总资产周转率":
            case "存货周转率":
            case "应收账款周转天数":
            case "每股净资产":
            case "营业收入":
            case "净利润":
            case "每股盈利":
            case "每股公积金":
            case "每股未分配利润":
            case "每股经营现金流":
            case "毛利润":
            case "归属母公司净利润":
            case "净利率":
            case "存货周转天数":
            case "应收账款占比":
            case "净利润率":
            case "现金流分数":
            case "现金流量允当比率":
            case "现金再投资比率":
            case "偿债能力分数":
            case "总资产":
            case "总负债":
            case "成长能力分数":
            case "运营能力分数":
            case "营业周期":
            case "盈利能力分数":
            case "政府补贴占净利润比例":
            case "营业收入增长率":
            case "重要客户集中度":
            case "营业利润":
            case "营业费用率":
            case "营业利润率":
            case "经营活动现金净流量":
            case "投资活动现金净流量":
            case "融资活动现金净流量":
            case "经营活动现金净流量/营业利润":
            case "自由现金流":
            case "净资本增长率":
            case "可持续增长率":
            case "流动资产周转率":
            case "固定资产周转率":
            case "应收账款周转率":
            case "总资产周转天数":
            case "政府补贴占净利润比":
            case "净资产":
            case "净资本":
            case "商誉风险":
            case "资产收益率":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "财务指标":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "基础报价数据是":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "呼叫投顾":
            case "无法回答":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "调侃问好":
                break;

            case "未开发":
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '公司概况':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '办公地址':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case "事件概述":
                break;

            case '竞争优势':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '撤单页面':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '查询页面':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '持仓页面':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '预警设置':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '查看自选股':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '预警查看':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '预警设置清空':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '买入指令':
            case '卖出指令':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '自选股删除':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '自选股添加':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        // "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        // "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '资金流向':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '个股综评':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;
            case '研报':
            case '资讯':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '通用答案':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '相似K线':
                break;

            case '通用单个答案':
            case '通用列表答案':
                break;

            case '条件选股':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.10",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '选股页面': //条件选股指令
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.3.6",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.18",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '筹码分布':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.10",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '公司高管':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '高管/股东增减持':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '高管图谱':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '股权激励':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '股东人数变化':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '股本结构':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '十大股东':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '知识产权':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '每股盈利':
            case '权益利润率':
            case '营业收入':
            case '资产负债率':
            case '风险提示':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '开户页面':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.3.7",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.20",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '融资融券':
            case '个股限售股解禁':
            case '流动性':
            case '港股通资金流向':
            case '竞争力数据':
            case '高管变动':
            case '员工持股':
            case '业绩预告':
            case '财务分析':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.1.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.9",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '股权质押页面':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.3.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.20",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '行业分析页面':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.3.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.20",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '热点行业详情页面':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.3.8",
                        "appTopC": "1.0.0",
                        "webPage": "",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.20",
                        "appTopC": "1.0.0",
                        "webPage": "",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '近期热点页面':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.3.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.20",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '招股说明书解读':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.3.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.20",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '科创板专题':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.3.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.20",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            case '数据中心答案':
                version = {
                    "android": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.3.8",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    },
                    "ios": {
                        // "appZscf": "0.0.0",
                        "appEzt": "1.9.20",
                        "appTopC": "1.0.0",
                        // "appXgw": "7.0.0",
                        "app": ""
                    }
                };
                break;

            default:
                break;
        }

        //版本检查
        if (version) {
            //平台
            if (version[appFrom]) {
                //APP
                if (version[appFrom][appKey] !== undefined) {
                    //比较版本
                    var minVersion = version[appFrom][appKey];
                    if (appVersion) {
                        flag = this.checkVersion(minVersion, appVersion);
                        if (!flag)
                            console.log('当前版本[' + appVersion + ']低于最小原生支持版本[' + minVersion + ']，将展示纯H5界面')
                    } else {
                        console.log('未获取appVersion：' + appVersion)
                    }
                } else {
                    console.log('未匹配有效AppKey：' + appKey)
                }
            } else {
                console.log('未匹配有效平台类型：' + appFrom)
            }
        } else {
            console.log('此答案无版本控制');
        }
        var temp = '答案类型：' + answerType + '；平台：' + appFrom + '；App：' + appKey + '；最低版本：' + (minVersion || '无') + '；当前版本：' + (appVersion || '无') + '；原生界面: ' + flag;
        console.log(temp);
        // sendPreAnswerContent(temp);

        return flag;
    },

}

export default commonUtil;

