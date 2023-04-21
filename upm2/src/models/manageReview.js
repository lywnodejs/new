import {
  getList,
  fetchPermissionCount,
  fetchPermissionList,
  permissionClose,
  getDept,
  addReview,
  startReview,
  getReviewDetail,
  getReviewManagers,
  notice,
  getReviewAppList,
  deleteReview,
  refreshReview,
  copyReview,
  permissionReviewShow,
  fetchReviewHistory,
  permissionReviewEdit,
  approveNotice
} from '../services/manageReview';
import { getAppBindedBusiness,getAppBindedBusinessAll } from '../services/admin';
import { fetchRoleListNew, fetchFlagList } from '../services/newApply';
import { getQueryList, getBusiness, getDataType } from '../services/dataResource'

const PAGE_SIZE = 20;

export default {

  namespace: 'manageReview',

  state: {
    list: [],
    permission: {},
    loading: false,
    permissionData: [],
    departments: [],
    reviewObj:{},
    appbindedbusiness: [],
    appbindedbusinessAll:[],
    resourceList: [],
    // reviewAppList: []
    // reviewDetail: {}
  },

  effects: {

    *showEdit( {payload} , { put }){
      yield put({
        type: 'save',
        payload: {
          reviewObj:payload
        }
      });
    },
    *fetch({ payload }, { call, put }){
      const list = yield call(getList, {
        size: 20,
        ...payload
      })

      yield put({
        type: 'save',
        payload: {
          list
        }
      })
    },
    *editPermissionReview({ payload }, { call, put }){
      try {
        const result = yield call(permissionReviewEdit, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },
    *getPermissionReviewShow({ payload }, { call, put }){
      const data = yield call(permissionReviewShow, {
        ...payload
      });
      return data;
      // yield put({
      //   type: 'save',
      //   payload: {
      //     data
      //   }
      // });
    },
    *fetchHistory({ payload }, { call, put }){
      const list = yield call(fetchReviewHistory, {
        size: 20,
        ...payload
      });
      yield put({
        type: 'save',
        payload: {
          list
        }
      });
    },

    *fetchDept({ payload }, { call, put }) {
      const { word } = payload;
      const data = yield call(getDept, { word });
      yield put({
        type: 'save',
        payload: {departments: data}
      });
    },
    *saveDept({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {departments: payload}
      });
    },
    *fetchPermission({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const { appId, username } = payload;
      const permission = yield call(fetchPermissionCount, {appId: appId || 888, username});

      yield put({
        type: 'save',
        payload: {
          permission,
          loading: false
        },
      });
    },

    *fetchPermissionList({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true
        }
      });

      const data = yield call(fetchPermissionList, {
        ...payload,
        size: PAGE_SIZE
      });

      yield put({
        type: 'save',
        payload: {
          permissionData: data,
          loading: false
        }
      });
    },

    *permissionClose({ payload }, { call }) {
      return yield call(permissionClose, payload);
    },

    // 获取appId绑定的业务线列表
    *getAppBindedBusiness({ payload }, { call, put }) {
      const appbindedbusiness = yield call(getAppBindedBusiness, payload.appId);

      yield put({
        type: 'save',
        payload: {
          appbindedbusiness
        }
      });
    },
    // 获取appId绑定的业务线列表
    *getAppBindedBusinessAll({ payload }, { call, put }) {
      const appbindedbusinessAll = yield call(getAppBindedBusinessAll, payload.appId);

      yield put({
        type: 'save',
        payload: {
          appbindedbusinessAll
        }
      });
    },

    // 获取角色和地区列表
    *fetchRoleListNew({ payload }, { call, put }) {
      const { params } = payload;
      const {
        page = 1,size = 10, resourceTypeId='',
        resourceName = '', resourceKey = '',
        businessId = '', appId, labelId= '',
        type = '', id = '', nameZh = '', applicable = ''
      } = params;
      const resourceList = yield call(fetchRoleListNew, {
        appId, page, size, resourceName, resourceKey, resourceTypeId, businessId, labelId, type, id, nameZh, applicable
      });
      yield put({
        type: 'save',
        payload: { resourceList }
      });
    },

    // 获取数据资源列别
    *getQueryList({ payload }, { call, put }) {
      const { params } = payload;
      const {
        page = 1,size = 10, projectNameList='',
        resourceTypeIdList = '', riskLevelList = '',
        resourceName = '', appId, businessIdList = '', fuzzySearch = ''
      } = params;
      const resourceList = yield call(getQueryList, {
        appId, page, size, projectNameList, resourceTypeIdList, riskLevelList, resourceName, businessIdList, fuzzySearch
      });
      yield put({
        type: 'save',
        payload: { resourceList }
      });
    },

    // 获取业务线
    *getBusiness({ payload }, { call, put }) {
      const businessList = yield call(getBusiness);
      return businessList
    },

    *getDataType({ payload }, { call, put }) {
      const dataType = yield call(getDataType, { ...payload });
      return dataType
    },

    // 获取review详情
    *fetchReviewDetail({ payload }, { call, put }) {
      try {
        const reviewDetail = yield call(getReviewDetail, payload);
        return {
          success: true,
          result: reviewDetail,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },

    // 获取review审批人列表
    *fetchReviewManagers({ payload }, { call, put }) {
      try {
        const managerList = yield call(getReviewManagers, payload);
        return {
          success: true,
          result: managerList,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },

    // 发送邮件提醒
    *notice({ payload }, { call, put }) {
      try {
        const result = yield call(notice, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },

    // 获取标识位列表
    *fetchFlagList({ payload }, { call, put }) {
      const { params } = payload;
      const {
        page = 1,size = 10, resourceTypeId='',
        resourceName = '', resourceKey = '',
        businessId = '', appId, permissionId = '',
        permissionName = '', applicable = ''
      } = params;
      const resourceList = yield call(fetchFlagList, {
        appId, page, size, resourceName, resourceKey, resourceTypeId, businessId, permissionId, permissionName, applicable
      });
      yield put({
        type: 'save',
        payload: {
          resourceList
        }
      });
    },

    *addReview({ payload }, { call }) {
      try {
        const result = yield call(addReview, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },
    *deleteReview({ payload }, { call }) {
      try {
        const result = yield call(deleteReview, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },
    *refreshReview({ payload }, { call }) {
      try {
        const result = yield call(refreshReview, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },
    *copyReview({ payload }, { call }) {
      try {
        const result = yield call(copyReview, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },
    *startReview({ payload }, { call }) {
      try {
        const result = yield call(startReview, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },

    *fetchReviewAppList({}, { call, put }){
      try {
        const reviewAppList = yield call(getReviewAppList)
        return {
          success: true,
          result: reviewAppList,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },

    // 发送审核人邮件提醒
    *approveNotice({ payload }, { call, put }) {
      try {
        const result = yield call(approveNotice, payload);
        return {
          success: true,
          result,
        };
      } catch (error) {
        return {
          success: false,
          result: error.message,
        };
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    mergeDept(state,{payload}) {
      return {
        ...state,
        departments: payload
      };
    },
    mergeReviewObj(state,{payload}){
      return {
        ...state,
        reviewObj: {
          ...state.reviewObj,
          ...payload
        }
      };
    },
    saveReviewObj(state,{payload}){
      return {
        ...state,
        reviewObj: payload
      };
    },
  },

};
