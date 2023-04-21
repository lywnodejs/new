import {get, post, request} from '~/utils/fetch'
const url = 'companyConf/'
export default {
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  fetch_white_list: (params) => {
    return request(`${url}queryInfo`, 'post', params)
  },
  fetch_check_bills: (params) => {
    return request(`fund/bill/queryCheckBill`, 'post', params)
  },
}
