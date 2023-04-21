/**
 * 申请新权限
 */

import _ from 'lodash';
import moment from 'moment';
import { MAIN } from '@routes/config';
import { routerRedux } from 'dva/router';

import {
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
} from '../services/newApply';

import { getDefaultNotice } from '@services/applyNotice';

// 根据标识符来动态获取id
const getIdByIdentifying = (list, identifying) => {
  const data = _.filter(list, item => item.identifying == identifying)[0];
  return data ? data.id : -1;
};

// 将 state.params 构造成后端需要的结构，用于提交表单
const buildParams = (
  params,
  strategyList,
  groupRoleMap,
  username,
  resourceTypeList,
  reset
) => {
  // 根据用户选择的角色、策略、维度，来填充 roles
  let roles = [];
  // 如果role有值说明是从url上带的值
  if (reset && !_.isEmpty(params.role)) {
    params.resourceType = ['role'];
  }
  _.each(params.resourceType, resourceType => {
    const applyTypeIsRole = resourceType == 'role' || !resourceType;

    if (resourceType == 'area') {
      // 申请类型是地区
      roles = roles.concat(
        params['resource_' + resourceType].map(r => ({
          refId: r,
          type: 4,
          businessId: params.businessId + ''
        }))
      );
    } else if (!applyTypeIsRole) {
      // 申请类型不是角色
      _.each(params['resource_' + resourceType], resource => {
        const refId = resource.value;
        let type = 5;

        switch (resourceType) {
          case 'bigdata_report':
            type = 8;
            break;
          case 'bigdata_extraction_tool':
            type = 10;
            break;
          case 'bigdata_indicator':
            type = 9;
            break;
          case 'wide_table': // 服务化宽表
            type = 14;
            break;
          case 'tableau_workbook':
            type = 11;
            break;
          case 'woater_monitor':
            type = 15;
            break;
          case 'bigdata_data_set':
            type = 16;
            break;
          default:
            type = 5;
            break;
        }
        // if (resourceType == getIdByIdentifying(resourceTypeList, 'bigdata_report')) {
        //   type = 8;
        // } else if (resourceType == getIdByIdentifying(resourceTypeList, 'bigdata_extraction_tool')) {
        //   type = 10;
        // } else if (resourceType == getIdByIdentifying(resourceTypeList, 'bigdata_indicator')) {
        //   type = 9;
        // } else if (resourceType == getIdByIdentifying(resourceTypeList, 'tableau_workbook')) {
        //   type = 11;
        // }
        const item = {
          refId,
          type
        };
        roles.push(item);
      });
    } else {
      // 申请类型是角色
      if (reset && !_.isEmpty(params.role)) {
        // do nothing
      } else if (
        params['resource_' + resourceType] &&
        params['resource_' + resourceType].length
      ) {
        params.role = params['resource_' + resourceType].map(r => {
          r.isGroup = false;
          return r;
        });
      }
      _.each(params.role, ({ value, isGroup, businessId }) => {
        let roleIds = [];
        let refId = value;
        // 如果是组，则展开下面所有的角色，并且剔除掉params.role中已经包括的
        if (isGroup) {
          _.each(groupRoleMap[value], (groupId, roleId) => {
            if (!params.role[roleId]) {
              roleIds.push(roleId);
            }
          });
        } else {
          roleIds = [value];
        }

        // 遍历所有角色（可能是角色组展开的）
        _.each(roleIds, value => {
          const dimeNodeList = [];
          _.each(params.strategy[value], (dimension, tagId) => {
            _.each(dimension, selectedDimensionNode => {
              _.each(selectedDimensionNode, (checked, dimeNodeId) => {
                dimeNodeList.push({
                  tagId,
                  dimenodeId: dimeNodeId
                });
              });
            });
          });

          const strategy = _.find(
            strategyList,
            ({ roleId }) => roleId == value
          );

          const item = {
            refId: refId,
            // 1为角色组，2为角色
            type: isGroup ? 1 : 2,
            dimeNodeList,
            // 有的角色不需要配策略，这里做判断
            strategyId: !_.isEmpty(strategy) ? strategy.strategyDto.id : null,
            productId: params.businessLine,
            typeId: getIdByIdentifying(resourceTypeList, resourceType),
            businessId: businessId + ''
          };

          roles.push(item);
        });
      });
    }
  });

  let userNames = [];

  if (_.isArray(params.username)) {
    userNames = params.username.map(userObj => userObj.label); // 通过下拉选择
  } else {
    userNames = _.split(params.username, ',');
  }

  // 不是帮别人申请时，则使用sso的username
  if (!params.isApplyForOthers) {
    userNames = [username];
  }

  const data = {
    appId: params.appId,
    roles,
    remark: params.reason,
    areaList: Object.keys(params.region ? params.region : {}).map(i =>
      Number(i)
    ),
    // 自己申请 type=1，代他人申请 type=2
    type: params.isApplyForOthers ? 2 : 1,
    userNames,
    expireTime: params.expireTime
      ? params.expireTime.valueOf()
      : moment()
          .add(365, 'days')
          .valueOf(),
    opt: params.opt
  };

  return data;
};

