import _ from 'lodash';

import request, { postJSON } from '../utils/request';
import { postJSON as monitorPostJSON } from '../utils/monitorRequest';
import { getDimensionDetail } from './dimension';

const defaultParams = {
  appId: 888
};

const fetchRoleList = function*(appId) {
  const role = yield request('/role/list/all', {
    params: { appId }
  });

  // TODO 国际化
  return _.map(role, ({ id, commonName, nameZh, name, labelName }) => ({
    label: commonName || nameZh || name,
    value: id,
    labelName
  }));
};

// 获取角色资源列表新
const fetchRoleListNew = params => {
  return request('/v2/nopermission/role/list', { params });
};

// 获取标识位资源列表
const fetchFlagList = params => {
  return request('/v2/nopermission/flag/list', { params });
};

// 获取系统的提示信息
// ***已弃用，用 src/services/applyNotice.js 里面的 getDefaultNotice 代替
const fetchAppIntroduce = function(appId) {
  return request('/v2/nopermission/app/introduce', { params: { appId } });
};

// 获取指定产品线的角色列表
const fetchProductLineRoleList = function*(params) {
  const role = yield request('/v2/productLine/role/list', { params });

  // TODO 国际化
  return _.map(role, ({ id, nameZh, name }) => ({
    label: nameZh || name,
    value: id
  }));
};

const fetchRoleGroupList = function*(appId) {
  const roleGroup = yield request('/rolegroup/list/all', {
    params: { appId }
  });

  return _.map(roleGroup, ({ id, commonName, nameZh, name }) => ({
    label: commonName || nameZh || name,
    value: id
  }));
};

const fetchStrategyList = (appId, roles) => {
  if (_.isEmpty(roles)) {
    return [];
  }

  const roleIdlist = [];
  const roleGroupIdList = [];
  _.each(roles, ({ value, isGroup }) => {
    if (isGroup) {
      roleGroupIdList.push(value);
    } else {
      roleIdlist.push(value);
    }
  });

  return postJSON('/v2/strategy/findStrByRoles', {
    appId,
    roleIds: roleIdlist,
    groupIds: roleGroupIdList
  });
};

// 遍历 root 树形结构，规范数据格式，存一个id=>option的idMap
// 做法类似于 utils/treeUtil.js:patchNodeParent
const formatDimension = root => {
  const idMap = {};
  if (!root) {
    return { root, idMap };
  }

  const patchParent = (node, parent) => {
    const { id, dimeNodeKey, dimeNodeName } = node;
    node.parent = parent;
    node.value = id;
    node.label = dimeNodeName;
    node.key = dimeNodeKey;

    idMap[id] = node;

    _.each(node.children, child => patchParent(child, node));
  };
  _.each(root, node => patchParent(node, null));

  return { root, idMap };
};

const fetchDimensionOptions = function*(appId, id) {
  /*
  const dimension = {
    label: '地域',
    name: 'area',
    options: [
      {
        value: 1, label: '澳大利亚',
        children: [{
          value: 11, label: 11,
          children: [{
            value: 111, label: 111,
            children: [{
              value: 1111, label: 1111,
            }, {
              value: 1112, label: 1112
            }]
          }]
        }]
      }, {
        value: 2, label: 2,
      }, {
        value: 3, label: 3,
        children: [{
          value: 31, label: 31,
        }, {
          value: 32, label: 32, disabled: true,
        }, {
          value: 33, label: 33,
          children: [{
            value: 331, label: 331,
          }, {
            value: 332, label: 332,
          }]
        }]
      }, {
        value: 4, label: 4,
        children: [{
          value: 41, label: 41,
          children: [{
            value: 411, label: 411
          }]
        }]
      }, {
        value: 5, label: 5,
      }, {
        value: 6, label: 6,
      }, {
        value: 7, label: 7,
      }, {
        value: 8, label: 8,
        children: [
          { value: '81', label: '81' },
          { value: '82', label: '82' },
          { value: '83', label: '83' },
          { value: '84', label: '84' },
          { value: '85', label: '85' },
          { value: '86', label: '86' },
          { value: '87', label: '87' },
          { value: '88', label: '88' },
          { value: '89', label: '80' },
          { value: '81a', label: '81a' },
          { value: '81b', label: '81b' },
          { value: '81c', label: '81c' },
          { value: '81d', label: '81d' },
          { value: '81e', label: '81e' },
          { value: '81f', label: '81f' },
          { value: '81g', label: '81g' },
          { value: '81h', label: '81h' },
          { value: '81i', label: '81i' },
          { value: '81j', label: '81j' },
        ]
      }
    ],
  };
  */

  const dimension = yield getDimensionDetail(appId, id);
  const { root, idMap } = formatDimension(dimension);

  return {
    idMap,
    dimension: {
      id: id,
      options: root
    }
  };
};

