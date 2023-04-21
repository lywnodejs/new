import {get, post, request} from '~/utils/fetch'
export default {
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  //信审开关设置
  fetch_updateSwitch: (params) => {
    return post(`creditConfig/updateCreditSwitch`, params)
  },
  fetch_switchList: (params) => {
    return get(`creditConfig/queryCreditSwitch`, params)
  },
  //信审策略设置
  fetch_updateStrategy: (params) => {
    return post(`creditConfig/updateCreditStrategy`, params)
  },
  fetch_strategyList: (params) => {
    return get(`creditConfig/queryCreditStrategy`, params)
  },
  //绩效考核设置
  fetch_assessmentList: (params) => {
    return get(`creditConfig/queryCreditAssessConfig`, params)
  },
  fetch_updateAssessment: (params) => {
    return post(`creditConfig/updateCreditAssessConfig`, params)
  },
  fetch_personnel_list: (params) => {
    return get(`creditConfig/queryCreditRoleInfo`, params)
  },
  fetch_updateStatus_list: (params) => {
    return post(`creditConfig/updateCreditRoleStatus`, params)
  },
  //信审列表
  fetch_creditOrder_list: (params) => {
    return get(`creditverify/getCreditOrder`, params)
  },
  //详情
  fetch_creditDetail_list: (params) => {
    return get(`creditverify/detail/getCreditOrderDetailBase`, params)
  },
  //人员分配
  fetch_userTrees_list: (params) => {
    return get(`creditverify/userTrees`, params)
  },

  //信审结果查询
  fetch_getResult_detail: (params) => {
    return get(`creditverify/detail/getResult`, params)
  },

  fetch_reject_code: (params) => {
    return get(`creditverify/getRejectCode`, params)
  },

  fetch_remark_status: (params) => {
    return get(`creditverify/detail/getMemo`, params)
  },

  fetch_firstCredit_update: (params) => {
    return post(`creditverify/firstCredit`, params)
  },
  fetch_reviewCredi_update: (params) => {
    return post(`creditverify/reviewCredit`, params)
  },
  fetch_finishCredit_update: (params) => {
    return post(`creditverify/finishCredit`, params)
  },

  fetch_firstCredit_stash: (params) => {
    return post(`creditverify/stash`, params)
  },
  fetch_firstCredit_orderReturn: (params) => {
    return post(`creditverify/orderReturn`, params)
  },
  //查看详情
  fetch_risk_detail: (params) => {
    return get(`creditverify/detail/getRiskDetail`, params)
  },
  //绩效考核列表
  fetch_credit_statAssess: (params) => {
    return get(`creditverify/statAssess`, params)
  },
  fetch_assess_update: (params) => {
    return get(`creditverify/downStatAssess`, params)
  },

  //发送短信
  fetch_sendSms_send: (params) => {
    return get(`creditverify/detail/sendSms`, params)
  },

  //信审委案列表
  fetch_credit_verifyOrder: (params) => {
    return get(`creditverify/getCreditVerifyOrder`, params)
  },
  //检查个数
  fetch_overdueAlloc_list: (params) => {
    return get(`collection/getNewOrders`, params)
  },

  //处理中统计
  fetch_report_processing: (params) => {
    return get(`creditverify/statVerifying`, params)
  },

  //已结案统计
  fetch_report_finish: (params) => {
    return get(`creditverify/statFinish`, params)
  },

  //分配提交
  fetch_assign_update: (params) => {
    return post(`creditverify/assign`, params)
  },

  //新增联系人接口
  fetch_linkman_update: (params) => {
    return post(`creditverify/detail/updateLinkman`, params)
  },

  //结案列表
  fetch_over_case: (params) => {
    return get(`creditverify/getCreditVerifyOrderHis`, params)
  },

  //下户调查
  fetch_creditSurvey_update: (params) => {
    return post(`creditverify/creditSurvey`, params)
  },
  //备注
  fetch_creditRemark_update: (params) => {
    return post(`creditverify/creditRemark`, params)
  },
  //标蓝
  fetch_creditBlue_update: (params) => {
    return post(`creditverify/creditBlue`, params)
  },

  //查询产品单数
  fetch_countOrder: (params) => {
    return get(`creditverify/countOrder`, params)
  },

  //风险决策详情
  fetch_risk_peopleDetail: (params) => {
    return get(`creditverify/detail/getRiskDetail`, params)
  },

  //通讯录
  fetch_risk_getContactList: (params) => {
    return get(`creditverify/detail/getContactList`, params)
  },
}
