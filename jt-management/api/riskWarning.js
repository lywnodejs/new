import {get, post, request, loanFetch} from '~/utils/fetch'

export default {
  fetch_riskList(params) {
    return loanFetch(`/postloan/riskwarning/getWarnIngList`, params, true)
  },
  fetch_product_list(params) {
    return loanFetch(`/postloan/riskwarning/config/getAllProduct`, null, true)
  },
  fetch_decisionList_list(params) {
    return loanFetch(`/postloan/riskwarning/config/decisionList`, params, true)
  },

  fetch_decisionList_update(params) {
    return loanFetch(`/postloan/riskwarning/config/addConfig`, params)
  },
  fetch_get_riskList(params) {
    return loanFetch(`/postloan/riskwarning/config/configList`, params, true)
  },
  fetch_get_updateRemark(params) {
    return loanFetch(`/postloan/riskwarning/config/updateRemark`, params, true)
  },
}