const buildParamsForecast = (
  username,
  resourceType,
  params,
  strategyList,
  groupRoleMap,
  resourceTypeList,
  reset
) => {
  // 根据用户选择的角色、策略、维度，来填充 roles
  let roles = [];
  // 如果role有值说明是从url上带的值
  if (reset && !_.isEmpty(params.role)) {
    params.resourceType = ['role'];
  }
  const applyTypeIsRole = resourceType == 'role' || !resourceType;

  if (resourceType == 'area') {
    // 申请类型是地区
    roles = roles.concat(
      params['resource_' + resourceType].map(r => ({
        refId: r,
        type: 4,
        businessId: params.businessId + ''
      }))
    );
  } else if (!applyTypeIsRole) {
    // 申请类型不是角色
    _.each(params['resource_' + resourceType], resource => {
      const refId = resource.value;
      let type = 5;

      switch (resourceType) {
        case 'bigdata_report':
          type = 8;
          break;
        case 'bigdata_extraction_tool':
          type = 10;
          break;
        case 'bigdata_indicator':
          type = 9;
          break;
        case 'wide_table': // 服务化宽表
          type = 14;
          break;
        case 'tableau_workbook':
          type = 11;
          break;
        case 'woater_monitor':
          type = 15;
          break;
        case 'bigdata_data_set':
          type = 16;
          break;
        default:
          type = 5;
          break;
      }
      const item = {
        refId,
        type
      };
      roles.push(item);
    });
  } else {
    // 申请类型是角色
    if (reset && !_.isEmpty(params.role)) {
      // do nothing
    } else if (
      params['resource_' + resourceType] &&
      params['resource_' + resourceType].length
    ) {
      params.role = params['resource_' + resourceType].map(r => {
        r.isGroup = false;
        return r;
      });
    }
    _.each(params.role, ({ value, isGroup, businessId }) => {
      let roleIds = [];
      let refId = value;
      // 如果是组，则展开下面所有的角色，并且剔除掉params.role中已经包括的
      if (isGroup) {
        _.each(groupRoleMap[value], (groupId, roleId) => {
          if (!params.role[roleId]) {
            roleIds.push(roleId);
          }
        });
      } else {
        roleIds = [value];
      }

      // 遍历所有角色（可能是角色组展开的）
      _.each(roleIds, value => {
        const dimeNodeList = [];
        _.each(params.strategy[value], (dimension, tagId) => {
          _.each(dimension, selectedDimensionNode => {
            _.each(selectedDimensionNode, (checked, dimeNodeId) => {
              dimeNodeList.push({
                tagId,
                dimenodeId: dimeNodeId
              });
            });
          });
        });

        const strategy = _.find(strategyList, ({ roleId }) => roleId == value);

        const item = {
          refId: refId,
          // 1为角色组，2为角色
          type: isGroup ? 1 : 2,
          dimeNodeList,
          // 有的角色不需要配策略，这里做判断
          strategyId: !_.isEmpty(strategy) ? strategy.strategyDto.id : null,
          productId: params.businessLine,
          typeId: getIdByIdentifying(resourceTypeList, resourceType),
          businessId: businessId + ''
        };

        roles.push(item);
      });
    });
  }

  const data = {
    appId: params.appId,
    roles,
    // remark: params.reason,
    areaList: Object.keys(params.region ? params.region : {}).map(i =>
      Number(i)
    ),
    // 自己申请 type=1，代他人申请 type=2
    type: params.isApplyForOthers ? 2 : 1,
    userNames: [username],
    // expireTime: params.expireTime ? params.expireTime.valueOf() : moment().add(365, 'days').valueOf(),
    opt: params.opt
  };

  return data;
};

