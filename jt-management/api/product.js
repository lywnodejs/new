import {get, post, request, gwRequest} from '~/utils/fetch'
export default {
  get_products: (params) => {
    return get(`products`, params)
  },
  get_product_detail: (id) => {
    return request(`products/${id}`, 'get', {})
  },
  add_product: (params) => {
    return request(`products`, 'post', params)
  },
  edit_product: (params) => {
    return request(`products`, 'post', params)
  },
  get_menu_list: () => {
    return request(`menu`, 'get', {})
  },
  getProduct4search: (params) => {
    return gwRequest('bank.api.distributestatisticsservice.getloannames', [
      params,
    ])
  },
}
