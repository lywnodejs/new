import {get, post, request, upload} from '~/utils/fetch'
const url = 'creditverify/'
export default {
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  fetch_credit_order: (params) => {
    return request(`${url}getCreditOrder`, 'get', params)
  },
  fetch_credit_detail: (params) => {
    return request(`${url}detail/getCreditOrderDetailBase`, 'get', params)
  },
  fetch_risk_tag: (params) => {
    return request(`${url}detail/getRiskLabel`, 'get', params)
  },
  fetch_linkman_info: (params) => {
    return request(`${url}detail/getLinkmanInfo`, 'get', params)
  },
  fetch_contact_list: (params) => {
    return request(`${url}detail/getContactList`, 'get', params)
  },
  fetch_contact_history: (params) => {
    return request(`${url}detail/getLinkmanChangeHis`, 'get', params)
  },
  fetch_recent_order_info: (params) => {
    return request(`${url}detail/getRecentlyOrderInfo`, 'get', params)
  },
  fetch_user_relation: (params) => {
    return request(`${url}detail/queryUserRelationInfo`, 'get', params)
  },
  fetch_install_app: (params) => {
    return request(`${url}detail/getApp`, 'get', params)
  },
  fetch_loan_history: (params) => {
    return request(`${url}detail/getLoanHis`, 'get', params)
  },
  fetch_card_info: (params) => {
    return request(`${url}detail/getBankCard`, 'get', params)
  },
  fetch_device_log: (params) => {
    return request(`${url}detail/getDeviceLoginInfo`, 'get', params)
  },
  fetch_memo_history: (params) => {
    return request(`${url}detail/getMemo`, 'get', params)
  },
  fetch_reject_code: (params) => {
    return request(`${url}getRejectCode`, 'get', params)
  },
  fetch_reject_result: (params) => {
    return request(`${url}detail/getResult`, 'get', params)
  },
  send_sms: (params) => {
    return request(`${url}sendSms`, 'post', params)
  },
  update_linkman: (params) => {
    return request(`${url}detail/updateLinkman`, 'post', params)
  },
  update_stash: (params) => {
    return request(`${url}stash`, 'post', params)
  },
  update_back: (params) => {
    return request(`${url}orderReturn`, 'post', params)
  },
  update_finish: (params) => {
    return request(`${url}finishCredit`, 'post', params)
  },
  update_first: (params) => {
    return request(`${url}firstCredit`, 'post', params)
  },
  update_review: (params) => {
    return request(`${url}reviewCredit`, 'post', params)
  },
  update_tel: (params) => {
    return request(`${url}telVerify`, 'post', params)
  },
  fetch_credit_orders: (params) => {
    return request(`${url}getCreditVerifyOrder`, 'get', params)
  },
  fetch_count_order: (params) => {
    return request(`${url}countOrder`, 'get', params)
  },
  update_assign: (params) => {
    return request(`${url}assign`, 'post', params)
  },
  update_credit_remark: (params) => {
    return request(`${url}creditRemark`, 'post', params)
  },
  update_credit_blue: (params) => {
    return request(`${url}creditBlue`, 'post', params)
  },
  fetch_credit_order_history: (params) => {
    return request(`${url}getCreditVerifyOrderHis`, 'get', params)
  },
  fetch_tel_order_history: (params) => {
    return request(`${url}getTelVerify`, 'get', params)
  },
  fetch_report_processing: (params) => {
    return request(`${url}statVerifying`, 'get', params)
  },
  fetch_report_finish: (params) => {
    return request(`${url}statFinish`, 'get', params)
  },
  fetch_keyword_config: (params) => {
    return request(`${url}getKeywordConfig`, 'get', params)
  },
  add_keyword_config: (params) => {
    return request(`${url}addKeywordConfig`, 'post', params)
  },
  update_keyword_config: (params) => {
    return request(`${url}updateKeywordConfig`, 'post', params)
  },
  delete_keyword_config: (params) => {
    return request(`${url}deleteKeywordConfig`, 'post', params)
  },
  fetch_tel_his: (params) => {
    return request(`${url}detail/getLinkmanTelHis`, 'get', params)
  },
  add_tel_his_memo: (params) => {
    return request(`${url}detail/updateLinkmanTelHis`, 'get', params)
  },
  fetch_questions: (params) => {
    return request(`${url}detail/getQuestions`, 'get', params)
  },
  fetch_risk_detail: (params) => {
    return request(`${url}detail/getRiskDetail`, 'get', params)
  },
  getCreditRole: (params) => {
    return request(`${url}/getCreditRole`, 'get', params)
  },
}
