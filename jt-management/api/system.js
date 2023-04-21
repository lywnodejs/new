import {get, post, request} from '~/utils/fetch'
const url = 'companyConf/'
export default {
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  fetch_white_list: (params) => {
    return request(`${url}queryInfo`, 'post', params)
  },
  add_ipconfig_one: (params) => {
    return request(`${url}add`, 'post', params)
  },
  edit_ipconfig_one: (params) => {
    return request(`${url}updateById`, 'post', params)
  },
}
