import _ from 'underscore'
import utils from './com-util'
import format from './format'

var commonUtil = {


        /**
         * 处理k线的时间方法
         * @param str 20180102
         * @return {Date} 毫秒数
         */
        moneyFormatter: function (str) {
            if (!str || isNaN(str))
                return '--';

            var d = str.toLocaleString();
            return d;
        },
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
            var randomTime = new Date().getTime();
            return classNamePrefix + randomTime + (Math.random() * 10000).toFixed(0);
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
                else if (value < 10e11)
                    return prefix + (value / 10e7).toFixed(precision) + '亿';
                else
                    return prefix + (value / 10e11).toFixed(precision) + '万亿';
            } else {
                return value === 0 ? value.toFixed(2) : '--';
            }
        },

        /**
         * 以千分位格式化数字
         * @param value
         * @param precision 小数点精度
         * @returns {*}
         */
        formatNumberNoUnit: function (value, precision) {
            var re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;//千分位 正则公式
            value = Number(value);
            var isInteger = Number.isInteger(value)
            if (value && !isNaN(value)) {
                if (precision === undefined || precision === '' || precision === null)
                    precision = 2;
                var prefix = '';
                if (value < 0) {
                    value = Math.abs(value);
                    prefix = '-';
                }
                value = prefix + value.toFixed(precision);
                value = value.replace(re, "$1,");
                if (isInteger) {
                    value = value.slice(0, value.length - 3);
                }
                return value
            } else {
                return value === 0 ? (isInteger ? value : value.toFixed(2)) : '--';
            }
        },
        formatMoneyByUnit: function (value, unit, precision) {
            var transform = false;
            var normalNum = false;
            var lastUnit = "";
            if (unit.indexOf('元') >= 0 || unit.indexOf('人') >= 0) {
                normalNum = true;
                lastUnit = unit.substr(unit.length - 1, 1);
                if ((unit == '元' || unit == '人') && value >= 10000) {
                    transform = true;
                } else if ((unit == '万元' || unit == '万人') && value >= 10000) {
                    transform = true;
                    value = value * 10e3;
                } else if ((unit == '亿元' || unit == '亿人') && value >= 10000) {
                    transform = true;
                    value = value * 10e7;
                } else if ((unit == '万亿元' || unit == '万人') && value >= 10000) {
                    transform = true;
                    value = value * 10e11;
                }
            }
            if (precision === undefined || precision === '' || precision === null) {
                precision = 2;
            }
            if (transform) {
                return this.formatNumber(value, precision) + lastUnit;
            } else if (normalNum) {
                value = Number.isInteger(value) ? value : value.toFixed(precision)
                return value + unit;
            } else {
                return this.formatNumberNoUnit(value, precision) + unit;
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

        //日期格式转换
        changeTimeForMinNoHours: function (nS) {
            if (!nS || isNaN(nS))
                return '';
            var date = new Date(parseInt(nS));
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            return Y + M + D;
        },

        //日期格式转换
        changeTimeForMinNoHoursnoline: function (nS) {
            if (!nS || isNaN(nS))
                return '';
            var date = new Date(parseInt(nS));
            var Y = date.getFullYear();
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            return Y + M + D;
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

        //
        //日期格式转换
        changeTime1: function (nS, suffix) {
            if (!nS || isNaN(nS))
                return '--';

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
                let add = value >= 0 ? true : false
                value = Math.abs(value);
                if (value < 10000)
                    return (add ? value : -value) + '元';
                else if (value < 10e7)
                    return ((add ? value : -value) / 10000).toFixed(2) + '万';
                else
                    return ((add ? value : -value) / 10e7).toFixed(2) + '亿';
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
            } else
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
            } else {
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
        getClsByNumber: function (num) {
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
        getPercentage: function (num1, num2) {
            var flag = 0;
            if (num2 === 0)
                return flag;
            return num1 / num2 * 100;
        },

        //资金单位变更
        getPreAnswer: function (appKey) {
            if (appKey == "guoxin") {
                return false;
            }
            return true;
        },

        /**
         * 返回评价的HTML标签行
         * @param result 每个回答的spanId
         * @param showInteractiveView
         * @returns {string}
         */
        getRatingLabel: function (result, appKey) {
            console.log(appKey)
            let showInteractiveView = commonUtil.isInteractiveView(result.answerResultType, appKey)
            if (appKey === 'guoxin')
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
            } else {
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

        // 转换日期为2017Q1 ||　2017一季报
        getQuarterLabel: function (value, type, shortYear) {
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
            if (type === 'zh')
                quarter = zh;
            if (type === 'zh2')
                quarter = zh2;
            else if (type === 'season')
                quarter = season;

            var month = '00';
            var year = '';
            var str = value.toString();
            year = str.substr(shortYear ? 2 : 0, shortYear ? 2 : 4);
            if (str.length > 4)
                month = str.substr(4, 2);

            return year + quarter[month];
        },

        /**
         * 根据答案分类判断平台/APP/版本以确定是否展示与原生交互的界面
         * @param answerType 答案分类名称
         * @param requestParams appKey
         * @returns {boolean} 是否展示true|false
         */
        isInteractiveView: function (answerType, requestParams) {
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
                case "净利润":
                case "净利润增长率":
                case "净资产收益率":
                case "每股净资产":
                case "每股收益":
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

                default:
                    break;
            }

            console.log(version)
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
            var temp = '答案类型：' + answerType + '，平台：' + appFrom + '，App：' + appKey + '，最低版本：' + (minVersion ? minVersion : '无') + '，当前版本：' + appVersion + '，原生界面: ' + flag;
            console.log(temp);
            // sendPreAnswerContent(temp);

            return flag;
        },
        stringIsEmpty: function (str) {
            return this.stringIsNull(str) || str === "";
        },
        stringIsNull: function (str) {
            return typeof str == "undefined" || str === null;
        },
        stringIsNotEmpty: function (str) {
            return !this.stringIsEmpty(str);
        },
        isNoData: function (obj) {
            if (obj.hasOwnProperty('isError') && obj.isError) {
                return true;
            }
            return false;
        },
        replaceSpecial: function (str) {
            if (this.stringIsNotEmpty(str)) {
                str = str.replace(/\n/g, '');
                str = str.replace(/\r/g, '');
                str = str.replace(/\s*/g, "");
            }
            return str
        },
        formatData: function (trade_dt, timeUnit) {
            if (this.stringIsEmpty(trade_dt)) return "--";
            let time = trade_dt + "";
            switch (timeUnit) {
                case '日':
                    time = time.substring(0, 4) + "-" + time.substring(4, 6) + "-" + time.substring(6, time.length);
                    break;
                case '月':
                    time = time.substring(0, 4) + "-" + time.substring(4, 6);
                    break;
                case '年':
                    time = time.substring(0, 4);
                    break;
                default:
                    break;
            }
            return time;
        },
        formatDataDay: function (trade_dt) {
            if (this.stringIsEmpty(trade_dt)) return "--";
            let time = trade_dt + "";
            return time.substring(0, 4) + "-" + time.substring(4, 6) + "-" + time.substring(6, time.length);
        },
        formatUnit: function (unit, value, displayUnit, convertedUnit, precision) {
            precision = precision != undefined ? precision : 2;
            if (displayUnit && displayUnit.length >= 2) {
                displayUnit = displayUnit.replace("人", "");
                displayUnit = displayUnit.replace("股", "");
                displayUnit = displayUnit.replace("元", "");
            }
            if (convertedUnit && convertedUnit.length >= 2) {
                convertedUnit = convertedUnit.replace("人", "");
                convertedUnit = convertedUnit.replace("股", "");
                convertedUnit = convertedUnit.replace("元", "");
            }

            switch (displayUnit) {
                case "":
                    break;
                case "千":
                    value = value * 1000;
                    break;
                case "万":
                    value = value * 10000;
                    break;
                case "百万":
                    value = value * 1000000;
                    break;
                case "千万":
                    value = value * 10000000;
                    break;
                case "亿":
                    value = value * 100000000;
                    break;
            }

            switch (convertedUnit) {
                case "":
                    break;
                case "千":
                    value = this.getTwoNumberDot(value / 1000, precision);
                    break;
                case "万":
                    value = this.getTwoNumberDot(value / 10000, precision);
                    break;
                case "百万":
                    value = this.getTwoNumberDot(value / 1000000, precision);
                    break;
                case "千万":
                    value = this.getTwoNumberDot(value / 10000000, precision);
                    break;
                case "亿":
                    value = this.getTwoNumberDot(value / 100000000, precision);
                    break;
            }

            return value;

        },
        fundFilter2: function (num, precision) {
            precision = precision != undefined ? precision : 2;
            if (num !== undefined && num !== '') {
                return (Number(num).toFixed(precision) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
            }
            return num;
        },
        returnInitMoney: function (num, str) {
            var str = str || ''
            //num = num || '';
            if (num || num === 0) {
                var res = '';
                switch (str) {
                    case '元' :
                        res = num
                        break;
                    case '千元':
                        res = num * 1000
                        break;
                    case '万元':
                        res = num * 10000
                        break;
                    case '百万元':
                        res = num * (100 * 10000)
                        break;
                    case '千万元':
                        res = num * (1000 * 10000)
                        break;
                    case '亿元':
                        res = num * (10000 * 10000)
                        break;
                    default:
                        res = num
                }
                return res;
            }
            if (num && !str) {
                return num;
            }
            return num;
        },

        fundFilterToMoney: function (num, str, precision) {
            precision = precision != undefined ? precision : 2;
            var str = str || ''
            //num = num || '';
            if (num || num === 0) {
                var res = '';
                switch (str) {
                    case '元' :
                        res = num
                        break;
                    case '千元':
                        res = num / 1000
                        break;
                    case '万元':
                        res = num / 10000
                        break;
                    case '百万元':
                        res = num / (100 * 10000)
                        break;
                    case '千万元':
                        res = num / (1000 * 10000)
                        break;
                    case '亿元':
                        res = num / (10000 * 10000)
                        break;
                    default:
                        res = num;
                        return res + str;
                }
                return (Number(res).toFixed(precision) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + str;
            }
            if (num && !str) {
                return num;
            }
            return num;
        },

        /**
         * @param number 数字
         * @return 小于10则返回前面加0的字符串，大于10则直接返回对应的字符串
         */
        getTwoNumber: function (number) {
            return String((number >= 10) ? number : ("0" + number));
        },

        /**
         * @资金保留两位数
         */
        getTwoNumberDot: function (num, dot) {
            dot = dot != undefined ? dot : 2;
            if (num !== undefined && num !== '') {
                return Number(num).toFixed(dot)
            }
            return num;
        },
        formatNumberMoney: function (str) {
            return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
        tabHandler: function (displayType, result, queryParams) {
            let wordData = [];

            let headData = [];

            let contentData = [];

            let itemData = [];
            var updateTime = ""

            let list = result.list;
            let textValue = result.textValue;
            let emptyIndicator = result.emptyIndicator;
            let sequenceType = result.sequenceType;
            let conditionParams = queryParams.conditionParams;
            let requestParams = queryParams.queryParams;
            let loadType = queryParams.loadType;


            let indicatorOrders = [];//指标集合

            let indicatorAliasNameList = [];//指标别名集合

            let indicatorUnitMap = new Map();//指标基础单位集合

            let indicatorConvertedUnitMap = new Map();//指标转换单位集合

            let indicatorNameSpecialMap = new Map();//特殊指标集合包含日期，代码，简称等

            let indicatorUnitChangeMap = new Map();//单位是否可以转换和是否具有单位判断集合

            let indicatorIndexSort = new Map();//判断是指标是行业 个股  指数

            let indicatorIndexValueType = new Map();//数据值类型，1-数值/2-字符串/3-list/4-索引/5-日期',

            let fixedNumMap = new Map();

            let indicatorUrlList = [];//指标Url集合

            let selectedIndexList = conditionParams.selectedIndexList;//指标信息集合

            let stepNumber = conditionParams.stepNumber;//当前步数

            let dynamicParams = conditionParams.dynamicParams;//判断url拼接参数


            let tabLength = '';
            let stockLength = 0;
            let indexLength = 0;
            let industriesLength = 0;
            let areaKeysLength = 0;

            if (commonUtil.stringIsNotEmpty(requestParams.entities)) {
                stockLength = requestParams.entities.length;
            }

            if (commonUtil.stringIsNotEmpty(requestParams.index)) {
                indexLength = requestParams.index.length;
            }

            if (commonUtil.stringIsNotEmpty(requestParams.industry)) {
                industriesLength = requestParams.industry.length;
            }

            if (commonUtil.stringIsNotEmpty(requestParams.area)) {
                areaKeysLength = requestParams.area.length;
            }


            let isIndexAppear = false;
            let isStockAppear = false;
            let isIndustriesAppear = false;
            let isMacroscopicAppear = false;
            let isMasterStock = false;
            let isAreaAppear = false;

            for (let i = 0; i < selectedIndexList.length; i++) {
                let indexId = selectedIndexList[i].indicatorId;

                if (commonUtil.stringIsNotEmpty(emptyIndicator) && emptyIndicator.indexOf(indexId) !== -1 && displayType === 1) {
                    continue;
                }

                let indexAliasName = selectedIndexList[i].aliasName;

                let unit = selectedIndexList[i].unit;
                let indexDisplayUnit = selectedIndexList[i].convertedUnit;
                let indexFlagCode = commonUtil.stringIsEmpty(selectedIndexList[i].indexFlag) ? -1 : selectedIndexList[i].indexFlag;
                let isUnitChange = selectedIndexList[i].isUnitChange;
                let urlFlag = selectedIndexList[i].urlFlag;
                let indexUrl = selectedIndexList[i].indexUrl;
                let indexSort = selectedIndexList[i].indexSort;
                let value_type = selectedIndexList[i].valueType;
                let fixedNum = selectedIndexList[i].xsdNumberVal;

                indicatorAliasNameList.push(indexAliasName);
                indicatorOrders.push(indexId);
                indicatorUnitMap.set(indexId, unit);
                indicatorConvertedUnitMap.set(indexId, indexDisplayUnit);
                indicatorNameSpecialMap.set(indexId, indexFlagCode);
                indicatorUnitChangeMap.set(indexId, isUnitChange);
                indicatorIndexValueType.set(indexId, value_type);
                indicatorIndexSort.set(indexId, indexSort);
                fixedNumMap.set(indexId, fixedNum);
                if (urlFlag == "1" && commonUtil.stringIsNotEmpty(indexUrl)) {
                    indicatorUrlList.push(indexUrl);
                }


                if (i === 0 && indexFlagCode === 1) {
                    isMasterStock = true;
                }

                switch (indexSort) {
                    case 1:
                    case 9:
                    case 11:
                        isStockAppear = true;
                        break;
                    case 2:
                    case 39:
                        isIndexAppear = true;
                        break;
                    case 3:
                    case 30:
                        isIndustriesAppear = true;
                        break;
                    case 4:
                        isMacroscopicAppear = true;
                        break;
                    case 23:
                        isAreaAppear = true;
                        break;
                }
            }

            let count = 0;

            if (isStockAppear) {
                count += stockLength
            }

            if (isIndexAppear) {
                count += indexLength;
            }

            if (isIndustriesAppear) {
                count += industriesLength
            }

            if (isMacroscopicAppear) {
                count += 1
            }

            if (isAreaAppear) {
                count += areaKeysLength;
            }

            if (count !== 0) {
                tabLength = count + ""
            }

            for (let i = 0; i < indicatorOrders.length; i++) {
                let indicator = indicatorOrders[i];
                let isUnitChangeT = indicatorUnitChangeMap.get(indicator);
                let indicatorUnit = "";
                if (isUnitChangeT != undefined) {
                    indicatorUnit = '(' + indicatorConvertedUnitMap.get(indicator) + ')';
                }

                headData.push(indicatorAliasNameList[i] + indicatorUnit);
                if (i === 0 && indicatorUrlList.length > 0 && stepNumber === 1) {
                    headData.push("链接")
                }
            }

            function getIndicatorUrl(indicatorUrl, topKey) {

                if (dynamicParams.stock && loadType === 1) {
                    indicatorUrl += "&symbol=" + conditionParams.entities;
                } else if (dynamicParams.stock && loadType === 0 && conditionParams.isDefaultStock && commonUtil.stringIsNotEmpty(queryParams.symbol)) {
                    indicatorUrl += "&symbol=" + queryParams.symbol;
                }

                if (dynamicParams.index && loadType === 1) {
                    indicatorUrl += "&index=" + conditionParams.index;
                } else if (dynamicParams.index && loadType === 0 && conditionParams.isDefaultIndex && commonUtil.stringIsNotEmpty(queryParams.index)) {
                    indicatorUrl += "&index=" + queryParams.index;
                }

                if (dynamicParams.industry && loadType === 1) {
                    indicatorUrl += "&industry=" + conditionParams.industry;
                } else if (dynamicParams.industry && loadType === 0 && conditionParams.isDefaultIndustry && commonUtil.stringIsNotEmpty(queryParams.industry)) {
                    indicatorUrl += "&industry=" + queryParams.industry;
                }

                // if (dynamicParams.people && loadType === 1) {
                //     indicatorUrl += "&relevantPeople=" + conditionParams.relevantPeople;
                // } else if (dynamicParams.people && loadType === 0 && !conditionParams.relevantPeopleFlag && commonUtil.stringIsNotEmpty(queryParams.relevantPeople)) {
                //     indicatorUrl += "&relevantPeople=" + queryParams.relevantPeople;
                // }

                indicatorUrl += "&relevantPeople=" + topKey;
                indicatorUrl += "&name=" + topKey + "个人简介";
                if (commonUtil.stringIsNotEmpty(queryParams.startAt) || commonUtil.stringIsNotEmpty(queryParams.endAt)) {
                    indicatorUrl += "&startAt=" + queryParams.startAt + "&endAt=" + queryParams.endAt;
                }
                return indicatorUrl;
            }

            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                let topKey = '';//X轴点 股票代码或者交易日期
                let innerData = item.innerData;//X轴点对应数据

                if (conditionParams.categoryType == 1 || (conditionParams.categoryType === 5 && sequenceType === 1)) {
                    topKey = commonUtil.formatData(item.topKey, "日");
                } else if (conditionParams.categoryType == 2 || (conditionParams.categoryType === 5 && sequenceType === 2)) {
                    topKey = item.topKey;
                    topKey = topKey.replace(/(^sh)|(x$)/g, '');
                    topKey = topKey.replace(/(^sz)|(x$)/g, '');
                    tabLength = item.innerData.length;
                }

                if (stepNumber === 1 && indicatorUrlList.length > 0) {
                    let indicatorUrl = indicatorUrlList[0];
                    indicatorUrl = getIndicatorUrl(indicatorUrl, topKey);
                    itemData.push({xValue: topKey, rowSpan: tabLength});
                    itemData.push({xValue: indicatorUrl, rowSpan: tabLength});
                } else if (stepNumber === 2 && indicatorUrlList.length > 0) {
                    let indicatorUrl = indicatorUrlList[0];
                    indicatorUrl = getIndicatorUrl(indicatorUrl, topKey);
                    itemData.push({type: 0, xValue: topKey, rowSpan: tabLength, indicatorUrl: indicatorUrl});
                } else {
                    itemData.push({xValue: topKey, rowSpan: tabLength});
                }
                for (let j = 0; j < innerData.length; j++) {

                    let inner = innerData[j];

                    let hasMap = new Map();
                    let realData = inner.realData;

                    let stockCode = '';
                    let stockName = '';
                    let trade_dt = '';

                    for (let p = 0; p < realData.length; p++) {
                        let real = realData[p];
                        let key = Object.keys(real)[0];
                        let values = Object.values(real)[0];

                        if (p == 0) {
                            let indexSorts = indicatorIndexSort.get(parseInt(key));
                            if (indexSorts === 3 || indexSorts === 4) {
                                stockCode = values.code_market;
                            } else {
                                stockCode = commonUtil.stringIsEmpty(values.code_market) ? '--' : values.code_market.substring(2, values.code_market.length);
                            }

                            stockName = commonUtil.stringIsEmpty(values.extra_0) ? '--' : values.extra_0;
                            trade_dt = commonUtil.stringIsEmpty(values.trade_dt) ? '--' : commonUtil.formatDataDay(values.trade_dt);
                        }
                        updateTime = this.getLastTradeAt(updateTime, values.trade_dt);
                        hasMap.set(key, values);
                    }

                    for (let k = 0; k < indicatorOrders.length; k++) {
                        let indicatorOrder = indicatorOrders[k];

                        let indexFlag = indicatorNameSpecialMap.get(indicatorOrder);

                        switch (indexFlag) {
                            case 1://代码
                                if (conditionParams.categoryType === 2 || (conditionParams.categoryType === 5 && sequenceType === 2)) {
                                    if (isMasterStock) {
                                        continue;
                                    }
                                }
                                itemData.push(stockCode);
                                break;
                            case 2://简称
                                if (conditionParams.categoryType === 1 || (conditionParams.categoryType === 5 && sequenceType === 1)) {
                                    itemData.push(stockName);
                                } else if ((conditionParams.categoryType === 2 || (conditionParams.categoryType === 5 && sequenceType === 2)) && j == 0) {
                                    itemData.push({xValue: stockName, rowSpan: tabLength});
                                }
                                break;
                            case 3://日期
                                if (conditionParams.categoryType === 1 || (conditionParams.categoryType === 5 && sequenceType === 1)) {
                                    continue;
                                }
                                itemData.push(trade_dt);
                                break;
                            case 7://相关人物或公司
                                break;
                            default:
                                let convertedUnit = indicatorConvertedUnitMap.get(indicatorOrder);
                                let valueType = indicatorIndexValueType.get(indicatorOrder);
                                let unit = indicatorUnitMap.get(indicatorOrder);
                                let indicatorContent = hasMap.get(indicatorOrder + '');
                                let fixNum = fixedNumMap.get(indicatorOrder);
                                if (commonUtil.stringIsNotEmpty(indicatorContent)) {
                                    if (commonUtil.stringIsNotEmpty(indicatorContent.unit_change) && indicatorContent.unit_change == 1) {

                                        let indicatorValue = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? commonUtil.getTwoNumberDot(indicatorContent.indicatorValue, fixNum) : '';
                                        let displayUnit = commonUtil.stringIsNotEmpty(indicatorContent.dispUnit) ? indicatorContent.dispUnit : '';

                                        let displayValue = '--';
                                        if (commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue)) {
                                            displayValue = commonUtil.formatNumberMoney(commonUtil.formatUnit(unit, indicatorValue, displayUnit, convertedUnit, fixNum) + "");
                                        }
                                        itemData.push(displayValue);
                                    } else if (valueType === 1) {
                                        let indicatorValue = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? commonUtil.formatNumberMoney(commonUtil.getTwoNumberDot(indicatorContent.indicatorValue, fixNum)) : '--';
                                        itemData.push(indicatorValue);
                                    } else {
                                        let noIndicator = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? indicatorContent.indicatorValue : '--';


                                        itemData.push(noIndicator);
                                    }
                                } else {
                                    itemData.push("--");
                                }
                                break;
                        }
                    }
                    contentData.push(itemData);
                    itemData = [];
                }
            }

            wordData.push(headData);
            wordData.push(contentData);

            let returnData = {};
            if (conditionParams.useChart) {
                returnData.chartData = wordData
            }
            if (conditionParams.useHuashu) {
                returnData.textValue = textValue
            }
            returnData.updateTime = updateTime;
            return returnData;
        },
        getLastTradeAt: function (last, tradeDate) {
            if (utils.stringIsEmpty(last)) {
                return tradeDate;
            } else if (utils.stringIsEmpty(tradeDate)) {
                return last;
            } else if (format.getTimeByDate(last) <= format.getTimeByDate(tradeDate)) {
                return tradeDate;
            }
            return last;
        },
        splineAndColumnHandler: function (displayType, host, info, queryParams) {
            let conditionParams = queryParams.conditionParams;
            console.log(conditionParams);
            let tabelClassType = queryParams.tabelClassType;//表格样式
            let xfield = info.xfield;
            let data = info.list;
            let textValue = info.textValue;
            let sequenceType = info.sequenceType;
            let chartType = conditionParams.chartType;//载入图表类型
            let indicators = conditionParams.indicators;//除去日期，代码，简称等指标
            let selectedIndexList = conditionParams.selectedIndexList;//指标信息集合
            let indicatorAliasNameByTypeList = conditionParams.indicatorAliasNameByTypeList;
            let emptyIndicator = info.emptyIndicator;
            let indicatorUnitMap = new Map();//顺序指标单位集合
            let indicatorConvertedUnitMap = new Map();//指标转换单位集合
            let indicatorChartTypeMap = new Map();//指标图表类型集合
            let indicatorAliasNameMap = new Map();//指标别名集合
            for (let i = 0; i < selectedIndexList.length; i++) {
                let indexId = selectedIndexList[i].indicatorId;

                indicatorAliasNameMap.set(indexId, selectedIndexList[i].aliasName);
                indicatorUnitMap.set(indexId, selectedIndexList[i].unit);
                indicatorConvertedUnitMap.set(indexId, selectedIndexList[i].convertedUnit);
            }

            let oldAxisType = 0;
            let isShowLegendLeftOrRight = false;
            for (let j = 0; j < indicatorAliasNameByTypeList.length; j++) {
                let indicatorAliasNameByType = indicatorAliasNameByTypeList[j];
                indicatorChartTypeMap.set(indicatorAliasNameByType.id, {
                    chartType: indicatorAliasNameByType.chartType,
                    axsisType: indicatorAliasNameByType.axsisType
                });
                //判断是不是有不同的左右坐标，有则在显示图例上显示左右，无则不显示
                if (j === 0) {
                    oldAxisType = indicatorAliasNameByType.axsisType;
                }
                if (!isShowLegendLeftOrRight) {
                    if (oldAxisType !== indicatorAliasNameByType.axsisType) {
                        isShowLegendLeftOrRight = true;
                    }
                }
            }

            let indicatorType = conditionParams.categoryType;
            if (conditionParams.categoryType === 5 && sequenceType === 1) {
                indicatorType = 3;
            } else if (conditionParams.categoryType === 5 && sequenceType === 2) {
                indicatorType = 4;
            }

            //1-实体对比，2-指标对比 相关获取
            let xCompareAxisType = conditionParams.axsisType;
            let xCompareType = conditionParams.xCompareType;
            let isXCompare = false;
            if (conditionParams.categoryType !== 1 && xCompareType === 2) {
                isXCompare = true;
            }

            let type = '';
            let colors = [];
            let splineColors = ['#F5BA42', '#722ED1', '#D46B08', '#49C7E7', '#FF4D3F', '#3E85FF'];
            let columnColors = ['#3E85FF', '#F2635E', '#A776E4', '#49C7E7', '#D46B08', '#F5BA42'];
            let markers = [];

            switch (chartType) {
                case 2://线状图
                    type = "spline";
                    colors = ['#3E85FF', '#FF4D3F', '#F5BA42', '#49C7E7', '#D46B08', '#722ED1'];
                    markers = [host + '/static/images/marker_1.png', host + '/static/images/marker_2.png', host + '/static/images/marker_3.png'
                        , host + '/static/images/marker_4.png', host + '/static/images/marker_5.png', host + '/static/images/marker_6.png'];
                    break;
                case 3://柱状图
                    type = "column";
                    colors = ['#5C8DF7', '#FF4D3F', '#F5BA42', '#49C7E7', '#D46B08', '#9254DE'];
                    break;
            }

            if (isXCompare) {
                let series = [];
                for (let i = data.length - 1; i >= 0; i--) {
                    let indicatorYData = data[i];
                    let pointYData = indicatorYData.innerData;
                    let entityColor = colors[i];//每组的色值
                    let name = "";//每组的名称
                    let yData = [];
                    for (let j = 0; j < pointYData.length; j++) {
                        let pointY = pointYData[j];
                        let realData = pointY.realData;
                        for (let k = 0; k < realData.length; k++) {
                            let point = realData[k];
                            // let key = Object.keys(point)[0];
                            let values = Object.values(point)[0];
                            let indicatorId = values.indicatorId;//指标id
                            let yTooltipUnit = indicatorConvertedUnitMap.get(indicatorId);//指标展示单位
                            name = commonUtil.stringIsNotEmpty(values[xfield]) ? values[xfield] : values.extra_0;
                            let yBasicUnit = values.dispUnit === undefined ? '' : values.dispUnit;//指标展示单位
                            //指标数值
                            let indicatorValue = null;
                            let tootipIndicatorUnit = commonUtil.stringIsNotEmpty(yTooltipUnit) ? '(' + yTooltipUnit + ')' : '';
                            let temporaryData = {//data值
                                name: values.indicatorName + tootipIndicatorUnit
                            };
                            if (values.indicatorValue === undefined) {
                                indicatorValue = null;
                            } else if (values.unit_change === 1) {
                                let value = commonUtil.formatUnit(indicatorUnitMap.get(indicatorId), values.indicatorValue, yBasicUnit, yTooltipUnit);
                                indicatorValue = Number(value);
                            } else {
                                indicatorValue = values.indicatorValue;
                            }
                            temporaryData.y = indicatorValue;
                            yData.push(temporaryData);
                        }
                    }

                    let chartSeries = {
                        name: name,
                        type: type,
                        color: entityColor,
                        data: yData
                    };

                    //就是这个属性设置负值的颜色
                    if (tabelClassType === 1 && chartType === 3) {
                        chartSeries.negativeColor = '#1BAA3C';
                    }

                    if (xCompareAxisType === 1) {
                        chartSeries.yAxis = 1;
                    }
                    series.push(chartSeries);
                }

                let chart = {};
                chart.textValue = textValue;
                chart.height = 300;
                chart.series = series;
                chart.units = [];
                let returnData = {};
                if (conditionParams.useChart) {
                    returnData.chartData = chart;
                }
                if (conditionParams.useHuashu) {
                    returnData.textValue = textValue;
                }
                returnData.isXCompare = true;
                return returnData;
            }
            let xSeries = [];//X轴数据
            let ySeries = []; //y轴展示每个点对应的所有指标数据
            let ySeriesAlls = []; //y轴展示每个点对应的所有指标数据
            let ySeriesSplineAll = [];//y轴指标数据和线状态
            let ySeriesColumnAll = [];//y轴指标数据和柱状图

            let yUnit = [];//y轴坐标单位

            //获取X轴数据和其对应的Y轴数据
            for (let i = data.length - 1; i >= 0; i--) {
                let item = data[i];
                let innerData = item.innerData;
                let currentYValue = [];

                xSeries.push(item.topKey);

                for (let j = 0; j < innerData.length; j++) {
                    let jItem = innerData[j];
                    let realData = jItem.realData;
                    let realDataMap = new Map();

                    for (let k = 0; k < realData.length; k++) {
                        let kItem = realData[k];
                        let key = Object.keys(kItem)[0];
                        let values = Object.values(kItem)[0];
                        realDataMap.set(key, values);
                    }

                    for (let k = 0; k < indicators.length; k++) {
                        let indicator = indicators[k] + "";

                        if (commonUtil.stringIsNotEmpty(emptyIndicator) && emptyIndicator.indexOf(indicators[k]) !== -1 && displayType === 1) {
                            continue;
                        }

                        let indicatorItem = realDataMap.get(indicator);
                        if (indicatorItem != undefined) {
                            currentYValue.push(indicatorItem);
                        }
                    }
                }
                ySeries.push(currentYValue);
            }


            //根据指标个数创建声明数组
            let arr = [];
            let indicatorsYSpotData = ySeries[0];
            for (let i = 0; i < indicatorsYSpotData.length; i++) {
                arr[i] = [];
            }
            for (let i = 0; i < ySeries.length; i++) {
                let item = ySeries[i];
                for (let j = 0; j < item.length; j++) {
                    arr[j].push(item[j]);
                }
            }


            let indicatorY = [];

            for (let i = 0; i < arr.length; i++) {
                let indicatorYData = arr[i]; //Y轴技术指标
                let yData = [];
                let yTooltipName = "";
                let yTooltipUnit = "";
                let yBasicUnit = "";
                let unitBasics = "";
                let indicatorId = -1;

                for (let j = 0; j < indicatorYData.length; j++) {
                    let jItem = indicatorYData[j];

                    if (j === 0) {
                        indicatorId = jItem.indicatorId;
                        yTooltipUnit = indicatorConvertedUnitMap.get(indicatorId);//指标展示单位
                        unitBasics = indicatorUnitMap.get(indicatorId);//指标展示单位
                        yBasicUnit = jItem.dispUnit == undefined ? '' : jItem.dispUnit;//指标展示单位
                        let indicatorAliasName = indicatorAliasNameMap.get(indicatorId);
                        switch (indicatorType) {
                            case 1:
                            case 3:
                                yTooltipName = "" + jItem.extra_0 + indicatorAliasName;
                                break;
                            case 2:
                                yTooltipName = "" + jItem.trade_dt + indicatorAliasName;
                                xSeries = [];//将保存的X轴股票代码移除,下面会替换为股票名称
                                break;
                            case 4:
                                yTooltipName = "" + jItem.trade_dt + jItem.extra_0 + indicatorAliasName;
                                break;
                        }
                    }

                    if (conditionParams.categoryType === 2) {
                        xSeries.push(jItem.extra_0);
                    }


                    if (jItem.indicatorValue == undefined) {
                        yData.push(null);
                    } else if (jItem.unit_change == 1) {
                        let value = commonUtil.formatUnit(unitBasics, jItem.indicatorValue, yBasicUnit, yTooltipUnit)
                        yData.push(Number(value));
                    } else {
                        yData.push(jItem.indicatorValue);
                    }
                }

                indicatorY.push({
                    yData: yData,
                    yTooltipName: yTooltipName,
                    indicatorId: indicatorId,
                    yTooltipUnit: yTooltipUnit
                })
            }


            for (let i = 0; i < indicatorY.length; i++) {
                let item = indicatorY[i];
                let indicatorId = item.indicatorId;
                let yData = item.yData;
                let yTooltipName = item.yTooltipName;
                let yTooltipUnit = item.yTooltipUnit;
                let indicatorChartType = indicatorChartTypeMap.get(indicatorId);
                let axsisType = indicatorChartType.axsisType;
                let chartId = indicatorChartType.chartType;

                if (isShowLegendLeftOrRight) {
                    if (axsisType === 0) {
                        yTooltipName = yTooltipName + "(左)";
                    } else if (axsisType === 1) {
                        yTooltipName = yTooltipName + "(右)";
                    }
                }

                let chartSeries = {
                    name: yTooltipName,
                    data: yData,
                    tooltip: {
                        valueSuffix: yTooltipUnit
                    }
                };

                if (tabelClassType === 1 && chartType === 3) {
                    chartSeries.negativeColor = '#1BAA3C';//就是这个属性设置负值的颜色
                }


                switch (chartType) {
                    case 2:
                    case 3:
                        chartSeries.type = type;
                        chartSeries.yAxis = axsisType;
                        chartSeries.marker = {
                            enabled: false,
                            symbol: 'url(' + markers[i] + ')',
                        }
                        yUnit[axsisType] = yTooltipUnit;
                        ySeriesAlls.push(chartSeries);
                        break;
                    case 7:
                        if (chartId === 2) {
                            chartSeries.type = "spline";
                            chartSeries.marker = {
                                symbol: 'url(' + host + '/static/images/marker_7.png' + ')',
                                enabled: false
                            }
                            chartSeries.yAxis = 0;
                            ySeriesSplineAll.push(chartSeries)
                            yUnit[0] = yTooltipUnit;
                        } else if (chartId === 3) {
                            chartSeries.type = "column";
                            chartSeries.yAxis = 1;
                            ySeriesColumnAll.push(chartSeries)
                            yUnit[1] = yTooltipUnit;
                        }
                        break;
                }

            }


            let chart = {};
            chart.textValue = textValue;
            chart.categories = xSeries;
            chart.height = 300;
            chart.units = yUnit;


            switch (chartType) {
                case 2://线状图
                case 3://柱状图
                    for (let i = 0; i < ySeriesAlls.length; i++) {
                        let ySeries = ySeriesAlls[i];
                        if (tabelClassType === 1) {//资金流向全部是红色的
                            ySeries.color = "#E63435";
                        } else {
                            ySeries.color = colors[i];
                        }
                    }
                    chart.series = ySeriesAlls;
                    break;
                case 7:
                    for (let i = 0; i < ySeriesColumnAll.length; i++) {
                        let ySeriesColumn = ySeriesColumnAll[i];
                        ySeriesColumn.color = columnColors[i];
                    }

                    for (let i = 0; i < ySeriesSplineAll.length; i++) {
                        let ySeriesSpline = ySeriesSplineAll[i];
                        ySeriesSpline.color = splineColors[i];
                    }

                    let ySeriesAll = ySeriesColumnAll.concat(ySeriesSplineAll);
                    chart.series = ySeriesAll;
                    break;
            }


            let returnData = {};
            if (conditionParams.useChart) {
                returnData.chartData = chart;
            }
            if (conditionParams.useHuashu) {
                returnData.textValue = textValue;
            }

            return returnData;
        }
        ,
        klineChartHandler: function (displayType, info, conditionParams) {
            let data = info.list;
            let textValue = info.textValue;

            let indicators = conditionParams.indicators;
            let selectedIndexList = conditionParams.selectedIndexList;
            let nameIndicatorIdMap = new Map();
            let aliasNameMap = new Map();
            for (let i = 0; i < selectedIndexList.length; i++) {
                nameIndicatorIdMap.set(selectedIndexList[i].name, selectedIndexList[i].indicatorId);
                aliasNameMap.set(selectedIndexList[i].name, selectedIndexList[i].aliasName)
            }
            //需要从原来indicators里删除的项
            var forDeletion = [];
            forDeletion.push(nameIndicatorIdMap.get("开盘"));
            forDeletion.push(nameIndicatorIdMap.get("最高"));
            forDeletion.push(nameIndicatorIdMap.get("最低"));
            forDeletion.push(nameIndicatorIdMap.get("收盘"));
            if (nameIndicatorIdMap.get("成交量") != undefined) {
                forDeletion.push(nameIndicatorIdMap.get("成交量"));
            }
            //从原来的indicators里删除
            indicators = indicators.filter(item => !forDeletion.includes(item));
            //重新排序后的indicators，[开盘,最高,最低,收盘,成交量,……]
            //前4项一定有，第5项成交量没有时，赋值-1
            var formatIndicators = [];
            formatIndicators.push(nameIndicatorIdMap.get("开盘"));
            formatIndicators.push(nameIndicatorIdMap.get("最高"));
            formatIndicators.push(nameIndicatorIdMap.get("最低"));
            formatIndicators.push(nameIndicatorIdMap.get("收盘"));
            if (nameIndicatorIdMap.get("成交量") != undefined) {
                formatIndicators.push(nameIndicatorIdMap.get("成交量"));
            } else {
                formatIndicators.push(-1);
            }
            //排序后的
            indicators.forEach(function (item) {
                formatIndicators.push(item);
            });

            //5日、10日、20日均线颜色
            let averageColor = ['#3E85FF', '#FF4D3F', '#F5BA42', '#49C7E7', '#D46B08', '#722ED1'];
            var stockName = "";
            if (conditionParams.selectedStocks[0] != undefined && conditionParams.selectedStocks[0] != "") {
                stockName = conditionParams.selectedStocks[0].label;
            }
            var ohlc = []; //开盘收盘最高最低
            var volume = []; //成交量
            // set the allowed units for data grouping
            var groupingUnits = [[
                'week',                         // unit name
                [1]                             // allowed multiples
            ], [
                'month',
                [1, 2, 3, 4, 6]
            ]];

            let averageArray = []; //均线
            var volumeScale = 35; //成交量在y轴上的占比，当没有选择成交量时为0
            var chartSeries = [{
                type: 'candlestick',
                color: '#1BAA3C',
                lineColor: '#1BAA3C',
                upColor: '#E63435',
                upLineColor: '#E63435',
                showInLegend: false,
                tooltip: {
                    pointFormat:
                        '开盘:{point.open} ' +
                        '收盘:{point.close} ' +
                        '最高:{point.high} ' +
                        '最低:{point.low} '
                },
                data: ohlc,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                name: "成交量",
                type: 'column',
                tooltip: {
                    pointFormat:
                        '<br/>' + '成交量:{point.y} '
                },
                data: volume,
                color: '#5C8DF7',
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }];

            var dataList = []; //这个list中，每个item是一个map
            for (let i = data.length - 1; i >= 0; i--) {
                let item = data[i];
                var realData = item.innerData[0].realData;
                var hasMap = new Map();
                realData.forEach(function (rItem) {
                    var key = Object.keys(rItem)[0];
                    var values = Object.values(rItem)[0];
                    hasMap.set(key, values);
                });
                dataList.push(hasMap);
            }

            for (let i = 0; i < dataList.length; i++) {
                let item = dataList[i];
                ohlc.push([
                    commonUtil.dataFormatter(item.get(formatIndicators[0] + "").trade_dt), // the date
                    item.get(formatIndicators[0] + "").indicatorValue, // open
                    item.get(formatIndicators[1] + "").indicatorValue, // high
                    item.get(formatIndicators[2] + "").indicatorValue, // low
                    item.get(formatIndicators[3] + "").indicatorValue// close
                ]);

                if (formatIndicators[4] != -1) {
                    volumeScale = 35;
                    volume.push([
                        commonUtil.dataFormatter(item.get(formatIndicators[0] + "").trade_dt), // the date
                        item.get(formatIndicators[4] + "").indicatorValue // the volume
                    ]);
                } else {
                    volumeScale = 0;
                }

            }
            // >5时，说明有均线数据
            if (formatIndicators.length > 5) {
                let averageIndicators = formatIndicators.slice(5 - formatIndicators.length);
                for (let j = 0; j < averageIndicators.length; j++) {
                    averageArray[j] = [];
                    if (hasMap.get(averageIndicators[j] + "") != undefined && hasMap.get(averageIndicators[j] + "") != "") {

                        if (displayType === 1) {
                            continue;
                        }

                        let name = hasMap.get(averageIndicators[j] + "").indicatorName;
                        let aliasName = aliasNameMap.get(name);
                        for (let i = 0; i < dataList.length; i++) {
                            let item = dataList[i];
                            averageArray[j].push([
                                commonUtil.dataFormatter(item.get(formatIndicators[0] + "").trade_dt), // the date
                                item.get(averageIndicators[j] + "").indicatorValue // the volume
                            ]);
                        }
                        let color = '';
                        if (name == "均线（5）") {
                            color = averageColor[0]
                        }
                        if (name == "均线（10）") {
                            color = averageColor[1]
                        }
                        if (name == "均线（20）") {
                            color = averageColor[2]
                        }

                        let averageSeries = {
                            type: 'line',
                            name: aliasName,
                            data: averageArray[j],
                            color: color,
                            tooltip: {
                                pointFormat:
                                    '<br/>' + aliasName + ':{point.y} '
                            },
                            lineWidth: 1
                        };
                        chartSeries.push(averageSeries);

                    }
                }
            }

            let returnData = {};
            if (conditionParams.useChart) {
                returnData.chartData = chartSeries;
                returnData.volumeScale = volumeScale;
            }
            if (conditionParams.useHuashu) {
                returnData.textValue = textValue;
            }

            return returnData;

        }
        ,
        pieHandler: function (displayType, info, conditionParams) {
            let data = info.list;
            let textValue = info.textValue;

            let indicators = conditionParams.indicators;//除去日期，代码，简称等指标
            let selectedIndexList = conditionParams.selectedIndexList;//指标信息集合
            let indicatorAliasNameByTypeList = conditionParams.indicatorAliasNameByTypeList;//饼状图数值类型
            let pieItem = indicatorAliasNameByTypeList[0];
            let pieValuesType = pieItem.chartType;
            let xfield = info.xfield;

            let indicatorUnitMap = new Map();//顺序指标单位集合
            let indicatorConvertedUnitMap = new Map();//指标转换单位集合
            let indicatorAliasNameMap = new Map();//指标别名集合
            for (let i = 0; i < selectedIndexList.length; i++) {
                let indexId = selectedIndexList[i].indicatorId;

                indicatorAliasNameMap.set(indexId, selectedIndexList[i].aliasName);
                indicatorUnitMap.set(indexId, selectedIndexList[i].unit);
                indicatorConvertedUnitMap.set(indexId, selectedIndexList[i].convertedUnit);
            }

            let ySeries = []; //y轴展示每个点对应的所有指标数据
            //获取X轴数据和其对应的Y轴数据
            for (let i = data.length - 1; i >= 0; i--) {
                let item = data[i];
                let innerData = item.innerData;
                let currentYValue = [];


                for (let j = 0; j < innerData.length; j++) {
                    let jItem = innerData[j];
                    let realData = jItem.realData;
                    let realDataMap = new Map();

                    for (let k = 0; k < realData.length; k++) {
                        let kItem = realData[k];
                        let key = Object.keys(kItem)[0];
                        let values = Object.values(kItem)[0];
                        realDataMap.set(key, values);
                    }

                    for (let k = 0; k < indicators.length; k++) {
                        let indicator = indicators[k] + "";
                        let indicatorItem = realDataMap.get(indicator);

                        if (displayType === 1) {
                            continue;
                        }

                        if (indicatorItem != undefined) {
                            currentYValue.push(indicatorItem);
                        }
                    }
                }
                ySeries.push(currentYValue);
            }

            //根据指标个数创建声明数组
            let arr = [];
            let indicatorsYSpotData = ySeries[0];
            for (let i = 0; i < indicatorsYSpotData.length; i++) {
                arr[i] = [];
            }
            for (let i = 0; i < ySeries.length; i++) {
                let item = ySeries[i];
                for (let j = 0; j < item.length; j++) {
                    arr[j].push(item[j]);
                }
            }

            let indicatorY = [];
            let indicatorValueAll = 0;
            let displayUnitPercentageMark = false;
            let indicatorConvertedUnit = '';

            for (let i = 0; i < arr.length; i++) {
                let indicatorYData = arr[i]; //Y轴技术指标
                for (let j = 0; j < indicatorYData.length; j++) {
                    let jItem = indicatorYData[j];

                    if (jItem.indicatorValue >= 0) {//负值剔除
                        if (jItem.dispUnit == "%") {
                            indicatorValueAll += jItem.indicatorValue;
                            displayUnitPercentageMark = true;
                        }

                        let y = 0;
                        let indicatorId = jItem.indicatorId;
                        indicatorConvertedUnit = indicatorConvertedUnitMap.get(indicatorId);
                        if (jItem.unit_change === 1) {
                            y = commonUtil.formatUnit(indicatorUnitMap.get(indicatorId), jItem.indicatorValue, indicatorUnitMap.get(indicatorId), indicatorConvertedUnitMap.get(indicatorId))
                        } else {
                            y = jItem.indicatorValue;
                        }

                        let name = commonUtil.stringIsNotEmpty(jItem[xfield]) ? jItem[xfield] : "";
                        indicatorY.push({
                            name: name + indicatorAliasNameMap.get(jItem.indicatorId),
                            y: Number(y)
                        });
                    }
                }
            }

            if (displayUnitPercentageMark && indicatorValueAll < 100) {
                indicatorY.push({
                    name: "其它",
                    y: 100 - indicatorValueAll
                });
            }

            let returnData = {};
            if (conditionParams.useChart) {
                returnData.chartData = indicatorY;
            }
            if (conditionParams.useHuashu) {
                returnData.textValue = textValue;
            }
            if (indicatorConvertedUnit) {
                returnData.indicatorConvertedUnit = indicatorConvertedUnit;
            }
            returnData.pieValuesType = pieValuesType;
            return returnData;
        },
        tabHandler2: function (displayType, result, queryParams) {
            let wordData = [];

            let headData = [];

            let contentData = [];

            let itemData = [];
            var updateTime = ""

            let list = result.list;
            let textValue = result.textValue;
            let emptyIndicator = result.emptyIndicator;
            let sequenceType = result.sequenceType;
            let conditionParams = queryParams.conditionParams;
            let requestParams = queryParams.queryParams;
            let loadType = queryParams.loadType;


            let indicatorOrders = [];//指标集合

            let indicatorAliasNameList = [];//指标别名集合

            let indicatorUnitMap = new Map();//指标基础单位集合

            let indicatorConvertedUnitMap = new Map();//指标转换单位集合

            let indicatorNameSpecialMap = new Map();//特殊指标集合包含日期，代码，简称等

            let indicatorUnitChangeMap = new Map();//单位是否可以转换和是否具有单位判断集合

            let indicatorIndexSort = new Map();//判断是指标是行业 个股  指数

            let indicatorIndexValueType = new Map();//数据值类型，1-数值/2-字符串/3-list/4-索引/5-日期',

            let fixedNumMap = new Map();

            let indicatorUrlList = [];//指标Url集合

            let selectedIndexList = conditionParams.selectedIndexList;//指标信息集合

            let stepNumber = conditionParams.stepNumber;//当前步数

            let dynamicParams = conditionParams.dynamicParams;//判断url拼接参数


            let tabLength = '';
            let stockLength = 0;
            let indexLength = 0;
            let industriesLength = 0;

            if (commonUtil.stringIsNotEmpty(requestParams.entities)) {
                stockLength = requestParams.entities.length;
            }

            if (commonUtil.stringIsNotEmpty(requestParams.index)) {
                indexLength = requestParams.index.length;
            }

            if (commonUtil.stringIsNotEmpty(requestParams.industry)) {
                industriesLength = requestParams.industry.length;
            }


            let isIndexAppear = false;
            let isStockAppear = false;
            let isIndustriesAppear = false;
            let isMacroscopicAppear = false;
            let isMasterStock = false;

            for (let i = 0; i < selectedIndexList.length; i++) {
                let indexId = selectedIndexList[i].indicatorId;

                if (commonUtil.stringIsNotEmpty(emptyIndicator) && emptyIndicator.indexOf(indexId) !== -1 && displayType === 1) {
                    continue;
                }

                let indexAliasName = selectedIndexList[i].aliasName;

                let unit = selectedIndexList[i].unit;
                let indexDisplayUnit = selectedIndexList[i].convertedUnit;
                let indexFlagCode = commonUtil.stringIsEmpty(selectedIndexList[i].indexFlag) ? -1 : selectedIndexList[i].indexFlag;
                let isUnitChange = selectedIndexList[i].isUnitChange;
                let urlFlag = selectedIndexList[i].urlFlag;
                let indexUrl = selectedIndexList[i].indexUrl;
                let indexSort = selectedIndexList[i].indexSort;
                let value_type = selectedIndexList[i].valueType;
                let fixedNum = selectedIndexList[i].xsdNumberVal;

                indicatorAliasNameList.push(indexAliasName);
                indicatorOrders.push(indexId);
                indicatorUnitMap.set(indexId, unit);
                indicatorConvertedUnitMap.set(indexId, indexDisplayUnit);
                indicatorNameSpecialMap.set(indexId, indexFlagCode);
                indicatorUnitChangeMap.set(indexId, isUnitChange);
                indicatorIndexValueType.set(indexId, value_type);
                indicatorIndexSort.set(indexId, indexSort);
                fixedNumMap.set(indexId, fixedNum);
                if (urlFlag == "1" && commonUtil.stringIsNotEmpty(indexUrl)) {
                    indicatorUrlList.push(indexUrl);
                }


                if (i === 0 && indexFlagCode === 1) {
                    isMasterStock = true;
                }

                switch (indexSort) {
                    case 1:
                        isStockAppear = true;
                        break;
                    case 2:
                        isIndexAppear = true;
                        break;
                    case 3:
                        isIndustriesAppear = true;
                        break;
                    case 4:
                        isMacroscopicAppear = true;
                        break;
                }
            }

            let count = 0;

            if (isStockAppear) {
                count += stockLength
            }

            if (isIndexAppear) {
                count += indexLength;
            }

            if (isIndustriesAppear) {
                count += industriesLength
            }

            if (isMacroscopicAppear) {
                count += 1
            }

            if (count !== 0) {
                tabLength = count + ""
            }

            for (let i = 0; i < indicatorOrders.length; i++) {
                let indicator = indicatorOrders[i];
                let isUnitChangeT = indicatorUnitChangeMap.get(indicator);
                let indicatorUnit = "";
                if (isUnitChangeT != undefined) {
                    indicatorUnit = '(' + indicatorConvertedUnitMap.get(indicator) + ')';
                }

                headData.push(indicatorAliasNameList[i] + indicatorUnit);
                if (i === 0 && indicatorUrlList.length > 0 && stepNumber === 1) {
                    headData.push("链接")
                }
            }

            function getIndicatorUrl(indicatorUrl, topKey) {

                if (dynamicParams.stock && loadType === 1) {
                    indicatorUrl += "&symbol=" + conditionParams.entities;
                } else if (dynamicParams.stock && loadType === 0 && conditionParams.isDefaultStock && commonUtil.stringIsNotEmpty(queryParams.symbol)) {
                    indicatorUrl += "&symbol=" + queryParams.symbol;
                }

                if (dynamicParams.index && loadType === 1) {
                    indicatorUrl += "&index=" + conditionParams.index;
                } else if (dynamicParams.index && loadType === 0 && conditionParams.isDefaultIndex && commonUtil.stringIsNotEmpty(queryParams.index)) {
                    indicatorUrl += "&index=" + queryParams.index;
                }

                if (dynamicParams.industry && loadType === 1) {
                    indicatorUrl += "&industry=" + conditionParams.industry;
                } else if (dynamicParams.industry && loadType === 0 && conditionParams.isDefaultIndustry && commonUtil.stringIsNotEmpty(queryParams.industry)) {
                    indicatorUrl += "&industry=" + queryParams.industry;
                }

                indicatorUrl += "&relevantPeople=" + topKey;
                indicatorUrl += "&name=" + topKey + "个人简介";

                if (commonUtil.stringIsNotEmpty(queryParams.startAt) || commonUtil.stringIsNotEmpty(queryParams.endAt)) {
                    indicatorUrl += "&startAt=" + queryParams.startAt + "&endAt=" + queryParams.endAt;
                }
                return indicatorUrl;
            }

            let hasMap = new Map();
            var updateTi
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                let topKey = '';//X轴点 股票代码或者交易日期
                let innerData = item.innerData;//X轴点对应数据
                let rowSpan = 0;
                let stockCode = '';
                let stockName = '';
                let trade_dt = [];

                for (let j = 0; j < innerData.length; j++) {
                    let inner = innerData[j];
                    let innerKey = inner.innerKey;
                    let realData = inner.realData;

                    let YList = [];

                    if (j === 0) {
                        rowSpan = realData.length;
                    }

                    for (let p = 0; p < realData.length; p++) {
                        let real = realData[p];
                        let key = Object.keys(real)[0];
                        let values = Object.values(real)[0];
                        if (p === 0) {
                            let indexSorts = indicatorIndexSort.get(parseInt(key));
                            if (indexSorts === 3 || indexSorts === 4) {
                                stockCode = values.code_market;
                            } else {
                                stockCode = commonUtil.stringIsEmpty(values.code_market) ? '--' : values.code_market.substring(2, values.code_market.length);
                            }

                            stockName = commonUtil.stringIsEmpty(values.extra_0) ? '--' : values.extra_0;

                        }
                        trade_dt.push(commonUtil.stringIsEmpty(values.trade_dt) ? '--' : commonUtil.formatDataDay(values.trade_dt));
                        YList.push(values);
                        updateTime = this.getLastTradeAt(updateTime, values.trade_dt);
                    }

                    hasMap.set(innerKey, YList);
                }

                itemData = [];

                if (conditionParams.categoryType == 1 || (conditionParams.categoryType === 5 && sequenceType === 1)) {
                    topKey = commonUtil.formatData(item.topKey, "日");
                } else {
                    topKey = item.topKey;
                    topKey = topKey.replace(/(^sh)|(x$)/g, '');
                    topKey = topKey.replace(/(^sz)|(x$)/g, '');
                }
                if (stepNumber === 1 && indicatorUrlList.length > 0) {
                    let indicatorUrl = indicatorUrlList[0];
                    indicatorUrl = getIndicatorUrl(indicatorUrl, topKey);
                    itemData.push({xValue: topKey, rowSpan: rowSpan});
                    itemData.push({xValue: indicatorUrl, rowSpan: rowSpan});
                } else if (stepNumber === 2 && indicatorUrlList.length > 0) {
                    let indicatorUrl = indicatorUrlList[0];
                    indicatorUrl = getIndicatorUrl(indicatorUrl, topKey);
                    itemData.push({type: 0, xValue: topKey, rowSpan: rowSpan, indicatorUrl: indicatorUrl});
                } else {
                    itemData.push({xValue: topKey, rowSpan: rowSpan});
                }


                let isAddStockName = false;
                let isAddStockCode = false;

                for (let f = 0; f < rowSpan; f++) {
                    if (f !== 0) {
                        itemData = [];
                    }

                    for (let k = 0; k < indicatorOrders.length; k++) {
                        let indicatorOrder = indicatorOrders[k];

                        let indexFlag = indicatorNameSpecialMap.get(indicatorOrder);

                        switch (indexFlag) {
                            case 1://代码
                                if (conditionParams.categoryType === 2 || (conditionParams.categoryType === 5 && sequenceType === 2 && result.dataType !== 1)) {
                                    continue;
                                } else if ((conditionParams.categoryType === 2 || (conditionParams.categoryType === 5 && sequenceType === 2 && result.dataType === 1))) {
                                    if (isMasterStock) {
                                        continue;
                                    } else if (!isAddStockCode) {
                                        itemData.push({xValue: stockCode, rowSpan: rowSpan});
                                        isAddStockCode = true;
                                    }
                                } else {
                                    itemData.push(stockCode);
                                }
                                break;
                            case 2://简称
                                if (conditionParams.categoryType === 1 || (conditionParams.categoryType === 5 && sequenceType === 1)) {
                                    itemData.push(stockName);
                                } else if ((conditionParams.categoryType === 2 || (conditionParams.categoryType === 5 && sequenceType === 2 && result.dataType !== 1))) {
                                    itemData.push({xValue: stockName, rowSpan: rowSpan});
                                } else if ((conditionParams.categoryType === 2 || (conditionParams.categoryType === 5 && sequenceType === 2 && result.dataType === 1))) {
                                    if (!isAddStockName) {
                                        itemData.push({xValue: stockName, rowSpan: rowSpan});
                                        isAddStockName = true;
                                    }
                                }
                                break;
                            case 3://日期
                                if (conditionParams.categoryType === 1 || (conditionParams.categoryType === 5 && sequenceType === 1)) {
                                    continue;
                                }
                                itemData.push(trade_dt[f]);
                                break;
                            case 7://相关人物或公司
                                break;
                            default:
                                let convertedUnit = indicatorConvertedUnitMap.get(indicatorOrder);
                                let valueType = indicatorIndexValueType.get(indicatorOrder);
                                let unit = indicatorUnitMap.get(indicatorOrder);
                                let indicatorList = hasMap.get(indicatorOrder + '');
                                let fixNum = fixedNumMap.get(indicatorOrder);

                                let indicatorContent = indicatorList[f];

                                if (commonUtil.stringIsNotEmpty(indicatorContent)) {
                                    if (commonUtil.stringIsNotEmpty(indicatorContent.unit_change) && indicatorContent.unit_change === 1) {

                                        let indicatorValue = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? commonUtil.getTwoNumberDot(indicatorContent.indicatorValue, fixNum) : '';
                                        let displayUnit = commonUtil.stringIsNotEmpty(indicatorContent.dispUnit) ? indicatorContent.dispUnit : '';

                                        let displayValue = '--';
                                        if (commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue)) {
                                            displayValue = commonUtil.formatNumberMoney(commonUtil.formatUnit(unit, indicatorValue, displayUnit, convertedUnit, fixNum));
                                        }
                                        itemData.push(displayValue);
                                    } else if (valueType === 1) {
                                        let indicatorValue = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? commonUtil.formatNumberMoney(commonUtil.getTwoNumberDot(indicatorContent.indicatorValue, fixNum)) : '--';
                                        itemData.push(indicatorValue);
                                    } else {
                                        let noIndicator = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? indicatorContent.indicatorValue : '--';
                                        itemData.push(noIndicator);
                                    }
                                } else {
                                    itemData.push("--");
                                }
                                break;
                        }
                    }

                    contentData.push(itemData);
                }
            }

            wordData.push(headData);
            wordData.push(contentData);

            let returnData = {};
            if (conditionParams.useChart) {
                returnData.chartData = wordData
            }
            if (conditionParams.useHuashu) {
                returnData.textValue = textValue
            }
            returnData.updateTime = updateTime;
            return returnData;
        },
        tabHandler3: function (displayType, result, queryParams) {
            let wordData = [];

            let headData = [];

            let contentData = [];

            let itemData = [];
            var updateTime = ""

            let list = result.list;
            let textValue = result.textValue;
            let emptyIndicator = result.emptyIndicator;
            let sequenceType = result.sequenceType;
            let conditionParams = queryParams.conditionParams;
            let requestParams = queryParams.queryParams;
            let loadType = queryParams.loadType;


            let indicatorOrders = [];//指标集合

            let indicatorAliasNameList = [];//指标别名集合

            let indicatorUnitMap = new Map();//指标基础单位集合

            let indicatorConvertedUnitMap = new Map();//指标转换单位集合

            let indicatorNameSpecialMap = new Map();//特殊指标集合包含日期，代码，简称等

            let indicatorUnitChangeMap = new Map();//单位是否可以转换和是否具有单位判断集合

            let indicatorIndexSort = new Map();//判断是指标是行业 个股  指数

            let indicatorIndexValueType = new Map();//数据值类型，1-数值/2-字符串/3-list/4-索引/5-日期',

            let fixedNumMap = new Map();

            let indicatorUrlList = [];//指标Url集合

            let selectedIndexList = conditionParams.selectedIndexList;//指标信息集合

            let stepNumber = conditionParams.stepNumber;//当前步数

            let dynamicParams = conditionParams.dynamicParams;//判断url拼接参数

            let isMasterStock = false;

            for (let i = 0; i < selectedIndexList.length; i++) {
                let indexId = selectedIndexList[i].indicatorId;

                if (commonUtil.stringIsNotEmpty(emptyIndicator) && emptyIndicator.indexOf(indexId) !== -1 && displayType === 1) {
                    continue;
                }

                let indexAliasName = selectedIndexList[i].aliasName;

                let unit = selectedIndexList[i].unit;
                let indexDisplayUnit = selectedIndexList[i].convertedUnit;
                let indexFlagCode = commonUtil.stringIsEmpty(selectedIndexList[i].indexFlag) ? -1 : selectedIndexList[i].indexFlag;
                let isUnitChange = selectedIndexList[i].isUnitChange;
                let urlFlag = selectedIndexList[i].urlFlag;
                let indexUrl = selectedIndexList[i].indexUrl;
                let indexSort = selectedIndexList[i].indexSort;
                let value_type = selectedIndexList[i].valueType;
                let fixedNum = selectedIndexList[i].xsdNumberVal;

                indicatorAliasNameList.push(indexAliasName);
                indicatorOrders.push(indexId);
                indicatorUnitMap.set(indexId, unit);
                indicatorConvertedUnitMap.set(indexId, indexDisplayUnit);
                indicatorNameSpecialMap.set(indexId, indexFlagCode);
                indicatorUnitChangeMap.set(indexId, isUnitChange);
                indicatorIndexValueType.set(indexId, value_type);
                indicatorIndexSort.set(indexId, indexSort);
                fixedNumMap.set(indexId, fixedNum);
                if (urlFlag === "1" && commonUtil.stringIsNotEmpty(indexUrl)) {
                    indicatorUrlList.push(indexUrl);
                }

                if (i === 0 && indexFlagCode === 1) {
                    isMasterStock = true;
                }
            }

            for (let i = 0; i < indicatorOrders.length; i++) {
                let indicator = indicatorOrders[i];
                let isUnitChangeT = indicatorUnitChangeMap.get(indicator);
                let indicatorUnit = "";
                if (isUnitChangeT != undefined) {
                    indicatorUnit = '(' + indicatorConvertedUnitMap.get(indicator) + ')';
                }

                headData.push(indicatorAliasNameList[i] + indicatorUnit);
                if (i === 0 && indicatorUrlList.length > 0 && stepNumber === 1) {
                    headData.push("链接")
                }
            }

            function getIndicatorUrl(indicatorUrl, topKey) {

                if (dynamicParams.stock && loadType === 1) {
                    indicatorUrl += "&symbol=" + conditionParams.entities;
                } else if (dynamicParams.stock && loadType === 0 && conditionParams.isDefaultStock && commonUtil.stringIsNotEmpty(queryParams.symbol)) {
                    indicatorUrl += "&symbol=" + queryParams.symbol;
                }

                if (dynamicParams.index && loadType === 1) {
                    indicatorUrl += "&index=" + conditionParams.index;
                } else if (dynamicParams.index && loadType === 0 && conditionParams.isDefaultIndex && commonUtil.stringIsNotEmpty(queryParams.index)) {
                    indicatorUrl += "&index=" + queryParams.index;
                }

                if (dynamicParams.industry && loadType === 1) {
                    indicatorUrl += "&industry=" + conditionParams.industry;
                } else if (dynamicParams.industry && loadType === 0 && conditionParams.isDefaultIndustry && commonUtil.stringIsNotEmpty(queryParams.industry)) {
                    indicatorUrl += "&industry=" + queryParams.industry;
                }

                indicatorUrl += "&relevantPeople=" + topKey;
                indicatorUrl += "&name=" + topKey + "个人简介";

                if (commonUtil.stringIsNotEmpty(queryParams.startAt) || commonUtil.stringIsNotEmpty(queryParams.endAt)) {
                    indicatorUrl += "&startAt=" + queryParams.startAt + "&endAt=" + queryParams.endAt;
                }
                return indicatorUrl;
            }

            let hasMap = new Map();
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                let topKey = '';//X轴点 股票代码或者交易日期
                let innerData = item.innerData;//X轴点对应数据
                let rowSpan = 0;
                let stockCode = '';
                let positionOrder = -1;
                let stockName = '';
                let trade_dt = '';

                for (let j = 0; j < innerData.length; j++) {
                    let inner = innerData[j];
                    let innerKey = inner.innerKey;
                    let realData = inner.realData;

                    let YList = [];

                    if (j === 0) {
                        rowSpan = realData.length;
                    }

                    for (let p = 0; p < realData.length; p++) {
                        let real = realData[p];
                        let key = Object.keys(real)[0];
                        let values = Object.values(real)[0];
                        if (p === 0) {
                            let indexSorts = indicatorIndexSort.get(parseInt(key));
                            if (indexSorts === 3 || indexSorts === 4) {
                                stockCode = values.code_market;
                            } else {
                                stockCode = commonUtil.stringIsEmpty(values.code_market) ? '--' : values.code_market.substring(2, values.code_market.length);
                            }

                            stockName = commonUtil.stringIsEmpty(values.extra_0) ? '--' : values.extra_0;
                            trade_dt = commonUtil.stringIsEmpty(values.trade_dt) ? '--' : commonUtil.formatDataDay(values.trade_dt);
                        }
                        updateTime = this.getLastTradeAt(updateTime, values.trade_dt);
                        YList.push(values);
                    }

                    hasMap.set(innerKey, YList);
                }

                itemData = [];

                if (conditionParams.categoryType == 1 || (conditionParams.categoryType === 5 && sequenceType === 1)) {
                    topKey = commonUtil.formatData(item.topKey, "日");
                } else {
                    topKey = item.topKey;
                    topKey = topKey.replace(/(^sh)|(x$)/g, '');
                    topKey = topKey.replace(/(^sz)|(x$)/g, '');
                }
                if (stepNumber === 1 && indicatorUrlList.length > 0) {
                    let indicatorUrl = indicatorUrlList[0];
                    indicatorUrl = getIndicatorUrl(indicatorUrl, topKey);
                    itemData.push({xValue: topKey, rowSpan: 1});
                    itemData.push({xValue: indicatorUrl, rowSpan: 1});
                } else if (stepNumber === 2 && indicatorUrlList.length > 0) {
                    let indicatorUrl = indicatorUrlList[0];
                    indicatorUrl = getIndicatorUrl(indicatorUrl, topKey);
                    itemData.push({type: 0, xValue: topKey, rowSpan: 1, indicatorUrl: indicatorUrl});
                } else {
                    itemData.push({xValue: topKey, rowSpan: 1});
                }

                for (let f = 0; f < rowSpan; f++) {
                    if (f !== 0) {
                        itemData = [];

                        if (conditionParams.categoryType == 1 || (conditionParams.categoryType === 5 && sequenceType === 1)) {
                            topKey = commonUtil.formatData(item.topKey, "日");
                        } else {
                            topKey = item.topKey;
                            topKey = topKey.replace(/(^sh)|(x$)/g, '');
                            topKey = topKey.replace(/(^sz)|(x$)/g, '');
                        }
                        if (stepNumber === 1 && indicatorUrlList.length > 0) {
                            let indicatorUrl = indicatorUrlList[0];
                            indicatorUrl = getIndicatorUrl(indicatorUrl, topKey);
                            itemData.push({xValue: topKey, rowSpan: 1});
                            itemData.push({xValue: indicatorUrl, rowSpan: 1});
                        } else if (stepNumber === 2 && indicatorUrlList.length > 0) {
                            let indicatorUrl = indicatorUrlList[0];
                            indicatorUrl = getIndicatorUrl(indicatorUrl, topKey);
                            itemData.push({type: 0, xValue: topKey, rowSpan: 1, indicatorUrl: indicatorUrl});
                        } else {
                            itemData.push({xValue: topKey, rowSpan: 1});
                        }
                    }

                    for (let k = 0; k < indicatorOrders.length; k++) {
                        let indicatorOrder = indicatorOrders[k];

                        let indexFlag = indicatorNameSpecialMap.get(indicatorOrder);

                        switch (indexFlag) {
                            case 1://代码
                                itemData.push(stockCode);
                                break;
                            case 2://简称
                                itemData.push(stockName);
                                break;
                            case 3://日期
                                itemData.push(trade_dt);
                                break;
                            case 7://相关人物或公司
                                break;
                            default:
                                let convertedUnit = indicatorConvertedUnitMap.get(indicatorOrder);
                                let valueType = indicatorIndexValueType.get(indicatorOrder);
                                let unit = indicatorUnitMap.get(indicatorOrder);
                                let indicatorList = hasMap.get(indicatorOrder + '');
                                let fixNum = fixedNumMap.get(indicatorOrder);

                                let indicatorContent = indicatorList[f];
                                var chartId = queryParams.chartId;

                                if (commonUtil.stringIsNotEmpty(indicatorContent)) {
                                    if (commonUtil.stringIsNotEmpty(indicatorContent.unit_change) && indicatorContent.unit_change === 1) {

                                        let indicatorValue = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? commonUtil.getTwoNumberDot(indicatorContent.indicatorValue, fixNum) : '';
                                        let displayUnit = commonUtil.stringIsNotEmpty(indicatorContent.dispUnit) ? indicatorContent.dispUnit : '';

                                        let displayValue = '--';
                                        if (commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue)) {
                                            displayValue = commonUtil.formatNumberMoney(commonUtil.formatUnit(unit, indicatorValue, displayUnit, convertedUnit, fixNum));
                                        }
                                        if (chartId == 598 || chartId == 616) {
                                            displayValue = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? Number(indicatorContent.indicatorValue).toFixed(2) : '--';
                                        }
                                        itemData.push(displayValue);
                                    } else if (valueType === 1) {
                                        let indicatorValue = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? commonUtil.formatNumberMoney(commonUtil.getTwoNumberDot(indicatorContent.indicatorValue, fixNum)) : '--';
                                        if (chartId == 598 || chartId == 616) {
                                            indicatorValue = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? Number(indicatorContent.indicatorValue).toFixed(2) : '--';
                                        }
                                        itemData.push(indicatorValue);
                                    } else {
                                        let noIndicator = commonUtil.stringIsNotEmpty(indicatorContent.indicatorValue) ? indicatorContent.indicatorValue : '--';


                                        itemData.push(noIndicator);
                                    }

                                    positionOrder = commonUtil.stringIsEmpty(indicatorContent.extra_2) ? -1 : indicatorContent.extra_2;

                                } else {
                                    itemData.push("--");
                                }
                                break;
                        }
                    }

                    contentData.push({positionOrder: positionOrder, itemData: itemData});
                }
            }


            contentData.sort(function (a, b) {
                return a.positionOrder - b.positionOrder;
            });

            let sortResult = [];

            for (let i = 0; i < contentData.length; i++) {
                let item = contentData[i];
                sortResult.push(item.itemData);
            }

            //第一项相同的，放在相邻位置,并合并相同列
            function groupDatas(sourceList) {
                var outcomeList = [];
                for (var i = 0; i < sourceList.length; i++) {
                    var item = sourceList[i];
                    var keyTD = item[0];
                    if (keyTD.pushed == '1') {
                        continue;
                    }
                    outcomeList.push(item);
                    var groups = [];
                    for (var j = i + 1; j < sourceList.length; j++) {
                        var nextItem = sourceList[j];
                        var nextKeyTD = nextItem[0];
                        if (nextKeyTD.pushed == '1') continue;
                        if (nextKeyTD.xValue == keyTD.xValue) {
                            var peer = _.clone(nextItem);
                            groups.push(peer);
                            outcomeList.push(peer);
                            nextKeyTD.pushed = '1';
                            peer[0] = 'up'
                        }
                    }
                    if (groups.length > 0) {
                        keyTD.rowSpan = groups.length + 1;
                        for (var k = 1; k < item.length; k++) {
                            var sameLength = 0;
                            for (var t = 0; t < groups.length; t++) {
                                var peer = groups[t];
                                if (peer[k] == item[k]) {
                                    sameLength++;
                                } else {
                                    break;
                                }
                            }
                            if (sameLength == groups.length) {
                                item[k] = {rowSpan: sameLength + 1, xValue: item[k]}
                                for (var p = 0; p < groups.length; p++) {
                                    var peer = groups[p];
                                    peer[k] = "up"
                                }
                            }
                        }
                    }
                }
                return outcomeList;
            }

            wordData.push(headData);
            if (result.rowspan == "true") {
                wordData.push(groupDatas(sortResult));
            } else {
                wordData.push(sortResult);
            }
            let returnData = {};
            if (conditionParams.useChart) {
                returnData.chartData = wordData
            }
            if (conditionParams.useHuashu) {
                returnData.textValue = textValue
            }
            returnData.updateTime = updateTime;
            return returnData;
        },
        /**
         * 格式化20170801为2017年08月01日
         * @param date
         * @returns {string}
         */
        formateDate: function (date) {

            var temp = date;
            if (date) {
                date = date.toString();
                if (date.length === 8)
                    temp = date.substr(0, 4) + '年' + date.substr(4, 2) + '月' + date.substr(6, 2) + '日';
            } else
                temp = '--';
            return date ? temp : '--';
        },
        /**
         * 转换时间格式
         * @param date
         * @returns {string}
         */
        changeIndexTimeTypeWay: function (type, val) {
            let res = '',
                y = '',
                m = '',
                d = '';
            if (val) {
                let t = val.toString()
                y = t.substring(0, 4)
                m = t.substring(4, 6)
                d = t.substring(6, 8)
            } else {
                return ''
            }
            switch (type) {
                case '1':
                    console.log('111111')
                    console.log(y)
                    res = y + '-' + m + '-' + d
                    break;
                case '2':
                    res = y + '年' + m + '月' + d + '日'
                    break;
                case '3':
                    res = y + '年'
                    break;
                case '4':
                    if (m === '01' || m === '02' || m === '03') {
                        res = y + 'Q1'
                    } else if (m === '04' || m === '05' || m === '06') {
                        res = y + 'Q2'
                    } else if (m === '07' || m === '08' || m === '09') {
                        res = y + 'Q3'
                    } else if (m === '10' || m === '11' || m === '12') {
                        res = y + 'Q3'
                    } else {
                        res = ''
                    }

                    break;
                case '5':
                    console.log('5555555555555')
                    if (m === '01' || m === '02' || m === '03' || m === '04' || m === '05' || m === '06') {
                        res = y + 'H1'
                    } else if (m === '07' || m === '08' || m === '09' || m === '10' || m === '11' || m === '12') {
                        res = y + 'H1'
                    } else {
                        res = ''
                    }
                    break;
            }
            return res;
        }


    }
;

export default commonUtil;

