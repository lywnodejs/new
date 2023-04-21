import {gwRequest} from '~/utils/fetch'
export default {
  getBranchList: (params) => {
    return gwRequest('bank.api.usermanageraccountservice.searchnetworks', [
      params,
    ])
  },
  getBranch4other: (params) => {
    return gwRequest(
      'bank.api.usermanageraccountservice.getnetworkbydepartmentid',
      [{}],
    )
  },
  getNetworkDepartmentTree: (params) => {
    return gwRequest(
      'bank.api.usermanageraccountservice.getnetworkdepartmenttree',
      [{}],
    )
  },

  editBranchItem: (params) => {
    const methodName = params.id
      ? 'bank.api.usermanageraccountservice.editnetwork'
      : 'bank.api.usermanageraccountservice.addnetwork'
    return gwRequest(methodName, [params])
  },
  deleteBranch: (id) => {
    return gwRequest('bank.api.usermanageraccountservice.deletenetwork', [{id}])
  },
  getManagerList: (params) => {
    return gwRequest(
      'bank.api.usermanageraccountservice.searchallusermanager',
      [params],
    )
  },
  editManagerItem: (params) => {
    const methodName = params.id
      ? 'bank.api.usermanageraccountservice.updatemanages'
      : 'bank.api.usermanageraccountservice.insertmanages'
    return gwRequest(methodName, [params])
  },
  deleteManager: (id) => {
    return gwRequest('bank.api.usermanageraccountservice.deletemanages', [{id}])
  },
  updateManagerStatus: (params) => {
    return gwRequest('bank.api.usermanageraccountservice.updatemanagesstatus', [
      params,
    ])
  },

  getOrders: (params) => {
    return gwRequest('bank.api.usermanageraccountservice.searchorders', [
      params,
    ])
  },
  getUsers: (params = {}) => {
    return gwRequest(
      'bank.api.usermanageraccountservice.getusermanageraccounttree',
      [params],
    )
  },
  updateAssign: (params) => {
    return gwRequest('bank.api.usermanageraccountservice.giveordertouser', [
      params,
    ])
  },
  getNetWorks: (params) => {
    return gwRequest('bank.api.branchnetworkservice.getnetworklist', [params])
  },
  getAchievementByNetwork: (params) => {
    return gwRequest(
      'bank.api.newusermanagerachievementservice.getachievementbynetwork',
      [params],
    )
  },
  getAchievementByManager: (params) => {
    return gwRequest(
      'bank.api.newusermanagerachievementservice.getachievementbymanager',
      [params],
    )
  },
  getManagerByNetworkId: (params) => {
    return gwRequest(
      'bank.api.usermanageraccountservice.getmanagerbynetworkid',
      [params],
    )
  },
  getTaskList: (params) => {
    return gwRequest(
      'bank.api.distributestatisticsservice.distributestatistics',
      [params],
    )
  },
  exportTaskData: (params) => {
    return gwRequest('bank.api.distributestatisticsservice.statisticsexport', [
      params,
    ])
  },
  getNetwork4report: () => {
    return gwRequest(
      'bank.api.newusermanagerachievementservice.getnetworklist',
      [{}],
    )
  },
  getProduct4report: (params) => {
    return gwRequest(
      'bank.api.newusermanagerachievementservice.getproductlist',
      [params],
    )
  },
  exportReportData: (params) => {
    return gwRequest(
      'bank.api.newusermanagerachievementservice.statisticsexport',
      [params],
    )
  },
  getDepart4select: () => {
    return gwRequest(`bank.api.usermanageraccountservice.getdepartmentlist`, [
      {},
    ])
  },
}
