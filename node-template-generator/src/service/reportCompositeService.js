/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class ReportCompositeService {
    constructor(clientAxios) {
        this.http = clientAxios
    }

    getAnalysisData(params) {
        let url = '/router/data';
        return this.http.postJsonType(url, params);
    }

    getSpeechData(params) {
        let url = '/router/mutidata';
        return this.http.postJsonType(url, params);
    }
    //数据是
    getAnalysisDataIs(params) {
        console.log(params)
        let url = '/router/mutidata/datais';
        return this.http.postJsonType(url, params);
    }

    getChartConfig(params) {
        let url = '/config/template';
        return this.http.getJson(url, params);
    }
}

export default {
    ReportCompositeService: ReportCompositeService,
}
