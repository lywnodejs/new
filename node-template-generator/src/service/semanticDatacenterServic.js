/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class SemanticDatacenterServic {
    constructor(clientAxios) {
        this.http = clientAxios
    }

    getNorthMoney(params) {
        let url = '/fundsface/getTMarHkshscTop10Stocks';
        return this.http.getJson(url,params)
    }
    getStockNorthMoney(params) {
        let url = '/fundsface/getTMarHkshscNewStocks';
        return this.http.getJson(url,params)
    }
    getStockNoticeSearch(params) {//公告
        let url = '/company/notice/search';
        return this.http.getJson(url,params)
    }
    getStocPersonsActingInConcert(params) {//一致行动人
        let url = '/company/act/concert';
        return this.http.getJson(url,params)
    }
    getStockJudicialDispute(params) {//司法纠纷
        let url = '/company/legal/queryByTitle';
        return this.http.getJson(url,params)
    }
    getStockShareHoldSearch(params){//参控股公司
        let url = '/ten/shareHold/page/point';
        return this.http.getJson(url,params);
    }

    getProposalVoteSearch(params){//董事会监事会投票
        let url = '/proposal/vote/stat';
        return this.http.getJson(url,params);
    }
    getDailyIndicatorBySymbol(params){
      let url = '/com/daily/indicator/limit/';
      return this.http.getJson(url,params);
    }
    getDataTemplateByBusiness(params){
      let url = '/template';
      return this.http.getJson(url,params);
    }
}

export default {
    SemanticDatacenterServic: SemanticDatacenterServic,
}
