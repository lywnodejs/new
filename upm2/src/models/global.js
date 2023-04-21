/**
 * 全局常量模块，默认页面加载时就进行请求+初始化
 */

import _ from 'lodash';
import uaParser from '@utils/uaParser.js';
import {
  getEnumMap,
  getSystemList,
  getAvailableApps,
  getAllBusiness,
  getFootprint,
  getBusinessSystemList,
  getTopApps,
  checkBpmApps,
  getDepartmentLevelOneList,
  getSyetemEnv
} from '../services/global';

export default {
  namespace: 'global',

  state: {
    // 全局枚举类型map
    enumMap: {},
    // 所有的子系统列表
    apps: [],
    // 当前用户可见的系统列表
    availableApps: [],
    // 当前正在管理的子系统
    managingApp: undefined,
    managingAvailableApp: undefined,
    allBusiness: [],
    footprint: undefined,
    globalAppId: 0,
    businessSystemList: [],
    // 显示顶部systemlist
    showSystemList: true,
    appId: '',
    topApps: [],
    isBpmApp: true,
    bpmAdmin: '',
    bpmHost: '',
    wikiHost: '',
    departmentLevelOneList: [],
    systemEnv: [],
    collapsed: false
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'fetchEnumMap' });
      dispatch({ type: 'fetchApps' });
      if (!uaParser.isMobile()) {
        // 移动端不需要请求
        dispatch({ type: 'fetchAvailableApps' });
        dispatch({ type: 'getAllBusiness' });
        dispatch({ type: 'fetchbusinessSystemList' });
        dispatch({ type: 'fetchTopApps' });
      }
    }
  },

  effects: {
    *fetchEnumMap(action, { call, put }) {
      const enumMap = yield call(getEnumMap);
      const { urlSettingMap = {} } = enumMap;
      yield put({
        type: 'saveEnumMap',
        payload: {
          enumMap,
          bpmAdmin: urlSettingMap.bpmadmin,
          bpmHost: urlSettingMap.bpm,
          wikiHost: urlSettingMap.wiki
        }
      });
    },
    *fetchApps(action, { call, put }) {
      const apps = yield call(getSystemList);
      yield put({
        type: 'save',
        payload: { apps }
      });
    },
    *fetchAvailableApps(action, { call, put }) {
      const availableApps = yield call(getAvailableApps);
      yield put({
        type: 'save',
        payload: { availableApps }
      });

      if (_.size(availableApps) > 0) {
        // 默认选择第一个，作为当前正在管理的子系统
        const app = _.first(availableApps) || {};
        yield put({
          type: 'selectAppToManage',
          payload: {
            appId: app.id
          }
        });
        const availableApp =
          _.first(availableApps.filter(item => item.status)) || {};
        yield put({
          type: 'selectAvailableAppToManage',
          payload: {
            appId: availableApp.id
          }
        });
      }

      return availableApps;
    },

    // 选择一个子系统，作为当前正在管理的子系统
    *selectAppToManage({ payload }, { put }) {
      const { appId } = payload;

      yield put({
        type: 'save',
        payload: {
          managingApp: appId
        }
      });

      yield put({
        type: 'menus/fetchMyMenus',
        payload: {
          appId
        },
        loading: true
      });
    },

    // 选择一个开启的子系统，作为当前正在管理的子系统
    *selectAvailableAppToManage({ payload }, { put }) {
      const { appId } = payload;

      yield put({
        type: 'save',
        payload: {
          managingAvailableApp: appId
        }
      });

      yield put({
        type: 'menus/fetchMyMenus',
        payload: {
          appId
        },
        loading: true
      });
    },

    *getAllBusiness({ payload }, { call, put, select }) {
      const allBusiness = yield select(state => state.global.allBusiness);

      if (allBusiness.length === 0) {
        const allBusiness = yield call(getAllBusiness);

        yield put({
          type: 'save',
          payload: {
            allBusiness
          }
        });
      }
    },

    *getFootprint({ payload }, { call, put }) {
      const { userId } = payload;
      const footprint = yield call(getFootprint, { userId });

      footprint.map(item => {
        item.appId = item.id;
        item.appName = item.name;

        return item;
      });
      _.reverse(footprint);

      yield put({
        type: 'save',
        payload: {
          footprint
        }
      });
    },

    *setGlobalAppId({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: { globalAppId: payload.globalAppId }
      });
    },
    *fetchbusinessSystemList(action, { call, put }) {
      const businessSystemList = yield call(getBusinessSystemList);
      yield put({
        type: 'save',
        payload: {
          businessSystemList: businessSystemList.map(i => ({
            appId: i.id,
            appName: i.name
          })),
          appId: businessSystemList[0] ? businessSystemList[0].id : ''
        }
      });
    },
    *updateShowSystemList({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: { showSystemList: payload.showSystemList }
      });
    },

    *fetchTopApps({}, { call, put }) {
      const topApps = yield call(getTopApps);

      yield put({
        type: 'save',
        payload: { topApps }
      });
    },

    *checkBpmApps({ payload }, { call, put, take }) {
      if (!payload) {
        const takeAction = yield take('global/selectAppToManage');
        payload = takeAction.payload.appId;
      }

      const isBpmApp = yield call(checkBpmApps, {
        appId: payload
      });

      yield put({
        type: 'save',
        payload: { isBpmApp }
      });

      return isBpmApp;
    },

    *getDepartmentLevelOneList({ payload }, { call, put }) {
      const _departmentLevelOneList = yield call(getDepartmentLevelOneList);
      const list = new Object(_departmentLevelOneList);

      yield put({
        type: 'save',
        payload: {
          departmentLevelOneList: Object.keys(list).map(id => ({
            id,
            ...list[id]
          }))
        }
      });
    },

    *getSyetemEnv({ payload }, { call, put }) {
      const systemEnv = yield call(getSyetemEnv);

      yield put({
        type: 'save',
        payload: {
          systemEnv
        }
      });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveEnumMap(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
