/**
 * 全局常量模块，默认页面加载时就进行请求+初始化
 */

import _ from 'lodash';

import {
  fetchApps,
  enableApp,
  disableApp,
  deleteApp,
  addApp,
  updateApp,
  isShowSystemInfoConfig,
  forceFillSystem,
  fetchAvailableApps,
  updateAdminSwitch,
  fetchPermissionAdminList
} from '../services/manageApp';
import { getBusiness, updateBusiness } from '../services/admin';

const PAGE_SIZE = 20;

export default {

  namespace: 'manageApp',

  state: {
    searches: {
      current: 1,
      size: PAGE_SIZE,
      total: 0,
      appId: '',
      id: '',
      name: '',
      pages: 1
    },
    list: [],
    business: [],
    iShowSystemModal: undefined,
    availableApps: [],
    adminManageApps: [] // 负责权限管理的系统列表
  },

  subscriptions: {
  },

  effects: {
    *fetchApps ({ payload }, { call, put, select }) {
      const {
        current,
        total,
        records,
        pages
      } = yield call(fetchApps, payload);

      yield put({
        type: 'save',
        payload: {
          list: records
        }
      });

      yield put({
        type: 'saveSearches',
        payload: {
          current,
          total,
          pages,
          appId: payload.appId
        }
      });
    },
    *enableApp ({ payload: { id, appId } }, { call, put, select }) {
      yield call(enableApp, { id, appId });

      yield put({
        type: 'alterStatus',
        payload: {
          id
        }
      });
    },
    *disableApp ({ payload: { id, appId } }, { call, put, select }) {
      yield call(disableApp, { id, appId });

      yield put({
        type: 'alterStatus',
        payload: {
          id
        }
      });
    },
    *addApp ({ payload }, { call, put, select }) {
      yield call(addApp, payload);

      // const { current, pages, id, name, appId } = yield select((state) => state.manageApp.searches);
      // if (current === pages && id === '' && name === '') {
      //   yield put({
      //     type: 'fetchApps',
      //     payload: {
      //       appId,
      //       page: current
      //     }
      //   });
      // }
    },
    *updateApp ({ payload }, { call, put, select }) {
      yield call(updateApp, payload);

      const list = yield select((state) => state.manageApp.list);

      const recordIndex = _.findIndex(list, { id: payload.id });

      list[recordIndex] = payload;

      yield put({
        type: 'save',
        payload: {
          list: [...list]
        }
      });
    },
    *deleteApp ({ payload: { appId, id } }, { call, put, select }) {
      yield call(deleteApp, { appId, id });
      const list = yield select((state) => state.manageApp.list);

      const newList = _.filter(list, (item) => item.id !== id);

      yield put({
        type: 'save',
        payload: {
          list: newList
        }
      });
    },
    *getBusiness ({ payload }, { call, put }) {
      const business = yield call(getBusiness, payload.appId);

      yield put({
        type: 'save',
        payload: {
          business
        }
      });
    },
    *updateBusiness ({ payload: { appId, business } }, { call, put }) {
      yield call(updateBusiness, {
        appId: 888,
        id: appId,
        businessIds: business
      });
    },
    *isShowSystemInfoConfig ({ payload }, { call, put }) {
      const iShowSystemModal = yield call(isShowSystemInfoConfig);
      yield put({
        type: 'save',
        payload: {
          iShowSystemModal
        }
      });
    },
    *forceFillSystem ({ payload }, { call, put }) {
      yield call(forceFillSystem, payload);
    },
    *fetchAvailableApps ({ payload }, { call, put }) {
      const adminManageApps = yield call(fetchPermissionAdminList); // 获取负责管理权限管理的子系统列表
      const availableApps = yield call(fetchAvailableApps);
      availableApps.forEach(item => {
        const index = adminManageApps.findIndex(i => i.id === item.id)
        if (index != -1) {
          item.isAdmin = 1
        } else {
          item.isAdmin = 0
        }
      })
      yield put({
        type: 'save',
        payload: { availableApps }
      });
    },
    *updateAdminSwitch ({ payload }, { call, put }) {
      yield call(updateAdminSwitch, payload)
    }
  },

  reducers: {
    save (state, action) {
      return { ...state, ...action.payload };
    },
    saveSearches (state, { payload }) {
      return {
        ...state,
        searches: {
          ...state.searches,
          ...payload
        }
      };
    },
    alterStatus ({ list, ...others }, { payload: { id } }) {
      const recordIndex = _.findIndex(list, { id });

      list[recordIndex]['status'] = Number(!list[recordIndex]['status']);

      return {
        ...others,
        list: [...list]
      };
    }
  },

};