// 根据选择的角色，获取对应角色的审批流（不同用户的审批流可能不一样）
const fetchWorkflow = (appId, userNames, roleIds, roleGroupIds) => {
  return postJSON('/v2/apply/getworkflows', {
    appId,
    userNames,
    roleIds,
    roleGroupIds
  });
};

const fetchWorkflowForecast = payload => {
  return postJSON('/v2/apply/getworkflows/forecast', payload, {
    returnAll: true
  });
};

// 根据选择的角色，获取对应角色的审批流（不同用户的审批流可能不一样）
const fetchWorkflowGroup = payload => {
  return postJSON('/v2/apply/getworkflows', payload);
};

const fetchWorkflowByResource = (
  appId,
  userNames,
  dataIds,
  applyTypeIsFlag,
  applyTypeIsArea
) => {
  let params = null;
  if (applyTypeIsFlag) {
    params = {
      appId,
      userNames,
      flagIds: dataIds
    };
  } else if (applyTypeIsArea) {
    params = {
      appId,
      userNames,
      areaIds: dataIds
    };
  } else {
    params = {
      appId,
      userNames,
      dataIds
    };
  }
  return postJSON('/v2/apply/getworkflows', params);
};
const sendApplyNps = () => {
  return postJSON('/apply/feedback/recordDisplay');
};
// 用户发起申请
const addApply = data => {
  return postJSON('/v2/apply/add', data);
};

// 获取用户申请的详情（一般用来复制申请）
const fetchApplyInfo = applyId => {
  return postJSON('/v2/user/apply/infoforcopy', {
    applyId
  });
};

// 获取用于已经有的 角色-策略-维度 数据
const getRoleStrategyDimension = (appId, userId) => {
  return postJSON('/v2/user/getUsersBindRoleAndGroup', {
    appId,
    userId
  });
};

// 直接给用户赋值权限，不用走申请逻辑，参数格式跟addApply一致
const addRoleStrategyDimension = data => {
  return postJSON('/v2/user/bindroleanddime', data);
};

// 获取子系统产品线列表
const fetchProductLine = params => {
  return request('/v2/productLine/query', { params });
};

// 获取产品线的资源类型
const fetchResourceType = params => {
  return request('/v2/productLine/type', { params });
};

//获取已选城市
const getUserAreas = data => {
  return request('/v2/apply/getUserAreas', { params: data });
};

// 获取资源类型所对应得资源
const fetchResourceList = params => {
  return request('/v2/resource/query', { params });
};

// 获取从bigdata跳到upm之后的初始数据
const fetchInitialFieldsValue = params => {
  return request('/v2/bigdata/resource/bigdatainfo', { params });
};

const fetchInitialRoleValue = params => {
  return request('/v2/nopermission/getRole', { params });
};

const fetchInitialFlagValue = params => {
  return request('/v2/nopermission/getFlag', { params });
};

const fetchInitialValue = params => {
  return request('/v2/apply/applyOwn', { params });
};

const fetchInitialValueWithIdentifyings = params => {
  return request('/v2/apply/applyAgain', { params });
};

const fetchRoleLabelList = params => {
  return request('/v2/nopermission/role/labelList', { params });
};

const fetchProjectList = params => {
  return request('/v2/resource/getCertainAttrValues', { params });
};

const fetchSiteList = () => {
  return request('/business/get/allSites');
};

const postMonitorPermissions = data => {
  return monitorPostJSON('/v2/privilegeGroup/monitor/bindUsers', data, {
    params: Object.assign({}, defaultParams)
  });
};

const fetchMonitorWorkFlow = data => {
  return monitorPostJSON('/v2/privilegeGroup/monitor/findWorkflow', data, {
    params: Object.assign({}, defaultParams)
  });
};

const recommendFlags = params => {
  return request('/v2/data/recommendFlags', { params });
};

export {
  fetchRoleList,
  fetchRoleListNew,
  fetchRoleGroupList,
  fetchStrategyList,
  fetchDimensionOptions,
  fetchWorkflow,
  fetchWorkflowForecast,
  fetchWorkflowGroup,
  fetchWorkflowByResource,
  addApply,
  sendApplyNps,
  fetchApplyInfo,
  getRoleStrategyDimension,
  addRoleStrategyDimension,
  fetchProductLine,
  fetchResourceType,
  fetchResourceList,
  fetchInitialFieldsValue,
  fetchProductLineRoleList,
  getUserAreas,
  fetchAppIntroduce,
  fetchFlagList,
  fetchInitialRoleValue,
  fetchInitialFlagValue,
  fetchInitialValue,
  fetchInitialValueWithIdentifyings,
  fetchRoleLabelList,
  fetchSiteList,
  fetchProjectList,
  postMonitorPermissions,
  fetchMonitorWorkFlow,
  recommendFlags
};
