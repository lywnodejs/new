import {get, post, request, upload} from '~/utils/fetch'
const url = 'fund/coupon/'
const fileUrl = 'fund/file/'
export default {
  fetch_marketing_ticket: (params) => {
    return request(`${url}listMarketingLimitConfig`, 'post', params)
  },
  add_marketing_ticket: (params) => {
    return request(`${url}addMarketingLimitConfig`, 'post', params)
  },
  edit_marketing_ticket: (params) => {
    return request(`${url}updateMarketingLimitConfig`, 'post', params)
  },
  fetch_marketing_task: (params) => {
    return request(`${url}getMarketingTaskList`, 'post', params)
  },
  edit_marketing_task: (params) => {
    return request(`${url}updateMarketingTask`, 'post', params)
  },
  upload_marketing_list: (params) => {
    return upload(params, `${fileUrl}upload/list`)
  },
  add_marketing_task: (params) => {
    return request(`${url}addMarketingTask`, 'post', params)
  },
  count_marketing_usableNum: (params) => {
    return request(`${url}countMarketingNum`, 'get', params)
  },
  fetch_marketing_history: (params) => {
    return request(`${url}listCoupon`, 'post', params)
  },
  export_marketing_history: (params) => {
    return request(`${fileUrl}export/history`, 'get', params, {
      responseType: 'arraybuffer',
    })
  },
}
