import toolsUtil from "../utils/toolsUtil";
import commonUtil from "../utils/commonUtil";
import handlerUtil from "../utils/handlerUtil"
import format from "../utils/format"
import comUtil from "../utils/com-util";
import {
    semanticDatacenterServic,
    semanticApiService,
    quotaService,
    aiApiService,
    stockAnalysisService,
    financialThemDwService,
    reportCompositeService
} from "../service";
import _ from "underscore";


let reportSearchHandler = {

    /*
    * 研报搜索组件
    * */
    async researchHandler(data) {

        var startAt = data.startAt;//开始时间
        var endAt = data.endAt;//结束时间



        if (!data.isDefaultStock) {
            if (data.hasOwnProperty('symbol')) {
                data.stocks = data.symbol.substring(2, data.symbol.length);
            } else {
                data.stocks = '000001';
            }
        }

        if (commonUtil.stringIsNotEmpty(startAt) || commonUtil.stringIsNotEmpty(endAt)) {
            switch (data.timeRangeType) {
                case 1: //近一段时间
                    data.deadline = endAt;
                    break;
                case 2: //自定义时间段
                    break;
                default: //任意时间
                    data.startAt = startAt;
                    data.endAt = endAt;
                    delete data.timeInterval;
                    break;
            }
        }


        console.log(data.id)
        let result;
        switch (data.id) {
            case 3001:
                result = await this.searchHandlerRating(data);
                break;
            case 3002:
                result = await this.organizationDuty(data);//组织架构及职责
                break;
            case 3003:
                result = await this.industryRelated(data);//产业相关
                break;
            case 3004:
                result = await this.enterpriseCompetitiveness(data);//企业竞争力
                break;
            case 3005:
                result = await this.personInfluence(data);//个人影响力
                break;
            case 5012:
                result = await this.researchReportGrade(data);//研报资讯
                break;
            case 5013:
                result = await this.realizableAssets(data);//可变现资产
                break;
            default:
                result = await this.searchHandlerRating(data);
        }
        return result;
    },

    async searchHandlerRating (data) {

        data.timeInterval = '近一年';
        let info = await semanticApiService.getRiskNotice(data);
        let template = 'riskNotice';
        let params = handlerUtil.getTemplateConfig("riskNotice");
        if (params.code === -1) {
            return params;
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
            params: params,
            commonUtil: commonUtil,
            templateType: template

        };
        return result;
    },
    //组织架构及职责
    async organizationDuty (data) {
        
        let knowledgeTypes;
        let entityLeftIds
        if(data.searchParams){
            knowledgeTypes = data.searchParams.knowledgeTypes;
            entityLeftIds = data.searchParams.entityLeftIds;
        }
        if(data.knowledgeTypes){
            knowledgeTypes = data.knowledgeTypes;
        }
        if(data.entityLeftIds){
            entityLeftIds = data.entityLeftIds;
        }
        let reqparams = {
            orderBy:'publishAt',
            knowledgeTypes: knowledgeTypes,//产业类型
            entityLeftTypeId:9,
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
    //产业相关
    async industryRelated (data) {
        let knowledgeTypes;
        let entityLeftIds
        // if(data.searchParams){
        //     knowledgeTypes = data.searchParams.knowledgeTypes;
        //     entityLeftIds = data.searchParams.entityLeftIds;
        // }
        if(data.knowledgeTypes){//产业类型
            knowledgeTypes = data.knowledgeTypes;
        }
        if(data.entityLeftIds){
            entityLeftIds = data.entityLeftIds;
        }
        let reqparams = {
            orderBy:'publishAt',
            knowledgeTypes: knowledgeTypes,//产业类型
            entityLeftTypeId:9,
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
    //企业竞争力
    async enterpriseCompetitiveness (data) {
        let knowledgeTypes;
        let entityLeftIds
        if(data.searchParams){
            knowledgeTypes = data.searchParams.knowledgeTypes;
            entityLeftIds = data.searchParams.entityLeftIds;
        }
        if(data.knowledgeTypes){
            knowledgeTypes = data.knowledgeTypes;
        }
        if(data.entityLeftIds){
            entityLeftIds = data.entityLeftIds;
        }
        let reqparams = {
            orderBy:'publishAt',
            knowledgeTypes: knowledgeTypes,//产业类型
            entityLeftTypeId:9,
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
    //个人影响力
    async personInfluence (data) {
        let knowledgeTypes;
        let entityLeftIds
        if(data.searchParams){
            knowledgeTypes = data.searchParams.knowledgeTypes;
            entityLeftIds = data.searchParams.entityLeftIds;
        }
        if(data.knowledgeTypes){
            knowledgeTypes = data.knowledgeTypes;
        }
        if(data.entityLeftIds){
            entityLeftIds = data.entityLeftIds;
        }
        let reqparams = {
            orderBy:'publishAt',
            knowledgeTypes: knowledgeTypes,//产业类型
            entityLeftTypeId:9,
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
    /**
     * 研报资讯
     * @param data
     * @param type 1 质押头部 2 触达预警和平仓的质押  3 当前存续的股权质押
     * @returns {Promise<*>}
     */
    async researchReportGrade (data) {

        console.log(data.isDefaultStock)
        let stockCode = null;
        if (data.stocks) {
            stockCode = data.stocks.code
        }
        let defaultStock = true;

        if (data.symbol && !data.isDefaultStock) {
            defaultStock = false;
            stockCode = data.symbol.slice(2, 8);
        }

        let start = null;
        let end = null;
        if (data.startAt) {
            start = new Date(commonUtil.generateDate(data.startAt)).getTime();
        }
        if (data.endAt) {
            end = new Date(commonUtil.generateDate(data.endAt)).getTime();
        }






        let reqparams = {
            orderBy:'publishAt',
            title2stocks: stockCode,
            facetFields: 'ratingResult',
            reportTypes: '公司研究',
            begin: start,
            end: end || '',
            deleteFlag: 0,
            //cp:1,
            ps:data.ps || 10
        }
        let info = await semanticApiService.apiBigSearchDetail(reqparams);
        let template = "bigSearch";
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
    * 可变现资产
    * @param data
    * @param type 1 质押头部 2 触达预警和平仓的质押  3 当前存续的股权质押
    * @returns {Promise<*>}
    */
   async realizableAssets (data) {
       let stock = null;
       let marval = null;
       let time = null;
       if (data.selectedStock.length > 0) {
            let str = data.selectedStock[0].baseName;
            marval = str.substring(0,2);
            stock = str.substring(2,str.length)
       } else {
            stock = '000001';
            marval = "sz"
       }
       if (data.timeRangeType === 0) {
        
       }


        if (data.symbol) {
            let symbol = data.symbol;
            stock = symbol.slice(2, 8);
            marval = symbol.slice(0, 2);
        }

       if (data.kbxTime) {
        time = commonUtil.changeTimeForMinNoHoursnoline(new Date(data.kbxTime).getTime());
       } else {
        let data = new Date().getTime();
        time = commonUtil.changeTimeForMinNoHoursnoline(data);
       }
       let reqparams = {
        marType: marval,
        pointTime: time,
        secCode: stock,
       }
       let info = await financialThemDwService.getRealizableAssets(reqparams);
       let template = "realizableAssets";
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
   }

};

export default reportSearchHandler;
