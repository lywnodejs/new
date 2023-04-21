import {get, post, request} from '~/utils/fetch'
export default {
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  fetch_repay_order: (params) => {
    return request(`repay/queryOrderBill`, 'get', params)
  },
  fetch_coll_checkdetail: (params) => {
    return request(`repay/queryRepayDetail`, 'get', params)
  },
  fetch_deduct_info: (params) => {
    return request(`repay/queryManualDeductInfo`, 'get', params)
  },
  fetch_repay_man: (params) => {
    return request(`loan/repaymentByStages`, 'post', params)
  },
  fetch_income_list: (params) => {
    return post(`financial/query/incomeDaily`, params)
  },
  fetch_cost_list: (params) => {
    return post(`financial/query/costDaily`, params)
  },
  fetch_loss_list: (params) => {
    return post(`financial/query/roiDaily`, params)
  },
  fetch_asset_list: (params) => {
    return post(`financial/query/assetDaily`, params)
  },
  fetch_profitMonthly_list: (params) => {
    return post(`financial/query/profitMonthly`, params)
  },
  fetch_costMonthly_list: (params) => {
    return post(`financial/query/costMonthly`, params)
  },
  fetch_update_monthly: (params) => {
    return post(`financial/do/costMonthly`, params)
  },
  fetch_record_list: (params) => {
    return post(`financial/query/moneyRecord`, params)
  },
  fetch_record_detail: (params) => {
    return post(`financial/query/moneyRecordDetail`, params)
  },
  fetch_record_add: (params) => {
    return post(`financial/add/moneyRecord`, params)
  },
  fetch_assetCost_list: (params) => {
    return post(`financial/query/assetCost`, params)
  },
  fetch_messageCost_list: (params) => {
    return post(`financial/query/messageCost`, params)
  },
  fetch_dsCost_list: (params) => {
    return post(`financial/query/dsCost`, params)
  },
  fetch_signCost_list: (params) => {
    return post(`financial/query/signCost`, params)
  },
  fetch_payChannel_list: (params) => {
    return post(`financial/query/payChannel`, params)
  },
  fetch_relieve_delete: (params) => {
    return post(`financial/relieve/moneyRecord`, params)
  },
  fetch_receipt_list: (params) => {
    return get(`financial/query/receiptList`, params)
  },
  fetch_receipt_detail: (params) => {
    return get(`financial/query/receiptById`, params)
  },
  fetch_grantList_list: (params) => {
    return get(`financial/query/grantList`, params)
  },
  fetch_deductList_list: (params) => {
    return get(`financial/query/deductList`, params)
  },
  fetch_loanList_list: (params) => {
    return get(`fund/sec/query/loanList`, params)
  },
  fetch_cardAuthCost_list: (params) => {
    return post(`financial/query/cardAuthCost`, params)
  },
  fetch_faceRcgCost_list: (params) => {
    return post(`financial/query/faceRcgCost`, params)
  },
  fetch_marketCost_list: (params) => {
    return post(`financial/query/marketCost`, params)
  },
  fetch_payCost_list: (params) => {
    return post(`financial/query/payCost`, params)
  },
  fetch_tradeList_list: (params) => {
    return get(`fund/sec/query/tradeList`, params)
  },
  fetch_loanPlanExpire_list: (params) => {
    return get(`financial/query/loanPlanExpire`, params)
  },
  fetch_loanList_export: (params) => {
    return get(`financial/export/loanPlanExpire`, params)
  },

  fetch_deductList_export: (params) => {
    return get(`financial/export/deductList`, params)
  },
}