const initialState = {
  loading: {},
  params: {
    // 申请的子系统
    appId: null,
    // 申请人
    username: null,
    // 申请的角色
    role: {},
    // 申请角色所 编辑的策略
    strategy: {},
    // 申请理由
    reason: '',
    // 是否帮别人申请
    isApplyForOthers: false,
    // 产品线
    productLine: '',
    // 资源类型
    resourceType: [],
    // 资源
    resource: [],
    businessId: '',
    opt: [1],
    //
    groupType: 0,
    expireTime: moment().add(1, 'year')
  },
  // 角色组到角色的 所属关系map
  groupRoleMap: {},
  // 可选的角色列表
  roleOptions: {},
  // 可选的策略列表
  strategyList: [],
  // 生产线列表
  productLineList: [],
  // 生产线资源类型列表
  resourceTypeList: [],
  resourceTypeObj: {},
  // 生产线资源列表
  resourceList: [],
  // 维度的 树形结构数据
  dimensionOptions: {},
  // 维度的 树形结构 转化后的 id => option 格式的map
  dimensionIdMap: {},
  // 表单初始数据
  initialFieldsValue: {},
  roleLabelList: [],
  siteList: [],
  projectList: [],
  // 是否是批量代申请，状态存入model
  isBatchForUserSelector: false
  // initialRoleValue: {},
  // initialFlagValue: {},
};

