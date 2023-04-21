import fetch from '~/utils/fetch'

export default {
  // 获取分组信息
  getGroup: () => {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getgroups',
    )
  },
  // 获取基础指标列表
  getNormBase(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.searchbykey',
      [{...params, indicatorsType: 'base'}],
    )
  },
  // 编辑基础指标
  editBaseNormById(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.save',
      [{...params, type: 'base'}],
    )
  },
  // 删除基础指标
  deleteBaseNormById(id) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.delete',
      [id],
    )
  },
  // 获取指标最后调用时间
  getBaseNormUseTime(id) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getlastcalltime',
      [id],
    )
  },
  // 接口数据源
  getDataSourceByHttp(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcemanagehttpservice.search',
      [params],
    )
  },
  // sql数据源 DataSourceSqlManageService.search
  getDataSourceBySql(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcesqlmanageservice.search',
      [params],
    )
  },
  // 左侧json或者sql tree
  getData4left(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getleftdata',
      [params],
    )
  },
  // 获取已配置指标
  getNormConfig(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getindicators',
      [params],
    )
  },
  // 获取分组信息
  getGroups() {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getgroups',
      [],
    )
  },
  // 添加分组
  addGroupByName(groupName) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.addgroup',
      [groupName],
    )
  },
  // 保存指标
  saveBaseNormConfig(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.save',
      [params],
    )
  },
  // 批量保存指标
  saveBaseNormConfig4all(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.saveall',
      [{indicatorsManageRequest: params}],
    )
  },
  // 批量保存指标
  getParams4sql() {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getalldefaultparams',
      [],
    )
  },
  runSql(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.runsql',
      [params],
    )
  },
  getConfigResult(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.geteditsuccessresult',
      [params],
    )
  },
  // 获取衍生指标列表
  getNormDerivative(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.searchbykey',
      [{...params, indicatorsType: 'derivative'}],
    )
  },
  // 获取人行指标列表
  getNormBankData(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.ind.rhdbindmanageservice.getlist',
      [{...params}],
    )
  },
}
