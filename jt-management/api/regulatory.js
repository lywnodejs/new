import {gwRequest} from '~/utils/fetch'
export default {
  downloadSignAgreement: (ids) => {
    return gwRequest(
      'bank.api.agreementsignatureservice.recordbranchdownload',
      [{ids}],
    )
  },
  getCategory: (type) => {
    return gwRequest(
      'report.api.read.reporteventreadservice.queryreporteventservice',
      [
        {
          category: 0,
          type,
        },
      ],
    )
  },
  getAllProducts: () => {
    return gwRequest('report.api.read.creditreportreadservice.allproducts', [
      {},
    ])
  },
  getCreditReportList: (params) => {
    return gwRequest(
      'report.api.read.creditreportreadservice.selectcreditreportpageservice',
      [params],
    )
  },
  getSecondReportList: (params) => {
    return gwRequest(
      'report.api.read.virtualbankaccountreportreadservice.selectvirtualbankaccountreportpageservice',
      [params],
    )
  },
  exportSecondReportList: (params) => {
    return gwRequest(
      'report.api.read.virtualbankaccountreportreadservice.exportdata',
      [params],
    )
  },
  exportCreditReportList: (params) => {
    return gwRequest('report.api.read.creditreportreadservice.exportdata', [
      params,
    ])
  },
  uploadCreditReportList: (params) => {
    return gwRequest(
      'report.api.write.creditreportwriteservice.importfeedbackfile',
      [params],
    )
  },
}
