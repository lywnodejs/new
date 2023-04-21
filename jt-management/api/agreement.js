import {get, postForm, request} from '~/utils/fetch'
import {gwRequest} from '~/utils/fetch'
export default {
  get_data_dict: (type) => {
    return get(`dataDictionary/${type}`)
  },
  fetch_agreement_list: (params) => {
    return request(`loanSignatureTemplate/search`, 'get', params)
  },
  download_agreement_list: (params) => {
    return request(`loanSignatureTemplate/download`, 'post', params)
  },
  update_agreement_item: (params) => {
    return request(`loanSignatureTemplate/save`, 'post', params)
  },
  fetch_agreement_signature: (params) => {
    return request(`loanSignature/search`, 'get', params)
  },
  get_file_base64: (params) => {
    return request(`napi/file-base64`, 'get', params)
  },
  getTemplateList: (params) => {
    return gwRequest('bank.api.agreementsignatureservice.gettemplatelist', [
      params,
    ])
  },
  getEnableTemplateList: (params) => {
    return gwRequest(
      'bank.api.agreementsignatureservice.queryenabletemplatelist',
      [params],
      true,
    )
  },
  changeTempStatus: (params) => {
    return gwRequest(
      'bank.api.agreementsignatureservice.updatetemplatestatus',
      [params],
    )
  },
  getTemplateDetail: (id) => {
    return gwRequest('bank.api.agreementsignatureservice.gettemplatedetail', [
      {id},
    ])
  },
  // 获取文档模板编辑页标签
  getTemplateLabel: (type) => {
    return gwRequest('bank.api.agreementsignatureservice.getdictionarylist', [
      {type},
    ])
  },
  addTemplate: (params) => {
    return gwRequest('bank.api.agreementsignatureservice.addtemplate', [params])
  },
  updateTemplate: (params) => {
    return gwRequest('bank.api.agreementsignatureservice.updatetemplate', [
      params,
    ])
  },
  previewTemplate: (params) => {
    return gwRequest('bank.api.agreementsignatureservice.viewtemplate', [
      params,
    ])
  },
  getAppType: () => {
    return gwRequest('bank.api.agreementenumservice.getapplicationmap')
  },
  getAllPage: () => {
    return gwRequest('bank.api.agreementenumservice.getpositionmap')
  },
  getAgreementList: (params) => {
    return gwRequest(
      'bank.api.agreementsignatureservice.getsignatureagreementlist',
      [params],
    )
  },
  changeAgreementStatus: (params) => {
    return gwRequest(
      'bank.api.agreementsignatureservice.updateagreementstatus',
      [params],
    )
  },
  previewAgreement: (id) => {
    return gwRequest('bank.api.agreementsignatureservice.viewagreement', [{id}])
  },
  // bank.api.agreementenumservice.getsignnodemap
  getSignNode: () => {
    return gwRequest('bank.api.agreementenumservice.getsignnodemap')
  },
  addAgreement: (params) => {
    return gwRequest('bank.api.agreementsignatureservice.addagreement', [
      params,
    ])
  },
  updateAgreement: (params) => {
    return gwRequest('bank.api.agreementsignatureservice.updateagreement', [
      params,
    ])
  },
  downloadAgreement: (ids) => {
    return gwRequest(
      'bank.api.agreementsignatureservice.agreementbranchdownload',
      [{ids}],
    )
  },
  getSignAgreementList: (params) => {
    return gwRequest(
      'bank.api.agreementsignatureservice.getsignaturerecordlist',
      [params],
    )
  },
  downloadSignAgreement: (ids) => {
    return gwRequest(
      'bank.api.agreementsignatureservice.recordbranchdownload',
      [{ids}],
    )
  },
  getStatusList: () => {
    return gwRequest('bank.api.agreementenumservice.getstatusmap', [{}])
  },
  uploadData: (data) => {
    return gwRequest('bank.api.agreementsignatureservice.agreementimgupload', [
      data,
    ])
  },
}