export default {
  namespace: 'newApply',

  state: _.cloneDeep(initialState),

  subscriptions: {
    setup({ dispatch }) {
      // dispatch({
      //   type: 'fetch',
      // });
    }
  },

  effects: {
    *getAreas(
      {
        payload: { appId, businessId }
      },
      { call, put }
    ) {
      yield put({
        type: 'getUserAreas',
        payload: { appId, businessId }
      });

      const list = yield call(getAreaList, {
        businessId,
        appId
      });

      const { root, idMap } = formatAreasForInputTag(list);

      yield put({
        type: 'save',
        payload: {
          allAreas: root,
          areaIdMap: idMap
        }
      });
    },
    *getUserAreas(
      {
        payload: { appId, businessId }
      },
      { call, put }
    ) {
      const list = yield call(getUserAreas, { appId, businessId });

      yield put({
        type: 'save',
        payload: {
          areas: list
        }
      });
    },
    *fetchAppIntroduce({ payload }, { call, put }) {
      const introduce = yield call(getDefaultNotice, payload);

      yield put({
        type: 'save',
        payload: {
          introduce
        }
      });
    },
    *fetchSiteList({}, { call, put }) {
      const siteList = yield call(fetchSiteList);

      yield put({
        type: 'save',
        payload: {
          siteList
        }
      });
    },
    *fetchProjectList(
      {
        payload: { appId, attrName, attrValue }
      },
      { call, put }
    ) {
      const projectList = yield call(fetchProjectList, {
        appId,
        attrName,
        attrValue
      });

      yield put({
        type: 'save',
        payload: {
          projectList
        }
      });
    },
    *fetchRoleListNew({ payload }, { call, put }) {
      const { params } = payload;
      const {
        page = 1,
        size = 10,
        resourceTypeId = '',
        resourceName = '',
        resourceKey = '',
        businessId = '',
        appId,
        labelId = '',
        type = '',
        id = '',
        nameZh = ''
      } = params;
      const resourceList = yield call(fetchRoleListNew, {
        appId,
        page,
        size,
        resourceName,
        resourceKey,
        resourceTypeId,
        businessId,
        labelId,
        type,
        id,
        nameZh
      });
      yield put({
        type: 'save',
        payload: { appId, resourceList }
      });
    },
    *fetchFlagList({ payload }, { call, put }) {
      const { params } = payload;
      const {
        page = 1,
        size = 10,
        resourceTypeId = '',
        resourceName = '',
        resourceKey = '',
        businessId = '',
        appId,
        permissionId = '',
        permissionName = ''
      } = params;
      const resourceList = yield call(fetchFlagList, {
        appId,
        page,
        size,
        resourceName,
        resourceKey,
        resourceTypeId,
        businessId,
        permissionId,
        permissionName
      });
      yield put({
        type: 'save',
        payload: { appId, resourceList }
      });
    },
    *fetchRoleList({ payload }, { call, put }) {
      const { appId } = payload;

      // 清空已经选择的role
      yield put({ type: 'updateParams', payload: { role: undefined } });
      // 清空strategy
      yield put({ type: 'save', payload: { strategyList: undefined } });

      yield put({ type: 'loading', payload: { loadingRole: true } });

      const [role, roleGroup] = yield [
        call(fetchRoleList, appId),
        call(fetchRoleGroupList, appId)
      ];

      yield put({
        type: 'saveRole',
        payload: {
          roleOptions: {
            role,
            roleGroup
          }
        }
      });

      yield put({ type: 'loading', payload: { loadingRole: false } });
    },
    *fetchRoleLabelList({ payload }, { call, put }) {
      const roleLabelList = yield call(fetchRoleLabelList, payload);

      yield put({
        type: 'save',
        payload: { roleLabelList }
      });
    },
    *fetchProductLineRoleList({ payload }, { call, put }) {
      const { appId, productLine } = payload;

      // 清空已经选择的role
      yield put({ type: 'updateParams', payload: { role: undefined } });
      // 清空strategy
      yield put({ type: 'save', payload: { strategyList: undefined } });

      yield put({ type: 'loading', payload: { loadingRole: true } });

      const [role, roleGroup] = yield [
        call(fetchProductLineRoleList, { appId, productLineId: productLine }),
        call(fetchRoleGroupList, appId)
      ];

      yield put({
        type: 'saveRole',
        payload: {
          roleOptions: {
            role,
            roleGroup
          }
        }
      });

      yield put({ type: 'loading', payload: { loadingRole: false } });
    },

    *fetchStrategyList({ payload }, { call, put, select }) {
      const { role } = payload;
      const { params, groupRoleMap } = yield select(state => state.newApply);
      const { appId } = params;

      yield put({ type: 'loading', payload: { loadingStrategy: true } });

      const strategyList = yield call(fetchStrategyList, appId, role);
      const { roleStrategyOutDto, groupRoles } = strategyList;
      const newGroupRoleMap = { ...groupRoleMap };
      // 填充 角色与角色组的映射关系
      _.each(groupRoles, ({ groupId, roleId }) => {
        newGroupRoleMap[groupId] = newGroupRoleMap[groupId] || {};
        newGroupRoleMap[groupId][roleId] = groupId;
      });

      yield put({
        type: 'save',
        payload: {
          strategyList: roleStrategyOutDto,
          groupRoleMap: newGroupRoleMap
        }
      });
      yield put({ type: 'loading', payload: { loadingStrategy: false } });

      const dimensionIdList = [];
      _.each(roleStrategyOutDto, ({ tagDimeList }) => {
        _.each(tagDimeList, ({ dimeDtoList }) => {
          dimensionIdList.push(..._.map(dimeDtoList, ({ id }) => id));
        });
      });
      yield put({
        type: 'fetchDimension',
        payload: {
          appId,
          // id 去重一下
          dimensionIdList: _.uniq(dimensionIdList)
        }
      });
    },

    *fetchDimension({ payload }, { call, put, select }) {
      const { appId, dimensionIdList } = payload;
      const { dimensionOptions } = yield select(state => state.newApply);

      for (let id of dimensionIdList) {
        // 已经加载了，则不重复加载
        if (dimensionOptions[id]) {
          continue;
        }
        const { dimension, idMap } = yield call(
          fetchDimensionOptions,
          appId,
          id
        );
        yield put({
          type: 'saveDimension',
          payload: { [id]: dimension }
        });
        yield put({
          type: 'saveDimensionIdMap',
          payload: { [id]: idMap }
        });
      }
    },

    *fetchWorkflow({ payload }, { call, put }) {
      const { appId, role, username, resource, applyTypeIsFlag } = payload;

      yield put({ type: 'loading', payload: { loadingWorkflow: true } });
      const roleIds = [];
      const dataIds = [];
      const roleGroupIds = [];
      const userNames = _.split(username, ',');
      let workflow = {};
      if (role) {
        _.each(role, ({ value, isGroup }) => {
          if (isGroup) {
            roleGroupIds.push(value);
          } else {
            roleIds.push(value);
          }
        });
        workflow = yield call(
          fetchWorkflow,
          appId,
          userNames,
          roleIds,
          roleGroupIds
        );
      } else if (resource) {
        _.each(resource, item => {
          dataIds.push(item.value);
        });
        workflow = yield call(
          fetchWorkflowByResource,
          appId,
          userNames,
          dataIds,
          applyTypeIsFlag
        );
      }

      yield put({ type: 'save', payload: { workflow } });
      yield put({ type: 'loading', payload: { loadingWorkflow: false } });
    },

    *fetchWorkflowForecast({ payload }, { call, put, select }) {
      yield put({
        type: 'loading',
        payload: { loadingWorkflowForecast: true }
      });
      const {
        workflowItem: { username, resourceType }
      } = payload;
      const {
        params,
        strategyList,
        groupRoleMap,
        resourceTypeList
      } = yield select(state => state.newApply);
      // const { username } = yield select(state => state.userInfo);
      let data = buildParamsForecast(
        username,
        resourceType,
        params,
        strategyList,
        groupRoleMap,
        resourceTypeList
      );
      // resourceAdmins safetyReviewer 外提
      if (
        params.resourceType[0] == 'woater_monitor' &&
        params.resource_woater_monitor
      ) {
        if (
          params.resource_woater_monitor[0] &&
          params.resource_woater_monitor[0].resourceAdmins
        ) {
          data['resourceAdmins'] =
            params.resource_woater_monitor[0].resourceAdmins;
        }
        if (
          params.resource_woater_monitor[0] &&
          params.resource_woater_monitor[0].safetyReviewer
        ) {
          data['safetyReviewer'] =
            params.resource_woater_monitor[0].safetyReviewer;
        }
      }
      data.appId *= 1;

      try {
        const response = yield call(fetchWorkflowForecast, data);
        yield put({
          type: 'loading',
          payload: { loadingWorkflowForecast: false }
        });
        return {
          success: true,
          result: response
        };
      } catch (error) {
        yield put({
          type: 'loading',
          payload: { loadingWorkflowForecast: false }
        });
        return {
          success: false,
          result: error.message
        };
      }
    },

    *fetchMonitorWorkflow(
      {
        payload: {
          username,
          type,
          groupIds,
          expireAt,
          reason,
          customPrivileges
        }
      },
      { call, put }
    ) {
      yield put({ type: 'loading', payload: { loadingWorkflow: true } });

      const res = yield call(fetchMonitorWorkFlow, {
        usernames: username,
        type,
        groupIds,
        expireAt,
        reason,
        customPrivileges
      });

      yield put({ type: 'save', payload: { workflow: res } });
      yield put({ type: 'loading', payload: { loadingWorkflow: false } });
    },

    *fetchWorkflowGroup({ payload }, { call, put }) {
      // let pars = [];
      let workflow = [];
      yield put({ type: 'loading', payload: { loadingWorkflow: true } });
      // _.each(payload, (item) => {

      try {
        for (let i = 0, len = payload.length; i < len; i++) {
          const item = payload[i];
          const {
            appId,
            role,
            username,
            resource,
            applyTypeIsFlag,
            type,
            applyTypeIsArea
          } = item;

          const roleIds = [];
          const dataIds = [];
          const roleGroupIds = [];
          const userNames = _.split(username, ',');
          if (role) {
            _.each(role, ({ value, isGroup }) => {
              if (isGroup) {
                roleGroupIds.push(value);
              } else {
                roleIds.push(value);
              }
            });
            let w = yield call(
              fetchWorkflow,
              appId,
              userNames,
              roleIds,
              roleGroupIds
            );
            _.each(w, i => {
              i.type = type;
            });
            workflow = workflow.concat(w);
            // pars.push({appId, userNames, roleIds, roleGroupIds});
          } else if (applyTypeIsArea) {
            _.each(resource, item => {
              dataIds.push(item);
            });
            let w = yield call(
              fetchWorkflowByResource,
              appId,
              userNames,
              dataIds,
              applyTypeIsFlag,
              applyTypeIsArea
            );
            _.each(w, i => {
              i.type = type;
            });
            workflow = workflow.concat(w);
          } else if (resource) {
            _.each(resource, item => {
              dataIds.push(item.value);
            });
            let w = yield call(
              fetchWorkflowByResource,
              appId,
              userNames,
              dataIds,
              applyTypeIsFlag
            );
            _.each(w, i => {
              i.type = type;
            });
            workflow = workflow.concat(w);
            // pars.push({appId, userNames, dataIds, applyTypeIsFlag});
          }
        }
        // workflow = yield call(fetchWorkflowGroup, pars);

        yield put({ type: 'save', payload: { workflow } });
        yield put({ type: 'loading', payload: { loadingWorkflow: false } });

        return {
          success: true
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    // 发起申请
    *addApply(action, { call, select }) {
      const {
        params,
        strategyList,
        groupRoleMap,
        resourceTypeList
      } = yield select(state => state.newApply);
      const { username } = yield select(state => state.userInfo);
      let data = buildParams(
        params,
        strategyList,
        groupRoleMap,
        username,
        resourceTypeList
      );
      // resourceAdmins safetyReviewer 外提
      if (
        params.resourceType[0] == 'woater_monitor' &&
        params.resource_woater_monitor
      ) {
        if (
          params.resource_woater_monitor[0] &&
          params.resource_woater_monitor[0].resourceAdmins
        ) {
          data['resourceAdmins'] =
            params.resource_woater_monitor[0].resourceAdmins;
        }
        if (
          params.resource_woater_monitor[0] &&
          params.resource_woater_monitor[0].safetyReviewer
        ) {
          data['safetyReviewer'] =
            params.resource_woater_monitor[0].safetyReviewer;
        }
      }
      data.appId *= 1;
      // data.businessId = params.businessId || (params.resource_role && params.resource_role[0] && params.resource_role[0].businessId)
      yield call(sendApplyNps, data);
      try {
        const result = yield call(addApply, data);
        if (result) {
          return {
            success: false,
            result: result,
            error: true
          };
        } else {
          return {
            success: true,
            result: result
          };
        }
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    // 管理端直接给用户赋值权限时，需要获取当前用户现在已经有的各种权限数据
    // 这里异步获取，并且自动同步到表单
    *fetchAllDataOnUser({ payload }, { call, put }) {
      const { appId, username, userId } = payload;
      yield put({
        type: 'updateParams',
        payload: {
          appId,
          username
        }
      });

      const detail = yield call(getRoleStrategyDimension, appId, userId);
      yield put({
        type: 'initForm',
        payload: { detail }
      });
    },

    // 用户端复制已经提交的申请，需要获取某一个申请的详细内容
    // 这里异步获取，并且自动同步到表单
    *fetchApplyData({ payload }, { call, put }) {
      const { applyId, record } = payload;

      yield put({
        type: 'updateParams',
        payload: {
          ...record,
          reason: record.remark
        }
      });

      const detail = yield call(fetchApplyInfo, applyId);
      yield put({
        type: 'initForm',
        payload: { detail }
      });
      yield put({
        type: 'redirect',
        payload: { detail, record }
      });
    },

    *redirect({ payload }, { put }) {
      const { detail, record } = payload;
      const { resourceDtos, areaIdList, businessId } = detail;
      const { applyType, appId } = record;
      const item = resourceDtos[0];
      let url = `${MAIN}`;
      switch (applyType * 1) {
        case 2: //角色
        case 7: //数据
          url +=
            '/new-apply' +
            (applyType == 2
              ? '/'
              : '/' + item.resourceTypeName + '/' + item.resourceKey);
          break;
        case 4: //地区权限
          url +=
            '/apply-area-permission/' +
            appId +
            '?areaList=' +
            areaIdList.join() +
            '&businessId=' +
            businessId;
          break;
      }

      yield put(routerRedux.push(url));
    },

    *initForm({ payload }, { put }) {
      const { detail } = payload;
      const role = {};
      _.each(
        detail.roles,
        r =>
          (role[r.id] = {
            value: r.id,
            label: r.nameZh,
            isGroup: false
          })
      );
      _.each(
        detail.roleGroups,
        rg =>
          (role[rg.id] = {
            value: rg.id,
            label: rg.nameZh,
            isGroup: true
          })
      );
      // 获取已选角色的 策略
      yield put({
        type: 'fetchStrategyList',
        payload: { role }
      });
      // 填充 角色表单
      yield put({
        type: 'updateParams',
        payload: { role }
      });

      const strategy = {};
      _.each(detail.userTags, ({ roleId, tagDimes }) => {
        const role = {};
        strategy[roleId] = role;

        _.each(tagDimes, ({ tagId, dimes }) => {
          const tag = {};
          role[tagId] = tag;

          _.each(dimes, ({ dimeId, nodes }) => {
            const dime = {};
            tag[dimeId] = dime;

            _.each(nodes, ({ dimeNodeId }) => {
              dime[dimeNodeId] = true;
            });
          });
        });
      });
      // 填充 策略表单
      yield put({
        type: 'updateParams',
        payload: { strategy }
      });
    },

    // 直接给用户赋值权限，不走审批逻辑
    *addRoleWithoutApply({ payload }, { call, select }) {
      const { userId } = payload;
      const {
        params,
        strategyList,
        groupRoleMap,
        resourceTypeList
      } = yield select(state => state.newApply);
      const { username } = yield select(state => state.userInfo);
      const data = buildParams(
        params,
        strategyList,
        groupRoleMap,
        username,
        resourceTypeList,
        true
      );
      // 增加userId 这个参数
      data.userId = userId;

      try {
        const result = yield call(addRoleStrategyDimension, data);
        return {
          success: true,
          result
        };
      } catch (error) {
        return {
          success: false,
          result: error.message
        };
      }
    },

    *fetchProductLine({ payload }, { call, put, select }) {
      const { appId } = payload;
      const productLineList = yield call(fetchProductLine, { appId });
      yield put({
        type: 'save',
        payload: { productLineList }
      });
    },

    *fetchResourceType({ payload }, { call, put }) {
      const { appId } = payload;
      const resourceTypeList = yield call(fetchResourceType, { appId });
      const resourceTypeObj = resourceTypeList.reduce((total, curr) => {
        total[curr.identifying] = curr;
        return total;
      }, {});
      yield put({
        type: 'save',
        payload: { resourceTypeList, resourceTypeObj }
      });
    },

    *fetchResourceList({ payload }, { call, put }) {
      yield put({ type: 'loading', payload: { loadingResourceList: true } });
      const { params } = payload;
      const {
        page = 1,
        size = 10,
        resourceTypeId = '',
        resourceName = '',
        resourceKey = '',
        businessId = '',
        appId,
        dataApp = '',
        site = '',
        projectName = '',
        resourceIds = []
      } = params;
      const resourceList = yield call(fetchResourceList, {
        appId,
        page,
        size,
        resourceName,
        resourceKey,
        resourceTypeId,
        businessId,
        dataApp,
        site,
        projectName,
        resourceIds
      });

      yield put({
        type: 'save',
        payload: { appId, resourceList, page }
      });
      yield put({ type: 'loading', payload: { loadingResourceList: false } });
    },

    // 获取从bigdata跳到upm之后的表单初始数据
    *fetchInitialFieldsValue({ payload }, { call, put }) {
      const { appId, type, resourceKey } = payload;
      const initialFieldsValue = yield call(fetchInitialFieldsValue, {
        appId,
        type,
        resourceKey
      });
      yield put({
        type: 'save',
        payload: { initialFieldsValue }
      });
    },

    *fetchInitialRoleValue({ payload }, { call, put }) {
      const initialRoleValue = yield call(fetchInitialRoleValue, payload);
      yield put({
        type: 'save',
        payload: { initialFieldsValue: initialRoleValue }
      });
    },

    *fetchInitialFlagValue({ payload }, { call, put }) {
      const initialFlagValue = yield call(fetchInitialFlagValue, payload);
      yield put({
        type: 'save',
        payload: { initialFieldsValue: initialFlagValue }
      });
    },

    *fetchInitialValue({ payload }, { call, put }) {
      const initialValue = yield call(fetchInitialValue, payload);
      yield put({
        type: 'save',
        payload: { initialFieldsValue: initialValue }
      });
    },

    *fetchInitialValueWithIdentifyings({ payload }, { call, put }) {
      const initialValue = yield call(
        fetchInitialValueWithIdentifyings,
        payload
      );
      yield put({
        type: 'save',
        payload: { initialFieldsValue: initialValue }
      });
    },

    *setToStrategyApp({ payload }, { call, put }) {
      const { appId, id } = payload;
      yield put({
        type: 'updateParams',
        payload: { appId }
      });
    },

    *setParams({ payload }, { call, put }) {
      yield put({
        type: 'updateParams',
        payload: payload
      });
    },

    *setToStrategyRole({ payload }, { call, put }) {
      yield put({
        type: 'updateRole',
        payload
      });
    },

    *fetchFastApplyToStrategyList({ payload }, { select }) {
      const { params } = yield select(state => state.newApply);
      return params.role;
    },

    *monitorApply(
      {
        payload: {
          username,
          expireAt,
          reason,
          type,
          groupIds,
          customPrivileges
        }
      },
      { call }
    ) {
      return yield call(postMonitorPermissions, {
        usernames: username,
        expireAt,
        reason,
        type,
        groupIds,
        customPrivileges
      });
    },
    *recommendFlags({ payload }, { call }) {
      return yield call(recommendFlags, payload);
    }
  },

  reducers: {
    reset() {
      return _.cloneDeep(initialState);
    },
    updateParams(state, { payload }) {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload
        }
      };
    },
    updateParamStrategy(state, { payload }) {
      let { strategy } = state.params;
      strategy = {
        ...strategy,
        ...payload
      };

      return {
        ...state,
        params: {
          ...state.params,
          strategy
        }
      };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveRole(state, { payload }) {
      return { ...state, ...payload };
    },

    loading(state, { payload }) {
      return {
        ...state,
        loading: {
          ...state.loading,
          ...payload
        }
      };
    },

    saveDimension(state, { payload }) {
      return {
        ...state,
        dimensionOptions: {
          ...state.dimensionOptions,
          ...payload
        }
      };
    },
    saveDimensionIdMap(state, { payload }) {
      return {
        ...state,
        dimensionIdMap: {
          ...state.dimensionIdMap,
          ...payload
        }
      };
    },
    updateRole(state, { payload }) {
      let role = {};
      state.roleOptions.role.forEach(i => {
        if (i.value === payload.id) {
          role = i;
          role.idGroup = false;
        }
      });
      return {
        ...state,
        params: {
          ...state.params,
          role: {
            [role.value]: role
          }
        }
      };
    }
  }
};
