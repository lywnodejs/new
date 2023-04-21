import {get, post, request} from '~/utils/fetch'
export default {
  get_roles: (params) => {
    return get(`roles`, params)
  },
  get_one_role: (id) => {
    return request(`roles/${id}`, 'get', {})
  },
  handle_role: (method, params) => {
    return request(`roles`, method, params)
  },
  delete_role: (id) => {
    return request(`roles/${id}`, 'delete')
  },
  get_resource: (method, params) => {
    return request(`roles/roleConfig`, method, params)
  },
  get_users: (params) => {
    return request(`users`, 'get', params)
  },
  handle_account: (method, params) => {
    return request(`users`, method, params)
  },
  delete_account: (id) => {
    return request(`users/${id}`, 'delete')
  },
  set_account_status: (params) => {
    return request(`users/disabled`, 'put', params)
  },
  put_resource: (params) => {
    return request(`roles/roleConfig`, 'put', params)
  },
  get_core_index: (params) => {
    return request(`coreIndex/query`, 'get', params)
  },
}
