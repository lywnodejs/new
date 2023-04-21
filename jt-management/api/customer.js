import {get, post, request} from '~/utils/fetch'
const url = 'customerInfo/'
export default {
  get_customer_list: (params) => {
    return request(`${url}queryCustomerInfoList`, 'get', params)
  },
  get_customer_detail: (params) => {
    return request(`${url}queryCustomerInfoDatil`, 'get', params)
  },
  update_customer_fiveLevelType: (params) => {
    return request(`${url}updateFiveLevelType`, 'post', params)
  },
  update_user_limitAmount: (params) => {
    return request(`${url}updateUserLimitAmount`, 'post', params)
  },
}
