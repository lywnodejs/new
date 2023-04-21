/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class EventService {
    constructor (clientAxios) {
        this.http = clientAxios
    }

    /**
     * 事件列表
     * @returns {Promise}
     */

    getEventList (params) {
        let url = '/hotConcept'
        return this.http.getJson(url, params)
    };

    industry (type, params) {
        let url = `/kb/${type}/search`
        return this.http.getJson(url, params)
    };

    searchN (params) {
        let url = `/kb/COMPANY_SUMMARY_MAIN_POINT/searchN`
        return this.http.getJson(url, params)
    };

    /**
     * @msg: 根据id查指定数据
     */
    searchID (id,params) {
        let url = `/kb/${id}`
        return this.http.getJson(url, params)
    };

    reportInfo (params) {
        let url = `/datacenter/reportInfo`
        return this.http.getJson(url, params)
    };

    /**
     * 知行日报的list也接口
     * @returns {Promise}
     */
    zxrbList (params) {
        let url = `/information/topic`
        return this.http.getJson(url, params)
    };

    /**
     * 知行日报的title
     * @returns {Promise}
     */
    zxrbListId (params) {
        let url = `/information/topic/`
        return this.http.getJson(url,params)
    };

    /**
     * 知行日报日报接口
     * @returns {Promise}
     */
    zxrbIndex (params) {
        let url = `/information/daily/report`
        return this.http.getJson(url,params)
    };

    /**
     * infoID接口
     * @returns {Promise}
     */
    infoID (id,params) {
        let url = `/information/report/detail/${id}`
        return this.http.getJson(url,params)
    };

    getArticleList (params) {
        let url = '/hotConcept/details'
        return this.http.getJson(url, params)
    }

    /**
     * @description: 获取股权质押接口
     * @param {type}
     */
    getcontroller (params){
        let url='/datacenter/fundFace/stockPledge';
        return this.http.getJson(url,params);
    }

    /**
     * @description: 获取风险排行接口
     * @param {type}
     */
    getRtPledge (params){
        let url='/datacenter/fundFace/getTRtPledgeTotriskTOP10';
        return this.http.getJson(url,params);
    }

    /**
     * @description: 获取风险排行信息从从
     * @param {type}
     */
    focus (params){
        let url='/focus/industry/detail';
        return this.http.getJson(url,params);
    }
    /**
     * 事件列表
     * @returns {Promise}
     */

    infoID(id){
        let url = `/information/detail/${id}`
        return this.http.getJson(url)
    }

    recommend (params){
        let url='/recommend/stock';
        return this.http.getJson(url,params);
    }

    getProspectus(params) {
        let url = '/keChuangPlate';
        return this.http.getJson(url, params);
    }

    /**
     * @description: 科创板分类详情
     * @param type  type类别
     * @param params  实体参数
     */
    getProspectusInfo(type, params) {
        let url = '/kb/' + type + '/searchN';
        return this.http.getJson(url, params);
    }


}
export default {
    EventService,
}
