import fetch from '~/utils/fetch'

export default {
  getDataSourceByHttp(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcemanagehttpservice.search',
      [params],
    )
  },
  getDataSourceBySql(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcesqlmanageservice.search',
      [params],
    )
  },
  addDataSourceByHttp(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcemanagehttpservice.insert',
      [params],
    )
  },
  addDataSourceBySql(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcesqlmanageservice.insert',
      [params],
    )
  },
  getDataSourceById(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcemanagehttpservice.getbyid',
      [params],
    )
  },
  getDataSqlById(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcesqlmanageservice.getbyid',
      [params],
    )
  },
  updateDataSourceByHttp(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcemanagehttpservice.update',
      [params],
    )
  },
  updateDataSqlByHttp(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcesqlmanageservice.update',
      [params],
    )
  },
  deleteDataSourceByHttp(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcemanagehttpservice.delete',
      [params],
    )
  },
  deleteDataSqlByHttp(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcesqlmanageservice.delete',
      [params],
    )
  },
  testDataSourceByHttp(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcemanagehttpservice.executerequest',
      [params],
    )
  },
  testDataSqlByHttp(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcesqlmanageservice.testconnect',
      [params],
    )
  },
  getIndicatorsCountById(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcemanagehttpservice.getindicatorscountbyid',
      [params],
    )
  },
  getIndicatorsSqlCountById(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.datasourcesqlmanageservice.getindicatorscountbyid',
      [params],
    )
  },
  getIndicatorsFromDataSource(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.searchbykey',
      [params],
    )
  },
  getGroup: () => {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getgroups',
    )
  },
  getLastCallTime(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getlastcalltime',
      [params],
    )
  },
  deleteIndicatorsById(params) {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.delete',
      [params],
    )
  },
  getAllDefaultParams: () => {
    return fetch(
      'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getalldefaultparams',
    )
  },
}
