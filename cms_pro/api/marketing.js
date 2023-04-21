import {c_request, c_upload} from '~/utils/fetch'
const url = 'coupon/'
const fileUrl = 'coupon/file/'
export default {
  fetch_marketing_ticket: (params) => {
    return c_request(`${url}listMarketingLimitConfig`, 'post', params)
  },
  add_marketing_ticket: (params) => {
    return c_request(`${url}addMarketingLimitConfig`, 'post', params)
  },
  edit_marketing_ticket: (params) => {
    return c_request(`${url}updateMarketingLimitConfig`, 'post', params)
  },
  vertify_marketing_ticket: (params) => {
    return c_request(`${url}updateMarketingByAudit`, 'post', params)
  },
  fetch_marketing_task: (params) => {
    return c_request(`${url}getMarketingTaskList`, 'post', params)
  },
  edit_marketing_task: (params) => {
    return c_request(`${url}updateMarketingTask`, 'post', params)
  },
  upload_marketing_list: (params) => {
    // debugger
    return c_upload(params, `${fileUrl}upload/list`)
  },
  add_marketing_task: (params) => {
    return c_request(`${url}addMarketingTask`, 'post', params)
  },
  count_marketing_usableNum: (params) => {
    return c_request(`${url}countMarketingNum`, 'get', params)
  },
  fetch_marketing_history: (params) => {
    return c_request(`${url}listCoupon`, 'post', params)
  },
  export_marketing_history: (params) => {
    return c_request(`${fileUrl}export/history`, 'get', params, {
      responseType: 'arraybuffer',
    })
  },
}
