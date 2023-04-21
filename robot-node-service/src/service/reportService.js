/**
 * 智能报告服务
 */

class ReportService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  /**
   * 取报告答案
   * @param params
   * @returns {Promise}
   */
  getReportAnswer(params) {
    let url = '/report/template/content';
    return this.http.getJson(url, params);
  }
}

export default {
  ReportService
}

