import {get, post, request, loanFetch} from '~/utils/fetch'
export default {
  get_products: (tenantId) => {
    return get(`tenant/${tenantId}/products`)
  },
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  fetch_overdueAlloc_list: (params) => {
    return request(`collection/getNewOrders`, 'get', params)
  },
  fetch_all_whitelist: (params) => {
    return post(`companyConf/queryInfo`, params)
  },
  getTreeMemberList: (params) => {
    return get(`users/userTrees`, params)
  },
  add_overdueAlloc_one: (params) => {
    return post(`companyConf/add`, params)
  },
  edit_overdueAlloc_allselect: (params) => {
    return post(`collection/distribution`, params)
  },
  edit_overdueAlloc_one: (params) => {
    return post(`companyConf/updateById`, params)
  },
  fetch_orderManage_undoList: (params) => {
    return request(`collection/getDoingOrders`, 'get', params)
  },
  fetch_orderManage_doneList: (params) => {
    return request(`collection/getDoneOrders`, 'get', params)
  },
  fetch_order_detail: (id) => {
    // return get(`collection/queryOrderDetail?id=${id}&collectionOrderId=${id}`)
    return get(`collection/queryOrderDetail`, {id, collectionOrderId: id})
  },
  fetch_overdue_settings: (params) => {
    return post(`overdueLevelConfig/queryListInfo`, params)
  },
  add_overdue_one: (params) => {
    return post(`overdueLevelConfig/add`, params)
  },
  edit_overdue_one: (params) => {
    return post(`overdueLevelConfig/updateById`, params)
  },
  fetch_autosplits_settings: (params) => {
    return request(`collection/distribution/conf/search`, 'get', params)
  },
  delete_split_one: (params) => {
    return post(`collection/distribution/conf/remove`, params)
  },
  add_split_one: (params) => {
    return post(`collection/distribution/conf/save`, params)
  },
  fetch_report_orderHistory: (params) => {
    return request(`collection/report/orderHistory`, 'get', params)
  },
  fetch_history_detail: (params) => {
    return request(`collection/report/orderHistoryDetail`, 'get', params)
  },
  fetch_report_recordHistory: (params) => {
    return request(`collection/report/recordHistory`, 'get', params)
  },
  fetch_report_distribution: (params) => {
    return request(`collection/report/distribution`, 'get', params)
  },
  fetch_report_overdueOrders: (params) => {
    return request(`collection/report/overdueOrders`, 'get', params)
  },
  fetch_report_newOrders: (params) => {
    return request(`collection/report/newOrders`, 'get', params)
  },
  fetch_report_performance: (params) => {
    return request(`collection/report/achievementOrders`, 'get', params)
  },

  fetch_coll_checkdetail: (params) => {
    return request(`collection/queryRepayDetail`, 'get', params)
  },
  fetch_all_list: (params) => {
    return request(`collection/queryOrderDetail`, 'get', params)
  },
  add_one_collection: (params) => {
    return post(`collection/saveRecord`, params)
  },
  fetch_repayremind_list: (params) => {
    return request(`customer/repayRemind/queryOrderCallRecord`, 'get', params)
  },
  add_call_one: (params) => {
    return request(`calloutConf/call`, 'get', params)
  },
  fetch_address_list: (params) => {
    return request(`collection/queryContactsDetail`, 'get', params)
  },
  save_memo_collection: (params) => {
    return post(`collection/update`, params)
  },
  fetch_sms_list: (params) => {
    return request(`calloutConf/querySmsList`, 'get', params)
  },
  add_sms_one: (params) => {
    return request(`calloutConf/sms`, 'get', params)
  },
  // 获取委案列表
  getEntrustCaseList(params) {
    return loanFetch(`/postloan/order/query`, params)
  },
  // 获取检查结果列表
  getCheckCaseList(params) {
    return loanFetch(`/postloan/order/historyQuery`, params)
  },
  // 获取贷后详情
  getCheckResult(params) {
    return loanFetch(`/postloan/order/queryDetail`, params, true)
  },
  getLoanAfterConfig() {
    return loanFetch(`/postloan/reviewConfig/productQuery`, null, true)
  },
  updateLoanAfterConfig(params) {
    return loanFetch(`/postloan/reviewConfig/configUpdate`, params)
  },
  getProdutLevelConfig(productId) {
    return loanFetch(`/collection/overdueLevelConfig/queryListInfo`, {
      productId,
    })
  },
  changeProdutLevelConfig(params) {
    if (params.id) {
      return loanFetch(`/collection/overdueLevelConfig/updateById`, params)
    } else {
      return loanFetch(`/collection/overdueLevelConfig/add`, params)
    }
  },
  removeProdutLevelConfig(id) {
    return loanFetch(`/collection/overdueLevelConfig/remove`, {id}, true)
  },
  getProdutAutomaticConfig(params) {
    return loanFetch(`/collection/distribution/conf/search`, params, true)
  },
  getPersonnelList: (params) => {
    return get(`creditConfig/queryCreditRoleInfo`, params)
  },
  changeAutomaticConfig(params) {
    return loanFetch(`/collection/distribution/conf/save`, params)
  },
  deleteAutomaticConfig(id) {
    return loanFetch(`/collection/distribution/conf/remove`, {id})
  },
  getAppraisalConfig(productId) {
    return loanFetch(`/collection/achievement/conf/list`, {productId}, true)
  },
  changeAppraisalConfig(params) {
    return loanFetch(`/collection/achievement/conf/update`, params)
  },
  getLoanAfterList(params) {
    return loanFetch(`/postloan/order/loanQuery`, params)
  },
  upCheckContent(params) {
    return loanFetch(`/postloan/order/add`, params)
  },
  getNewTreeMemberList: () => {
    return post(`collection/queryCollectionRoleInfo`)
  },
  getContactlist: (userId) => {
    return get(`creditverify/detail/getContactList`, {userId})
    // return post(`creditverify/detail/getContactList`)
  },
  getSmsList(params) {
    return loanFetch(`/postloan/riskwarning/getCollectSmsList`, params, true)
  },
}
