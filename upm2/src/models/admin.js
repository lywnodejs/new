import {
  fetchDetail,
  updateAppInfo,
  getBusiness,
  updateBusiness,
  getAdminUserList,
  unbindAdmins,
  bindAdmins,
  getSubAdmins,
  bindSubAdmins,
  unbindSubAdmins,
  getAppBindedBusiness
} from '../services/admin';

import {
  getAllBusiness
} from '../services/area';
import _ from "lodash";

export default {

  namespace: 'admin',

  state: {
    list: [], // 管理员管理列表
    business: [], // 业务线绑定
    allBusiness: [], // 所有业务线
    detail: {}, // 子系统详情
    appbindedbusiness: [], // app绑定的业务线
  },

  subscriptions: {
    set({ dispatch, history }) {
    }
  },

  effects: {
    *getDetail({ payload: { appId } }, { call, put, take }) {
      if (!appId) {
        const takeAction = yield take('global/selectAvailableAppToManage');
        appId = takeAction.payload.appId;
      }

      const detail = yield call(fetchDetail, appId);

      yield put({
        type: 'save',
        payload: {
          detail
        }
      });
    },
    *updateDetail({ payload }, { call, put, select }) {
      yield call(updateAppInfo, payload);

      const detail = yield select((state) => state.admin.detail);

      yield put({
        type: 'save',
        payload: {
          detail: {
            ...detail,
            ...payload
          }
        }
      });
    },
    *updateBusiness({ payload: { appId, business } }, { call, put, select }) {
      yield call(updateBusiness, {
        appId,
        id: appId,
        businessIds: business
      });
    },
    *getBusiness({ payload }, { call, put }) {
      const business = yield call(getBusiness, payload.appId);

      yield put({
        type: 'save',
        payload: {
          business
        }
      });
    },
    *getAppBindedBusiness({ payload }, { call, put }) {
      const appbindedbusiness = yield call(getAppBindedBusiness, payload.appId);

      yield put({
        type: 'save',
        payload: {
          appbindedbusiness: appbindedbusiness || []
        }
      });
    },
    *getAdminUserList({ payload: { appId, roleName } }, { call, put }) {
      const list = yield call(getAdminUserList, {
        appId,
        operateAppId: appId,
        roleName
      });

      yield put({
        type: 'save',
        payload: {
          list
        }
      });
    },
    *unbindAdmins({ payload }, { call, put, select }) {
      yield call(unbindAdmins, payload);

      const list = yield select((state) => state.admin.list);

      const newList = _.filter(list, (item) => !~payload.userIds.indexOf(item.id));

      yield put({
        type: 'save',
        payload: {
          list: newList
        }
      });
    },
    *bindAdmins({ payload }, { call, put }) {
      yield call(bindAdmins, payload);

      yield put({
        type: 'getAdminUserList',
        payload: {
          appId: payload.appId,
          roleName: payload.roleName
        }
      });
    },

    // 小权限管理员相关
    *getSubAdmins({ payload: { appId, roleName } }, { call, put }) {
      const list = yield call(getSubAdmins, { appId });

      yield put({
        type: 'save',
        payload: {
          list
        }
      });
    },
    *unbindSubAdmins({ payload }, { call, put, select }) {
      yield call(unbindSubAdmins, payload);

      const list = yield select((state) => state.admin.list);

      const newList = _.filter(list, (item) => !~payload.userIds.indexOf(item.id));

      yield put({
        type: 'save',
        payload: {
          list: newList
        }
      });
    },
    *bindSubAdmins({ payload }, { call, put }) {
      yield call(bindSubAdmins, payload);

      yield put({
        type: 'getSubAdmins',
        payload: {
          appId: payload.appId
        }
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
