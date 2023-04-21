class financialStatementService {
    constructor(clientAxios) {
        this.http = clientAxios
    }
    getFinancialStatementByType(params,type) {
        let url = "/" + type;
        return this.http.getJson(url, params);
    }
}

export default {
  financialStatementService: financialStatementService,
}