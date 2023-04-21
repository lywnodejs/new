class FinancialThemDwService {
    constructor(clientAxios) {
        this.http = clientAxios
    }

    getFinancialData(params) {
        // console.log(params)
        let url = "/financialData/data";
        return this.http.postContentTypeJson(url, params);
    }
    //可变现资产
    getRealizableAssets(params) {
        let url = "/financial/asset/release";
        return this.http.getJson(url, params);
    }
}

export default {
    FinancialThemDwService
}