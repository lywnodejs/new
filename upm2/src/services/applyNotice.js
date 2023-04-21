import request, { postJSON } from '../utils/request';

// for mock test
// const mockPrefix = 'http://mock.xiaojukeji.com/mock/596';

const mockPrefix = '';

/**
 * 查询所有配置
 * @appId {Number} 用户所属系统 id
 * @appIdRel {Number} 配置所属子系统 id
 * @configName {String} 配置名称
 * @page {Number} 当前第几页
 * @size {Number} 每页有几条
 */
const searchAllNotice = (params) => {
  return request(mockPrefix+ '/v2/configMgmt/find/list', { params });
};

/**
 * 查询单一配置
 * @appId {Number} 用户所属系统 id
 * @configId {Number} 配置 id
 */
const searchOneNotice = ({appId, configId}) => {
  let params = {
    appId,
    configId
  };
  return request(mockPrefix+ '/v2/configMgmt/findDetail', { params });
};

/**
 * 获取默认配置
 * @appId {Number} 用户所属系统 id
 * @appIdRel {Number} 目标系统 id
 */
const getDefaultNotice = ({appId, appIdRel}) => {
  let params = {
    appId,
    appIdRel
  };
  return request(mockPrefix+ '/v2/configMgmt/findDefault', { params });
};

/**
 * 删除配置
 * @appId {Number} 系统 id
 * @configId {Number} 配置 id
 */
const delNotice = ({appId, configId}) => {
  return postJSON(mockPrefix+ '/v2/configMgmt/remove', {
    appId,
    configId
  }, {
    silent: false
  });
};

/**
 * 新增配置
 * @appId {Number} 系统 id
 * @appIdRel {Number} 用户所选择的用于创建配置的子系统 id
 * @name {String} 配置名称
 * @default {Boolean} 是否默认配置
 * @content {String} 配置内容
 */
const newNotice = (data) => {
  return postJSON(mockPrefix+ '/v2/configMgmt/add', {...data}, {
    silent: false
  });
};

/**
 * 更新配置
 * @appId {Number} 系统 id
 * @appIdRel {Number} 用户所选择的用于创建配置的子系统 id
 * @name {String} 配置名称
 * @default {Boolean} 是否默认配置
 * @content {String} 配置内容
 */
const updateNotice = (data) => {
  return postJSON(mockPrefix+ '/v2/configMgmt/modify', {...data}, {
    silent: false
  });
};

export {
  searchAllNotice,
  searchOneNotice,
  getDefaultNotice,
  delNotice,
  newNotice,
  updateNotice,
};