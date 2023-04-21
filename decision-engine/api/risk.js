import fetch, {get, post, request, upload} from '~/utils/fetch'
const url = 'design/'
export default {
  fetch_modules_byUser: (params) => {
    return request(`${url}getModulesByUser`, 'get', params)
  },
  fetch_risk_variable: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.fieldfdservice.search`,
      [params],
    )
  },
  fetch_risk_groups: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.fieldgpfdservice.search`,
      [params],
    )
  },
  update_risk_variable: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.fieldfdservice.savewithgroup`,
      [params],
    )
  },
  add_one_group: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.fieldgpfdservice.save`,
      [params],
    )
  },
  move_risk_variable: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.fieldfdservice.movegroup`,
      [params],
    )
  },
  delete_risk_variable: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.fieldfdservice.delete`,
      [params],
    )
  },
  test_risk_field: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.scriptfdservice.debugwithassignment`,
      [params],
    )
  },
  validate_risk_script: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.scriptfdservice.sourcevalidate`,
      [params],
    )
  },
  save_risk_variable: (params) => {
    return fetch(`fincloud.engine.facade.service.design.fieldfdservice.save`, [
      params,
    ])
  },
  fetch_risk_ruleset_edit: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.rulesetfdservice.searcheditingpage`,
      [params],
    )
  },
  fetch_risk_ruleset_pro: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.rulesetfdservice.searchpublishedpage`,
      [params],
    )
  },
  fetch_risk_scoreCard_edit: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.scorecardfdservice.searcheditingpage`,
      [params],
    )
  },
  fetch_risk_scoreCard_pro: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.scorecardfdservice.searchpublishedpage`,
      [params],
    )
  },
  fetch_risk_matrix_edit: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.matrixfdservice.searcheditingpage`,
      [params],
    )
  },
  fetch_risk_matrix_pro: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.matrixfdservice.searchpublishedpage`,
      [params],
    )
  },
  fetch_risk_rulederive_edit: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.basicactionfdservice.searcheditingpage`,
      [params],
    )
  },
  fetch_risk_rulederive_pro: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.basicactionfdservice.searchpublishedpage`,
      [params],
    )
  },
  fetch_risk_flow_edit: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.flowfdservice.searcheditingpage`,
      [params],
    )
  },
  fetch_risk_flow_pro: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.flowfdservice.searchpublishedpage`,
      [params],
    )
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
    return fetch(
      `fincloud.engine.facade.service.design.basicactionfdservice.save`,
      [params],
    )
  },
  delete_risk_ruleset: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.rulesetfdservice.deletelist`,
      [params],
    )
  },
  delete_risk_scoreCard: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.scorecardfdservice.deletelist`,
      [params],
    )
  },
  delete_risk_matrix: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.matrixfdservice.deletelist`,
      [params],
    )
  },
  delete_risk_derive: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.basicactionfdservice.deletelist`,
      [params],
    )
  },
  delete_risk_flow: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.flowfdservice.deletelist`,
      [params],
    )
  },
  copy_risk_ruleset: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.rulesetfdservice.copytoproduct`,
      [params],
    )
  },
  copy_risk_scoreCard: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.scorecardfdservice.copytoproduct`,
      [params],
    )
  },
  copy_risk_matrix: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.matrixfdservice.copytoproduct`,
      [params],
    )
  },
  copy_risk_derive: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.basicactionfdservice.copytoproduct`,
      [params],
    )
  },
  publish_risk_ruleset: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.submitruleset`,
      [params],
    )
  },
  publish_risk_scoreCard: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.submitscorecard`,
      [params],
    )
  },
  publish_risk_matrix: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.submitmatrix`,
      [params],
    )
  },
  publish_risk_derive: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.submitbasicaction`,
      [params],
    )
  },
  publish_risk_flow: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.submitflow`,
      [params],
    )
  },
  fetch_risk_ruleset_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.rulesetfdservice.geteditingdetail`,
      [params],
    )
  },
  fetch_risk_ruleset_pro_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.rulesetfdservice.getpublisheddetail`,
      [params],
    )
  },
  fetch_risk_scorecard_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.scorecardfdservice.geteditingdetail`,
      [params],
    )
  },
  fetch_risk_scorecard_pro_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.scorecardfdservice.getpublisheddetail`,
      [params],
    )
  },
  fetch_risk_matrix_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.matrixfdservice.geteditingdetail`,
      [params],
    )
  },
  fetch_risk_matrix_pro_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.matrixfdservice.getpublisheddetail`,
      [params],
    )
  },
  fetch_risk_derive_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.basicactionfdservice.geteditingdetail`,
      [params],
    )
  },
  fetch_risk_derive_pro_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.basicactionfdservice.getpublisheddetail`,
      [params],
    )
  },
  fetch_risk_flow_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.flowfdservice.geteditingdetail`,
      [params],
    )
  },
  fetch_risk_flow_pro_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.flowfdservice.getpublisheddetail`,
      [params],
    )
  },
  download_test_run: (params) => {
    return request(`${url}exec/test/template`, 'get', params)
  },
  upload_task_file: (params) => {
    return upload(`/${url}exec/test/upload`, params)
  },
  set_risk_ruleset_detail_status: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.operatorlogfdservice.save`,
      [params],
    )
  },
  save_risk_ruleset_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.rulesetfdservice.saverulesetwithrulelist`,
      [params],
    )
  },
  save_risk_scorecard_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.scorecardfdservice.savescorecardwithrulelist`,
      [params],
    )
  },
  save_risk_matrix_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.matrixfdservice.savematrixwithrulelist`,
      [params],
    )
  },
  save_risk_flow_detail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.flowfdservice.saveflowwithrulelist`,
      [params],
    )
  },
  test_run_list: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.enginetestexecfdservice.list`,
      [params],
    )
  },
  fetch_risk_actiontypes: () => {
    return fetch(
      `fincloud.engine.facade.service.design.datadictfdservice.actiontypelist`,
    )
  },
  fetch_risk_verifystatus: () => {
    return fetch(
      `fincloud.engine.facade.service.design.datadictfdservice.publishstagelist`,
    )
  },
  fetch_risk_ruleverify: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.searchpage`,
      [params],
    )
  },
  fetch_risk_logs: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.operatorlogfdservice.search`,
      [params],
    )
  },
  fetch_risk_flowlist: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.flowfdservice.searchpublishedpage`,
      [params],
    )
  },
  fetch_risk_deploylist: (params) => {
    return fetch(
      `fincloud.engine.facade.service.biz.flowreffdservice.getbyproduct`,
      [params],
    )
  },
  save_risk_deploylist: (params) => {
    return fetch(`fincloud.engine.facade.service.biz.flowreffdservice.save`, [
      params,
    ])
  },
  fetch_risk_diffdetail: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.publishdifflist`,
      [params],
    )
  },
  save_risk_approve_back: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.returnpublish`,
      [params],
    )
  },
  save_risk_approve_vertify: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.auditpublish`,
      [params],
    )
  },
  fetch_risk_approve_vertifyrecord: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.stpublishfdservice.auditresultdetail`,
      [params],
    )
  },
  export_risk_vertifyrecord: (params) => {
    return request(`${url}publish/export/selective`, 'get', params, {
      responseType: 'arraybuffer',
    })
  },
  fetch_risk_vartypelist: (params) => {
    return fetch(
      `fincloud.engine.facade.service.design.datadictfdservice.vartypelist`,
      [params],
    )
  },
}
