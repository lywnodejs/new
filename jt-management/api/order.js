import {get, post, request} from '~/utils/fetch'
import axios from 'axios'
export default {
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  fetch_all_order: (params) => {
    return request(`loan/queryOrderList`, 'get', params)
  },
  getTestData: () => {
    return axios.get('/detail.json')
  },
  fetch_all_list: (id) => {
    return request(`loan/loanApplys/${id}`, 'get', {})
  },
  fetch_loan_water: (params) => {
    return request(`repay/deduct/getByPage`, 'get', params)
  },
  fetch_address_list: (params) => {
    return request(`items/app`, 'get', params)
  },
}
