import {get, post, request, upload} from '~/utils/fetch'
const url = 'design/'
export default {
  fetch_modules_byUser: (params) => {
    return request(`${url}getModulesByUser`, 'get', params)
  },
  fetch_risk_variable: (params) => {
    return request(`${url}field/search`, 'get', params)
  },
  fetch_risk_groups: (params) => {
    return request(`${url}fieldGroup/search`, 'get', params)
  },
  update_risk_variable: (params) => {
    return request(`${url}field/saveWithGroup`, 'post', params)
  },
  add_one_group: (params) => {
    return request(`${url}fieldGroup/save`, 'post', params)
  },
  move_risk_variable: (params) => {
    return request(`${url}field/moveGroup`, 'post', params)
  },
  delete_risk_variable: (params) => {
    return request(`${url}field/delete`, 'post', params)
  },
  test_risk_field: (params) => {
    return request(`${url}script/debug/assignment`, 'post', params)
  },
  validate_risk_script: (params) => {
    return request(`${url}script/source/validation`, 'post', params)
  },
  save_risk_variable: (params) => {
    return request(`${url}field/save`, 'post', params)
  },
  fetch_risk_ruleset_edit: (params) => {
    return request(
      `${url}ruleset/${params.moduleType}/search/editing/page`,
      'get',
      params,
    )
  },
  fetch_risk_ruleset_pro: (params) => {
    return request(
      `${url}ruleset/${params.moduleType}/search/published/page`,
      'get',
      params,
    )
  },
  fetch_risk_scoreCard_edit: (params) => {
    return request(
      `${url}scorecard/${params.moduleType}/search/editing/page`,
      'get',
      params,
    )
  },
  fetch_risk_scoreCard_pro: (params) => {
    return request(
      `${url}scorecard/${params.moduleType}/search/published/page`,
      'get',
      params,
    )
  },
  fetch_risk_matrix_edit: (params) => {
    return request(
      `${url}matrix/${params.moduleType}/search/editing/page`,
      'get',
      params,
    )
  },
  fetch_risk_matrix_pro: (params) => {
    return request(
      `${url}matrix/${params.moduleType}/search/published/page`,
      'get',
      params,
    )
  },
  fetch_risk_rulederive_edit: (params) => {
    return request(
      `${url}basicaction/${params.moduleType}/search/editing/page`,
      'get',
      params,
    )
  },
  fetch_risk_rulederive_pro: (params) => {
    return request(
      `${url}basicaction/${params.moduleType}/search/published/page`,
      'get',
      params,
    )
  },
  fetch_risk_flow_edit: (params) => {
    return request(`${url}flow/search/editing/page`, 'get', params)
  },
  fetch_risk_flow_pro: (params) => {
    return request(`${url}flow/search/published/page`, 'get', params)
  },
  add_risk_ruleset: (params) => {
    return request(`${url}ruleset/${params.moduleType}/add`, 'post', params)
  },
  add_risk_scoreCard: (params) => {
    return request(`${url}scorecard/${params.moduleType}/add`, 'post', params)
  },
  add_risk_matrix: (params) => {
    return request(`${url}matrix/${params.moduleType}/add`, 'post', params)
  },
  add_risk_flow: (params) => {
    return request(`${url}flow/add`, 'post', params)
  },
  edit_risk_ruleset: (params) => {
    return request(
      `${url}ruleset/${params.moduleType}/save/no/detail/by/id`,
      'post',
      params,
    )
  },
  edit_risk_scoreCard: (params) => {
    return request(
      `${url}scorecard/${params.moduleType}/save/no/detail/by/id`,
      'post',
      params,
    )
  },
  edit_risk_matrix: (params) => {
    return request(
      `${url}matrix/${params.moduleType}/save/no/detail/by/id`,
      'post',
      params,
    )
  },
  edit_risk_flow: (params) => {
    return request(`${url}flow/save/no/detail/by/id`, 'post', params)
  },
  update_risk_rulederive: (params) => {
    return request(
      `${url}basicaction/${params.moduleType}/prePublish`,
      'post',
      params,
    )
  },
  delete_risk_ruleset: (params) => {
    return request(`${url}ruleset/${params.moduleType}/delete`, 'post', params)
  },
  delete_risk_scoreCard: (params) => {
    return request(
      `${url}scorecard/${params.moduleType}/delete`,
      'post',
      params,
    )
  },
  delete_risk_matrix: (params) => {
    return request(`${url}matrix/${params.moduleType}/delete`, 'post', params)
  },
  delete_risk_derive: (params) => {
    return request(
      `${url}basicaction/${params.moduleType}/delete`,
      'post',
      params,
    )
  },
  delete_risk_flow: (params) => {
    return request(`${url}flow/delete`, 'post', params)
  },
  copy_risk_ruleset: (params) => {
    return request(
      `${url}ruleset/${params.moduleType}/copy/to/product`,
      'post',
      params,
    )
  },
  copy_risk_scoreCard: (params) => {
    return request(
      `${url}scorecard/${params.moduleType}/copy/to/product`,
      'post',
      params,
    )
  },
  copy_risk_matrix: (params) => {
    return request(
      `${url}matrix/${params.moduleType}/copy/to/product`,
      'post',
      params,
    )
  },
  copy_risk_derive: (params) => {
    return request(
      `${url}basicaction/${params.moduleType}/copy/to/product`,
      'post',
      params,
    )
  },
  publish_risk_ruleset: (params) => {
    return request(
      `${url}publish/${params.moduleType}/submit/ruleset`,
      'post',
      params,
    )
  },
  publish_risk_scoreCard: (params) => {
    return request(
      `${url}publish/${params.moduleType}/submit/scorecard`,
      'post',
      params,
    )
  },
  publish_risk_matrix: (params) => {
    return request(
      `${url}publish/${params.moduleType}/submit/matrix`,
      'post',
      params,
    )
  },
  publish_risk_derive: (params) => {
    return request(
      `${url}publish/${params.moduleType}/submit/basicaction`,
      'post',
      params,
    )
  },
  publish_risk_flow: (params) => {
    return request(
      `${url}publish/${params.moduleType}/submit/flow`,
      'post',
      params,
    )
  },
  fetch_risk_ruleset_detail: (params) => {
    return request(`${url}ruleset/${params.moduleType}/detail`, 'get', params)
  },
  fetch_risk_ruleset_pro_detail: (params) => {
    return request(
      `${url}ruleset/${params.moduleType}/published/detail`,
      'get',
      params,
    )
  },
  fetch_risk_scorecard_detail: (params) => {
    return request(`${url}scorecard/${params.moduleType}/detail`, 'get', params)
  },
  fetch_risk_scorecard_pro_detail: (params) => {
    return request(
      `${url}scorecard/${params.moduleType}/published/detail`,
      'get',
      params,
    )
  },
  fetch_risk_matrix_detail: (params) => {
    return request(`${url}matrix/${params.moduleType}/detail`, 'get', params)
  },
  fetch_risk_matrix_pro_detail: (params) => {
    return request(
      `${url}matrix/${params.moduleType}/published/detail`,
      'get',
      params,
    )
  },
  fetch_risk_derive_detail: (params) => {
    return request(
      `${url}basicaction/${params.moduleType}/detail`,
      'get',
      params,
    )
  },
  fetch_risk_derive_pro_detail: (params) => {
    return request(
      `${url}basicaction/${params.moduleType}/published/detail`,
      'get',
      params,
    )
  },
  fetch_risk_flow_detail: (params) => {
    return request(`${url}flow/detail`, 'get', params)
  },
  fetch_risk_flow_pro_detail: (params) => {
    return request(`${url}flow/published/detail`, 'get', params)
  },
  download_test_run: (params) => {
    return request(`${url}exec/test/template`, 'get', params)
  },
  upload_task_file: (params) => {
    return upload(params, `${url}exec/test/upload`)
  },
  set_risk_ruleset_detail_status: (params) => {
    return request(`${url}operatorLog/save`, 'post', params)
  },
  save_risk_ruleset_detail: (params) => {
    return request(`${url}ruleset/${params.moduleType}/save`, 'post', params)
  },
  save_risk_scorecard_detail: (params) => {
    return request(`${url}scorecard/${params.moduleType}/save`, 'post', params)
  },
  save_risk_matrix_detail: (params) => {
    return request(`${url}matrix/${params.moduleType}/save`, 'post', params)
  },
  save_risk_flow_detail: (params) => {
    return request(`${url}flow/save`, 'post', params)
  },
  test_run_list: (params) => {
    return request(`${url}exec/test/list`, 'get', params)
  },
  fetch_risk_actiontypes: () => {
    return request(`${url}dict/action/type`, 'get')
  },
  fetch_risk_verifystatus: () => {
    return request(`${url}dict/publish/stage`, 'get')
  },
  fetch_risk_ruleverify: (params) => {
    return request(
      `${url}publish/${params.moduleType}/search/page`,
      'get',
      params,
    )
  },
  fetch_risk_logs: (params) => {
    return request(`${url}operatorLog/search`, 'get', params)
  },
  fetch_risk_flowlist: (params) => {
    return request(`${url}flow/search`, 'get', params)
  },
  fetch_risk_deploylist: (params) => {
    return request(`${url}productFlow/search`, 'get', params)
  },
  save_risk_deploylist: (params) => {
    return request(`${url}productFlow/save`, 'post', params)
  },
  fetch_risk_diffdetail: (params) => {
    return request(
      `${url}publish/${params.moduleType}/audit/diff/detail`,
      'get',
      params,
    )
  },
  save_risk_approve_back: (params) => {
    return request(
      `${url}/publish/${params.moduleType}/return/publish`,
      'post',
      params,
    )
  },
  save_risk_approve_vertify: (params) => {
    return request(
      `${url}/publish/${params.moduleType}/audit/publish`,
      'post',
      params,
    )
  },
  fetch_risk_approve_vertifyrecord: (params) => {
    return request(
      `${url}publish/${params.moduleType}/audit/result`,
      'get',
      params,
    )
  },
  export_risk_vertifyrecord: (params) => {
    return request(
      `${url}publish/${params.moduleType}/export/selective`,
      'get',
      params,
      {
        responseType: 'arraybuffer',
      },
    )
  },
}
