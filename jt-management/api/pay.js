import {post} from '~/utils/fetch'
export default {
  getPayChannelList: (params) => {
    return post(`fund/sec/query/payChannelList`, params)
  },
  getPayChannelConfig: (params) => {
    return post(`fund/sec/query/payChannelRelaList`, params)
  },
  editPayChannelConfig: (params) => {
    let url = params.id
      ? 'fund/sec/update/fundPayRela'
      : 'fund/sec/add/fundPayRela'
    return post(url, params)
  },
}
