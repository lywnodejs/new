import {get, post, request} from '~/utils/fetch'
export default {
  fetch_capital_list: (params) => {
    return post(`core/asset/protection/query`, params)
  },
  fetch_capital_detail: (params) => {
    return get(`core/asset/protection/detail`, params)
  },
  fetch_interest_deduction: (params) => {
    return get(`core/asset/protection/interest/query`, params)
  },
  fetch_add_deduction: (params) => {
    return post(`core/asset/protection/interest/reduction`, params)
  },
  fetch_verify_deduction: (params) => {
    return post(`core/asset/protection/interest/reduction/examine`, params)
  },
  fetch_record_deduction: (params) => {
    return post(`core/asset/file/query`, params)
  },
  //导出检查
  fetch_cheek_export: (params) => {
    return post(`core/asset/file/export/cheek`, params)
  },
  //导出文件生成
  fetch_export_list: (params) => {
    return post(`core/asset/file/export`, params)
  },
  //导出记录下载
  fetch_export_downLoad: (params) => {
    return get(`core/asset/file/export/download`, params)
  },
  //上传校验
  fetch_cheek_import: (params) => {
    return post(`core/asset/file/excel/upload/cheek`, params)
  },
  //导入记录下载
  fetch_export_downLoad: (params) => {
    return get(`/core/asset/file/import/download`, params)
  },
  //导入文件生成
  fetch_import_list: (params) => {
    return post(`core/asset/file/excel/upload`, params)
  },
}
