import _ from 'lodash';
import moment from 'moment';
import {
  getPackageCountries,
  getCategoriesByCountry,
  getPackageByCondition,
  getPermissionsByPackageId,
  addPackage,
  fetchWorkflow,
  fetchWorkflowByResource
} from '../services/packageApply';
import { searchOneNotice } from '../services/packageNotice';

const buildParams = (params, username) => {
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
    remark: params.remark,
    // 自己申请 type=1，代他人申请 type=2
    type: params.isApplyForOthers ? 2 : 1,
    userNames,
    expireTime: params.expireTime
      ? params.expireTime.valueOf()
      : moment()
          .add(365, 'days')
          .valueOf(),
    packageId: params.packageId
  };

  return data;
};
// const DEFAULT_PARAMS = {
//   isApplyForOthers: false,
//   username: null,
//   country: 'China',
//   categoryId: '',
//   packageId: '',
//   expireTime: null,
//   remark: '',
//   expireTime: moment().add(1, 'year')
// };
const initialState = {
  packageCountries: [],
  packageCategories: [],
  packageList: [],
  params: {
    isApplyForOthers: false,
    username: null,
    country: 'China',
    categoryId: '',
    packageId: '',
    expireTime: null,
    remark: '',
    expireTime: moment().add(1, 'year')
  },
  workflow: {},
  permissions: [],
  loading: {},
  introduce: ''
};

export default {
  namespace: 'packageApply',

  state: _.cloneDeep(initialState),

  effects: {
    // UPM礼包所有对应国家
    *getPackageCountries({ payload }, { put, call }) {
      const packageCountries = yield call(getPackageCountries, payload);
      yield put({ type: 'save', payload: { packageCountries } });
    },

    // UPM国家对应的所有分类
    *getCategoriesByCountry({ payload }, { put, call }) {
      const packageCategories = yield call(getCategoriesByCountry, payload);
      yield put({ type: 'save', payload: { packageCategories } });
    },

    // 根据分类+国家获取对应礼包
    *getPackageByCondition({ payload }, { put, call }) {
      const packageList = yield call(getPackageByCondition, payload);
      yield put({ type: 'save', payload: { packageList } });
    },

    // 根据礼包Id获取对应权限
    *getPermissionsByPackageId({ payload }, { put, call }) {
      // try {
      const permissions = yield call(getPermissionsByPackageId, payload);
      yield put({ type: 'save', payload: { permissions } });
      //   return {
      //     success: true,
      //     permissions
      //   }
      // } catch (error) {
      //   return {
      //     success: false
      //   }
      // }
    },

    // 申请
    *addPackage({}, { call, select }) {
      const { params } = yield select(state => state.packageApply);
      const { username } = yield select(state => state.userInfo);
      const data = buildParams(params, username);

      try {
        const result = yield call(addPackage, data);
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

    // 获取审批流
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

    // 获取审批流组
    *fetchWorkflowGroup({ payload }, { call, put }) {
      let workflow = [];
      yield put({ type: 'loading', payload: { loadingWorkflow: true } });

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
          // _.each(role, ({ value, isGroup }) => {
          //   if (isGroup) {
          //     roleGroupIds.push(value);
          //   } else {
          _.each(role, value => {
            roleIds.push(value);
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
            dataIds.push(item);
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
        }
      }

      yield put({ type: 'save', payload: { workflow } });
      yield put({ type: 'loading', payload: { loadingWorkflow: false } });
    },

    *fetchCategoryIntroduce({ payload }, { call, put }) {
      const introduce = yield call(searchOneNotice, payload);

      yield put({
        type: 'save',
        payload: {
          introduce
        }
      });
    }
  },

  reducers: {
    reset() {
      return _.cloneDeep(initialState);
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
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

    updateParams(state, { payload }) {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload
        }
      };
    }
  }
};
