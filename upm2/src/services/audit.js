import request, { postJSON } from '../utils/request';

const fetchConfig = () => {
  return request('/auditlog/list/config');
}

const fetchApplyConfig = () => {
  return request('/common/get/enummap');
}

const fetchAuditlog = (params) => {
  return request('/auditlog/list/auditlog', {params});
}

const fetchAuditApplyLog = (params) => {
  return request('/auditlog/apply/list', {params});
}

export {
  fetchConfig,
  fetchApplyConfig,
  fetchAuditlog,
  fetchAuditApplyLog
}