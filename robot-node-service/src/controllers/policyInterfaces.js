import {semanticApiService} from '../service/index';
import config from '../config';
var logger = require('../utils/logger');



module.exports = {

    //获取政府搜索数据
    async policyInterfaces(req,res,next){
        let info = await semanticApiService.policyInterfaces(req);
        res.json(info);
    },

    //获取政府搜索数据详情页
    async policyInterfacesDetail(req,res,next){
        let info = await semanticApiService.policyInterfacesDetail(req);
        res.json(info);
    },
    async feedback(req,res,next){
        let info = await semanticApiService.feedback(req);
        res.json(info);
    },

    //获取政府数据其他年份数据
    async getDateYear(req,res,next){
        let info = await semanticApiService.getDateYear(req);
        res.json(info);
    },

}
