import {get, post, request} from '~/utils/fetch'
const url = 'customer/'
export default {
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  fetch_withdraw_list: (params) => {
    return request(`${url}withdraw/queryOrderList`, 'get', params)
  },
  export_withdraw_list: (params) => {
    return request(`${url}withdraw/queryOrderList`, 'get', params, {
      responseType: 'arraybuffer',
    })
  },
  update_assign: (params) => {
    return request(`${url}assign/loanOrder`, 'post', params)
  },
  save_memo_operating: (params) => {
    return request(`${url}withdraw/orderRemark`, 'post', params)
  },
  get_repayment_products: (params) => {
    return request(`${url}repayment/queryProductNameList`, 'get', params)
  },
  fetch_repayment_list: (params) => {
    return request(`${url}repayment/queryOrderList`, 'get', params)
  },
  export_repayment_list: (params) => {
    return request(`${url}repayment/queryOrderList`, 'get', params, {
      responseType: 'arraybuffer',
    })
  },
  get_renew_products: (params) => {
    return request(`${url}continue/queryProductNameList`, 'get', params)
  },
  fetch_renew_list: (params) => {
    return request(`${url}continue/queryOrderList`, 'get', params)
  },
  export_renew_list: (params) => {
    return request(`${url}continue/queryOrderList`, 'get', params, {
      responseType: 'arraybuffer',
    })
  },
  fetch_my_contacts: (params) => {
    return request(`${url}contact/queryContactList`, 'get', params)
  },
  fetch_report_list: (params) => {
    return request(`${url}statistics/queryReportList`, 'get', params)
  },
  fetch_withdraw_detail: (params) => {
    return request(`${url}withdraw/queryDetailOrder`, 'get', params)
  },
  save_call_record: (params) => {
    return request(`${url}contact/addCallRecord`, 'post', params)
  },
  fetch_order_history: (params) => {
    return request(`${url}contact/getCallRecordList`, 'get', params)
  },
  save_memo_replayment: (params) => {
    return request(`${url}repayment/orderRemark`, 'post', params)
  },
  fetch_replayment_detail: (params) => {
    return request(`${url}repayment/queryDetailOrder`, 'get', params)
  },
  save_memo_renew: (params) => {
    return request(`${url}continue/orderRemark`, 'post', params)
  },
  fetch_renew_detail: (params) => {
    return request(`${url}continue/queryDetailOrder`, 'get', params)
  },
  fetch_sms_list: (params) => {
    return request(`${url}sms/queryTemplateList`, 'get', params)
  },
  get_withdrawal_products: (params) => {
    return request(`${url}withdraw/queryProductNameList`, 'get', params)
  },
}
