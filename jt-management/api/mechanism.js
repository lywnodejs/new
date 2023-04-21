import {get, post, request} from '~/utils/fetch'
const url = 'organization/'
export default {
  get_mechanism_list: (params) => {
    return request(`${url}queryList`, 'get', params)
  },
  get_mechanism_detail: (params) => {
    return request(`${url}query`, 'get', params)
  },
  update_mechanism_update: (params) => {
    return request(`${url}update`, 'post', params)
  },
}
