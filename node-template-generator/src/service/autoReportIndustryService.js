/**
 * Created by XDY on 2019/9/6.
 */
/* eslint-disable */
class AutoReportIndustryService {
    constructor(clientAxios) {
        this.http = clientAxios
    }
    //获取行业简介、行业上下游数据 接口
    getTrade(params) {
        /*let url = '/auto/report/dev/kb/search?q=物联网';
        return this.http.getJson(url, params);*/
        let url = '/auto/report/dev/kb/search';
        return this.http.getJson(url, params);
    }
    //获取行业发展趋势  接口
    getIndustryTrend(params,str) {
       /* let url = '/auto/report/dev//kb/INDUSTRY_TREND/search';
        return this.http.getJson(url, params);*/
        let url = '/auto/report/dev//kb/'+str+'/search';
        return this.http.getJson(url, params);
    }
}

export default {
    AutoReportIndustryService: AutoReportIndustryService,
}