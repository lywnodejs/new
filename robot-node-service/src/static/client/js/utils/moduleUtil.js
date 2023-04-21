/**
 * Created by BoBo on 2018-11-05.
 */

/**
 * 模块是否可展示
 * @param moduleName
 * @returns {boolean}
 */
function checkModuleAuth(moduleName) {
    var flag = true;

    var auth;
    switch(moduleName)
    {
        case "":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "主动推送":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '事件影响':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "推荐列表":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "高管简介":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "行业推荐":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "概念":
        case "概念股":
        case "热点":
        case "热点成分股":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "个股所属板块":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "股票推荐":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: true
            };
            break;

        case "所属题材":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "经营分析":
        case "业绩简评":
        case "业绩预告":
        case "投资建议":
        case "搜索回答":
        case "估值评级":
        case "行业综评":
        case "行业":
        case "行业个股推荐":
        case '专家个股观点':
        case '专家行业观点':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '基础知识':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "公司主营":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "指数技术分析":
        case "技术分析":
        case "指数":
        case "上证指数综合评价":
        case "指数综评":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: true
            };
            break;

        case "个股技术分析":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: true
            };
            break;

        case '股东列表':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '分红配股':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
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
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
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
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "财务指标":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "基础报价数据是":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "呼叫投顾":
        case "无法回答":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "调侃问好":
            break;

        case "未开发":
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '公司概况':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '办公地址':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case "事件概述":
            break;

        case '竞争优势':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '撤单页面':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '查询页面':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '持仓页面':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '预警设置':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '查看自选股':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '预警查看':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '预警设置清空':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '买入指令':
        case '卖出指令':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '自选股删除':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '自选股添加':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '资金流向':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '个股综评':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;
        case '研报':
        case '资讯':
            break;

        case '通用答案':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '相似K线':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '通用单个答案':
        case '通用列表答案':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '条件选股':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '筹码分布':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '公司高管':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '高管/股东增减持':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '高管图谱':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '股权激励':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '股东人数变化':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '股本结构':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '十大股东':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '知识产权':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        case '开户页面':
            auth = {
                appEzt: true,
                appTopC: true,
                appZscf: true,
                appJftg: true,
                guoxin: false
            };
            break;

        default:
            break;
    }

    if(auth){
        if(auth.hasOwnProperty(appKey)){
            flag = auth[appKey];
        }else{

        }
    }

    return flag;
}