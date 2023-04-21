/**
 * Created by BoBo on 2018-02-08.
 */

/**
 * 根据答案分类判断平台/APP/版本以确定是否展示与原生交互的界面
 * @param answerType 答案分类名称
 * @returns {boolean} 是否展示true|false
 */
function isInteractiveView(answerType) {
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
        case '行业研报详情页面':
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
                    flag = checkVersion(minVersion, appVersion);
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
}
