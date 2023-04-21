import fetch, {get, post, request, pie} from '~/utils/fetch'
export default {
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  get_core_index: (params) => {
    return fetch(
      `fincloud.engine.facade.service.statistics.statcallcountservice.querycallcount`,
      [params],
    )
  },
  get_monitoring_info: (params) => {
    return fetch(
      `fincloud.engine.facade.service.statistics.statcallcountservice.querymonitoringinfo`,
      [params],
    )
  },
  get_call_query: (params) => {
    return fetch(
      `fincloud.engine.facade.service.statistics.statcallcountservice.querystatcalldetaillist`,
      [params],
    )
  },
  get_result_pie: (params) => {
    console.log('params', params)
    return fetch(
      `fincloud.engine.facade.service.statistics.statcallcountservice.querytotalcount`,
      [params],
    )
  },
  get_result_rejection: (params) => {
    return fetch(
      `fincloud.engine.facade.service.statistics.statcallcountservice.queryrejectscount`,
      [params],
    )
  },
  get_input_parameter: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.execresultfdservice.execinfo`,
      [params],
    )
  },
  get_node_list: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.execresultfdservice.getresultnodetypelist`,
      [params],
    )
  },
  get_rules_list: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.execresultfdservice.getresultrulelist`,
      [params],
    )
  },
}
